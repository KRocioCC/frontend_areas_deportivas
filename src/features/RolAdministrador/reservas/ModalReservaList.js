// src/features/reservas/components/ModalReservaList.js
import React from "react";
import { X, Users, Clock, CreditCard, CalendarDays } from "lucide-react";
import Button from "../../../components/ui/Button";
import "./ModalReservaList.css";

export default function ModalReservaList({ initialData, onCancel }) {
  if (!initialData) return null;

  const cancha = initialData.cancha || {};
  const cliente = initialData.cliente || {};
  const pago = initialData.pago || {};

  const imageUrl = cancha.urlImagen || "https://placehold.co/300x300/2563eb/white?text=Sin+Imagen";

  return (
    <div className="modal-reserva-overlay">
      <div className="modal-reserva-blur"></div>

      <div className="modal-reserva-container">
        <div className="modal-reserva-content">
          {/* Header */}
          <div className="modal-reserva-header">
            <h2>Detalle de Reserva</h2>
            <button onClick={onCancel} className="modal-reserva-close">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Imagen y datos principales */}
          <div className="modal-reserva-grid">
            <div className="modal-reserva-image">
              <img src={imageUrl} alt={cancha.nombre} />
            </div>

            <div className="modal-reserva-info">
              <h3>{cancha.nombre || "Cancha sin nombre"}</h3>
              <div className="modal-reserva-box primary">
                <div className="label">Estado</div>
                <div className="value">{initialData.estadoReserva}</div>
              </div>

              <div className="modal-reserva-box">
                <Users className="icon" />
                <span>Capacidad: {cancha.capacidad || "?"} personas</span>
              </div>

              <div className="modal-reserva-box">
                <Clock className="icon" />
                <span>Horario: {initialData.horaInicio?.slice(0,5)} - {initialData.horaFin?.slice(0,5)}</span>
              </div>

              <div className="modal-reserva-box">
                <CalendarDays className="icon" />
                <span>Fecha: {initialData.fechaReserva?.slice(0,10)}</span>
              </div>

              <div className="modal-reserva-box">
                <CreditCard className="icon" />
                <span>Pago: Bs {pago.monto || initialData.totalPagado || 0} ({pago.metodoPago || "Método no registrado"})</span>
              </div>
            </div>
          </div>

          {/* Detalles extendidos */}
          <div className="modal-reserva-details">
            <h4>Información del Cliente</h4>
            <div className="modal-reserva-detail-grid">
              <div>
                <div className="label">Nombre</div>
                <div className="value">{cliente.nombre || initialData.nombreUsuario || "Sin nombre"}</div>
              </div>
              <div>
                <div className="label">Email</div>
                <div className="value">{cliente.email || "No disponible"}</div>
              </div>
              <div>
                <div className="label">Teléfono</div>
                <div className="value">{cliente.telefono || "No disponible"}</div>
              </div>
              <div>
                <div className="label">Observaciones</div>
                <div className="value">{initialData.observaciones || "Sin observaciones"}</div>
              </div>
            </div>
          </div>

          {/* Botón cerrar */}
          <div className="modal-reserva-footer">
            <Button variant="secondary" onClick={onCancel}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
