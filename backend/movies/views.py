from rest_framework import viewsets
from .models import Movie
from .serializers import MovieSerializer

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        imdb_id = self.request.query_params.get('imdb_id')
        if imdb_id:
            queryset = queryset.filter(imdb_id=imdb_id)
        return queryset
