from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0002_movie_imdb_id_movie_video'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='imdb_id',
            field=models.CharField(blank=True, db_index=True, max_length=50, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='movie',
            name='titulo',
            field=models.CharField(db_index=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='movie',
            name='director',
            field=models.CharField(db_index=True, max_length=255),
        ),
    ]
