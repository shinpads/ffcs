from django.http import JsonResponse
from django.views import View

from app.models import Rank
from app.serializers.rankserializer import RankSerializer


class RanksView(View):
    def get(self, request, *args, **kwargs):
        ranks = Rank.objects.all()
        out_data = {
            'ranks': []
        }

        for rank in ranks:
            cur_rank_seralize = RankSerializer(rank).data
            rank_players = list(rank.players.all())

            if len(rank_players) > 0:
                rank_players.sort(key=lambda player: player.rumble_lp)
                rank_min_lp = rank_players[0].rumble_lp
                cur_rank_seralize['min_lp'] = rank_min_lp
            else:
                cur_rank_seralize['min_lp'] = None
            
            out_data['ranks'].append(cur_rank_seralize)

        return JsonResponse({
            "message": "success",
            "data": out_data,
        }, status=200)
