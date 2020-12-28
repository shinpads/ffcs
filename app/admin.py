from django.contrib import admin
from django import forms
from .models import Season, Team, Match, Player, Game

admin.site.register(Game)

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):

    def get_id(self, obj):
        return obj.pk

    get_id.short_description = 'ID'

    list_display = ('username', 'team', 'role', 'get_id')

    fieldsets = (
        (None, {
            'fields': ('username', 'team', 'role')
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

    list_display = ('number', 'name', 'get_id')

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

    form = MatchForm

    get_id.short_description = 'ID'

    exclude = ('winner', 'loser')

    list_display = ('week', 'scheduled_for', 'get_id')

    filter_horizontal = ('teams',)
