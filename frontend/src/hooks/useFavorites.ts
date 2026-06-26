import { useState, useCallback } from 'react';
import type { OMDbMovieDetail } from '../types/movie';

const STORAGE_KEY = 'favorites';

const loadFavorites = (): OMDbMovieDetail[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<OMDbMovieDetail[]>(loadFavorites);

  const persist = (items: OMDbMovieDetail[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      console.error('localStorage quota exceeded');
    }
  };

  const addFavorite = useCallback((movie: OMDbMovieDetail) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.imdbID === movie.imdbID)) return prev;
      const updated = [...prev, movie];
      persist(updated);
      return updated;
    });
  }, []);

  const removeFavorite = useCallback((imdbID: string) => {
    setFavorites(prev => {
      const updated = prev.filter(fav => fav.imdbID !== imdbID);
      persist(updated);
      return updated;
    });
  }, []);

  const isFavorite = useCallback((imdbID: string) => {
    return favorites.some(fav => fav.imdbID === imdbID);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite };
};
