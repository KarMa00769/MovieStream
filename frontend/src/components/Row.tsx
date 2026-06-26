import { useState, useEffect } from 'react';
import type { OMDbMovie } from '../types/movie';
import { searchMovies } from '../services/omdb';
import { POSTER_FALLBACK_SM } from '../constants';

interface Props {
  title: string;
  query: string;
  onViewDetails: (id: string) => void;
}

const Row = ({ title, query, onViewDetails }: Props) => {
  const [movies, setMovies] = useState<OMDbMovie[]>([]);

  useEffect(() => {
    let cancelled = false;
    const fetchMovies = async () => {
      const cacheKey = `row_cache_${query}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        if (!cancelled) setMovies(JSON.parse(cached));
        return;
      }

      try {
        const data = await searchMovies(query);
        if (!cancelled && data.Response === 'True' && data.Search) {
          const results = data.Search.slice(0, 10);
          setMovies(results);
          sessionStorage.setItem(cacheKey, JSON.stringify(results));
        }
      } catch {
        /* silently ignore row fetch errors */
      }
    };
    fetchMovies();
    return () => { cancelled = true; };
  }, [query]);

  if (movies.length === 0) return null;

  return (
    <div className="mb-5">
      <h4 className="text-light fw-bold mb-3">{title}</h4>
      <div className="d-flex overflow-auto gap-3 pb-3 no-scrollbar">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="flex-shrink-0" style={{ width: '200px' }}>
            <button
              type="button"
              className="btn p-0 border-0 w-100"
              onClick={() => onViewDetails(movie.imdbID)}
              aria-label={`Ver detalle de ${movie.Title}`}
              style={{ background: 'transparent' }}
            >
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : POSTER_FALLBACK_SM}
                className="img-fluid rounded shadow-sm row-poster"
                alt={`P&oacute;ster de ${movie.Title}`}
                loading="lazy"
                style={{ height: '300px', width: '100%', objectFit: 'cover' }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Row;
