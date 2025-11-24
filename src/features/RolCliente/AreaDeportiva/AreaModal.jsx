// src/features/RolCliente/Areadeportiva/AreaModal.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import {
  Phone,
  MapPin,
  Clock,
  Star,
  SquareDashed,
  X
} from "lucide-react";
import { getCanchasPorArea } from "../../../api/CanchaApi";

export default function AreaModal({ area, onClose }) {
  const { isDarkMode } = useTheme();
  const [canchas, setCanchas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarCanchas = async () => {
      if (!area?.idAreadeportiva) return;
      try {
        const data = await getCanchasPorArea(area.idAreadeportiva);
        const canchaArray = Array.isArray(data) ? data : data?.canchas || [];
        setCanchas(canchaArray.slice(0, 3));
      } catch (error) {
        console.error("❌ Error al obtener canchas:", error);
        setCanchas([]);
      }
    };
    cargarCanchas();
  }, [area?.idAreadeportiva]);

  const handleVerCanchas = () => {
    onClose();
    navigate(`/canchacli?areaId=${area.idAreadeportiva}`);
  };

  // Colores de acento según modo
  const accentColor = isDarkMode ? '#2C7366' : '#41bfb2';
  const textColor = isDarkMode ? 'text-gray-200' : 'text-gray-300';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden shadow-xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Fondo de imagen */}
          <div className="absolute inset-0">
            <img
              src={area.urlImagen || "/defaults/area-default.jpg"}
              alt={area.nombreArea || "Área deportiva"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/defaults/area-default.jpg";
              }}
            />
            <div className="absolute inset-0 bg-black/70"></div>
          </div>

          {/* Botón de cierre */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full w-9 h-9 flex items-center justify-center z-20 shadow-lg"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </motion.button>

          {/* Contenido principal */}
          <div className="relative z-10 flex flex-col h-full p-6 sm:p-8">
            {/* En pantallas pequeñas, cambiamos a columna */}
            <div className="flex flex-col lg:flex-row h-full gap-6 lg:gap-8">
              {/* Columna izquierda: información del área */}
              <div className="lg:w-2/3 flex flex-col justify-end text-white space-y-4">
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold"
                  style={{ fontFamily: 'var(--font-Oswald)' }}
                >
                  {area.nombreArea || "Centro Deportivo Costa del Sol"}
                </h2>

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{area.telefonoArea || "+34 555 239 9909"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <SquareDashed className="h-4 w-4" />
                    <span>{area.emailArea || "No contamos con email"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {area.zona?.macrodistrito?.nombre || "Macrodistrito no disponible"},{" "}
                      {area.zona?.nombre || "Zona no disponible"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {area.horaInicioArea && area.horaFinArea
                        ? `${area.horaInicioArea} – ${area.horaFinArea}`
                        : "6:00 AM – 10:00 PM"}
                    </span>
                  </div>
                </div>

                <p
                  className={`text-sm leading-relaxed max-w-lg ${textColor}`}
                  style={{ fontFamily: 'var(--font-Balo)' }}
                >
                  {area.descripcionArea ||
                    "Instalaciones deportivas de alto nivel situadas en la costa, perfectas para actividades al aire libre y torneos."}
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <span className="text-white font-bold mr-2">#56</span>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>

                  {/* Botón moderno, minimalista, con animación */}
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: "0 6px 16px rgba(0,0,0,0.2)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleVerCanchas}
                    className="px-5 py-2.5 rounded-lg font-semibold text-white shadow-md transition-all duration-200"
                    style={{
                      fontFamily: 'var(--font-josefin)',
                      backgroundColor: accentColor,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                    }}
                  >
                    Ver Más Canchas
                  </motion.button>
                </div>
              </div>

              {/* Columna derecha: canchas */}
              <div className="lg:w-1/3 flex flex-col justify-start lg:justify-center mt-6 lg:mt-0">
                <h3
                  className="text-lg sm:text-xl font-semibold text-white mb-3 pb-1 border-b border-red-600 w-fit"
                  style={{ fontFamily: 'var(--font-Alumni)' }}
                >
                  Canchas Disponibles
                </h3>
                <div className="grid grid-rows-3 gap-3">
                  {canchas.length > 0 ? (
                    canchas.map((cancha, i) => (
                      <div
                        key={cancha.idCancha || i}
                        className="relative rounded-lg overflow-hidden group cursor-pointer"
                      >
                        <img
                          src={cancha.urlImagen || "/defaults/cancha-default.jpg"}
                          alt={cancha.nombre}
                          className="w-full h-20 sm:h-24 object-cover transform group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition"></div>
                        <div className="absolute bottom-2 left-2 text-white text-[11px] sm:text-xs">
                          <p className="font-bold truncate max-w-[120px]">
                            {cancha.nombre || `Cancha ${i + 1}`}
                          </p>
                          <p className={`opacity-90 ${textColor}`}>
                            S/{cancha.costoHora?.toFixed(2) || "0.00"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={`text-sm ${textColor}`}>No hay canchas disponibles.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}