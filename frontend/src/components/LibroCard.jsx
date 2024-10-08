import React, { useState } from 'react';
import PropTypes from 'prop-types';  // Validación de propiedades, buena practica.

function LibroCard({ libro, onCardClick, onAddToCart  }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Función para alternar la rotación de la tarjeta
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      onCardClick(libro.id); // Informa al componente padre que esta tarjeta fue clickeada
    }
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



