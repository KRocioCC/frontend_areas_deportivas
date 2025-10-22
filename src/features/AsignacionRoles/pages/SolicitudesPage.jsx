import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../auth/hooks/useAuth'; // o donde tengas tu auth

const SolicitudesPage = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    const cargarSolicitudes = async () => {
      try {
        const res = await fetch('http://localhost:8032/api/admin/solicitudes', {
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setSolicitudes(data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    cargarSolicitudes();
  }, [auth.token]);

  const aprobar = async (id) => {
    try {
      await fetch(`http://localhost:8032/api/admin/solicitudes/${id}/aprobar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        }
      });
      // Eliminar de la lista
      setSolicitudes(solicitudes.filter(s => s.id !== id));
    } catch (err) {
      alert('Error al aprobar');
    }
  };

  const rechazar = async (id) => {
    try {
      await fetch(`http://localhost:8032/api/admin/solicitudes/${id}/rechazar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        }
      });
      setSolicitudes(solicitudes.filter(s => s.id !== id));
    } catch (err) {
      alert('Error al rechazar');
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
          {solicitudes.map(s => (
            <div key={s.id} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
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