import React, { createContext, useState, useCallback } from 'react';
import { getLibros } from '../services/api';

const LibroContext = createContext();

export function LibroProvider({ children }) {
  const [libros, setLibros] = useState([]);

  const fetchLibros = useCallback(async () => {
    try {
      const data = await getLibros();
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
