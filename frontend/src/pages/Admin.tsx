import { useState } from 'react';
import { useLocalMovies } from '../hooks/useLocalMovies';
import type { LocalMovie } from '../types/movie';

const INITIAL_FORM: LocalMovie = {
  id: '', titulo: '', genero: '', anio: new Date().getFullYear(),
  director: '', descripcion: '', poster: '', calificacion: 0
};

const NUMERIC_FIELDS = new Set(['anio', 'calificacion']);

const Admin = () => {
  const { movies, addMovie, updateMovie, deleteMovie } = useLocalMovies();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<LocalMovie>({ ...INITIAL_FORM });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: NUMERIC_FIELDS.has(name) ? (value === '' ? 0 : Number(value)) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMovie(formData);
    } else {
      addMovie({ ...formData, id: crypto.randomUUID() });
    }
    handleCancel();
  };

  const handleEdit = (movie: LocalMovie) => {
    setEditingId(movie.id);
    setFormData(movie);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ ...INITIAL_FORM });
  };

  return (
    <div className="container-fluid px-4 px-lg-5 py-5 mt-5" style={{ minHeight: '80vh' }}>
      <h2 className="mb-4 text-light">Panel de Administraci&oacute;n (LocalStorage)</h2>

      <div className="card text-white mb-5 shadow-lg">
        <div className="card-header bg-brand">
          <h5 className="mb-0 fw-bold">{editingId ? 'Editar Pel&iacute;cula' : 'Nueva Pel&iacute;cula'}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="admin-titulo">T&iacute;tulo</label>
              <input id="admin-titulo" type="text" className="form-control bg-dark text-white border-secondary" name="titulo" value={formData.titulo} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="admin-genero">G&eacute;nero</label>
              <input id="admin-genero" type="text" className="form-control bg-dark text-white border-secondary" name="genero" value={formData.genero} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="admin-anio">A&ntilde;o</label>
              <input id="admin-anio" type="number" className="form-control bg-dark text-white border-secondary" name="anio" value={formData.anio} onChange={handleChange} required min={1888} max={new Date().getFullYear() + 5} />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="admin-director">Director</label>
              <input id="admin-director" type="text" className="form-control bg-dark text-white border-secondary" name="director" value={formData.director} onChange={handleChange} required />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="admin-calificacion">Calificaci&oacute;n</label>
              <input id="admin-calificacion" type="number" step="0.1" min={0} max={10} className="form-control bg-dark text-white border-secondary" name="calificacion" value={formData.calificacion} onChange={handleChange} required />
            </div>
            <div className="col-md-12">
              <label className="form-label" htmlFor="admin-poster">URL del Poster</label>
              <input id="admin-poster" type="url" className="form-control bg-dark text-white border-secondary" name="poster" value={formData.poster} onChange={handleChange} />
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="admin-descripcion">Descripci&oacute;n</label>
              <textarea id="admin-descripcion" className="form-control bg-dark text-white border-secondary" name="descripcion" rows={3} value={formData.descripcion} onChange={handleChange} required></textarea>
            </div>
            <div className="col-12 d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-brand px-4">{editingId ? 'Actualizar' : 'Guardar'}</button>
              {editingId && <button type="button" className="btn btn-outline-brand px-4" onClick={handleCancel}>Cancelar</button>}
            </div>
          </form>
        </div>
      </div>

      <h4 className="text-light mb-3">Pel&iacute;culas Registradas</h4>
      <div className="table-responsive shadow-sm">
        <table className="table table-dark table-hover border-secondary align-middle" aria-label="Pel&iacute;culas registradas en administraci&oacute;n">
          <thead>
            <tr>
              <th>T&iacute;tulo</th>
              <th>A&ntilde;o</th>
              <th>G&eacute;nero</th>
              <th>Calificaci&oacute;n</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movies.length === 0 ? (
              <tr><td colSpan={5} className="text-center text-secondary py-4">No hay pel&iacute;culas registradas en localStorage.</td></tr>
            ) : (
              movies.map((m) => (
                <tr key={m.id}>
                  <td className="fw-bold">{m.titulo}</td>
                  <td>{m.anio}</td>
                  <td>{m.genero}</td>
                  <td className="text-warning">&starf; {m.calificacion}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-brand me-2" onClick={() => handleEdit(m)} aria-label={`Editar ${m.titulo}`}><i className="bi bi-pencil"></i></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => deleteMovie(m.id)} aria-label={`Eliminar ${m.titulo}`}><i className="bi bi-trash"></i></button>
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
