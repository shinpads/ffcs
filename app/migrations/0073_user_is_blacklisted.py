# Generated by Django 3.1.4 on 2022-07-19 19:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0072_scheduletest'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_blacklisted',
            field=models.BooleanField(default=False),
        ),
    ]