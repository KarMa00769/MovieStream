import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container py-5 mt-5 text-center text-white" style={{ minHeight: '80vh' }}>
    <h1 className="display-1 fw-bold text-brand mb-3">404</h1>
    <h2 className="mb-3">P&aacute;gina no encontrada</h2>
    <p className="text-secondary mb-4">La ruta que buscas no existe.</p>
    <Link to="/" className="btn btn-brand">
      <i className="bi bi-house"></i> Volver al inicio
    </Link>
  </div>
);

export default NotFound;
