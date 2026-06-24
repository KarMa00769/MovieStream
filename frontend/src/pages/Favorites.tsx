import { useState } from 'react';
import MovieModal from '../components/MovieModal';
import { useFavorites } from '../hooks/useFavorites';
import type { OMDbMovieDetail, OMDbMovie } from '../types/movie';
import MovieCard from '../components/MovieCard';

const Favorites = () => {
  const { favorites, removeFavorite, isFavorite } = useFavorites();
  const [selectedMovie, setSelectedMovie] = useState<OMDbMovieDetail | null>(null);

  const handleViewDetails = (id: string) => {
    const movie = favorites.find((m) => m.imdbID === id);
    if (movie) setSelectedMovie(movie);
  };

  return (
    <div className="container-fluid px-4 px-lg-5 py-5 mt-5" style={{minHeight: '80vh'}}>
      <h2 className="mb-4 text-light"><i className="bi bi-star-fill text-warning"></i> Mis Favoritos</h2>
      {favorites.length === 0 ? (
        <div className="alert alert-dark border-secondary">No tienes películas favoritas guardadas en localStorage.</div>
      ) : (
        <div className="row g-4">
          {favorites.map((movie) => {
            const mappedMovie: OMDbMovie = {
              Title: movie.Title,
              Year: movie.Year,
              imdbID: movie.imdbID,
              Type: movie.Type,
              Poster: movie.Poster,
            };
            return (
              <div key={movie.imdbID} className="col-md-4 col-lg-3">
                <MovieCard
                  movie={mappedMovie}
                  isFavorite={isFavorite(movie.imdbID)}
                  onViewDetails={handleViewDetails}
                  onToggleFavorite={removeFavorite}
                />
              </div>
            );
          })}
        </div>
      )}
      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </div>
  );
};
export default Favorites;
