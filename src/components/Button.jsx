import React from 'react';
import PropTypes from 'prop-types';

function Button({ label, onClick, type = "button" }) {
  return (
    <button 
      className="btn btn-primary" 
      onClick={onClick} 
      type={type} 
      aria-label={label}
    >
      {label}
    </button>
  );
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),  // Restringe a tipos de botón válidos
};

export default Button;
