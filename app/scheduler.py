from .models import Player
from .utils import get_info_by_account_id
from apscheduler.schedulers.background import BackgroundScheduler
import sys

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(update_summoner_info, 'interval', seconds=30)
    scheduler.start()

def update_summoner_info():
    all_players = Player.objects.all()
    print('reached beginning')
    sys.stdout.flush()

    print(all_players[0].summoner_name)
    sys.stdout.flush()    

    for player in all_players:
        print('on: ' + player.summoner_name)
        sys.stdout.flush()
        if not player.account_id:
            print('not: ' + player.summoner_name)
            sys.stdout.flush()
            continue

        player_info = get_info_by_account_id(player.account_id)
        print('info:' + player_info)
        sys.stdout.flush()

        if player_info == None:
            continue
        user = player.user

        player.profile_icon_id = player_info['profileIconId']
        user.summoner_name = player_info['name']
        user.summoner_level = player_info['summonerLevel']

        user.save()
        player.save()

    return