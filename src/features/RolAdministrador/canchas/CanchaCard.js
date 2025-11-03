// src/features/personas/RolAdministrador/canchas/CanchaCard.js
import React from 'react';
import './CanchasAdmin.css';

const CanchaCard = ({ cancha, onEdit, isEditing, editedData, onChangeField, onSave, onCancel }) => {
  const renderField = (label, field) => (
    <p>
      <strong>{label}:</strong>{' '}
      {isEditing ? (
        <input
          type="text"
          value={editedData[field] || ''}
          onChange={(e) => onChangeField(field, e.target.value)}
        />
      ) : (
        cancha[field]
      )}
    </p>
  );

  return (
    <div className="cancha-card">
      <div className="cancha-image-placeholder" />
      <div className="cancha-info">
        <div className="cancha-header">
          <h3>
            {isEditing ? (
              <input
                type="text"
                value={editedData.nombre || ''}
                onChange={(e) => onChangeField('nombre', e.target.value)}
              />
            ) : cancha.nombre}
          </h3>
          {isEditing ? (
            <div className="cancha-actions">
              <button className="btn-save" onClick={onSave}>Guardar</button>
              <button className="btn-cancel" onClick={onCancel}>Cerrar</button>
            </div>
          ) : (
            <button className="btn-edit" onClick={() => onEdit(cancha.idCancha)}>Editar</button>
          )}
        </div>

        <div className="cancha-details">
          {renderField("Costo Hora", "costoHora")}
          {renderField("Capacidad", "capacidad")}
          {renderField("Apertura", "horaInicio")}
          {renderField("Cierre", "horaFin")}
          {renderField("Superficie", "tipoSuperficie")}
          {renderField("Tamaño", "tamano")}
          {renderField("Cubierta", "cubierta")}
          {renderField("Iluminación", "iluminacion")}
        </div>

        <div className="cancha-footer">
          <span className="zona-info">
            <strong>Zona:</strong> {cancha.areaDeportiva?.zona?.nombre || 'Sin zona'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CanchaCard;
