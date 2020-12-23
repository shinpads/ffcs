from django.contrib import admin
from .models import Season, Team, Match, Player, Game

admin.site.register(Match)
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