# Generated by Django 3.2 on 2022-07-30 02:40

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0083_team_avg_rumble_elo'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='banned_role',
            field=models.CharField(blank=True, choices=[('TOP', 'Top'), ('JG', 'Jungle'), ('MID', 'Mid'), ('ADC', 'ADC'), ('SUPP', 'Support')], max_length=10),
        ),
        migrations.AlterField(
            model_name='user',
            name='smurfs',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, default='', max_length=64), blank=True, null=True, size=None),
        ),
    ]