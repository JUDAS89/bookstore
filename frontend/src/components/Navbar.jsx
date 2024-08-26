import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import CartIndicator from './CartIndicator'; 
import '../style.css';

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    console.log("Menu toggled, menuOpen is now:", !menuOpen);  // Debugging
  };

  return (
    <nav className="navbar navbar-light bg-light navbar-full-width">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">📖 Bookstore 📖</Link>
        <button 
          className="navbar-toggler d-block d-lg-none"  // Solo visible en dispositivos pequeños
          type="button" 
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={toggleMenu}
        >
          ☰ {/* Ícono de hamburguesa */}
        </button>
        <div className={`navbar-collapse justify-content-end ${menuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/register">Crear Cuenta</Link>
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
                <CartIndicator />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;



