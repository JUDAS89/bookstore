import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LibroProvider } from './contexts/LibroContext';
import AppRouter from './AppRouter';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <LibroProvider>
        <AppRouter />  {/* Mueve Navbar y Footer dentro de AppRouter */}
      </LibroProvider>
    </AuthProvider>
  );
}

export default App;


