# Generated by Django 3.1.4 on 2021-01-07 06:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_game_meta_key'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='meta_key',
            field=models.CharField(blank=True, max_length=100, unique=True),
        ),
        migrations.AddIndex(
            model_name='game',
            index=models.Index(fields=['meta_key'], name='app_game_meta_ke_8d1823_idx'),
        ),
    ]