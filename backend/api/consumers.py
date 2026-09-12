from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Conversation, Message


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.user = self.scope["user"]

        is_member = await self.check_membership()

        if not is_member:
            await self.close(code=4003)
            return

        self.room_group_name = f"conversation_{self.conversation_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        message_content = data["message"]

        message = await self.save_message(message_content)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message_id": message.id,
                "user_id": message.user.id,
                "message": message.message_content,
                "date": message.date.isoformat(),
            }
        )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps({
                "id": event["message_id"],
                "user": event["user_id"],
                "message_content": event["message"],
                "date": event["date"],
            })
        )

    @database_sync_to_async
    def check_membership(self):
        return self.user.conversation_set.filter(
            id=self.conversation_id
        ).exists()

    @database_sync_to_async
    def save_message(self, message_content):
        conversation = Conversation.objects.get(
            id=self.conversation_id
        )

        return Message.objects.create(
            user=self.user,
            conversation=conversation,
            message_content=message_content,
        )