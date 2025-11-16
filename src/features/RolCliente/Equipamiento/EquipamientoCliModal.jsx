// src/features/RolCliente/Cancha/EquipamientoCliModal.jsx
/*import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

// Supongamos que tienes esta API:
// GET /api/equipamiento/cancha/{canchaId}
import { getEquipamientoPorCancha } from "../../../api/EquipamientoApi";

export default function EquipamientoCliModal({ canchaId, onClose }) {
  const [equipamientos, setEquipamientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipamiento = async () => {
      try {
        const data = await getEquipamientoPorCancha(canchaId);
        setEquipamientos(data);
      } catch (error) {
        console.error("Error al cargar equipamiento:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipamiento();
  }, [canchaId]);

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
          className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto relative"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 text-2xl hover:text-gray-800"
          >
            <FaTimes />
          </button>

          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Equipamiento de la Cancha</h2>
            {loading ? (
              <p>Cargando...</p>
            ) : equipamientos.length === 0 ? (
              <p className="text-gray-500">No hay equipamiento disponible.</p>
            ) : (
              <div className="space-y-4">
                {equipamientos.map((eq) => (
                  <div key={eq.id} className="border-b pb-4">
                    <h3 className="font-bold">{eq.nombre}</h3>
                    <p className="text-gray-600">Cantidad: {eq.cantidad}</p>
                    {eq.descripcion && <p className="text-sm text-gray-500">{eq.descripcion}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}*/