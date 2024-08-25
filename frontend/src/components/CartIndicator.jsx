import React from 'react';
import useCart from '../hooks/useCart';

function CartIndicator() {
  const { cart } = useCart();

  // Calcular la cantidad total de ítems en el carrito
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="cart-indicator" style={{ position: 'relative', display: 'inline-block', verticalAlign: 'middle' }}>
      <span
        className="icon-carrito"
        role="img"
        aria-label="Carrito"
        style={{
          fontSize: '22px', // Ajusta el tamaño del carrito
          position: 'relative',
          verticalAlign: 'middle', // Alinea verticalmente el carrito
        }}
      > 🛒
        {totalItems > 0 && (
          <span
          style={{
            position: 'absolute',
            top: '-16px', // Mueve el número más arriba
            left: '50%',
            transform: 'translateX(-50%)', // Centra horizontalmente el número
            color: '#FF4500', // Color del número
            fontSize: '13px', // Tamaño del número
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Sombra mejorada
            padding: '2px 6px',
          }}
          >
            {totalItems}
          </span>
        )}
      </span>
    </div>
  );
}

export default CartIndicator;







