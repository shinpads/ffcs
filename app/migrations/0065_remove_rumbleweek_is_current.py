# Generated by Django 3.1.4 on 2022-07-13 02:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0064_remove_player_rumble_teams'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='rumbleweek',
            name='is_current',
        ),
    ]
