
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import transaction

from api.models import UserProfile, Conversation, Message


class Command(BaseCommand):
    help = "Create demo users, profiles, conversations and messages"

    @transaction.atomic
    def handle(self, *args, **options):

        # ==========================================================
        # USERS
        # ==========================================================

        users_data = [
            {
                "username": "alex",
                "password": "Demo12345!",
                "bio": "Full-stack developer interested in Django and React.",
            },
            {
                "username": "sarah",
                "password": "Demo12345!",
                "bio": "Frontend developer · Next.js · TypeScript.",
            },
            {
                "username": "daniel",
                "password": "Demo12345!",
                "bio": "Backend developer learning Django REST Framework.",
            },
            {
                "username": "emma",
                "password": "Demo12345!",
                "bio": "UI/UX designer who loves clean interfaces.",
            },
            {
                "username": "mike",
                "password": "Demo12345!",
                "bio": "Computer science student and open-source enthusiast.",
            },
            {
                "username": "olivia",
                "password": "Demo12345!",
                "bio": "Junior developer exploring cloud technologies.",
            },
            {
                "username": "james",
                "password": "Demo12345!",
                "bio": "Python developer · APIs · PostgreSQL.",
            },
            {
                "username": "sophia",
                "password": "Demo12345!",
                "bio": "Software engineer interested in real-time applications.",
            },
        ]

        users = {}

        for data in users_data:

            user, created = User.objects.get_or_create(
                username=data["username"]
            )

            # Set password only when the user is created.
            if created:
                user.set_password(data["password"])
                user.save()

            users[data["username"]] = user

            # ------------------------------------------------------
            # PROFILE
            # ------------------------------------------------------

            profile, profile_created = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    "bio": data["bio"],
                },
            )

            # If the profile already existed, update its bio.
            if not profile_created:
                profile.bio = data["bio"]
                profile.save(update_fields=["bio"])

        self.stdout.write(
            self.style.SUCCESS("✓ Users and profiles created")
        )

        # ==========================================================
        # PRIVATE CONVERSATIONS
        # ==========================================================

        private_chats = [
            ("alex", "sarah"),
            ("daniel", "james"),
            ("emma", "olivia"),
            ("alex", "sophia"),
        ]

        private_conversations = {}

        for username1, username2 in private_chats:

            user1 = users[username1]
            user2 = users[username2]

            # Find an existing private conversation containing
            # both users.
            conversation = (
                Conversation.objects
                .filter(is_group=False, members=user1)
                .filter(members=user2)
                .first()
            )

            if conversation is None:

                conversation = Conversation.objects.create(
                    owner=user1,
                    is_group=False,
                    name="",
                    bio="",
                )

                conversation.members.add(user1, user2)

            private_conversations[
                f"{username1}_{username2}"
            ] = conversation

        self.stdout.write(
            self.style.SUCCESS("✓ Private conversations created")
        )

        # ==========================================================
        # GROUP CONVERSATIONS
        # ==========================================================

        groups = {
            "Django Developers": [
                "alex",
                "daniel",
                "james",
                "mike",
                "sophia",
            ],

            "Project Team": [
                "sarah",
                "emma",
                "olivia",
                "alex",
            ],

            "Study Room": [
                "mike",
                "daniel",
                "james",
                "olivia",
                "sophia",
            ],
        }

        for group_name, member_names in groups.items():

            owner = users[member_names[0]]

            conversation, created = (
                Conversation.objects.get_or_create(
                    name=group_name,
                    is_group=True,
                    defaults={
                        "owner": owner,
                        "bio": "",
                    },
                )
            )

            # Make sure the members are correct even if the
            # conversation already existed.
            conversation.members.set(
                [users[name] for name in member_names]
            )

        self.stdout.write(
            self.style.SUCCESS("✓ Group conversations created")
        )

        # ==========================================================
        # PRIVATE CHAT MESSAGES
        # ==========================================================

        private_messages = {

            "alex_sarah": [
                (
                    "alex",
                    "Hey Sarah, did you finish the new dashboard?",
                ),
                (
                    "sarah",
                    "Almost. I'm fixing the responsive layout right now.",
                ),
                (
                    "alex",
                    "Nice. Are you using CSS grid for it?",
                ),
                (
                    "sarah",
                    "Yeah, grid for the main layout and flex for the smaller components.",
                ),
                (
                    "alex",
                    "That should work well on mobile too.",
                ),
                (
                    "sarah",
                    "Exactly. I'll push the changes tonight.",
                ),
            ],

            "daniel_james": [
                (
                    "daniel",
                    "Hey James, I finally finished the authentication API.",
                ),
                (
                    "james",
                    "Nice! Are you using JWT?",
                ),
                (
                    "daniel",
                    "Yeah, access and refresh tokens.",
                ),
                (
                    "james",
                    "Good choice. Where are you storing the refresh token?",
                ),
                (
                    "daniel",
                    "HttpOnly cookies.",
                ),
                (
                    "james",
                    "That's what I'd use too. Much safer than localStorage for that use case.",
                ),
            ],

            "emma_olivia": [
                (
                    "emma",
                    "What do you think about the new profile page?",
                ),
                (
                    "olivia",
                    "I like it. The layout feels much cleaner.",
                ),
                (
                    "emma",
                    "I'm still not sure about the spacing between the sections.",
                ),
                (
                    "olivia",
                    "Maybe give the profile header a little more breathing room.",
                ),
                (
                    "emma",
                    "Good idea. I'll try that.",
                ),
            ],

            "alex_sophia": [
                (
                    "alex",
                    "Hey Sophia, how is the notification system going?",
                ),
                (
                    "sophia",
                    "Pretty good. I'm using WebSockets for the real-time part.",
                ),
                (
                    "alex",
                    "Are you using Django Channels?",
                ),
                (
                    "sophia",
                    "Yeah, with Redis as the channel layer.",
                ),
                (
                    "alex",
                    "Nice. That should work really well.",
                ),
            ],
        }

        for conversation_key, conversation_messages in private_messages.items():

            conversation = private_conversations[conversation_key]

            # Don't create duplicate messages.
            if Message.objects.filter(
                conversation=conversation
            ).exists():
                continue

            for username, text in conversation_messages:

                Message.objects.create(
                    user=users[username],
                    conversation=conversation,
                    message_content=text,
                )

        # ==========================================================
        # GROUP MESSAGES
        # ==========================================================

        group_messages = {

            "Django Developers": [
                (
                    "alex",
                    "What is everyone working on this week?",
                ),
                (
                    "daniel",
                    "I'm working on a Django REST API for a small project.",
                ),
                (
                    "james",
                    "I'm working on PostgreSQL optimization.",
                ),
                (
                    "mike",
                    "I'm trying to understand Django signals better.",
                ),
                (
                    "sophia",
                    "I'm working on a real-time notification system with WebSockets.",
                ),
                (
                    "alex",
                    "Nice. Are you using Django Channels?",
                ),
                (
                    "sophia",
                    "Yeah, Channels with Redis.",
                ),
                (
                    "daniel",
                    "I've been wanting to learn Channels. Is it difficult?",
                ),
                (
                    "sophia",
                    "The basic setup isn't too bad. The tricky part is understanding the async side.",
                ),
                (
                    "mike",
                    "That's exactly the part I'm struggling with.",
                ),
                (
                    "james",
                    "Redis makes a lot more sense once you understand what the channel layer is doing.",
                ),
                (
                    "alex",
                    "We should probably make a small project together sometime.",
                ),
            ],

            "Project Team": [
                (
                    "sarah",
                    "I've pushed the latest frontend changes.",
                ),
                (
                    "emma",
                    "I checked the new design. Looks much better.",
                ),
                (
                    "olivia",
                    "The profile page looks great.",
                ),
                (
                    "alex",
                    "I'll connect the new UI to the API tonight.",
                ),
                (
                    "sarah",
                    "Perfect.",
                ),
                (
                    "emma",
                    "Can we also add loading states?",
                ),
                (
                    "alex",
                    "Yeah, I'll handle those.",
                ),
                (
                    "olivia",
                    "And maybe an empty-state message when there are no conversations.",
                ),
                (
                    "sarah",
                    "Good idea. I'll add that tomorrow.",
                ),
            ],

            "Study Room": [
                (
                    "mike",
                    "Anyone studying Django today?",
                ),
                (
                    "daniel",
                    "Yep 😂",
                ),
                (
                    "james",
                    "I'm going through DRF permissions.",
                ),
                (
                    "olivia",
                    "I'm learning Docker at the moment.",
                ),
                (
                    "sophia",
                    "I'm trying to understand WebSockets better.",
                ),
                (
                    "mike",
                    "We should share useful resources here.",
                ),
                (
                    "daniel",
                    "Agreed. I'll post some DRF notes later.",
                ),
                (
                    "james",
                    "And I'll share some PostgreSQL stuff.",
                ),
                (
                    "olivia",
                    "Perfect.",
                ),
            ],
        }

        for group_name, messages in group_messages.items():

            conversation = Conversation.objects.get(
                name=group_name,
                is_group=True,
            )

            # Don't create duplicate messages.
            if Message.objects.filter(
                conversation=conversation
            ).exists():
                continue

            for username, text in messages:

                Message.objects.create(
                    user=users[username],
                    conversation=conversation,
                    message_content=text,
                )

        self.stdout.write(
            self.style.SUCCESS("✓ Messages created")
        )

        # ==========================================================
        # FINISHED
        # ==========================================================

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                "🎉 Demo data created successfully!"
            )
        )

        self.stdout.write("")
        self.stdout.write(
            self.style.WARNING(
                "Demo password for all users: Demo12345!"
            )
        )
