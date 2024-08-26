import React from 'react';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth'; 
import { useNavigate } from 'react-router-dom'; 

function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth(); 
  const navigate = useNavigate(); 

  // Calcular el total del carrito
  const totalCarrito = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handleCheckout = () => {
    if (!user) {
      // Guardar el carrito en localStorage antes de redirigir
      localStorage.setItem('cart', JSON.stringify(cart));

      // Redirigir al usuario a una página que le permita elegir entre iniciar sesión o registrarse
      navigate('/auth-options');
      return;
    }
    alert('Compra realizada con éxito!');
    clearCart();
  };

  return (
    <div className="container">
      <h1>Carrito de Compras</h1>
      {cart.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <div className="row">
          {cart.map(item => (
            <div key={item.id} className="col-md-4 mb-3">
              <div className="card card-small h-100">
                <img src={item.img} className="img-fluid rounded-start" alt={item.titulo} />
                <div className="card-body text-center">
                  <h5 className="card-title">{item.titulo}</h5>
                  <p className="card-text">{item.price} {item.moneda}</p>
                  <div>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="card-text mt-2">
                    <b>Total: </b>{(item.price * item.quantity).toFixed(2)} {item.moneda}
                  </p>
                  <button 
                    className="btn btn-danger mt-2"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="cart-total-container d-flex justify-content-between align-items-center w-100 mt-2">
            <h4 className="cart-total">Total del Carrito: {totalCarrito.toFixed(2)} CLP</h4>
            <button className="btn cart-checkout-btn" onClick={handleCheckout}>
              Realizar Compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarritoPage;
