# Generated by Django 3.1.4 on 2022-07-13 03:51

import app.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0066_remove_player_role_preferences'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='role_preferences',
            field=models.JSONField(blank=True, default=app.models.Player.role_preferences_default, null=True),
        ),
    ]
