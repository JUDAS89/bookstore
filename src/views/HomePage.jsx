import React, { useContext, useEffect } from 'react';
import LibroCard from '../components/LibroCard';
import LibroContext from '../contexts/LibroContext';
import '../style.css'

const HomePage = () => {
  const { libros, fetchLibros } = useContext(LibroContext);

  useEffect(() => {
    fetchLibros();
  }, [fetchLibros]);

  return (
    <div className="container">
      <div className="row">
        {libros.map((libro, index) => (
          <div key={libro.id||index} className="col-md-4">
            <LibroCard libro={libro} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
