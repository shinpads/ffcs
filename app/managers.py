from django.contrib.auth import models

class DiscordUserOAuthManager(models.UserManager):
    def create_new_discord_user(self, user):
        return self.create(
            discord_user_id=user['id'],
            email=user['email'],
            avatar=user['avatar'],
            discord_username='%s#%s' % (user['username'], user['discriminator'])
        )
