from .utils import get_riot_account_id
from django.db import models
from django.core import serializers
import json

class Season(models.Model):
    number = models.IntegerField(unique=True)
    name = models.CharField(max_length=20, blank=True)


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
    match_format = models.IntegerField()  # 1 for bo1, 3 for bo3, etc
    winner = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name='winning_matches'
    )
    loser = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name='losing_matches'
    )


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
    account_id = models.CharField(max_length=70, unique=True, blank=True)

    @property
    def get_account_id(self):
        return get_riot_account_id(self.username)
    
    def save(self, *args, **kwargs):
        self.account_id = self.get_account_id
        super(Player, self).save(*args, **kwargs)
    
    class Meta:
        indexes = [
            models.Index(fields=['account_id'])
        ]
    
    def __str__(self):
        return self.username

class Game(models.Model):
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
