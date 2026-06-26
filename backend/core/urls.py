from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static
from django.db import connection


def health_check(request):
    try:
        connection.ensure_connection()
        db_status = "ok"
    except Exception:
        db_status = "error"
    return JsonResponse({"status": "ok", "database": db_status})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/peliculas/', include('movies.urls')),
    path('health/', health_check),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
