import React, { createContext, useState, useCallback } from 'react';

const LibroContext = createContext();

export function LibroProvider({ children }) {
  const [libros, setLibros] = useState([]);

  const fetchLibros = useCallback(async () => {
    try {
      const response = await fetch('/libros.json'); // Carga directamente desde libros.json en public
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setLibros(data);
    } catch (error) {
      console.error('Error al obtener los libros:', error);
    }
  }, []);

  return (
    <LibroContext.Provider value={{ libros, fetchLibros }}>
      {children}
    </LibroContext.Provider>
  );
}

export default LibroContext;

