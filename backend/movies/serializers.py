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

    def to_representation(self, instance):
        """Override output: return absolute video URL instead of relative path."""
        ret = super().to_representation(instance)
        request = self.context.get('request')
        if instance.video and request:
            ret['video'] = request.build_absolute_uri(instance.video.url)
        return ret
