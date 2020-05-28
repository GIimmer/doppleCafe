# Generated by Django 3.0.5 on 2020-05-27 20:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0014_auto_20200513_1845'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cafe',
            name='formatted_phone_number',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='FormattedPhoneNumber'),
        ),
        migrations.AlterField(
            model_name='cafe',
            name='lat',
            field=models.DecimalField(blank=True, decimal_places=8, max_digits=10, null=True, verbose_name='Latitude'),
        ),
        migrations.AlterField(
            model_name='cafe',
            name='lng',
            field=models.DecimalField(blank=True, decimal_places=8, max_digits=11, null=True, verbose_name='Longitude'),
        ),
    ]