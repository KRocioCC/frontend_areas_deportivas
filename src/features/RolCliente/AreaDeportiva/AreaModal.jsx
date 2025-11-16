// src/features/RolCliente/Areadeportiva/AreaModal.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaPhone, FaMapMarkerAlt, FaClock, FaStar, FaFutbol } from "react-icons/fa";
import { getCanchasPorArea } from "../../../api/CanchaApi";
export default function AreaModal({ area, onClose }) {

  const [canchas, setCanchas] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const cargarCanchas = async () => {
      if (!area?.idAreadeportiva) return;
      try {
        const data = await getCanchasPorArea(area.idAreadeportiva);
         console.log("✅ Canchas recibidas:", data.canchas);
        setCanchas(data.slice(0, 3)); // ✅ máximo 3 canchas
      } catch (error) {
        console.error("❌ Error al obtener canchas:", error);
        setCanchas([]); // si falla, vacío
      }
    };
    cargarCanchas();
  }, [area?.idAreadeportiva]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          transition={{ type: "spring", stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Fondo de imagen */}
          <div className="absolute inset-0">
            <img
              src={area.urlImagen || "/images/default-area.jpg"}
              alt={area.nombreArea}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/70"></div>
          </div>

          {/* Botón de cierre */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white text-2xl bg-red-600 hover:bg-red-700 rounded-full w-10 h-10 flex items-center justify-center z-20"
          >
            <FaTimes />
          </button>

          {/* Contenido principal */}
          <div className="relative z-10 flex h-full px-10 py-8">
            {/* Columna izquierda: información del área */}
            <div className="w-2/3 flex flex-col justify-end text-white space-y-4">
              <h2 className="text-4xl font-bold">{area.nombreArea || "Centro Deportivo Costa del Sol"}</h2>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaPhone /> <span>{area.telefonoArea || "+34 555 239 9909"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaFutbol /> <span>{area.emailArea || "No contamos con email"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-white" />
                  <span>
                    {area.zona?.macrodistrito?.nombre || "Macrodistrito no disponible"},{" "}
                    {area.zona?.nombre || "Zona no disponible"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock /> <span>{area.horaInicioArea + "  " + area.horaFinArea || "6:00 AM - 10:00 PM"}</span>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed max-w-lg">
                {area.descripcionArea ||
                  "Instalaciones deportivas de alto nivel situadas en la costa, perfectas para actividades al aire libre y torneos."}
              </p>
                    {/*logica de comentarios sar ae flaat  */}
              <div className="flex items-center gap-6 mt-2">
                <div className="flex items-center gap-1 text-yellow-400 text-lg">
                  <span className="text-white font-bold">#56</span>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < 4 ? "fill-current" : "text-gray-500"} />
                  ))}
                </div>

                <button
                  onClick={() => navigate(`/canchacli?areaId=${area.idAreadeportiva}`)}
                  className="bg-teal-600 hover:bg-teal-700 transition px-6 py-2 rounded-lg text-white font-semibold shadow-lg"
                >
                  Ver Más Canchas
                </button>

              </div>



            </div>

            {/* Columna derecha: canchas */}
            <div className="w-1/3 flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-white mb-3 border-b-2 border-red-600 w-fit">
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
                        src={cancha.urlImagen || "../../../../public/contenido/descarga.jpg"}
                        alt={cancha.nombre}
                        className="w-full h-28 object-cover transform group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition"></div>
                      <div className="absolute bottom-2 left-2 text-white text-xs">
                        <p className="font-bold truncate max-w-[120px]">
                          {cancha.nombre || `Cancha ${i + 1}`} 
                        </p>
                        <p className="text-gray-300">
                          S/{cancha.costoHora?.toFixed(2) || "0.00"} 
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No hay canchas disponibles.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
