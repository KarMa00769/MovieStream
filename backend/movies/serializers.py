from rest_framework import serializers
from .models import Movie


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = [
            'id', 'imdb_id', 'titulo', 'genero', 'anio', 'duracion',
            'director', 'calificacion', 'descripcion', 'poster', 'video'
        ]
        read_only_fields = ['id']
