import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [userData, setUserData] = useState({ nombre: '', apellido: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/users/register', userData);
      console.log('Registro exitoso:', response.data);
      setError(null); 
      alert('Registro exitoso. Serás redirigido al inicio de sesión.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        const errorMessage = err.response.data.error || 'Error en la solicitud. Verifica los datos.';
        if (errorMessage === 'Error al registrarse. Correo ya existe') {
          setError('Error al registrarse. Correo ya existe');
        } else {
          setError(errorMessage);
        }
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
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input 
            type="text" 
            className="form-control" 
            id="nombre" 
            value={userData.nombre}
            onChange={(e) => setUserData({ ...userData, nombre: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="apellido" className="form-label">Apellido</label>
          <input 
            type="text" 
            className="form-control" 
            id="apellido" 
            value={userData.apellido}
            onChange={(e) => setUserData({ ...userData, apellido: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            id="email" 
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            required
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
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Registrarse</button>
      </form>
    </div>
  );
}

export default RegisterPage;
