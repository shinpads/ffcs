# Generated by Django 3.1.4 on 2022-07-12 00:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0059_auto_20220711_2034'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='rumble_teams',
            field=models.ManyToManyField(blank=True, related_name='rumble_players', to='app.Team'),
        ),
        migrations.AlterField(
            model_name='rumbleteam',
            name='players',
            field=models.ManyToManyField(to='app.Player'),
        ),
        migrations.AlterField(
            model_name='rumbleteam',
            name='rumble_week',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.rumbleweek'),
        ),
    ]
