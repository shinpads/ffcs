# Generated by Django 3.1.4 on 2022-05-21 00:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0043_auto_20220520_1935'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='summoner_id',
            field=models.CharField(default=None, max_length=64, null=True),
        ),
    ]
