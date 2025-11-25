// src/features/RolCliente/Cancha/EquipamientoCliModal.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { getEquipamientosPorCancha } from "../../../api/CanchaApi";

export default function EquipamientoCliModal({ canchaId, onClose }) {
  const { isDarkMode } = useTheme();
  const [equipamientos, setEquipamientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipamiento = async () => {
      try {
        const data = await getEquipamientosPorCancha(canchaId);
        setEquipamientos(data || []);
      } catch (error) {
        console.error("Error al cargar equipamiento:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipamiento();
  }, [canchaId]);

  // Colores dinámicos
  const modalBg = isDarkMode ? '#1a1d1e' : '#ffffff';
  const textColor = isDarkMode ? '#e2e8f0' : '#111827';
  const secondaryText = isDarkMode ? '#a0aec0' : '#6b7280';
  const borderColor = isDarkMode ? '#2d3748' : '#e5e7eb';
  const accentColor = isDarkMode ? '#2C7366' : '#41bfb2';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <motion.div
          className="rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden relative flex flex-col"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{ backgroundColor: modalBg, border: `1px solid ${borderColor}` }}
        >
          {/* Botón de cierre */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full transition-colors"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              color: textColor 
            }}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>

          {/* Contenido con scroll */}
          <div className="p-6 overflow-y-auto flex-1">
            <h2
              className="text-xl md:text-2xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-Alumni)', color: textColor }}
            >
              Equipamiento de la Cancha
            </h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <div
                  className="w-6 h-6 border-2 border-transparent rounded-full animate-spin"
                  style={{ borderTopColor: accentColor }}
                ></div>
              </div>
            ) : equipamientos.length === 0 ? (
              <p className="text-center py-8" style={{ color: secondaryText, fontFamily: 'var(--font-Balo)' }}>
                No hay equipamiento disponible.
              </p>
            ) : (
              <div className="space-y-5">
                {equipamientos.map((eq) => (
                  <div
                    key={eq.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl"
                    style={{ border: `1px solid ${borderColor}` }}
                  >
                    {/* Imagen */}
                    <div className="flex-shrink-0 w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      {eq.urlImagen ? (
                        <img
                          src={eq.urlImagen}
                          alt={eq.nombre || "Equipamiento"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/defaults/equipamiento-default.jpg";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1">
                      <h3
                        className="text-lg font-semibold mb-1"
                        style={{ fontFamily: 'var(--font-Alumni)', color: textColor }}
                      >
                        {eq.nombre}
                      </h3>
                      <p className="text-sm mb-1" style={{ color: secondaryText }}>
                        <strong>Tipo:</strong> {eq.tipoEquipamiento || "No especificado"}
                      </p>
                      {eq.descripcion && (
                        <p className="text-sm mt-2" style={{ color: secondaryText, fontFamily: 'var(--font-Balo)' }}>
                          {eq.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}