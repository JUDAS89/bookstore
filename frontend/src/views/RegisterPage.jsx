import React, { useState } from 'react';
import axios from 'axios';

function RegisterPage() {
  const [userData, setUserData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/users/register', {
        email: userData.email,
        password: userData.password,
      });
      console.log('Registro exitoso:', response.data);
      setError(null); // Limpiar cualquier error previo
      alert('Registro exitoso. Serás redirigido al inicio de sesión.');
      setTimeout(() => {
        window.location.href = '/login'; // Redirigir después de un breve retraso
      }, 2000);
    } catch (err) {
      // Manejar diferentes tipos de errores de respuesta del servidor
      if (err.response && err.response.status === 400) {
      // Mostrar mensaje de error específico si es un error 400
      setError(err.response.data.error || 'Error en la solicitud. Verifica los datos.');
      } else {
        console.error('Error en el registro:', err);
        setError('Error al registrarse. Intente nuevamente.');
      }
    }
  };

  return (
    <div className="container">
      <h1>Registro</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            id="email" 
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input 
            type="password" 
            className="form-control" 
            id="password" 
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-primary">Registrarse</button>
      </form>
    </div>
  );
}

export default RegisterPage;

