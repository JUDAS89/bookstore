import React, { useContext, useEffect, useState } from 'react';
import LibroCard from '../components/LibroCard';
import LibroContext from '../contexts/LibroContext';

function CatalogoPage() {
  const { libros, fetchLibros } = useContext(LibroContext);
  const [selectedCardId, setSelectedCardId] = useState(null); // Estado para manejar la tarjeta seleccionada

  useEffect(() => {
    fetchLibros();
  }, [fetchLibros]);

  // Función para manejar el clic en una tarjeta
  const handleCardClick = (id) => {
    setSelectedCardId(id === selectedCardId ? null : id); // Selecciona o deselecciona la tarjeta
  };

  return (
    <div className="container">
      <h1>Catálogo de Libros</h1>
      <div className="row">
        {libros.map(libro => (
          <div key={libro.id} className="col-md-4">
            <LibroCard 
              libro={libro} 
              isSelected={selectedCardId === null || selectedCardId === libro.id} 
              onCardClick={() => handleCardClick(libro.id)} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatalogoPage;
