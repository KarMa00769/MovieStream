import type { OMDbSearchResponse, OMDbMovieDetail } from '../types/movie';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

export const searchMovies = async (query: string): Promise<OMDbSearchResponse> => {
  const response = await fetch(`${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
  if (!response.ok) {
    throw new Error('Error fetching movies from OMDb');
  }
  return await response.json();
};

export const getMovieDetails = async (imdbID: string): Promise<OMDbMovieDetail> => {
  const response = await fetch(`${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`);
  if (!response.ok) {
    throw new Error('Error fetching movie details from OMDb');
  }
  return await response.json();
};
