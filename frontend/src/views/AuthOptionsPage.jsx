import React from 'react';
import { Link } from 'react-router-dom';

function AuthOptionsPage() {
  return (
    <div className="container">
      <h1>Opciones de Autenticación</h1>
      <p>Por favor, inicia sesión o crea una cuenta para continuar con tu compra.</p>
      <div className="d-flex justify-content-around mt-4">
        <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
        <Link to="/register" className="btn btn-secondary">Crear Cuenta</Link>
      </div>
    </div>
  );
}

export default AuthOptionsPage;
