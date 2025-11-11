import React, { useEffect } from "react";
import "../../styles/ToastMensaje.css";

export default function ToastMensaje({ mensaje, onClose, duracion = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duracion);
    return () => clearTimeout(timer);
  }, [duracion, onClose]);

  return (
    <div className="toast-mensaje">
      {mensaje}
    </div>
  );
}
