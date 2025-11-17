import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getCancha } from "../../../api/CanchaApi";
import DisciplinaAdm from "../Disciplina/DisciplinaAdm";
import CanchaHeaderAdmin from "./CanchaHeaderAdmin";
import CanchaInfoAdmin from "./CanchaInfoAdmin";
import CanchaDetallesExtrasAdmin from "./CanchaDetallesExtrasAdmin";
//import CanchaMapaAdmin from "./CanchaMapaAdmin";
import { FaArrowLeft, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../../../auth/hooks/useAuth";

export default function CanchaDetalleAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cancha, setCancha] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser, isAdmin } = useAuth();
  const [error, setError] = useState('');
  const [disciplina, setDisciplina] = useState(null);

    // 👇 Aquí agregas el log
  console.log({
    DisciplinaAdm,
    CanchaHeaderAdmin,
    CanchaInfoAdmin,
    CanchaDetallesExtrasAdmin
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCancha(id);
        setCancha(data);
      } catch (e) {
        console.error("Error al cargar cancha", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (!cancha) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 text-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaMapMarkerAlt className="text-3xl text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Cancha no encontrada</h2>
          <p className="text-gray-600 mb-6">La cancha que buscas no existe o no está disponible.</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium w-full"
          >
            <FaArrowLeft /> Volver al listado
          </button>
        </div>
      </div>
    );
  }

  const handleReservar = () => {
    if (!disciplina) {
      setError("Por favor, selecciona una disciplina antes de reservar.");
      return;
    }
    setError("");

    const url = `/admin/reservascli?canchaId=${cancha.idCancha}&disciplinaId=${disciplina.idDisciplina}`;

    if (currentUser && isAdmin) {
      navigate(url);
    } else {
      console.log("❌ Usuario no autorizado para reservar");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('/Fondos/Deporte11.png')`,
      }}
    >
      <div className="fixed inset-0 bg-black/50 -z-10"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 min-h-screen flex flex-col"
      >
        {/* Header con navegación */}
        <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-3 text-white hover:text-blue-200 font-medium transition-all duration-300 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
            >
              <FaArrowLeft className="text-lg" />
              Volver al panel
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Columna izquierda - Información principal */}
            <div className="xl:col-span-1 space-y-6">
              {/* Header de la cancha */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6"
              >
                <CanchaHeaderAdmin cancha={cancha} />
              </motion.div>

              {/* Selección de disciplina */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <FaCheckCircle className="text-white text-lg" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">Selecciona una Disciplina</h3>
                </div>
                
                <DisciplinaAdm
                  canchaId={cancha.idCancha}
                  onSelectDisciplina={(d) => setDisciplina(d)}
                />

                {disciplina && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
                  >
                    <FaCheckCircle className="text-green-500 text-xl" />
                    <div>
                      <p className="font-semibold text-green-800 text-sm">{disciplina.nombre}</p>
                      <p className="text-green-600 text-xs">Disciplina seleccionada</p>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium"
                  >
                    {error}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Columna derecha - Detalles y acciones */}
            <div className="xl:col-span-3 space-y-6">
              {/* Información de la cancha */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <FaClock className="text-white text-lg" />
                  </div>
                  <h2 className="font-bold text-gray-800 text-xl">Información de la Cancha</h2>
                </div>
                <CanchaInfoAdmin cancha={cancha} />
              </motion.div>

              {/* Detalles adicionales */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <FaCalendarAlt className="text-white text-lg" />
                  </div>
                  <h2 className="font-bold text-gray-800 text-xl">Características Adicionales</h2>
                </div>
                <CanchaDetallesExtrasAdmin cancha={cancha} />
              </motion.div>

              {/* Mapa (comentado)
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 p-6"
              >
                <CanchaMapaAdmin cancha={cancha} />
              </motion.div> */}

              {/* Botón de reserva */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center mt-8"
              >
                <button
                  onClick={handleReservar}
                  disabled={!disciplina}
                  className={`group relative px-12 py-5 rounded-2xl font-bold text-white text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    disciplina
                      ? "bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 hover:shadow-3xl"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-xl" />
                    <span>Ver Horarios y Reservar</span>
                  </div>
                  
                  {disciplina && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <FaCheckCircle className="text-white text-xs" />
                    </div>
                  )}
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}