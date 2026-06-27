from rest_framework import serializers
from .models import Movie


class MovieSerializer(serializers.ModelSerializer):
    # BUG-2 fix: return absolute URL so frontend doesn't need to manually build it
    video = serializers.SerializerMethodField()

    def get_video(self, obj):
        request = self.context.get('request')
        if obj.video and request:
            return request.build_absolute_uri(obj.video.url)
        return None

    class Meta:
        model = Movie
        fields = [
            'id', 'imdb_id', 'titulo', 'genero', 'anio', 'duracion',
            'director', 'calificacion', 'descripcion', 'poster', 'video'
        ]
        read_only_fields = ['id']
