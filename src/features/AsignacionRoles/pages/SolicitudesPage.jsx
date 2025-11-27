import React, { useEffect, useState } from 'react';
import {
  getSolicitudes,
  aprobarSolicitud,
  rechazarSolicitud,
} from '../../../api/admin.js';

const SolicitudesPage = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});

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
    setProcessing(prev => ({ ...prev, [id]: 'aprobar' }));
    try {
      await aprobarSolicitud(id);
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert('Error al aprobar la solicitud');
      console.error(err);
    } finally {
      setProcessing(prev => ({ ...prev, [id]: false }));
    }
  };

  const rechazar = async (id) => {
    setProcessing(prev => ({ ...prev, [id]: 'rechazar' }));
    try {
      await rechazarSolicitud(id);
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert('Error al rechazar la solicitud');
      console.error(err);
    } finally {
      setProcessing(prev => ({ ...prev, [id]: false }));
    }
  };

  const getRolColor = (rol) => {
    switch (rol) {
      case 'ROL_ADMINISTRADOR':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'ROL_CLIENTE':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'ROL_SUPERUSUARIO':
        return 'bg-purple-500/10 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getRolText = (rol) => {
    switch (rol) {
      case 'ROL_ADMINISTRADOR':
        return 'Administrador';
      case 'ROL_CLIENTE':
        return 'Cliente';
      case 'ROL_SUPERUSUARIO':
        return 'Superusuario';
      default:
        return rol;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[#3AAFA9] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando solicitudes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 card text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Solicitudes Pendientes
          </h1>
        </div>

        {solicitudes.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-gray-200/50">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay solicitudes pendientes
              </h3>
              <p className="text-gray-600">
                Todas las solicitudes han sido procesadas.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solicitudes.map((solicitud) => (
              <div
                key={solicitud.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:border-gray-300/70 transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-6">
                  {/* Header de la tarjeta */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {solicitud.persona?.nombre} {solicitud.persona?.apellidoPaterno}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">@{solicitud.username}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRolColor(solicitud.rolSolicitado)}`}>
                      {getRolText(solicitud.rolSolicitado)}
                    </span>
                  </div>

                  {/* Información del usuario */}
                  <div className="space-y-2 mb-6">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-sm text-gray-600 truncate">{solicitud.email}</p>
                    </div>
                    
                    {solicitud.persona?.telefono && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Teléfono</p>
                        <p className="text-sm text-gray-600">{solicitud.persona.telefono}</p>
                      </div>
                    )}
                    
                    {solicitud.persona?.fechaNacimiento && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Fecha Nacimiento</p>
                        <p className="text-sm text-gray-600">
                          {new Date(solicitud.persona.fechaNacimiento).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => aprobar(solicitud.id)}
                      disabled={processing[solicitud.id]}
                      className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 ${
                        processing[solicitud.id] === 'aprobar'
                          ? 'bg-green-500/80 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white flex items-center justify-center`}
                    >
                      {processing[solicitud.id] === 'aprobar' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Procesando...
                        </>
                      ) : (
                        'Aprobar'
                      )}
                    </button>
                    
                    <button
                      onClick={() => rechazar(solicitud.id)}
                      disabled={processing[solicitud.id]}
                      className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 ${
                        processing[solicitud.id] === 'rechazar'
                          ? 'bg-red-500/80 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      } text-white flex items-center justify-center`}
                    >
                      {processing[solicitud.id] === 'rechazar' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Procesando...
                        </>
                      ) : (
                        'Rechazar'
                      )}
                    </button>
                  </div>
                </div>

                {/* Footer con fecha de solicitud */}
                <div className="bg-gray-50/50 px-6 py-3 rounded-b-2xl border-t border-gray-200/30">
                  <p className="text-xs text-gray-500">
                    Solicitado el {new Date(solicitud.fechaSolicitud || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SolicitudesPage;