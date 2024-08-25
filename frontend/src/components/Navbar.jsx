import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import CartIndicator from './CartIndicator'; 
import '../style.css';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light navbar-full-width">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">📖 Bookstore 📖</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/register">Crear Cuenta </Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Perfil 👤</Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={logout}>Cerrar Sesión 🔒</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">Iniciar Sesión 🔓</Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/carrito">
                <CartIndicator /> {/* Aquí se muestra el indicador del carrito */}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

