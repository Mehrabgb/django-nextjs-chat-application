from rest_framework import serializers
from .models import Conversation,Message,UserProfile
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class ConversationSerializer(serializers.ModelSerializer):
    last_message=serializers.SerializerMethodField()
    profile=serializers.SerializerMethodField()
    class Meta:
        model = Conversation
        fields = "__all__" 
        read_only_fields = ['owner']


    def get_profile(self, obj):
        if obj.is_group:
            return None

        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return None
        
        other_user = obj.members.exclude(
            id=request.user.id
        ).first()

        if not other_user:
            return None

        return UserWithProfileSerializer(
            other_user,
            context=self.context
        ).data
    
    def get_last_message(self, obj):
        message = obj.message_set.order_by("-date").first()
        return MessageSerializer(message).data if message else None


class UserProfileSerializerForMessages(serializers.ModelSerializer):
     class Meta:
        model = UserProfile
        fields = "__all__"

class ConversationSerializerForMessages(serializers.ModelSerializer):
     profile=serializers.SerializerMethodField()
     class Meta:
        model = Conversation
        fields = "__all__"

     def get_profile(self, obj):
        if obj.is_group:
            return None

        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return None
        
        other_user = obj.members.exclude(
            id=request.user.id
        ).first()

        if not other_user:
            return None

        return UserWithProfileSerializer(
            other_user,
            context=self.context
        ).data


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    groups = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = "__all__"
        read_only_fields = ["id", "user",'username','groups']

    def update(self, instance, validated_data):

        user_data = validated_data.pop('user', {})

        instance.bio = validated_data.get(
            'bio',
            instance.bio
        )

        if 'image' in validated_data:
            instance.image = validated_data['image']

        instance.save()

        if 'username' in user_data:
            instance.user.username = user_data['username']
            instance.user.save()

        return instance
    
    def get_groups(self, obj):
        conversation = obj.user.conversation_set.all()
        return ConversationSerializer(conversation,many=True).data if conversation else None

class UserWithProfileSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(
        source='userprofile',
        read_only=True
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'profile']


class MessageSerializer(serializers.ModelSerializer):
    user_profile = UserProfileSerializerForMessages(
        source="user.userprofile",
        read_only=True
    )
    username = serializers.CharField(read_only=True,source='user.username')
    class Meta:
        model = Message
        fields = [
            "id",
            "user",
            "conversation",
            "message_content",
            "date",
            "user_profile",
            "username"

        ]

        read_only_fields = [
            "user",
            "conversation",
            "date",
            "user_profile",
            "username"
        ]


class ConversationDetailSerializer(serializers.ModelSerializer):
    owner=serializers.CharField(source='owner.username', read_only=True)
    members = UserWithProfileSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Conversation
        fields = "__all__"
        read_only_fields = ['owner']
     

#authentication

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        data['has_profile'] = UserProfile.objects.filter(
            user=self.user
        ).exists()

        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    email = serializers.EmailField(
        required=True
    )

    class Meta:
        model = User

        fields = [
            "username",
            "email",
            "password",
        ]

    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        return user