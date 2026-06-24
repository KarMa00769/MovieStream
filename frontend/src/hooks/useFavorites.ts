import { useState, useEffect } from 'react';
import type { OMDbMovieDetail } from '../types/movie';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<OMDbMovieDetail[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing favorites', e);
      }
    }
  }, []);

  const addFavorite = (movie: OMDbMovieDetail) => {
    const exists = favorites.some((fav) => fav.imdbID === movie.imdbID);
    if (!exists) {
      const updatedFavorites = [...favorites, movie];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  const removeFavorite = (imdbID: string) => {
    const updatedFavorites = favorites.filter((fav) => fav.imdbID !== imdbID);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const isFavorite = (imdbID: string) => {
    return favorites.some((fav) => fav.imdbID === imdbID);
  };

  return { favorites, addFavorite, removeFavorite, isFavorite };
};
