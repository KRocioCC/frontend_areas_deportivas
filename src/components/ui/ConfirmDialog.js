import React from "react";
import "../../styles/ConfirmDialog.css";

export default function ConfirmDialog({ mensaje, onConfirmar, onCancelar }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content small">
        <p className="confirm-text">{mensaje || "¿Estás segur@?"}</p>
        <div className="form-actions">
          <button className="btn btn-danger" onClick={onConfirmar}>Sí</button>
          <button className="btn btn-secondary" onClick={onCancelar}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
