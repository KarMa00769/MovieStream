import { useState } from 'react';
import { useLocalMovies } from '../hooks/useLocalMovies';
import type { LocalMovie } from '../types/movie';

const Admin = () => {
  const { movies, addMovie, updateMovie, deleteMovie } = useLocalMovies();
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<LocalMovie>({
    id: '', titulo: '', genero: '', anio: new Date().getFullYear(),
    director: '', descripcion: '', poster: '', calificacion: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'anio' || name === 'calificacion' ? Number(value) : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMovie(formData);
    } else {
      addMovie({ ...formData, id: Date.now().toString() });
    }
    handleCancel();
  };

  const handleEdit = (movie: LocalMovie) => {
    setEditingId(movie.id);
    setFormData(movie);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ id: '', titulo: '', genero: '', anio: new Date().getFullYear(), director: '', descripcion: '', poster: '', calificacion: 0 });
  };

  return (
    <div className="container-fluid px-4 px-lg-5 py-5 mt-5" style={{minHeight: '80vh'}}>
      <h2 className="mb-4 text-light">Panel de Administración (LocalStorage)</h2>
      
      <div className="card text-white mb-5 shadow-lg">
        <div className="card-header bg-brand">
          <h5 className="mb-0 fw-bold">{editingId ? 'Editar Película' : 'Nueva Película'}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Título</label>
              <input type="text" className="form-control bg-dark text-white border-secondary" name="titulo" value={formData.titulo} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Género</label>
              <input type="text" className="form-control bg-dark text-white border-secondary" name="genero" value={formData.genero} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">Año</label>
              <input type="number" className="form-control bg-dark text-white border-secondary" name="anio" value={formData.anio} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">Director</label>
              <input type="text" className="form-control bg-dark text-white border-secondary" name="director" value={formData.director} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label">Calificación</label>
              <input type="number" step="0.1" className="form-control bg-dark text-white border-secondary" name="calificacion" value={formData.calificacion} onChange={handleChange} required />
            </div>
            <div className="col-md-12">
              <label className="form-label">URL del Poster</label>
              <input type="url" className="form-control bg-dark text-white border-secondary" name="poster" value={formData.poster} onChange={handleChange} />
            </div>
            <div className="col-12">
              <label className="form-label">Descripción</label>
              <textarea className="form-control bg-dark text-white border-secondary" name="descripcion" rows={3} value={formData.descripcion} onChange={handleChange} required></textarea>
            </div>
            <div className="col-12 d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-brand px-4">{editingId ? 'Actualizar' : 'Guardar'}</button>
              {editingId && <button type="button" className="btn btn-outline-brand px-4" onClick={handleCancel}>Cancelar</button>}
            </div>
          </form>
        </div>
      </div>

      <h4 className="text-light mb-3">Películas Registradas</h4>
      <div className="table-responsive shadow-sm">
        <table className="table table-dark table-hover border-secondary align-middle">
          <thead>
            <tr>
              <th>Título</th>
              <th>Año</th>
              <th>Género</th>
              <th>Calificación</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movies.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-secondary py-4">No hay películas registradas en localStorage.</td></tr>
            ) : (
              movies.map((m) => (
                <tr key={m.id}>
                  <td className="fw-bold">{m.titulo}</td>
                  <td>{m.anio}</td>
                  <td>{m.genero}</td>
                  <td className="text-warning">★ {m.calificacion}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-brand me-2" onClick={() => handleEdit(m)}><i className="bi bi-pencil"></i></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteMovie(m.id)}><i className="bi bi-trash"></i></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Admin;
