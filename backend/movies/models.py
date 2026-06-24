from django.db import models

class Movie(models.Model):
    imdb_id = models.CharField(max_length=50, blank=True, null=True, unique=True)
    titulo = models.CharField(max_length=255)
    genero = models.CharField(max_length=100)
    anio = models.IntegerField()
    duracion = models.CharField(max_length=50)
    director = models.CharField(max_length=255)
    calificacion = models.FloatField()
    descripcion = models.TextField()
    poster = models.URLField(max_length=500, blank=True, null=True)
    video = models.FileField(upload_to='videos/', blank=True, null=True)

    def __str__(self):
        return self.titulo
