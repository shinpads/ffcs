from io import BytesIO
import os
from venv import create
from PIL import Image, ImageDraw, ImageFont, ImageChops

from app.utils import get_summoner_image


def create_profile_image(user):
    rumble_player = user.players.get(is_rumble=True)
    W, H = (350, 200)
    icon_W, icon_H = (30, 30)
    margin_left, margin_top = (5, 5)
    font_size = 16
    discord_dark_mode_color = '#36393f'

    summoner_image = Image.open(
        BytesIO(get_summoner_image(rumble_player.profile_icon_id)))
    summoner_image = summoner_image.resize((icon_W, icon_H))

    cur_path = os.path.dirname(__file__)
    default_font = ImageFont.truetype(
        cur_path + '/../staticfiles/rest_framework/fonts/friz-quadrata-std-medium.otf',
        size=font_size
    )
    img = Image.new(
        'RGB',
        (W, H),
        discord_dark_mode_color
    )
    img.paste(summoner_image, (margin_left, margin_top))

    d = ImageDraw.Draw(img)

    d.text(
        (
            icon_W + (2 * margin_left),
            margin_top + int(icon_H / 2)
        ),
        f'{user.summoner_name}',
        fill='#EDB852',
        font=default_font,
        anchor='lm'
    )

    d.text(
        (
            margin_left,
            icon_H + margin_top + 10
        ),
        f'{rumble_player.rumble_rank.name}, {rumble_player.rumble_lp} LP',
        fill=rumble_player.rumble_rank.color,
        font=default_font,
        anchor='lt'
    )

    d.text(
        (
            margin_left,
            icon_H + margin_top + 36
        ),
        f'Rumble record: {rumble_player.rumble_wins} - {rumble_player.rumble_losses}',
        fill=(255, 255, 255),
        font=default_font,
        anchor='lt'
    )

    d.text(
        (
            margin_left,
            icon_H + margin_top + 62
        ),
        f'KDA: {rumble_player.stats.kda_per_game}',
        fill=(255, 255, 255),
        font=default_font,
        anchor='lt'
    )

    return img
