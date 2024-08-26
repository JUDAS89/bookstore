import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './views/HomePage';
import CarritoPage from './views/CarritoPage';
import LoginPage from './views/LoginPage';
import ProfilePage from './views/ProfilePage';
import RegisterPage from './views/RegisterPage';
import CatalogoPage from './views/CatalogoPage';
import Navbar from './components/Navbar';  // Importa Navbar
import Footer from './components/Footer';  // Importa Footer
import AuthOptionsPage from './views/AuthOptionsPage';

function AppRouter() {
  return (
    <Router>
      <Navbar />  {/* Renderiza Navbar dentro del Router */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/carrito" element={<CarritoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/catalogo" element={<CatalogoPage />} /> 
        <Route path="/auth-options" element={<AuthOptionsPage />} /> 
      </Routes>
      <Footer />  {/* Renderiza Footer dentro del Router */}
    </Router>
  );
}

export default AppRouter;

