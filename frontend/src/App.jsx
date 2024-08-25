import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LibroProvider } from './contexts/LibroContext';
import { CartProvider } from './contexts/CartContext';
import AppRouter from './AppRouter';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <LibroProvider>
        <CartProvider>
          <AppRouter />  {/* Mueve Navbar y Footer dentro de AppRouter */}
        </CartProvider>
      </LibroProvider>
    </AuthProvider>
  );
}

export default App;
