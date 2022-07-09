from django.contrib import admin
from django import forms
from .models import Season, Team, Match, Player, Game, Provider, User, RegistrationForm, Vote

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

    list_display = ('user', 'get_summoner_name', 'team', 'role', 'account_id', 'get_id')

    fieldsets = (
        (None, {
            'fields': ('user', 'team', 'role', 'caster')
        }),
    )

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    def get_id(self, obj):
        return obj.pk

    get_id.short_description = 'ID'

    list_display = ('name', 'season', 'get_id')

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

    list_display = ('get_id', 'week', 'scheduled_for', 'get_teams', 'winner', 'blue_side')

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
        'tournament_code',
    )

    fieldsets = (
        (None, {
            'fields': ('winner', 'mvp')
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

    list_display = ('discord_username', 'email', 'summoner_name')

@admin.register(RegistrationForm)
class RegistrationFormAdmin(admin.ModelAdmin):
    def get_id(self, obj):
        return obj.pk

    get_id.short_description = 'ID'

    list_display = ('created_at', 'season_id', 'summoner_name', 'first_name', 'first_role', 'second_role', 'third_role', 'fourth_role', 'fifth_role', 'current_rank', 'rank_should_be', 'wants_to_be_captain', 'heard_from')
