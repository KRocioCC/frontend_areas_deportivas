// src/features/RolCliente/Cancha/CanchaModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaInfoCircle } from "react-icons/fa";
import EquipamientoCliModal from "../Equipamiento/EquipamientoCliModal";
import DisciplinaCli from "../Disciplina/DisciplinaCli";

export default function CanchaModal({ cancha, area, onClose }) {
  const [showEquipamiento, setShowEquipamiento] = useState(false);

  return (
    <>
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
            className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto relative"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 text-2xl hover:text-gray-800"
            >
              <FaTimes />
            </button>

            {/* Imagen grande */}
            <div className="relative h-64">
              <img
                src={cancha.urlImagen || "/images/default-cancha.jpg"}
                alt={cancha.nombre}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-2xl font-bold">{cancha.nombre}</h2>
                <p className="text-sm">En {area.nombreArea}</p>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
              {/* Info básica */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold">Costo por hora</h3>
                  <p className="text-xl font-bold text-blue-600">S/{cancha.costoHora?.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold">Capacidad</h3>
                  <p className="text-xl font-bold text-green-600">{cancha.capacidad} personas</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold">Estado</h3>
                  <p className="text-xl font-bold text-gray-600">{cancha.estadoCancha ? "Activo" : "Inactivo"}</p>
                </div>
              </div>

              {/* Descripción */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <FaInfoCircle /> Descripción
                </h3>
                <p className="text-gray-700">
                  {cancha.descripcion || "No hay descripción disponible."}
                </p>
              </div>

              {/* Botón de equipamiento */}
              <button
                className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg mb-6"
                onClick={() => setShowEquipamiento(true)}
              >
                Ver Equipamiento
              </button>

              {/* Disciplinas */}
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Disciplinas Disponibles</h3>
                <DisciplinaCli canchaId={cancha.id} />
              </div>

              {/* Botón principal */}
              <button
                className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg"
                onClick={() => alert("Redirigir a ReservaHorario.jsx")}
              >
                Continuar con Reserva →
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Modal de equipamiento */}
      {showEquipamiento && (
        <EquipamientoCliModal
          canchaId={cancha.id}
          onClose={() => setShowEquipamiento(false)}
        />
      )}
    </>
  );
}