import React from 'react';

const BadgeEstado = ({ estado, type }) => {
  const colors = {
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    default: '#6c757d'
  };
  
  return (
    <span style={{
      backgroundColor: colors[type] || colors.default,
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.8rem',
      fontWeight: 'bold'
    }}>
      {estado}
    </span>
  );
};

export default BadgeEstado;