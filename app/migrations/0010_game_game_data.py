# Generated by Django 3.1.4 on 2021-05-27 22:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_match_blue_side'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='game_data',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
