// src/features/Reserva/components/ModalTerminos.jsx
import { motion } from "framer-motion";

export default function ModalTerminos({ onClose, onAceptar }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white p-8 rounded-2xl max-w-lg shadow-xl"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: "var(--color-p-1)" }}>
          Términos y Condiciones
        </h3>
        <p className="text-gray-600 mb-6 text-justify">
          Al confirmar la reserva, aceptas nuestras políticas de cancelación y uso de canchas.
          Las reservas pueden modificarse hasta 24 horas antes. No se reembolsan cancelaciones tardías.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 rounded-lg font-semibold"
            style={{ borderColor: "var(--color-p-1)", color: "var(--color-p-1)" }}
          >
            Cancelar
          </button>
          <button
            onClick={onAceptar}
            className="px-4 py-2 bg-[var(--color-p-1)] text-white rounded-lg font-semibold"
          >
            Aceptar y Reservar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
