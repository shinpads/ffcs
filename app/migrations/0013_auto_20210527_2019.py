# Generated by Django 3.1.4 on 2021-05-28 00:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0012_auto_20210527_2018'),
    ]

    operations = [
        migrations.AlterField(
            model_name='playerstats',
            name='player',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='stats', to='app.player'),
        ),
    ]