from rest_framework import response
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
import environ
from requests import post, put, get


# Initialise environment variables
env = environ.Env()
environ.Env.read_env()

BASE_URL = "https://api.spotify.com/v1/me/"


def update_or_create_user_tokens(
    session_id, access_token, token_type, expires_in, refresh_token
):
    expires_in = timezone.now() + timedelta(seconds=expires_in)
    # Check if user already exists
    try:
        user_token = SpotifyToken.objects.get(user=session_id)
    except SpotifyToken.DoesNotExist:
        user_token = SpotifyToken(
            user=session_id,
            access_token=access_token,
            token_type=token_type,
            expires_in=expires_in,
            refresh_token=refresh_token,
        )
        user_token.save()
    else:
        user_token.access_token = access_token
        user_token.token_type = token_type
        user_token.expires_in = expires_in
        user_token.save(
            update_fields=["access_token", "token_type", "expires_in", "refresh_token"]
        )
    return user_token


def is_spotify_authenticated(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        token = user_tokens.first()
        if token.expires_in <= timezone.now():
            refresh_spotify_token(session_id)
        return True
    return False


def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token

    response = post(
        "https://accounts.spotify.com/api/token",
        data={
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": env("CLIENT_ID"),
            "client_secret": env("CLIENT_SECRET"),
        },
    ).json()

    access_token = response.get("access_token")
    token_type = response.get("token_type")
    expires_in = response.get("expires_in")
    refresh_token = response.get("refresh_token")

    update_or_create_user_tokens(
        session_id, access_token, token_type, expires_in, refresh_token
    )


def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    # print(user_tokens)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id)
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {tokens.access_token}",
    }

    if post_:
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        put(BASE_URL + endpoint, headers=headers)

    response = get(BASE_URL + endpoint, {}, headers=headers)
    try:
        return response.json()
    except:
        return {"Error": "Issue with  request"}

def play_song(session_id):
    return execute_spotify_api_request(session_id,'player/play', put_=True)

def pause_song(session_id):
    return execute_spotify_api_request(session_id,'player/pause', put_=True)

def skip_song(session_id):
    return execute_spotify_api_request(session_id,'player/next', post_=True)