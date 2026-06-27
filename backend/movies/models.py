from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
from datetime import datetime


def _max_year():
    return datetime.now().year + 5


class Movie(models.Model):
    imdb_id = models.CharField(max_length=50, blank=True, null=True, unique=True, db_index=True)
    titulo = models.CharField(max_length=255, db_index=True)
    genero = models.CharField(max_length=100)
    anio = models.IntegerField(
        validators=[MinValueValidator(1888), MaxValueValidator(_max_year)]
    )
    duracion = models.CharField(max_length=50)
    director = models.CharField(max_length=255, db_index=True)
    calificacion = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(10.0)]
    )
    descripcion = models.TextField()
    poster = models.URLField(max_length=500, blank=True, null=True)
    video = models.FileField(
        upload_to='videos/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['mp4', 'webm', 'ogg'])]
    )

    class Meta:
        ordering = ['-anio', 'titulo']

    def __str__(self):
        return self.titulo
