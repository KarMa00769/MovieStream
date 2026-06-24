import type { OMDbMovieDetail } from '../types/movie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/peliculas/';

export const getLocalMovie = async (imdbID: string) => {
  const response = await fetch(`${API_URL}?imdb_id=${imdbID}`);
  const data = await response.json();
  return data.length > 0 ? data[0] : null;
};

export const uploadMovieVideo = async (movie: OMDbMovieDetail, videoFile: File) => {
  const formData = new FormData();
  formData.append('imdb_id', movie.imdbID);
  formData.append('titulo', movie.Title);
  formData.append('genero', movie.Genre);
  // Extracción simple de año para campos numéricos
  const yearMatch = movie.Year.match(/\d{4}/);
  formData.append('anio', yearMatch ? yearMatch[0] : new Date().getFullYear().toString());
  formData.append('duracion', movie.Runtime);
  formData.append('director', movie.Director);
  formData.append('calificacion', movie.imdbRating !== 'N/A' ? movie.imdbRating : '0');
  formData.append('descripcion', movie.Plot);
  if (movie.Poster !== 'N/A') formData.append('poster', movie.Poster);
  formData.append('video', videoFile);

  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Error al subir el video');
  }

  return await response.json();
};
