from django.test import TestCase
from django.contrib.auth.models import User

from ..models import *


class UserProfileModelTest(TestCase):

    def test_user_profile_creation(self):
        user = User.objects.create_user(
            username='mehrab',
            password='testpassword123'
        )

        profile = UserProfile.objects.create(
            user=user,
            bio='Hello',
            image=None
        )

        self.assertEqual(profile.user, user)
        self.assertEqual(profile.bio, 'Hello')
        self.assertIsNone(profile.image.name)

class ConversationModelTest(TestCase):

    def test_conversation_creation(self):
        user = User.objects.create_user(
            username='mehrab',
            password='testpassword123'
        )

        conversation = Conversation.objects.create(
            owner=user,
            name='My Chat'
        )

        self.assertEqual(conversation.owner, user)
        self.assertEqual(conversation.name, 'My Chat')
        self.assertTrue(conversation.is_group)

    def test_conversation_members(self):
        owner = User.objects.create_user(
            username='mehrab'
        )

        user2 = User.objects.create_user(
            username='ali'
        )

        conversation = Conversation.objects.create(
            owner=owner,
            name='My Chat'
        )

        conversation.members.add(owner, user2)

        self.assertEqual(
            conversation.members.count(),
            2
        )

        self.assertIn(
            user2,
            conversation.members.all()
        )

class MessageModelTest(TestCase):

    def test_message_creation(self):
        user = User.objects.create_user(
            username='mehrab'
        )

        conversation = Conversation.objects.create(
            owner=user,
            name='Test Chat'
        )

        message = Message.objects.create(
            user=user,
            conversation=conversation,
            message_content='Hello!'
        )

        self.assertEqual(message.user, user)
        self.assertEqual(
            message.conversation,
            conversation
        )
        self.assertEqual(
            message.message_content,
            'Hello!'
        )
        self.assertIsNotNone(message.date)