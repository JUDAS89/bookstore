import React, { createContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = ({ token, ...userData }) => {
    // Guardar carrito del invitado antes de iniciar sesión
    const guestCart = JSON.parse(localStorage.getItem('cart')) || [];

    setUser({ token, ...userData });
    console.log('Token guardado en el contexto:', token); // Para depuración

    // Intentar cargar el carrito del usuario autenticado desde localStorage
    const userCart = JSON.parse(localStorage.getItem(`cart_${token}`));

    // Si existe un carrito en el usuario autenticado, úsalo; de lo contrario, usa el del invitado
    if (userCart) {
      localStorage.setItem('cart', JSON.stringify(userCart));
    } else {
      localStorage.setItem('cart', JSON.stringify(guestCart));
    }

    // Limpia el carrito del invitado para evitar conflictos futuros
    localStorage.removeItem('cart');
  };

  const logout = () => {
    if (user) {
      // Guardar el carrito específico del usuario en localStorage antes de cerrar sesión
      localStorage.setItem(`cart_${user.token}`, localStorage.getItem('cart'));
    }
    setUser(null);
    localStorage.removeItem('cart'); // Limpiar el carrito al cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;




