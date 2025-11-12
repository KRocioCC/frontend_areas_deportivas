// src/features/RolCliente/Cancha/CanchaDetalleModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaFutbol, FaUsers, FaDollarSign, FaClock, FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";

export default function CanchaDetalleModal({ cancha, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white text-2xl bg-red-600 hover:bg-red-700 rounded-full w-10 h-10 flex items-center justify-center z-10"
          >
            <FaTimes />
          </button>

          {/* Imagen de fondo — ocupa toda la parte superior */}
          <div className="relative h-64">
            <img
              src={cancha.urlImagen || "/images/default-cancha.jpg"}
              alt={cancha.nombre}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-2xl font-bold">{cancha.nombre}</h2>
            </div>
          </div>

          {/* Contenido — sobre la imagen */}
          <div className="p-6">
            {/* Información básica */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaFutbol />
                  <span>Fútbol</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers />
                  <span>{cancha.capacidad} personas</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaDollarSign />
                  <span>S/{cancha.costoHora?.toFixed(2)}/hora</span>
                </div>
              </div>

              {/* Descripción */}
              <div className="text-gray-300">
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p>
                  {cancha.descripcion || "No hay descripción disponible."}
                </p>
              </div>

              {/* Equipamientos */}
              <div className="text-gray-300">
                <h3 className="font-semibold mb-2">Equipamientos</h3>
                <ul className="list-disc list-inside">
                  {cancha.equipamientos?.length > 0 ? (
                    cancha.equipamientos.map((eq, i) => <li key={i}>{eq.nombre}</li>)
                  ) : (
                    <li>No hay equipamientos disponibles.</li>
                  )}
                </ul>
              </div>

              {/* Horarios */}
              <div className="text-gray-300">
                <h3 className="font-semibold mb-2">Horarios</h3>
                <p>
                  {cancha.horario || "No hay horarios disponibles."}
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-6 flex gap-4">
              <button
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition"
                onClick={() => alert("Realizar Reserva")}
              >
                Realizar Reserva
              </button>
              <button
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition"
                onClick={() => alert("Ver Equipamientos")}
              >
                Ver Equipamientos
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}