import React, { useContext, useEffect } from 'react';
import LibroCard from '../components/LibroCard';
import LibroContext from '../contexts/LibroContext';

function HomePage() {
  const { libros, fetchLibros } = useContext(LibroContext);

  useEffect(() => {
    fetchLibros();
  }, [fetchLibros]);

  return (
    <div className="container">
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

export default HomePage;
