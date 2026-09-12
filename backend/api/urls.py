from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

urlpatterns = [
    path('',views.conversation_list),
    path('messages/<int:conversation_id>/',views.conversation_messages),
    path('joinleave/<int:conversation_id>/',views.join_leave),
    path("conversations/private/<int:user_id>/",views.create_pv),
    path("conversations/create",views.create_group),
    path("detail/<int:conversation_id>/",views.conversatiion_detail),
    path("createuser/<str:status>/",views.create_profile),
    path("profile",views.profile),
    
    #authentication
    path('register',views.register),
    path('login/',views.MyLoginView.as_view()),
    path("logout/", views.logout),
    path("token/refresh/", TokenRefreshView.as_view()),
]
