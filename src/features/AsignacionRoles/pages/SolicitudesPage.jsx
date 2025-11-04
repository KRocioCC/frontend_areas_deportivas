// src/features/AsignacionRoles/pages/SolicitudesPage.jsx
import React, { useEffect, useState } from 'react';
import {
  getSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud,
} from '../../../api/admin.js';

const SolicitudesPage = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarSolicitudes = async () => {
      try {
        const data = await getSolicitudes();
        setSolicitudes(data);
      } catch (err) {
        console.error('Error al cargar solicitudes:', err);
      } finally {
        setLoading(false);
      }
    };
    cargarSolicitudes();
  }, []);

  const aprobar = async (id) => {
    try {
      await aprobarSolicitud(id);
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert('Error al aprobar la solicitud');
      console.error(err);
    }
  };

  const rechazar = async (id) => {
    try {
      await rechazarSolicitud(id);
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert('Error al rechazar la solicitud');
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Cargando solicitudes...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Solicitudes Pendientes</h2>
      {solicitudes.length === 0 ? (
        <p className="text-gray-600">No hay solicitudes pendientes.</p>
      ) : (
        <div className="space-y-4">
          {solicitudes.map((s) => (
            <div
              key={s.id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
            >
              <p><strong>Usuario:</strong> {s.username}</p>
              <p><strong>Rol solicitado:</strong> {s.rolSolicitado}</p>
              <p><strong>Email:</strong> {s.email}</p>
              <p><strong>Nombre:</strong> {s.persona?.nombre} {s.persona?.apellidoPaterno}</p>
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => aprobar(s.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => rechazar(s.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SolicitudesPage;
