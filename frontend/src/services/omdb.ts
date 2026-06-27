import type { OMDbSearchResponse, OMDbMovieDetail } from '../types/movie';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

const assertApiKey = () => {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error('VITE_OMDB_API_KEY no est\u00e1 configurada. Copia frontend/.env.example a frontend/.env y asigna tu API key.');
  }
};

export const searchMovies = async (query: string): Promise<OMDbSearchResponse> => {
  assertApiKey();
  const response = await fetch(`${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
  if (!response.ok) throw new Error(`OMDb error: ${response.status}`);
  return await response.json();
};

export const getMovieDetails = async (imdbID: string): Promise<OMDbMovieDetail> => {
  assertApiKey();
  const response = await fetch(`${BASE_URL}?i=${encodeURIComponent(imdbID)}&apikey=${API_KEY}`);
  if (!response.ok) throw new Error(`OMDb error: ${response.status}`);
  return await response.json();
};
