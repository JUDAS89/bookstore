import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Rating from 'react-rating';

function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [compras, setCompras] = useState([]);
  const [libros, setLibros] = useState([]);
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
        console.log('Token usado para la solicitud de perfil:', user.token);
        const response = await axios.get(`http://localhost:3000/api/users/profile?nocache=${new Date().getTime()}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        console.log('Datos del perfil recibidos en el frontend:', response.data.user);
        setProfile(response.data.user);

        // Fetch user's purchases
        const comprasResponse = await axios.get('http://localhost:3000/api/users/compras', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        console.log('Compras del usuario:', comprasResponse.data.compras);
        setCompras(comprasResponse.data.compras);

        // Fetch libros.json from the public folder
        const librosResponse = await fetch('/libros.json');
        const librosData = await librosResponse.json();
        setLibros(librosData);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        if (error.response && error.response.status === 403) {
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

  const obtenerImagen = (titulo) => {
    const libro = libros.find(libro => libro.titulo === titulo);
    return libro ? libro.img : null;
  };

  const handleRatingChange = async (publicacion_id, rating) => {
    try {
      await axios.post('http://localhost:3000/api/ratings', { publicacion_id, rating }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
  
      setCompras(prevCompras =>
        prevCompras.map(compra =>
          compra.publicacion_id === publicacion_id ? { ...compra, userRating: rating } : compra
        )
      );
  
      alert('Rating guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar el rating:', error);
    }
  };

  return (
    <div className="container">
      <h1>Perfil del Usuario</h1>
      {profile ? (
        <>
          <p>Nombre: {profile.nombre}</p>
          <p>Apellido: {profile.apellido}</p>
          <p>Email: {profile.correo}</p> 
          <button onClick={logout} className="btn btn-secondary">Cerrar Sesión</button>

          <h2>Mis Compras</h2>
          <div className="compras-container">
            {compras.length > 0 ? (
              compras.map((compra, index) => (
                <div key={index} className="compra-item">
                  <img 
                    src={obtenerImagen(compra.titulo)} 
                    alt={compra.titulo} 
                    className="libro-imagen" 
                  />
                  <div className="compra-detalles">
                    <input type="hidden" value={compra.compra_id} />
                    <input type="hidden" value={compra.publicacion_id} />
                    <p className="compra-titulo">{compra.titulo}</p>
                    <p className="compra-info">Cantidad: {compra.cantidad}</p>
                    <p className="compra-info">Fecha: {new Date(compra.fecha).toLocaleDateString()}</p>
                    <div className="compra-rating">
                      <p className="mb-0">¿Te gustó el libro?</p>
                      {compra.userRating !== null && compra.userRating !== undefined ? (
                        <>
                          <p className="compra-info">Tu rating: {compra.userRating}</p>
                        </>
                      ) : (
                        <>
                          <Rating
                            initialRating={0}
                            fractions={2}
                            onChange={(value) => handleRatingChange(compra.publicacion_id, value)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No has realizado ninguna compra.</p>
            )}
          </div>
        </>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </div>
  );
}

// CSS en línea o en un archivo CSS separado
const styles = `
  .compras-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
  }

  .compra-item {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 600px;
    background-color: #f9f9f9;
  }

  .libro-imagen {
    width: 60px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
  }

  .compra-detalles {
    display: flex;
    flex-direction: column;
  }

  .compra-titulo {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .compra-info {
    font-size: 0.9em;
    margin: 0;
  }

  .compra-rating {
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;

// Insertar los estilos en la página
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ProfilePage;







