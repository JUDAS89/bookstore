import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.token) {
        console.error('Token is missing in the frontend');
        logout();
        navigate('/login');
        return;
      }

      try {
        console.log('Token usado para la solicitud de perfil:', user.token); // Verifica que el token sea el esperado
        const response = await axios.get('http://localhost:3000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setProfile(response.data.user);
      } catch (error) {
        console.error('Error al obtener el perfil:', error);
        if (error.response && error.response.status === 403) {
          logout();
          navigate('/login');  // Redirigir al usuario a la página de inicio de sesión si no está autorizado
        }
      }
    };

    if (user) {
      fetchProfile();
    } else {
      navigate('/login');
    }
  }, [user, logout, navigate]);

  return (
    <div className="container">
      <h1>Perfil del Usuario</h1>
      {profile ? (
        <>
          <p>Email: {profile.correo}</p>
          <button onClick={logout} className="btn btn-secondary">Cerrar Sesión</button>
        </>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </div>
  );
}


export default ProfilePage;