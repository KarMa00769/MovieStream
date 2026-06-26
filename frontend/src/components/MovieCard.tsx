import type { OMDbMovie } from '../types/movie';
import { POSTER_FALLBACK } from '../constants';

interface Props {
  movie: OMDbMovie;
  onViewDetails: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}

const MovieCard = ({ movie, onViewDetails, onToggleFavorite, isFavorite }: Props) => {
  const poster = movie.Poster !== 'N/A' ? movie.Poster : POSTER_FALLBACK;

  return (
    <div className="card h-100 text-white shadow-sm">
      <img
        src={poster}
        className="card-img-top"
        alt={`P&oacute;ster de ${movie.Title}`}
        loading="lazy"
        style={{ height: '400px', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold text-truncate" title={movie.Title}>{movie.Title}</h5>
        <p className="card-text text-secondary mb-3">{movie.Year}</p>
        <div className="mt-auto d-grid gap-2">
          <button className="btn btn-brand btn-sm" onClick={() => onViewDetails(movie.imdbID)}>
            Ver detalle
          </button>
          <button
            className={`btn btn-sm ${isFavorite ? 'btn-brand' : 'btn-outline-brand'}`}
            onClick={() => onToggleFavorite(movie.imdbID)}
            aria-label={isFavorite ? `Quitar ${movie.Title} de favoritos` : `Agregar ${movie.Title} a favoritos`}
          >
            {isFavorite ? <><i className="bi bi-star-fill"></i> Quitar Favorito</> : <><i className="bi bi-star"></i> Favorito</>}
          </button>
        </div>
      </div>
    </div>
  );
};
export default MovieCard;
