from .utils import get_riot_account_id, register_tournament_provider, register_tournament
from django.core.exceptions import ValidationError
from django.db.models.signals import m2m_changed
from django.db import models
from django.core import serializers
import json

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
    provider = models.ForeignKey(Provider, on_delete=models.SET_NULL, null=True)
    tournament_id = models.CharField(max_length=70, blank=True)

    @property
    def register_tournament(self):
        if self.tournament_id == None or self.tournament_id == '':
            return register_tournament(self.name, self.provider.provider_id)
        else:
            return None
    
    def save(self, *args, **kwargs):
        if self.tournament_id == None or self.tournament_id == '':
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

    class Meta:
        indexes = [
            models.Index(fields=['name'])
        ]

        unique_together = ('name', 'season')

    def __str__(self):
        return self.name + ", season: " + str(self.season)


class Match(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    match_format = models.IntegerField()  # 1 for bo1, 3 for bo3, etc
    winner = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name='winning_matches',
        null=True
    )
    loser = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name='losing_matches',
        null=True
    )

    teams           = models.ManyToManyField(Team, related_name="matches")
    week            = models.IntegerField(default=1)
    scheduled_for   = models.DateTimeField(null=True, blank=True)


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
    username = models.CharField(max_length=20)
    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    role = models.CharField(
        max_length=10,
        blank=True,
        choices=ROLE_CHOICES
    )
    account_id = models.CharField(max_length=70, blank=True)

    @property
    def get_account_id(self):
        return get_riot_account_id(self.username)

    def save(self, *args, **kwargs):
        account_id = self.get_account_id
        if (account_id != None):
            self.account_id = account_id
        super(Player, self).save(*args, **kwargs)

    class Meta:
        indexes = [
            models.Index(fields=['account_id'])
        ]

    def __str__(self):
        return self.username

class Game(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    game_id = models.CharField(max_length=100)
    players = models.ManyToManyField(Player, related_name='games')
    winner = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name='winning_games'
    )
    loser = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name='losing_games'
    )
    match = models.ForeignKey(
        Match,
        on_delete=models.CASCADE,
        related_name='games'
    )
