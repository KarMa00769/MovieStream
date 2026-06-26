import type { OMDbMovieDetail } from '../types/movie';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/peliculas/').replace(/\/?$/, '/');
const BACKEND_BASE = API_URL.replace(/\/api\/peliculas\/$/, '');

export const resolveMediaUrl = (path: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BACKEND_BASE}${path}`;
};

export interface LocalMovieResponse {
  id: number;
  imdb_id: string;
  titulo: string;
  genero: string;
  anio: number;
  duracion: string;
  director: string;
  calificacion: number;
  descripcion: string;
  poster: string;
  video: string | null;
}

// Handles paginated DRF response { count, results: [...] } OR plain array
export const getLocalMovie = async (imdbID: string): Promise<LocalMovieResponse | null> => {
  const response = await fetch(`${API_URL}?imdb_id=${encodeURIComponent(imdbID)}`);
  if (!response.ok) throw new Error(`Error fetching local movie: ${response.status}`);
  const data = await response.json();
  const list: LocalMovieResponse[] = Array.isArray(data) ? data : (data.results ?? []);
  return list.length > 0 ? list[0] : null;
};

// Smart upsert: PATCH if movie already in DB (to avoid unique imdb_id conflict), POST if new
export const uploadMovieVideo = async (
  movie: OMDbMovieDetail,
  videoFile: File,
  existingMovie?: LocalMovieResponse | null
): Promise<LocalMovieResponse> => {
  const formData = new FormData();
  formData.append('video', videoFile);

  if (existingMovie?.id) {
    // Movie already exists → just PATCH the video field
    const response = await fetch(`${API_URL}${existingMovie.id}/`, {
      method: 'PATCH',
      body: formData,
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`PATCH failed: ${err}`);
    }
    return await response.json();
  }

  // Movie is new → POST with full metadata
  formData.append('imdb_id', movie.imdbID);
  formData.append('titulo', movie.Title);
  formData.append('genero', movie.Genre);
  const yearMatch = movie.Year.match(/\d{4}/);
  formData.append('anio', yearMatch ? yearMatch[0] : new Date().getFullYear().toString());
  formData.append('duracion', movie.Runtime);
  formData.append('director', movie.Director);
  formData.append('calificacion', movie.imdbRating !== 'N/A' ? movie.imdbRating : '0');
  formData.append('descripcion', movie.Plot);
  if (movie.Poster !== 'N/A') formData.append('poster', movie.Poster);

  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`POST failed: ${err}`);
  }

  return await response.json();
};

export const deleteMovieVideo = async (movieId: number): Promise<LocalMovieResponse> => {
  const response = await fetch(`${API_URL}${movieId}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ video: null }),
  });
  if (!response.ok) throw new Error('Error al eliminar el video');
  return await response.json();
};
