# Generated by Django 5.1.2 on 2024-10-18 12:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patient', '0005_alter_biaaccactivemetabolicmass_aat_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='measurement',
            name='dt',
            field=models.DateTimeField(),
        ),
    ]