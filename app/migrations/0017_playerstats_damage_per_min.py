# Generated by Django 3.1.4 on 2021-05-28 20:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0016_playerstats_kp_per_game'),
    ]

    operations = [
        migrations.AddField(
            model_name='playerstats',
            name='damage_per_min',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=6),
        ),
    ]
