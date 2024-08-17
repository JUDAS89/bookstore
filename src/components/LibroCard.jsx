import React from 'react';

function LibroCard({ libro }) {
  return (
    <div className="card">
      <img src={libro.img} alt={libro.titulo} className="card-img-top" />
      <div className="card-body">
        <h5 className="card-title">{libro.titulo}</h5>
        <p className="card-text">{libro.desc}</p>
        <p className="card-text">{libro.price} {libro.moneda}</p>
      </div>
    </div>
  );
}

export default LibroCard;
