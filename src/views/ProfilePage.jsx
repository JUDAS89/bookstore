import React from 'react';
import useAuth from '../hooks/useAuth';

function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="container">
      <h1>Perfil del Usuario</h1>
      {user ? (
        <>
          <p>Nombre: {user.name}</p>
          <p>Email: {user.email}</p>
          <button onClick={logout} className="btn btn-secondary">Cerrar Sesión</button>
        </>
      ) : (
        <p>No has iniciado sesión.</p>
      )}
    </div>
  );
}

export default ProfilePage;
