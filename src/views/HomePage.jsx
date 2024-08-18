import React from 'react';
import '../style.css'

const HomePage = () => {
  return (
    <div className="presentation-container">
      <img className='col-md-4' src="/img/libro1.jpg" alt="libro_top en ventas 1"/>
      <img className='col-md-4' src="/img/oferta.png" alt="oferta del mes"/>
      <img className='col-md-4' src="/img/libro2.jpg.webp" alt="libro_top en ventas 2"/>
    </div>
  );
}

export default HomePage;
