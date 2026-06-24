import { useState, useEffect } from 'react';
import type { LocalMovie } from '../types/movie';

export const useLocalMovies = () => {
  const [movies, setMovies] = useState<LocalMovie[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('localMovies');
    if (saved) {
      try {
        setMovies(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing local movies', e);
      }
    }
  }, []);

  const saveMovies = (updatedMovies: LocalMovie[]) => {
    setMovies(updatedMovies);
    localStorage.setItem('localMovies', JSON.stringify(updatedMovies));
  };

  const addMovie = (movie: LocalMovie) => {
    saveMovies([...movies, movie]);
  };

  const updateMovie = (updatedMovie: LocalMovie) => {
    saveMovies(movies.map((m) => (m.id === updatedMovie.id ? updatedMovie : m)));
  };

  const deleteMovie = (id: string) => {
    saveMovies(movies.filter((m) => m.id !== id));
  };

  return { movies, addMovie, updateMovie, deleteMovie };
};
