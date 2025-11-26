// src/features/calendario/pages/Cards.js
import React, { useEffect, useMemo, useState } from 'react';
import './Cards.css';
import PagosList from '../../pagos/pages/PagosList';
import { getCancha, getCanchas } from '../../../api/CanchaApi';
import { createCancelacion } from '../../../api/CancelacionApi';
import { Link } from 'react-router-dom';

const formateaFechaLarga = (fechaISO) => {
  try {
    const d = new Date(fechaISO);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return fechaISO ?? '';
  }
};

const hhmm = (t) => (t ? t.toString().slice(0, 5) : '--:--');

const moneyBOB = (n) =>
  typeof n === 'number'
    ? n.toLocaleString('es-BO', { style: 'currency', currency: 'BOB', maximumFractionDigits: 2 })
    : (n ?? '—');

// Helpers de fecha/hora LOCAL (evita UTC para que el backend no lo vea “futuro”)
const pad = (n) => String(n).padStart(2, '0');
const getLocalYYYYMMDD = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const getLocalHHMMSS = (d = new Date()) =>
  `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

const ReservaCard = ({ reserva = {} }) => {
  const {
    idReserva,
    idEspacio,                 // si existe, corresponde a idCancha
    idCliente,                 // puede venir directo
    nombreCliente,
    emailCliente,
    telefonoCliente,
    horaInicio,
    horaFin,
    fechaReserva,
    montoTotal,
    totalPagado,
    canchasIncluidas,
    cancelacion
  } = reserva;

  const [showPagos, setShowPagos] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [cancha, setCancha] = useState(null);
  const [cLoading, setCLoading] = useState(false);
  const [cError, setCError] = useState('');

  // Determinar id de cancha desde distintos posibles orígenes
  const idCanchaFromReserva = useMemo(() => {
    if (idEspacio) return idEspacio;
    const idFromIncluye = canchasIncluidas?.[0]?.cancha?.idCancha;
    return idFromIncluye || null;
  }, [idEspacio, canchasIncluidas]);

  // Cargar cancha
  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (!idCanchaFromReserva) return;
      try {
        setCLoading(true);
        setCError('');
        try {
          const data = await getCancha(idCanchaFromReserva);
          if (alive) setCancha(data || null);
          return;
        } catch (e1) {
          // Fallback: traer todas y buscar localmente
          const list = await getCanchas();
          const found = Array.isArray(list)
            ? list.find(c => String(c.idCancha) === String(idCanchaFromReserva))
            : null;
          if (alive) setCancha(found || null);
        }
      } catch (e) {
        console.error('Error al cargar cancha:', e);
        if (alive) {
          setCError('No se pudo cargar la información de la cancha.');
          setCancha(null);
        }
      } finally {
        if (alive) setCLoading(false);
      }
    };
    load();
    return () => { alive = false; };
  }, [idCanchaFromReserva]);

  const fechaBonita = useMemo(() => formateaFechaLarga(fechaReserva), [fechaReserva]);

  // Confirmación y envío de cancelación (con fecha/hora LOCAL)
  const handleConfirmCancelacion = async () => {
    const payload = {
      idReserva,
      // usa idCliente si lo tienes; si no, intenta alternativas comunes
      idCliente: idCliente ?? reserva?.clienteId ?? reserva?.cliente?.idPersona,
      motivo: "Cancelación manual",
      fechaCancelacion: getLocalYYYYMMDD(),  // LOCAL
      horaCancelacion: getLocalHHMMSS(),     // LOCAL
      estado: true
    };

    console.log("[CANCELACION] Enviando payload:", payload);

    try {
      const result = await createCancelacion(payload);
      console.log("[CANCELACION] Respuesta exitosa:", result);
      window.location.reload();
    } catch (err) {
      console.error("[CANCELACION] Error al cancelar reserva:", err);
      alert("Error al cancelar la reserva. Revisa la consola para más detalles.");
    }
  };

  return (
    <div className="reserva-wrapper text-gray-900">
      <div className="card">
        <header className="card-header row-between">
          <div className="header-left">
            <h1 className="titulo-principal">Información de la Reserva — {fechaBonita}</h1>
            <div className="evento-horario">
              <span className="ico-reloj" aria-hidden>🕒</span>
              {hhmm(horaInicio)} - {hhmm(horaFin)}
            </div>
          </div>
        </header>

        {/* Grid de secciones */}
        <div className="grid-info">
          {/* Cliente */}
          <section className="info-box">
            <h3 className="box-title">Información del Cliente</h3>
            <ul className="kv">
              <li><strong>Nombre:</strong><span>{nombreCliente || 'Sin nombre'}</span></li>
              <li><strong>Correo:</strong><span>{emailCliente || 'No disponible'}</span></li>
              <li><strong>Teléfono:</strong><span>{telefonoCliente || 'No disponible'}</span></li>
            </ul>
          </section>

          {/* Reserva */}
          <section className="info-box">
            <h3 className="box-title">Información de la Reserva</h3>
            <ul className="kv">
              <li><strong>Horario:</strong><span>{hhmm(horaInicio)} - {hhmm(horaFin)}</span></li>
              <li><strong>Fecha:</strong><span>{fechaBonita}</span></li>
              <li><strong>Monto Total:</strong><span>{moneyBOB(montoTotal)}</span></li>
              <li><strong>Monto Pagado:</strong><span>{moneyBOB(totalPagado)}</span></li>
            </ul>
          </section>

          {/* Cancha */}
          <section className="info-box">
            <h3 className="box-title">Información de la Cancha</h3>
            {cLoading && (
              <div className="kv" style={{ opacity: .85 }}>
                <div style={{ padding: '.25rem 0' }}>Cargando datos de cancha…</div>
              </div>
            )}
            {!cLoading && cError && (
              <div className="kv" style={{ color: '#991b1b', fontWeight: 600, padding: '.25rem 0' }}>
                {cError}
              </div>
            )}
            {!cLoading && !cError && (
              <ul className="kv">
                <li>
                  <strong>Nombre:</strong>
                  <span>{cancha?.nombre || cancha?.nombreCancha || 'No disponible'}</span>
                </li>
                <li>
                  <strong>Capacidad:</strong>
                  <span>{cancha?.capacidad ? `${cancha.capacidad} personas` : 'No definida'}</span>
                </li>
                <li>
                  <strong>Ubicación:</strong>
                  <span>{cancha?.areaDeportiva?.nombreArea || 'No especificada'}</span>
                </li>
              </ul>
            )}
          </section>

          {/* Acciones */}
          <div className="header-actions">
            {!cancelacion?.estado ? (
              <button className="btn btn--danger" onClick={() => setShowConfirmCancel(true)}>
                Cancelar Reserva
              </button>
            ) : (
              <Link to={`/cancelacion/${cancelacion.idCancelacion}`} className="btn btn--info">
                Detalles de la Cancelación
              </Link>
            )}
            <button className="btn btn--success" onClick={() => setShowPagos(true)}>
              Pagos
            </button>
          </div>
        </div>
      </div>

      {/* Modal de pagos */}
      {showPagos && (
        <PagosList idReserva={idReserva} onClose={() => setShowPagos(false)} />
      )}

      {/* Modal de confirmación de cancelación */}
      {showConfirmCancel && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>¿Estás seguro de cancelar esta reserva?</h2>
            <p>Esto marcará la cancelación como activa.</p>
            <div className="modal-actions">
              <button className="btn btn--ghost" onClick={() => setShowConfirmCancel(false)}>
                Cerrar
              </button>
              <button className="btn btn--danger" onClick={handleConfirmCancelacion}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservaCard;
