from django.contrib import admin
from django import forms

from app.scripts.rumble_matches import create_rumble_matches
from .models import Rank, RumbleSignup, RumbleWeek, Season, Team, Match, Player, Game, Provider, User, RegistrationForm, Vote

class DontLog:
    def log_addition(self, *args):
        return

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):

    def get_id(self, obj):
        return obj.pk

    def get_summoner_name(self, obj):
        return obj.user.summoner_name

    get_summoner_name.short_description = 'Summoner Name'

    get_id.short_description = 'ID'

    list_display = (
        'user',
        'get_summoner_name',
        'account_id',
        'get_id',
        'role_preferences',
        'rumble_elo',
        'has_rumble_priority',
        'rumble_rank',
        'rumble_lp'
    )

    fieldsets = (
        (None, {
            'fields': (
                'user',
                'team',
                'role',
                'rumble_rank',
                'rumble_lp',
                'rumble_wins',
                'rumble_losses',
                'caster',
                'rumble_elo',
                'rumble_old_elo',
                'banned_role',
                'is_rumble',
                'role_preferences',
                'has_rumble_priority',
            )
        }),
    )

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    def get_id(self, obj):
        return obj.pk

    get_id.short_description = 'ID'

    list_display = ('name', 'season', 'get_id', 'avg_rumble_elo')

@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
    def get_id(self, obj):
        return obj.pk

    get_id.short_description = 'ID'

    list_display = ('number', 'name', 'is_mock', 'tournament_id', 'get_id')

    fieldsets = (
        (None, {
            'fields': (
                'number',
                'name',
                'provider',
                'is_mock',
                'is_current',
                'is_rumble'
            )
        }),
    )


@admin.register(Rank)
class RankAdmin(admin.ModelAdmin):
    def get_id(self, obj):
        return obj.pk

    get_id.short_description = 'ID'

    list_display = (
        'name',
        'discord_role_id',
        'is_top_rank',
        'discord_role_id',
        'color'
    )


class MatchForm(forms.ModelForm):
    class Meta:
        model = Match
        fields = '__all__'

    def clean(self):
        teams = self.cleaned_data.get('teams')
        if not teams or teams.count() != 2:
            raise forms.ValidationError("Match must have exactly 2 teams")

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    def get_id(self, obj):
        return obj.pk

    def get_teams(self, obj):
        return " VS ".join([team.name for team in obj.teams.all()])

    form = MatchForm

    get_id.short_description = 'ID'
    get_teams.short_description = 'Teams'

    list_display = (
        'get_id',
        'week',
        'scheduled_for', 
        'get_teams',
        'winner',
        'blue_side',
        'elo_difference',
        'role_pref_coefficient'
    )

    filter_horizontal = ('teams',)

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    def get_id(self, obj):
        return obj.pk

    get_id.short_description = 'ID'

    list_display = (
        'get_id',
        'game_id',
        'match',
        'game_in_series',
        'winner',
        'mvp',
        'mvp_votes',
        'tournament_code',
    )

    fieldsets = (
        (None, {
            'fields': ('winner', 'mvp', 'game_in_series', 'match')
        }),
    )

@admin.register(Provider)
class ProviderAdmin(admin.ModelAdmin):
    def get_id(self, obj):
        return obj.pk

    get_id.short_description = 'ID'

    list_display = ('provider_id', 'get_id')

    fieldsets = (
        (None, {
            'fields': ()
        }),
    )

@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    def get_id(self, obj):
        return obj.pk

    get_id.short_description = 'ID'

    list_display = ('season', 'user')

    fieldsets = (
        (None, {
            'fields': ('season', 'user',)
        }),
    )

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    def get_id(self, obj):
        return obj.pk

    get_id.short_description = 'ID'

    list_display = (
        'discord_username',
        'email',
        'summoner_name',
        'is_rumble_player',
        'is_blacklisted'
    )

@admin.register(RegistrationForm)
class RegistrationFormAdmin(admin.ModelAdmin):
    def get_id(self, obj):
        return obj.pk

    get_id.short_description = 'ID'

    list_display = ('created_at', 'season_id', 'summoner_name', 'first_name', 'first_role', 'second_role', 'third_role', 'fourth_role', 'fifth_role', 'current_rank', 'rank_should_be', 'wants_to_be_captain', 'heard_from')

@admin.action(description='Remake matches for this week')
def remake_matches(modeladmin, request, queryset):
    create_rumble_matches()

@admin.register(RumbleWeek)
class RumbleWeekAdmin(admin.ModelAdmin):
    def get_id(self, obj):
        return obj.pk

    get_id.short_description = 'ID'

    list_display = ('season', 'signups_open')
    actions = [remake_matches]

@admin.register(RumbleSignup)
class RumbleSignupAdmin(admin.ModelAdmin):
    def get_id(self, obj):
        return obj.pk

    get_id.short_description = 'ID'

    list_display = ('created_at', 'rumble_week', 'player')
   
