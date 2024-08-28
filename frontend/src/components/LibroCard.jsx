import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';  // Validación de propiedades, buena practica.
import axios from 'axios'; // Para hacer solicitudes al backend

function LibroCard({ libro, onCardClick, onAddToCart }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [averageRating, setAverageRating] = useState(null); // Nuevo estado para almacenar el rating promedio

  // Función para alternar la rotación de la tarjeta
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      onCardClick(libro.id); // Informa al componente padre que esta tarjeta fue clickeada
    }
  };

  // Obtener el rating promedio del libro
  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/ratings/${libro.id}`);
        setAverageRating(response.data.averageRating);
      } catch (error) {
        console.error('Error al obtener el rating promedio:', error);
      }
    };

    fetchAverageRating();
  }, [libro.id]);

  // Función para renderizar estrellas según el rating promedio
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="fa fa-star checked"></span>);
    }

    if (halfStar) {
      stars.push(<span key="half" className="fa fa-star-half-o checked"></span>);
    }

    return stars;
  };

  return (
    <div 
      className={`card ${isFlipped ? 'flipped' : ''}`} 
      onClick={toggleFlip} 
      style={{ cursor: 'pointer' }}
    >
      <div className="card-inner">
        {/* Contenido del frente de la tarjeta */}
        <div className="card-front">
          <img src={libro.img} alt={libro.titulo} className="card-img-top"/>
          <div className="card-body">
            <h5 className="card-title"> {libro.titulo} </h5>
            <p className="card-text precio"> <b>{libro.price} {libro.moneda}</b> </p>
            {averageRating !== null && (
              <div className="rating">
                {renderStars(averageRating)}
                <span className="ml-2">{averageRating.toFixed(1)}</span>
              </div>
            )}
            <div className="d-flex justify-content-center mt-3">
              <button 
                className="btn btn-secondary" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onAddToCart(libro);
                }}
              >
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>

        {/* Contenido de la parte trasera de la tarjeta */}
        <div className="card-back">
          <p className="card-text"><b>Autor:</b> {libro.autor}</p>
          <p className="card-text"><b>Editorial:</b> {libro.editorial}</p>
          <p className="card-text"><b>Publicación:</b> {libro.publicacion}</p>
          <p className="card-text"><b>Páginas:</b> {libro.pag}</p>
          <p className="card-text">{libro.desc}</p>
        </div>
      </div>
    </div>
  );
}

LibroCard.propTypes = {
  libro: PropTypes.shape({
    id: PropTypes.number.isRequired,
    img: PropTypes.string.isRequired,
    titulo: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    moneda: PropTypes.string.isRequired,
    autor: PropTypes.string,
    editorial: PropTypes.string,
    publicacion: PropTypes.string,
    pag: PropTypes.string,
  }).isRequired,
  onCardClick: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default LibroCard;



