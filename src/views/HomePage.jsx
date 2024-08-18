import React from 'react';
import { Link } from 'react-router-dom';
import '../style.css'

const HomePage = () => {
  return (
<div className="container">
      <div className="row">
        <div className="col-md-4">
          <img src="/img/libro1.jpg" alt="libro_top en ventas 1" className="img-fluid"/>
        </div>
        <div className="col-md-4">
          <img src="/img/oferta.png" alt="oferta del mes" className="img-fluid"/>
          <div className="text-center mt-3">
            <Link to="/catalogo" className="btn btn-secondary">Ver Catálogo</Link>
          </div>
        </div>
        <div className="col-md-4">
          <img src="/img/libro2.jpg.webp" alt="libro_top en ventas 2" className="img-fluid"/>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
