# Generated by Django 3.1.4 on 2022-07-15 02:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0068_game_game_timeline'),
    ]

    operations = [
        migrations.AddField(
            model_name='match',
            name='on_game_in_series',
            field=models.IntegerField(default=1),
        ),
    ]