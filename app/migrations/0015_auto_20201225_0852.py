# Generated by Django 3.1.4 on 2020-12-25 08:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0014_auto_20201225_0137'),
    ]

    operations = [
        migrations.AlterField(
            model_name='player',
            name='account_id',
            field=models.CharField(blank=True, max_length=70),
        ),
    ]