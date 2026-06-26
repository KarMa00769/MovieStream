import type { OMDbMovieDetail } from '../types/movie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/peliculas/';

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

export const getLocalMovie = async (imdbID: string): Promise<LocalMovieResponse | null> => {
  const response = await fetch(`${API_URL}?imdb_id=${encodeURIComponent(imdbID)}`);
  if (!response.ok) {
    throw new Error(`Error fetching local movie: ${response.status}`);
  }
  const data: LocalMovieResponse[] = await response.json();
  return data.length > 0 ? data[0] : null;
};

export const uploadMovieVideo = async (movie: OMDbMovieDetail, videoFile: File, localId?: number): Promise<LocalMovieResponse> => {
  const formData = new FormData();
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
  formData.append('video', videoFile);

  const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
  const url = localId ? `${baseUrl}${localId}/` : baseUrl;
  const method = localId ? 'PATCH' : 'POST';

  const response = await fetch(url, {
    method,
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Error al subir el video');
  }

  return await response.json();
};
