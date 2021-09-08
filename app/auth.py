from django.contrib.auth.backends import BaseBackend
from .models import User


class DiscordAuthenticationBackend(BaseBackend):
    def authenticate(self, request, user):
        find_user = User.objects.filter(discord_user_id=user['id'])
        if len(find_user) == 0:
            return User.objects.create_new_discord_user(user)

        find_user.update(avatar=user['avatar'])
        return list(find_user).pop()

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
