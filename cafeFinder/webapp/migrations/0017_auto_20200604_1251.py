# Generated by Django 3.0.5 on 2020-06-04 19:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0016_city_photo_src'),
    ]

    operations = [
        migrations.RenameField(
            model_name='city',
            old_name='latitude',
            new_name='lat',
        ),
        migrations.RenameField(
            model_name='city',
            old_name='longitude',
            new_name='lng',
        ),
    ]
