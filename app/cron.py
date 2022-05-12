from .models import Player
from .utils import get_info_by_account_id

def update_summoner_info():
    print('started')
    all_players = Player.objects.all()

    for player in all_players:
        if not player.account_id:
            continue

        player_info = get_info_by_account_id(player.account_id)
        user = player.user

        player.profile_icon_id = player_info['profileIconId']
        user.summoner_name = player_info['name']
        user.summoner_level = player_info['summonerLevel']

        user.save()
        player.save()

    return