# Generated by Django 3.1.4 on 2022-05-13 02:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0031_user_summoner_level'),
    ]

    operations = [
        migrations.AlterField(
            model_name='team',
            name='color',
            field=models.IntegerField(default=16777215),
        ),
        migrations.AlterField(
            model_name='team',
            name='discord_channel_id',
            field=models.BigIntegerField(default=None, null=True),
        ),
        migrations.AlterField(
            model_name='team',
            name='discord_role_id',
            field=models.BigIntegerField(default=None, null=True),
        ),
    ]