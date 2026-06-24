import { useState, useEffect } from 'react';
import type { OMDbMovie } from '../types/movie';
import { searchMovies } from '../services/omdb';

interface Props {
  title: string;
  query: string;
  onViewDetails: (id: string) => void;
}

const Row = ({ title, query, onViewDetails }: Props) => {
  const [movies, setMovies] = useState<OMDbMovie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const cacheKey = `row_cache_${query}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setMovies(JSON.parse(cached));
        return;
      }

      try {
        const data = await searchMovies(query);
        if (data.Response === 'True' && data.Search) {
          const results = data.Search.slice(0, 10);
          setMovies(results);
          sessionStorage.setItem(cacheKey, JSON.stringify(results));
        }
      } catch (err) {
        console.error('Error fetching row data', err);
      }
    };
    fetchMovies();
  }, [query]);

  if (movies.length === 0) return null;

  return (
    <div className="mb-5">
      <h4 className="text-light fw-bold mb-3">{title}</h4>
      <div 
        className="d-flex overflow-auto gap-3 pb-3" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>
          {`
            .d-flex::-webkit-scrollbar { display: none; }
          `}
        </style>
        {movies.map((movie) => (
          <div key={movie.imdbID} className="flex-shrink-0" style={{ width: '200px' }}>
            <img 
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/200x300/222/FFF?text=No+Poster'} 
              className="img-fluid rounded shadow-sm" 
              alt={movie.Title} 
              style={{ height: '300px', width: '100%', objectFit: 'cover', cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => onViewDetails(movie.imdbID)}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Row;
