# Generated by Django 3.0.5 on 2020-04-16 01:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cafe',
            name='placetypes',
            field=models.ManyToManyField(blank=True, to='webapp.Placetype'),
        ),
    ]
