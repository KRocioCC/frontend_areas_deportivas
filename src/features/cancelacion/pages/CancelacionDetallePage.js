// src/features/cancelacion/pages/CancelacionDetallePage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CancelacionDetallePage.css';
import { getCancelacionById, deleteCancelacion } from '../../../api/CancelacionApi';
import { marcarEnCurso } from '../../../api/ReservaApi';

const CancelacionDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cancelacion, setCancelacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getCancelacionById(id);
        if (active) setCancelacion(data);
      } catch (err) {
        if (active) setErrorMsg('No se pudo cargar la cancelación.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  const handleDeshacer = async () => {
    try {
      await deleteCancelacion(id); // pone estado=false en cancelación
      await marcarEnCurso(cancelacion.reserva.idReserva); // reactiva reserva
      navigate(`/reservas/${cancelacion.reserva.fechaReserva}`);
    } catch (err) {
      console.error('Error al deshacer cancelación:', err);
    }
  };

  if (loading) return <p>Cargando detalles...</p>;
  if (errorMsg) return <p>{errorMsg}</p>;
  if (!cancelacion) return <p>No se encontró la cancelación.</p>;

  const { cliente, reserva, motivo, fechaCancelacion, horaCancelacion } = cancelacion;

  return (
    <div className="cancelacion-detalle">
      <h2>Cancelación #{id}</h2>

      <section className="info-box">
        <h3 className="box-title">Cliente que canceló</h3>
        <ul className="kv">
          <li><strong>Nombre:</strong><span>{cliente?.nombreCompleto || '—'}</span></li>
          <li><strong>Correo:</strong><span>{cliente?.correo || '—'}</span></li>
          <li><strong>Teléfono:</strong><span>{cliente?.telefono || '—'}</span></li>
        </ul>
      </section>

      <section className="info-box">
        <h3 className="box-title">Reserva cancelada</h3>
        <ul className="kv">
          <li><strong>Fecha:</strong><span>{reserva?.fechaReserva || '—'}</span></li>
          <li><strong>Horario:</strong><span>{reserva?.horaInicio} - {reserva?.horaFin}</span></li>
          <li><strong>Cancha:</strong><span>{reserva?.nombreEspacio || '—'}</span></li>
        </ul>
      </section>

      <section className="info-box">
        <h3 className="box-title">Datos de la Cancelación</h3>
        <ul className="kv">
          <li><strong>Motivo:</strong><span>{motivo}</span></li>
          <li><strong>Fecha:</strong><span>{fechaCancelacion}</span></li>
          <li><strong>Hora:</strong><span>{horaCancelacion}</span></li>
        </ul>
      </section>

      <div className="header-actions">
        <button className="btn btn--success" onClick={handleDeshacer}>
          Deshacer Cancelación
        </button>
      </div>
    </div>
  );
};

export default CancelacionDetallePage;
