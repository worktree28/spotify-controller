from django.db import models
import random
import string

# generate 6 unique code
def generate_code():
    length = 6
    while True:
        code = "".join(random.choices(string.ascii_uppercase, k=length))
        if not Room.objects.filter(code=code).exists():
            return code


# Create your models here.
class Room(models.Model):
    code = models.CharField(max_length=8, default=generate_code, unique=True)
    host = models.CharField(max_length=64, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    current_song = models.CharField(max_length=100, null=True)
