import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './views/HomePage';
import CarritoPage from './views/CarritoPage';
import LoginPage from './views/LoginPage';
import ProfilePage from './views/ProfilePage';
import RegisterPage from './views/RegisterPage';
import CatalogoPage from './views/CatalogoPage';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/carrito" element={<CarritoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/catalogo" element={<CatalogoPage />} /> 
      </Routes>
    </Router>
  );
}

export default AppRouter;
