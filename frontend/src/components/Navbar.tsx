import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link${isActive ? ' active' : ''}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" aria-label="Navegaci&oacute;n principal">
      <div className="container-fluid px-lg-5">
        <Link className="navbar-brand fw-bold fs-3 text-brand" to="/">
          <i className="bi bi-film"></i> MovieStream
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Abrir men&uacute; de navegaci&oacute;n"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className={linkClass} to="/" end>Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={linkClass} to="/favorites">Favoritos</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={linkClass} to="/admin">Admin</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
