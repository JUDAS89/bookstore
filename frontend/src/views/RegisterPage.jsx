import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart'; // Importa el hook de carrito
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const { login } = useAuth();
  const { addToCart } = useCart(); // Desestructuramos la función para agregar al carrito
  const navigate = useNavigate(); 
  const [userData, setUserData] = useState({ nombre: '', apellido: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Solicitud al backend para registrar un nuevo usuario
      const response = await axios.post('http://localhost:3000/api/users/register', userData);
      const token = response.data.token;
      const user = response.data.user;

      // Guardar el usuario en el contexto global de autenticación
      login({ token, ...user });

      // Cargar el carrito desde localStorage, si existe
      const storedCart = JSON.parse(localStorage.getItem('cart'));
      if (storedCart) {
        // Agregar cada ítem del carrito almacenado al carrito actual
        storedCart.forEach(item => addToCart(item));
        localStorage.removeItem('cart'); // Limpiar localStorage después de cargar el carrito
      }

      setSuccess('Registro exitoso.');
      setError('');    
      alert('Registro exitoso. Serás redirigido al carrito.');
      navigate('/carrito'); // Redirigir al usuario al carrito para continuar con la compra
    } catch (err) {
      // Manejo de errores basado en la respuesta del servidor
      if (err.response && err.response.status === 400) {
        const errorMessage = err.response.data.error || 'Error en la solicitud. Verifica los datos.';
        if (errorMessage === 'Error al registrarse. Correo ya existe') {
          setError('Error al registrarse. Correo ya existe');
        } else {
          setError(errorMessage);
        }
      } else {
        setError('Error al registrarse. Intente nuevamente.');
      }
      setSuccess('');
    }
  };

  return (
    <div className="container">
      <h1>Registro</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
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
