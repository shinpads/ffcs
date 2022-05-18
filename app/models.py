from .utils import get_riot_account_id, register_tournament_provider, register_tournament, generate_tournament_code
from django.core.exceptions import ValidationError
from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver
from django.db import models
from django.core import serializers
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.postgres.fields import ArrayField
from .managers import DiscordUserOAuthManager
import json
import math
import secrets

class Provider(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    provider_id = models.CharField(max_length=70, blank=True)

    @property
    def register_provider(self):
        if self.provider_id == None or self.provider_id == '':
            return register_tournament_provider()
        else:
            return None

    def save(self, *args, **kwargs):
        if self.provider_id == None or self.provider_id == '':
            provider_id = self.register_provider
            if (provider_id != None):
                self.provider_id = provider_id
        super(Provider, self).save(*args, **kwargs)

    def __str__(self):
        return "provider ID: " + self.provider_id


class Season(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    number = models.IntegerField(unique=True)
    name = models.CharField(max_length=20, blank=True)
    is_mock = models.BooleanField(default=False)
    is_current = models.BooleanField(default=False)
    provider = models.ForeignKey(Provider, on_delete=models.SET_NULL, null=True)
    tournament_id = models.CharField(max_length=70, blank=True)

    @property
    def register_tournament(self):
        if self.tournament_id == None or self.tournament_id == '':
            return register_tournament(self.name, self.provider.provider_id)
        else:
            return None

    def save(self, *args, **kwargs):
        if (self.tournament_id == None or self.tournament_id == '') and self.is_mock == False:
            tournament_id = self.register_tournament
            if (tournament_id != None):
                self.tournament_id = tournament_id
        super(Season, self).save(*args, **kwargs)

    class Meta:
        indexes = [
            models.Index(fields=['number'])
        ]

    def __str__(self):
        if self.name != '':
            string = self.name + " (season " + str(self.number) + ")"
        else:
            string = str(self.number)
        return string


class Team(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=25)
    season = models.ForeignKey(Season, on_delete=models.CASCADE)
    captain = models.ForeignKey('Player', on_delete=models.CASCADE, null=True, blank=True, related_name="captain_of")
    color = models.IntegerField(default=16777215)
    discord_channel_id = models.CharField(default=None, null=True, blank=True, max_length=64)
    discord_role_id = models.CharField(default=None, null=True, blank=True, max_length=64)
    logo_url = models.CharField(default=None, null=True, blank=True, max_length=200)
    
    class Meta:
        indexes = [
            models.Index(fields=['name'])
        ]

        unique_together = ('name', 'season')

    def __str__(self):
        return self.name + ", season: " + str(self.season)


class Match(models.Model):
    BO1 = 1
    BO3 = 3

    FORMAT_CHOICES = [
        (BO1, "Best of 1"),
        (BO3, "Best of 3"),
    ]

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    match_format = models.IntegerField(choices=FORMAT_CHOICES)
    season = models.ForeignKey(Season, on_delete=models.CASCADE)

    teams           = models.ManyToManyField(Team, related_name="matches")
    week            = models.IntegerField(default=1)
    scheduled_for   = models.DateTimeField(null=True, blank=True)
    proposed_for    = models.DateTimeField(null=True, blank=True, default=None)
    twitch_vod      = models.CharField(max_length=120, blank=True)
    blue_side       = models.ForeignKey(Team, on_delete=models.CASCADE, null=True)

    # 4 for quarter finals, 2 for semi-finbals, 1 for finals, etc (null for non-playoff)
    playoff_fraction = models.IntegerField(null=True, blank=True)

    @property
    def wins(self):
        wins_dict = {team.name: 0 for team in self.teams.all()}
        games = self.games.all()
        for game in games:
            if game.winner != None:
                wins_dict[game.winner.name] += 1

        return wins_dict

    @property
    def winner(self):
        wins_dict = self.wins
        for key in wins_dict.keys():
            if wins_dict[key] >= math.ceil(self.match_format / 2):
                for team in self.teams.all():
                    if team.name == key:
                        return team

        return None

    def finished_game(self, game_in_series):
        if self.winner == None:
            new_game = Game()
            new_game.match = self
            new_game.game_in_series = game_in_series + 1
            new_game.save()

    def __str__(self):
        return (
            " VS ".join([team.name for team in self.teams.all()]) + \
            ", week " + str(self.week) + \
            ", " + self.season.__str__()
        )

class User(AbstractBaseUser):
    objects = DiscordUserOAuthManager()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_updated_discord_info = models.DateTimeField(null=True)
    is_admin = models.BooleanField(default=False)

    # Stuff from discord
    discord_username = models.CharField(max_length=64, unique=True)
    email = models.CharField(max_length=254, unique=True)
    avatar = models.CharField(max_length=64)
    discord_user_id = models.BigIntegerField()

    # League stuff
    summoner_name = models.CharField(max_length=64)
    summoner_level = models.IntegerField(default=1)
    smurfs = ArrayField(
        models.CharField(max_length=64, default='', blank=True),
        null=True
    )

    # last_login = models.DateTimeField(null=True)

    REQUIRED_FIELDS = []

    USERNAME_FIELD = 'email'

    is_authenticated = True
    is_anonymous = False

    def is_active(self, request):
        return True

    def is_staff(self, request):
        return self.is_admin

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin

    def __str__(self):
        return self.discord_username


class Player(models.Model):
    TOP = "TOP"
    JG = "JG"
    MID = "MID"
    ADC = "ADC"
    SUPPORT = "SUPP"

    ROLE_CHOICES = [
        (TOP, "Top"),
        (JG, "Jungle"),
        (MID, "Mid"),
        (ADC, "ADC"),
        (SUPPORT, "Support"),
    ]

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='players',
    )
    caster = models.BooleanField(default=False)
    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        blank=True, null=True,
        related_name='players',
    )
    role = models.CharField(
        max_length=10,
        blank=True,
        choices=ROLE_CHOICES
    )
    account_id = models.CharField(max_length=70, blank=True)
    smurf_account_ids = ArrayField(
        models.CharField(max_length=70, blank=True, default=''),
        null=True
    )

    profile_icon_id = models.IntegerField(default=0)

    @property
    def get_account_id(self):
        return get_riot_account_id(self.user.summoner_name)

    def save(self, *args, **kwargs):
        if self.account_id == '':
            account_id = self.get_account_id
            if account_id != None:
                self.account_id = account_id
        super(Player, self).save(*args, **kwargs)

    class Meta:
        indexes = [
            models.Index(fields=['account_id']),
            models.Index(fields=['caster'])
        ]

    def __str__(self):
        return self.user.discord_username

