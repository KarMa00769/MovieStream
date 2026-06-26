import { useState, useCallback } from 'react';
import type { LocalMovie } from '../types/movie';

const STORAGE_KEY = 'localMovies';

const loadMovies = (): LocalMovie[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

export const useLocalMovies = () => {
  const [movies, setMovies] = useState<LocalMovie[]>(loadMovies);

  const persist = (items: LocalMovie[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      console.error('localStorage quota exceeded');
    }
  };

  const addMovie = useCallback((movie: LocalMovie) => {
    setMovies(prev => {
      const updated = [...prev, movie];
      persist(updated);
      return updated;
    });
  }, []);

  const updateMovie = useCallback((updatedMovie: LocalMovie) => {
    setMovies(prev => {
      const updated = prev.map(m => m.id === updatedMovie.id ? updatedMovie : m);
      persist(updated);
      return updated;
    });
  }, []);

  const deleteMovie = useCallback((id: string) => {
    setMovies(prev => {
      const updated = prev.filter(m => m.id !== id);
      persist(updated);
      return updated;
    });
  }, []);

  return { movies, addMovie, updateMovie, deleteMovie };
};
