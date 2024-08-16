import React from 'react';

function LibroCard({ libro }) {
  return (
    <div className="card">
      <img src={libro.imagen} alt={libro.nombre} className="card-img-top" />
      <div className="card-body">
        <h5 className="card-title">{libro.nombre}</h5>
        <p className="card-text">{libro.descripcion}</p>
        <p className="card-text">{libro.precio} USD</p>
      </div>
    </div>
  );
}

export default LibroCard;
