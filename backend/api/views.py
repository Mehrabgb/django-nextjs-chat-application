from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Conversation,Message
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Q

@api_view(["GET"])
def conversation_list(request):

    if request.user.is_authenticated:
        conversations = Conversation.objects.exclude(
            Q(is_group=False) & ~Q(members=request.user)
        )
    else:
        conversations = Conversation.objects.filter(is_group=True)

    serializer = ConversationSerializer(
        conversations,
        context={"request": request},
        many=True
    )

    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def join_leave(request,conversation_id):
    conversation = Conversation.objects.get(id=conversation_id)

    if conversation.members.filter(id=request.user.id).exists():
        conversation.members.remove(request.user.id)
    else:
        conversation.members.add(request.user.id)
    serializer = ConversationSerializer(conversation)

    return Response(serializer.data)

@api_view(["GET", "POST"])
def conversation_messages(request, conversation_id):

    try:
        conversation = Conversation.objects.get(id=conversation_id)
    except Conversation.DoesNotExist:
        return Response(
            {"detail": "Conversation not found or you are not a member."},
            status=status.HTTP_404_NOT_FOUND)
        
    cserializer=ConversationSerializerForMessages(conversation,context={"request": request},)

    if request.method == "GET" :
        if request.user.is_authenticated and conversation.members.filter(id=request.user.id).exists():
            messages = Message.objects.filter(conversation=conversation)

            serializer = MessageSerializer(messages,many=True)

            return Response([serializer.data,cserializer.data,request.user.id,])
        elif conversation.is_group==True :
            messages = Message.objects.filter(conversation=conversation)

            serializer = MessageSerializer(messages,many=True)

            return Response([serializer.data,cserializer.data])

        return Response({"detail": "what are you looking for dude?."},status=status.HTTP_400_BAD_REQUEST)


    elif request.method == "POST"  and conversation.members.filter(id=request.user.id).exists():

        serializer = MessageSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(
                user=request.user,
                conversation=conversation
            )

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def create_pv(request, user_id):

    try:
        other_user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {"detail": "User not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    conversation = Conversation.objects.filter(
        is_group=False,
        members=request.user
    ).filter(
        members=other_user
    ).first()

    if conversation:
        serializer = ConversationSerializer(conversation)

        return Response(serializer.data)
    
    conversation = Conversation.objects.create(
        is_group=False,
    )

    conversation.members.add(
        request.user,
        other_user
    )

    serializer = ConversationSerializer(conversation)

    return Response(
        serializer.data,
        status=status.HTTP_201_CREATED
    )

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_group(request):
    serializer = ConversationSerializer(data=request.data)

    if serializer.is_valid():
        conversation = serializer.save(
            is_group=True,
            owner=request.user
        )

        conversation.members.add(request.user)

        return Response(
            ConversationSerializer(conversation).data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def conversatiion_detail(request,conversation_id):
    try:
        conversation = Conversation.objects.get(id=conversation_id)
    except Conversation.DoesNotExist:
        return Response(
            {"detail": "Conversation not found or you are not a member."},
            status=status.HTTP_404_NOT_FOUND)
    
    if conversation.is_group==False:
        otheruer=conversation.members.exclude(id=request.user.id).first()
        userprofile=UserProfile.objects.get(user=otheruer)
        serializer = UserProfileSerializer(userprofile)
        return Response(serializer.data)
    else:
        serializer = ConversationDetailSerializer(conversation)
        return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def profile(request):
    user_profile,created=UserProfile.objects.get_or_create(user=request.user)

    serializer=UserProfileSerializer(user_profile)
    if created :
        return Response([serializer.data,'created'])
    else:
        return Response([serializer.data,'notcreated'])

 



#authentication

@api_view(["POST"])
def register(request):


    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(

        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):

    try:
        refresh_token = request.data['refresh']
        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response({'message': 'Logged out successfully'})

    except Exception:
        return Response(
            {'error': 'Invalid token'},
            status=status.HTTP_400_BAD_REQUEST
        )

class MyLoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST','PATCH'])
@permission_classes([IsAuthenticated])
def create_profile(request, status):

    if status == 'edit' and request.method== 'PATCH':

        profile = UserProfile.objects.get(user=request.user)

        serializer = UserProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=200
            )

        return Response(
            serializer.errors,
            status=400
        )
    elif status == 'edit' and request.method== 'POST':
        profile = UserProfile.objects.create(user=request.user)

        serializer = UserProfileSerializer(
            profile,
            data=request.data,
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=200
            )

        return Response(
            serializer.errors,
            status=400
        )

    elif status == 'create' and request.method == 'POST':

        UserProfile.objects.create(
            user=request.user
        )

        return Response(
            status=201
        )




