import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate(); 
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/login', credentials);
      login(response.data.token, response.data.user);
      setSuccess('Inicio de sesión exitoso.');
      setError('');

      // Redirigir al usuario a la página de perfil o inicio
      navigate('/profile');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Credenciales incorrectas. Inténtalo de nuevo.');
      } else if (err.response && err.response.status === 404) {
        setError('El usuario no existe.');
      } else {
        setError('Error en el servidor. Inténtalo más tarde.');
      }
      setSuccess('');
    }
  };

  return (
    <div className="container">
      <h1>Iniciar Sesión</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            id="email" 
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input 
            type="password" 
            className="form-control" 
            id="password" 
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default LoginPage;

