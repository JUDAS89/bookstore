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
      try {
        const response = await axios.get('http://localhost:3000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setProfile(response.data.user);
      } catch (error) {
        console.error('Error al obtener el perfil:', error);
        if (error.response && error.response.status === 401) {
          logout();
          navigate('/login');
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
          <p>Email: {profile.email}</p>
          <button onClick={logout} className="btn btn-secondary">Cerrar Sesión</button>
        </>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </div>
  );
}

export default ProfilePage;

