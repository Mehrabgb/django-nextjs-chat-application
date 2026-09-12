from django.db import models
from django.contrib.auth.models import User

class Conversation(models.Model):
    owner=models.ForeignKey(User,blank=True,null=True,on_delete=models.CASCADE,related_name='owner')
    is_group=models.BooleanField(default=True)
    name=models.CharField(max_length=100,blank=True)
    members=models.ManyToManyField(User,blank=True)
    image=models.ImageField(upload_to='conversations/', blank=True, null=True)
    bio=models.TextField(blank=True)
    def __str__(self):
        return self.name


class Message(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    conversation=models.ForeignKey(Conversation,on_delete=models.CASCADE)
    message_content=models.TextField()
    date=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return (self.user.username + '    : ' + self.message_content)


class UserProfile(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    image=models.ImageField(upload_to='users/', blank=True, null=True)
    bio=models.TextField(blank=True,null=True)

    def __str__(self):
        return self.user.username
