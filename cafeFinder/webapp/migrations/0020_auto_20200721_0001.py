# Generated by Django 3.0.5 on 2020-07-21 07:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0019_city_radius'),
    ]

    operations = [
        migrations.AlterField(
            model_name='city',
            name='lat',
            field=models.FloatField(verbose_name='Latitude'),
        ),
        migrations.AlterField(
            model_name='city',
            name='lng',
            field=models.FloatField(verbose_name='Longitude'),
        ),
    ]
