from django.urls import path

from api.serializers import UpdateRoomSerializer
from .views import (
    GetRoomView,
    JoinRoomView,
    LeaveRoom,
    RoomView,
    CreateRoomView,
    UpdateRoomView,
    UserInRoom,
)

urlpatterns = [
    path("room", RoomView.as_view()),
    path("create-room", CreateRoomView.as_view()),
    path("get-room", GetRoomView.as_view()),
    path("join-room", JoinRoomView.as_view()),
    path("user-in-room", UserInRoom.as_view()),
    path("leave-room", LeaveRoom.as_view()),
    path("update-room", UpdateRoomView.as_view()),
]
