# Generated by Django 3.0.5 on 2020-05-05 02:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0008_auto_20200504_1910'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cafe',
            name='placetypes',
            field=models.ManyToManyField(blank=True, to='webapp.Placetype'),
        ),
    ]
