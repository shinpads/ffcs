# Generated by Django 3.1.4 on 2022-05-20 23:35

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0042_match_casters'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='casters',
            field=models.ManyToManyField(default=None, null=True, related_name='caster_of', to=settings.AUTH_USER_MODEL),
        ),
    ]