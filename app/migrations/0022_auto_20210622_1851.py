# Generated by Django 3.1.4 on 2021-06-22 22:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0021_auto_20210622_1830'),
    ]

    operations = [
        migrations.AddField(
            model_name='playerchampionstats',
            name='losses',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='playerchampionstats',
            name='wins',
            field=models.IntegerField(default=0),
        ),
    ]
