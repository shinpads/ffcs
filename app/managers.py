from django.contrib.auth import models

class DiscordUserOAuthManager(models.UserManager):
    def create_new_discord_user(self, user):
        avatar = user['avatar']
        if avatar == None:
            avatar = ''
        return self.create(
            discord_user_id=user['id'],
            email=user['email'],
            avatar=avatar,
            discord_username='%s#%s' % (user['username'], user['discriminator'])
        )
