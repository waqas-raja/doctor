# Generated by Django 5.1.2 on 2024-10-25 11:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patient', '0006_alter_measurement_dt'),
    ]

    operations = [
        migrations.AddField(
            model_name='patient',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
        migrations.AddField(
            model_name='patient',
            name='telephone',
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
    ]
