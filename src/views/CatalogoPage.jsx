import React, { useContext, useEffect } from 'react';
import LibroCard from '../components/LibroCard';
import LibroContext from '../contexts/LibroContext';

function CatalogoPage() {
  const { libros, fetchLibros } = useContext(LibroContext);

  useEffect(() => {
    fetchLibros();
  }, [fetchLibros]);

  return (
    <div className="container">
      <h1>Catálogo de Libros</h1>
      <div className="row">
        {libros.map(libro => (
          <div key={libro.id} className="col-md-4">
            <LibroCard libro={libro} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatalogoPage;
