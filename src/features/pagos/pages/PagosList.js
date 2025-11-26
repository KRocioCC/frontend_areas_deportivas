// src/features/pagos/pages/PagosList.js
import React, { useEffect, useState } from 'react';
import './PagosList.css';
import { getPagos } from '../../../api/PagosApi';

const PagosList = ({ idReserva, onClose }) => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getPagos();
        if (active) {
          const filtrados = data.filter(p => p.idReserva === idReserva);
          setPagos(filtrados);
        }
      } catch (err) {
        if (active) setErrorMsg('Error al cargar pagos.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [idReserva]);

  return (
    <div className="modal-overlay text-gray-900">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">Pagos de la Reserva</h2>

        {loading ? (
          <p>Cargando pagos...</p>
        ) : errorMsg ? (
          <p className="error">{errorMsg}</p>
        ) : pagos.length === 0 ? (
          <p>No hay pagos registrados para esta reserva.</p>
        ) : (
          <ul className="pagos-list">
            {pagos.map((pago) => (
              <li key={pago.idPago} className="pago-item">
                <strong>Monto:</strong> {pago.monto} Bs<br />
                <strong>Fecha:</strong> {new Date(pago.fecha).toLocaleDateString()}<br />
                <strong>Estado:</strong> {pago.estado}
                
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PagosList;
