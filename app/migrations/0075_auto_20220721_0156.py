# Generated by Django 3.1.4 on 2022-07-21 05:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0074_auto_20220720_2151'),
    ]

    operations = [
        migrations.AddField(
            model_name='player',
            name='rumble_losses',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='player',
            name='rumble_wins',
            field=models.IntegerField(default=0),
        ),
    ]
