from django.contrib import admin
from .models import Movie


@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'anio', 'genero', 'director', 'calificacion']
    search_fields = ['titulo', 'director', 'genero']
    list_filter = ['genero', 'anio']
