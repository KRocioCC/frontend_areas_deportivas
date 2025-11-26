import React from 'react';

const StarRating = ({ calificacion, reviewsCount, showCount = true }) => {
  // Convertir a número por si acaso
  const rating = Number(calificacion) || 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <div style={{ display: 'flex', color: '#ffc107', fontSize: '1rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {/* Lógica simple: Estrella llena o vacía (puedes mejorarla a media estrella si quieres) */}
            {star <= Math.round(rating) ? '★' : '☆'}
          </span>
        ))}
      </div>
      {showCount && (
        <span style={{ fontSize: '0.85rem', color: '#6c757d', fontWeight: '600' }}>
          {rating.toFixed(1)} {reviewsCount !== undefined && `(${reviewsCount})`}
        </span>
      )}
    </div>
  );
};

export default StarRating;