from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.exceptions import ValidationError

from ..models import Conversation, Message, UserProfile
from ..serializers import (
    ConversationSerializer,
    MessageSerializer,
    UserProfileSerializer,
    RegisterSerializer,
)


class ConversationSerializerTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="mehrab",
            password="testpassword123"
        )

        self.user2 = User.objects.create_user(
            username="ali",
            password="testpassword123"
        )

        self.conversation = Conversation.objects.create(
            owner=self.user,
            name="Test Conversation"
        )

        self.conversation.members.add(self.user, self.user2)

    def test_conversation_serializer(self):
        serializer = ConversationSerializer(self.conversation)

        self.assertEqual(serializer.data["id"], self.conversation.id)
        self.assertEqual(serializer.data["owner"], self.user.id)
        self.assertEqual(serializer.data["name"], "Test Conversation")
        self.assertEqual(serializer.data["is_group"], True)

    def test_conversation_owner_is_read_only(self):
        serializer = ConversationSerializer(
            self.conversation,
            data={
                "owner": self.user2.id,
                "name": "Changed Conversation",
            },
            partial=True
        )

        self.assertTrue(serializer.is_valid())

        updated_conversation = serializer.save()

        self.assertEqual(updated_conversation.owner, self.user)
        self.assertEqual(updated_conversation.name, "Changed Conversation")


class MessageSerializerTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="mehrab",
            password="testpassword123"
        )

        self.conversation = Conversation.objects.create(
            owner=self.user,
            name="Test Conversation"
        )

        self.message = Message.objects.create(
            user=self.user,
            conversation=self.conversation,
            message_content="Hello world"
        )

    def test_message_serializer(self):
        serializer = MessageSerializer(self.message)

        self.assertEqual(serializer.data["id"], self.message.id)
        self.assertEqual(serializer.data["user"], self.user.id)
        self.assertEqual(
            serializer.data["conversation"],
            self.conversation.id
        )
        self.assertEqual(
            serializer.data["message_content"],
            "Hello world"
        )

        self.assertIn("date", serializer.data)

    def test_message_read_only_fields(self):
        serializer = MessageSerializer(
            self.message,
            data={
                "user": 999,
                "conversation": 999,
                "message_content": "Changed message",
            },
            partial=True
        )

        self.assertTrue(serializer.is_valid())

        updated_message = serializer.save()

        self.assertEqual(updated_message.user, self.user)
        self.assertEqual(
            updated_message.conversation,
            self.conversation
        )
        self.assertEqual(
            updated_message.message_content,
            "Changed message"
        )


class UserProfileSerializerTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="mehrab",
            password="testpassword123"
        )

        self.profile = UserProfile.objects.create(
            user=self.user,
            bio="Hello, I am Mehrab"
        )

    def test_user_profile_serializer(self):
        serializer = UserProfileSerializer(self.profile)

        self.assertEqual(serializer.data["id"], self.profile.id)
        self.assertEqual(serializer.data["user"], self.user.id)
        self.assertEqual(serializer.data["username"], "mehrab")
        self.assertEqual(
            serializer.data["bio"],
            "Hello, I am Mehrab"
        )

    def test_username_is_read_only(self):
        serializer = UserProfileSerializer(
            self.profile,
            data={
                "username": "changed_username",
                "bio": "New bio",
            },
            partial=True
        )

        self.assertTrue(serializer.is_valid())

        updated_profile = serializer.save()

        self.assertEqual(
            updated_profile.user.username,
            "mehrab"
        )
        self.assertEqual(
            updated_profile.bio,
            "New bio"
        )


class RegisterSerializerTest(TestCase):

    def test_register_serializer(self):
        serializer = RegisterSerializer(
            data={
                "username": "mehrab",
                "email": "mehrab@example.com",
                "password": "StrongPassword123!"
            }
        )

        self.assertTrue(serializer.is_valid())

        user = serializer.save()

        self.assertEqual(user.username, "mehrab")
        self.assertEqual(user.email, "mehrab@example.com")

        self.assertTrue(
            user.check_password("StrongPassword123!")
        )

    def test_password_is_required(self):
        serializer = RegisterSerializer(
            data={
                "username": "mehrab",
                "email": "mehrab@example.com",
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)

    def test_invalid_password(self):
        serializer = RegisterSerializer(
            data={
                "username": "mehrab",
                "email": "mehrab@example.com",
                "password": "123"
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)

    def test_username_is_required(self):
        serializer = RegisterSerializer(
            data={
                "email": "mehrab@example.com",
                "password": "StrongPassword123!"
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("username", serializer.errors)

    def test_email_is_required(self):
        serializer = RegisterSerializer(
            data={
                "username": "mehrab",
                "password": "StrongPassword123!"
            }
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)