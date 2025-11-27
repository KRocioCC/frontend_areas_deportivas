import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getReservasPorDia } from '../../../api/ReservaApi';
import ReservaCard from './Cards';
import './CalendarioReservaPage.css';

const formateaFechaLarga = (yyyy_mm_dd) => {
  // Evita problemas de zona horaria al parsear YYYY-MM-DD
  if (!yyyy_mm_dd) return '';
  const [y, m, d] = yyyy_mm_dd.split('-').map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1); // fecha local
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
};

const SkeletonCard = () => (
  <div className="skeleton-card" aria-hidden="true">
    <div className="sk-header" />
    <div className="sk-row" />
    <div className="sk-row" />
    <div className="sk-row" />
  </div>
);

const EmptyState = ({ fechaBonita }) => (
  <div className="empty-state">
    <h3>No hay reservas</h3>
    <p>Para el <strong>{fechaBonita}</strong> no se registraron reservas.</p>

  </div>
);

const CalendarioReservasPage = () => {
  const { fecha } = useParams(); // formato: YYYY-MM-DD
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fechaBonita = useMemo(() => formateaFechaLarga(fecha), [fecha]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const data = await getReservasPorDia(fecha);
        if (active) setReservas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar reservas:', error);
        if (active) setErrorMsg('No se pudieron cargar las reservas.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [fecha]);

  return (
    <div className="reservas-page text-gray-900">
      {/* Encabezado */}
      <header className="reservas-header">
        <div className="header-left">
          <Link to="/reservas/calendario" className="volver-link">← Volver al calendario</Link>
          <h1 className="text-3xl font-bold text-center mb-6 mx-auto w-fit">Reservas para el {fechaBonita}</h1>
        </div>
        <div className="header-right">
          <span className="count-badge">{reservas.length} {reservas.length === 1 ? 'reserva' : 'reservas'}</span>
        </div>
      </header>

      {/* Contenido */}
      {loading ? (
        <div className="cards-grid">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      ) : errorMsg ? (
        <div className="error-box">
          <p>{errorMsg}</p>
          <button className="btn-ghost" onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      ) : reservas.length === 0 ? (
        <EmptyState fechaBonita={fechaBonita} />
      ) : (
        <div className="cards-grid">
          {reservas.map((reserva) => (
            <ReservaCard key={reserva.idReserva ?? crypto.randomUUID()} reserva={reserva} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarioReservasPage;
