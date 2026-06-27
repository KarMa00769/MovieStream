import { useState } from 'react';
import Banner from '../components/Banner';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import Row from '../components/Row';
import { searchMovies, getMovieDetails } from '../services/omdb';
import type { OMDbMovie, OMDbMovieDetail } from '../types/movie';
import { useFavorites } from '../hooks/useFavorites';

const Home = () => {
  const [movies, setMovies] = useState<OMDbMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<OMDbMovieDetail | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const data = await searchMovies(query);
      if (data.Response === 'True' && data.Search) {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError(data.Error || 'No se encontraron resultados.');
      }
    } catch {
      setError('Error al conectar con OMDb API.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setHasSearched(false);
    setMovies([]);
    setError('');
  };

  const handleViewDetails = async (id: string) => {
    setModalLoading(true);
    try {
      const details = await getMovieDetails(id);
      setSelectedMovie(details);
    } catch {
      setSelectedMovie(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      try {
        const details = await getMovieDetails(id);
        addFavorite(details);
      } catch {
        /* silently fail - details fetch is best-effort for favorites */
      }
    }
  };

  return (
    <>
      <Banner />
      <div className="container-fluid px-4 px-lg-5 py-5">
        <SearchBar onSearch={handleSearch} />

        {loading && <div className="spinner-border text-brand mb-4" role="status"><span className="visually-hidden">Cargando...</span></div>}
        {error && <div className="alert alert-dark border-brand text-brand mb-4" role="alert">{error}</div>}

        {hasSearched ? (
          <>
            <div className="d-flex align-items-center gap-3 mb-4">
              <h3 className="text-light mb-0">Resultados de b&uacute;squeda</h3>
              <button className="btn btn-outline-brand btn-sm" onClick={handleResetSearch}>
                <i className="bi bi-arrow-left me-1"></i> Volver al cat&aacute;logo
              </button>
            </div>
            <div className="row g-4">
              {movies.map((movie) => (
                <div key={movie.imdbID} className="col-md-4 col-lg-3">
                  <MovieCard
                    movie={movie}
                    isFavorite={isFavorite(movie.imdbID)}
                    onViewDetails={handleViewDetails}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>
            <Row title="&Eacute;xitos de Ciencia Ficci&oacute;n" query="Interstellar" onViewDetails={handleViewDetails} />
            <Row title="Acci&oacute;n y Superh&eacute;roes" query="Batman" onViewDetails={handleViewDetails} />
            <Row title="Sagas &Eacute;picas" query="Star Wars" onViewDetails={handleViewDetails} />
            <Row title="Terror y Suspenso" query="Horror" onViewDetails={handleViewDetails} />
          </div>
        )}
      </div>
      <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
    </>
  );
};
export default Home;
