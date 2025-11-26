// src/features/Reserva/components/ModalTerminos.jsx
import { motion } from "framer-motion";
import { X, FileCheck } from "lucide-react";
import { useTheme } from "../../../../context/ThemeContext";

export default function ModalTerminos({ onClose, onAceptar }) {
  const { isDarkMode } = useTheme();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        backgroundColor: isDarkMode ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.40)"
      }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 130, damping: 12 }}
        className={`relative w-[90%] max-w-lg rounded-xl p-6 md:p-8 shadow-xl transition-all
          ${
            isDarkMode
              ? "bg-[#0f1213] text-gray-200 shadow-[0_0_25px_rgba(0,0,0,0.4)]"
              : "bg-[#FFFFFF] text-gray-800 shadow-[0_0_25px_rgba(0,0,0,0.10)]"
          }
        `}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition"
          style={{
            backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          }}
        >
          <X
            size={20}
            color={isDarkMode ? "#d1d5db" : "#374151"}
          />
        </button>

        {/* Header con icono */}
        <div className="flex flex-col items-center text-center gap-3 mb-4">
          <div
            className="p-3 rounded-full"
            style={{
              backgroundColor: isDarkMode ? "rgba(44,115,102,0.15)" : "rgba(65,191,178,0.15)",
            }}
          >
            <FileCheck
              size={28}
              color={isDarkMode ? "#2C7366" : "#41bfb2"}
            />
          </div>

          <h3
            className="text-2xl md:text-3xl font-bold"
            style={{
              color: isDarkMode ? "#2C7366" : "#41bfb2",
            }}
          >
            Términos y Condiciones
          </h3>
        </div>

        {/* Contenido */}
        <p className="text-[15px] leading-relaxed mb-4 text-justify">
          Antes de confirmar tu reserva, revisa nuestras políticas para garantizar una experiencia organizada,
          clara y segura:
        </p>

        <ul className="space-y-3 text-[15px]">
          <li className="flex gap-2">
            <span
              style={{
                color: isDarkMode ? "#2C7366" : "#41bfb2",
                fontWeight: "bold"
              }}
            >
              •
            </span>
            Las reservas pueden modificarse con un mínimo de <strong>24 horas de anticipación</strong>.
          </li>

          <li className="flex gap-2">
            <span
              style={{
                color: isDarkMode ? "#f35734" : "#f28627",
                fontWeight: "bold"
              }}
            >
              •
            </span>
            Las <strong>cancelaciones fuera de plazo no son reembolsables</strong> por la disponibilidad limitada.
          </li>

          <li className="flex gap-2">
            <span
              style={{
                color: isDarkMode ? "#2C7366" : "#41bfb2",
                fontWeight: "bold"
              }}
            >
              •
            </span>
            El usuario debe respetar las normas de uso y el tiempo asignado de la cancha.
          </li>

          <li className="flex gap-2">
            <span
              style={{
                color: isDarkMode ? "#f35734" : "#f28627",
                fontWeight: "bold"
              }}
            >
              •
            </span>
            La reserva se valida únicamente una vez confirmado el pago correspondiente.
          </li>
        </ul>

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-8 flex-wrap">
          {/* Cancelar */}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-semibold transition-all text-[15px]"
            style={{
              border: "2px solid",
              borderColor: isDarkMode ? "#8a2628" : "#d61727",
              color: isDarkMode ? "#e5e7eb" : "#b91c1c",
              backgroundColor: isDarkMode ? "rgba(138,38,40,0.15)" : "transparent"
            }}
          >
            Cancelar
          </button>

          {/* Aceptar */}
          <button
            onClick={onAceptar}
            className="px-4 py-2 rounded-lg font-semibold text-white transition-all text-[15px]"
            style={{
              backgroundColor: isDarkMode ? "#f35734" : "#f28627",
              boxShadow: isDarkMode
                ? "0 0 12px rgba(243,87,52,0.45)"
                : "0 0 12px rgba(242,134,39,0.35)",
            }}
          >
            Aceptar y Reservar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
