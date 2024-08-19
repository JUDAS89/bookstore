import React, { createContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (libro) => {
    setCart(prevCart => {
      const existingBook = prevCart.find(item => item.id === libro.id);
      if (existingBook) {
        return prevCart.map(item => 
          item.id === libro.id 
            ? { ...item, quantity: item.quantity + 1 }
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