class PlayerStats(models.Model):
    player = models.OneToOneField(Player, related_name='stats', on_delete=models.CASCADE)

    # stats from game data
    games_played    = models.IntegerField(default=0)
    kills           = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    deaths          = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    assists         = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    kda_per_game    = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    vision_per_min  = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    cc_per_game     = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    cs_per_min      = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    kp_per_game     = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    damage_per_min  = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    damage_taken    = models.DecimalField(max_digits=8, decimal_places=2, default=0)

class PlayerChampionStats(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='player_champion_stats')

    # stats from game data
    champion_id     = models.IntegerField()
    # stats represent data for specific champion
    games_played    = models.IntegerField(default=0)
    wins            = models.IntegerField(default=0)
    losses          = models.IntegerField(default=0)
    kills           = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    deaths          = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    assists         = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    kda             = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    vision_per_min  = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    cc              = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    cs_per_min      = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    kp              = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    damage_per_min  = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    damage_taken    = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    class Meta:
        unique_together = ('player', 'champion_id')

class Vote(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    season = models.ForeignKey(
        Season,
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )


class Game(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    game_data = models.JSONField(null=True, blank=True)
    game_id = models.CharField(max_length=100, blank=True)
    tournament_code = models.CharField(max_length=50, blank=True)
    game_in_series = models.IntegerField()
    meta_key = models.CharField(max_length=100, blank=True, unique=True)
    winner = models.ForeignKey(
        Team,
        related_name='won_games',
        on_delete=models.CASCADE,
        null=True
    )
    match = models.ForeignKey(
        Match,
        on_delete=models.CASCADE,
        related_name='games'
    )
    mvp = models.ForeignKey(
        Player,
        on_delete=models.CASCADE,
        related_name='mvps',
        null=True,
        blank=True,
    )

    @property
    def create_meta_key(self):
        return secrets.token_urlsafe(16)

    @property
    def create_tournament_code(self):
        return generate_tournament_code(self, Player)

    def save(self, *args, **kwargs):
        if self.meta_key == '':
            meta_key = self.create_meta_key
            if meta_key != None:
                self.meta_key = meta_key

        if self.tournament_code == '' and self.game_in_series != 1:
            tournament_code = self.create_tournament_code
            if tournament_code != None:
                self.tournament_code = tournament_code

        super(Game, self).save(*args, **kwargs)

    class Meta:
        indexes = [
            models.Index(fields=['meta_key'])
        ]

class RegistrationForm(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    season = models.ForeignKey(Season, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    first_name = models.CharField(max_length=32, null=True, blank=True)

    first_role = models.CharField(max_length=32)
    second_role = models.CharField(max_length=32)
    third_role = models.CharField(max_length=32)
    fourth_role = models.CharField(max_length=32)
    fifth_role = models.CharField(max_length=32)

    current_rank = models.CharField(max_length=32)
    rank_should_be = models.CharField(max_length=32)
    heard_from = models.CharField(max_length=64)
    summoner_name = models.CharField(max_length=32)

    wants_to_be_captain = models.BooleanField(default=False)


    def clean(self):
        if len(Set([self.first_role, self.second_role, self.third_role, self.fourth_role, self.fifth_role])) < 5:
            raise ValidationError(_('Must rank roles 1-5'))

@receiver(post_save, sender=Match)
def match_handler(sender, instance, **kwargs):
    if len(instance.games.all()) == 0:
        new_game = Game()
        new_game.match = instance
        new_game.game_in_series = 1
        new_game.save()

    if instance.scheduled_for != None and instance.scheduled_for != '':
        for game in instance.games.all():
            if game.game_in_series == 1 and game.tournament_code == '':
                tournament_code = generate_tournament_code(game, Player)
                if tournament_code != None:
                    game.tournament_code = tournament_code
                    game.save()

@receiver(post_save, sender=Game)
def game_handler(sender, instance, **kwargs):
    if instance.winner != None:
        instance.match.finished_game(instance.game_in_series)
