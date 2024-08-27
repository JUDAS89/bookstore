import React, { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Cargar carrito desde localStorage al iniciar la aplicación
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  // Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (libro) => {
    setCart(prevCart => {
      const existingBook = prevCart.find(item => item.id === libro.id);
      if (existingBook) {
        return prevCart.map(item => 
          item.id === libro.id 
            ? { ...item, quantity: existingBook.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...libro, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCart(prevCart => prevCart.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(quantity, 1) } 
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;




