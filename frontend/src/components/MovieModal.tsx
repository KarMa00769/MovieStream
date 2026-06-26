import { useState, useEffect } from 'react';
import type { OMDbMovieDetail } from '../types/movie';
import { getLocalMovie, uploadMovieVideo } from '../services/api';

interface Props {
  movie: OMDbMovieDetail | null;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: Props) => {
  const [localMovie, setLocalMovie] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (movie) {
      setIsPlaying(false);
      getLocalMovie(movie.imdbID).then(data => setLocalMovie(data)).catch(console.error);
    }
  }, [movie]);

  if (!movie) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const uploaded = await uploadMovieVideo(movie, e.target.files[0]);
        setLocalMovie(uploaded);
      } catch (err) {
        alert('Error subiendo el video');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{opacity: 0.85}}></div>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog" onClick={onClose}>
        <div className="modal-dialog modal-xl modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content text-white shadow-lg">
            
            {isPlaying && localMovie?.video ? (
              <div className="position-relative bg-black rounded">
                <div className="ratio ratio-16x9">
                  <video controls autoPlay src={localMovie.video} className="w-100 rounded" />
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
                  <h5 className="modal-title fw-bold fs-2">{movie.Title}</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
                </div>
                <div className="modal-body p-4 pt-3">
                  <div className="row">
                    <div className="col-md-4 mb-3 mb-md-0">
                      <img src={movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/300x450/222/FFF?text=No+Poster'} className="img-fluid rounded shadow-lg w-100" alt={movie.Title} />
                      
                      <div className="d-grid mt-4">
                        {localMovie?.video ? (
                          <button className="btn btn-brand btn-lg shadow-sm" onClick={() => setIsPlaying(true)}>
                            <i className="bi bi-play-fill fs-4 align-middle"></i> Reproducir
                          </button>
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
                            <small className="text-secondary d-block mt-2 text-center">Sube un archivo para ver esta película</small>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-md-8 px-md-4 d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center mb-3">
                        <span className="text-warning fw-bold fs-3 me-3">★ {movie.imdbRating} <span className="text-secondary fs-6">/ 10</span></span>
                        <span className="badge bg-secondary fs-6 me-2">{movie.Year}</span>
                        <span className="badge bg-dark border border-secondary fs-6">{movie.Runtime}</span>
                      </div>
                      
                      <p className="mb-2 fs-5"><strong>Género:</strong> {movie.Genre}</p>
                      <p className="mb-2 fs-5"><strong>Director:</strong> {movie.Director}</p>
                      <p className="mb-4 fs-5"><strong>Actores:</strong> {movie.Actors}</p>
                      
                      <p className="mb-2 text-secondary fw-bold text-uppercase fs-6" style={{letterSpacing: '2px'}}>Sinopsis</p>
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
