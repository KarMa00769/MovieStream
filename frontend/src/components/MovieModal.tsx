import { useState, useEffect, useCallback, useRef } from 'react';
import type { OMDbMovieDetail } from '../types/movie';
import { getLocalMovie, uploadMovieVideo, deleteMovieVideo, resolveMediaUrl, type LocalMovieResponse } from '../services/api';
import { useFavorites } from '../hooks/useFavorites';
import { POSTER_FALLBACK } from '../constants';

interface Props {
  movie: OMDbMovieDetail | null;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: Props) => {
  const [localMovie, setLocalMovie] = useState<LocalMovieResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isFav = movie ? isFavorite(movie.imdbID) : false;

  useEffect(() => {
    if (!movie) return;
    let cancelled = false;
    setIsPlaying(false);    // reset player when switching movies
    setUploadError('');
    setLocalMovie(null);    // clear stale data from previous movie
    setIsLoadingLocal(true);
    getLocalMovie(movie.imdbID)
      .then(data => { if (!cancelled) setLocalMovie(data); })
      .catch(() => { if (!cancelled) setLocalMovie(null); })
      .finally(() => { if (!cancelled) setIsLoadingLocal(false); });
    return () => { cancelled = true; };
  }, [movie]);

  useEffect(() => {
    if (movie && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [movie]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (movie) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [movie, handleKeyDown]);

  if (!movie) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setUploadError('');
      try {
        const uploaded = await uploadMovieVideo(movie, e.target.files[0], localMovie);
        setLocalMovie(uploaded);
      } catch {
        setUploadError('Error al subir el video. Verifica el formato (MP4 o WebM).');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDeleteVideo = async () => {
    if (!localMovie?.id) return;
    setIsDeleting(true);
    setUploadError('');
    try {
      const updated = await deleteMovieVideo(localMovie.id);
      setLocalMovie(updated);
    } catch {
      setUploadError('Error al eliminar el video.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show" aria-hidden="true" style={{ opacity: 0.85 }}></div>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="movieModalTitle"
        onClick={onClose}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content text-white shadow-lg">

            {isPlaying && localMovie?.video && localMovie.imdb_id === movie.imdbID ? (
              <div className="position-relative bg-black rounded">
                <div className="ratio ratio-16x9">
                  <video controls autoPlay muted src={resolveMediaUrl(localMovie.video)} className="w-100 rounded" />
                </div>
                <button
                  className="btn btn-brand position-absolute top-0 end-0 m-3 z-3"
                  onClick={() => setIsPlaying(false)}
                >
                  <i className="bi bi-x-lg"></i> Cerrar
                </button>
              </div>
            ) : (
              <>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold fs-2" id="movieModalTitle">{movie.Title}</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={onClose}
                    aria-label="Cerrar"
                    ref={closeBtnRef}
                  ></button>
                </div>
                <div className="modal-body p-4 pt-3">
                  <div className="row">
                    <div className="col-md-4 mb-3 mb-md-0">
                      <img
                        src={movie.Poster !== 'N/A' ? movie.Poster : POSTER_FALLBACK}
                        className="img-fluid rounded shadow-lg w-100"
                        alt={movie.Title}
                        loading="lazy"
                      />

                      <div className="d-grid mt-4">
                        {isLoadingLocal ? (
                          <button className="btn btn-outline-brand w-100 py-2" disabled>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Buscando video...
                          </button>
                        ) : localMovie?.video ? (
                          <div className="d-grid gap-2">
                            <button className="btn btn-brand btn-lg shadow-sm" onClick={() => setIsPlaying(true)}>
                              <i className="bi bi-play-fill fs-4 align-middle"></i> Reproducir
                            </button>
                            <button
                              className="btn btn-outline-danger w-100"
                              onClick={handleDeleteVideo}
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Eliminando...</>
                              ) : (
                                <><i className="bi bi-trash me-2"></i> Borrar Video</>
                              )}
                            </button>
                            {uploadError && <div className="alert alert-danger py-2 mt-2 mb-0 text-center" role="alert">{uploadError}</div>}
                          </div>
                        ) : (
                          <div>
                            <label className={`btn btn-outline-brand w-100 py-2 ${isUploading ? 'disabled' : ''}`}>
                              {isUploading ? (
                                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Subiendo...</>
                              ) : (
                                <><i className="bi bi-upload me-2"></i> Subir Video (.mp4)</>
                              )}
                              <input type="file" accept="video/mp4,video/webm" className="d-none" onChange={handleFileChange} disabled={isUploading} />
                            </label>
                            {uploadError && <div className="alert alert-danger py-2 mt-2 mb-0 text-center" role="alert">{uploadError}</div>}
                            <small className="text-secondary d-block mt-2 text-center">Sube un archivo para ver esta pel&iacute;cula</small>
                          </div>
                        )}
                        
                        <button 
                          className={`btn mt-3 ${isFav ? 'btn-brand' : 'btn-outline-brand'}`} 
                          onClick={() => isFav ? removeFavorite(movie.imdbID) : addFavorite(movie)}
                        >
                          {isFav ? <><i className="bi bi-star-fill me-2"></i> Quitar de Mi Lista</> : <><i className="bi bi-star me-2"></i> Agregar a Mi Lista</>}
                        </button>
                      </div>
                    </div>

                    <div className="col-md-8 px-md-4 d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center mb-3">
                        <span className="text-warning fw-bold fs-3 me-3"><i className="bi bi-star-fill mb-1"></i> {movie.imdbRating} <span className="text-secondary fs-6">/ 10</span></span>
                        <span className="badge bg-secondary fs-6 me-2">{movie.Year}</span>
                        <span className="badge bg-dark border border-secondary fs-6">{movie.Runtime}</span>
                      </div>

                      <p className="mb-2 fs-5"><strong>G&eacute;nero:</strong> {movie.Genre}</p>
                      <p className="mb-2 fs-5"><strong>Director:</strong> {movie.Director}</p>
                      <p className="mb-4 fs-5"><strong>Actores:</strong> {movie.Actors}</p>

                      <p className="mb-2 text-secondary fw-bold text-uppercase fs-6" style={{ letterSpacing: '2px' }}>Sinopsis</p>
                      <p className="text-light fs-5 lh-lg">{movie.Plot}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieModal;
