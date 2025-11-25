// src/features/RolCliente/Reserva/HorariosDisponibles.jsx
import { useEffect, useState } from "react";
import { getHorasDisponibles } from "../../../../api/ReservaApi";
import { Clock, CheckCircle } from "lucide-react";
import { useTheme } from "../../../../context/ThemeContext";
import { motion } from "framer-motion";

export default function HorariosDisponibles({ canchaId, fecha, onSelectRango }) {
  const { isDarkMode } = useTheme();
  const [horas, setHoras] = useState([]);
  const [seleccion, setSeleccion] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!canchaId || !fecha) return;
    setLoading(true);
    getHorasDisponibles(canchaId, fecha)
      .then((data) => {
        let horasFormateadas = [];
        if (Array.isArray(data)) {
          if (typeof data[0] === "object") {
            horasFormateadas = data.map((h) => h.hora || h.horario || h.horaInicio || h);
          } else {
            horasFormateadas = data;
          }
        }
        setHoras(horasFormateadas.sort());
      })
      .catch((err) => console.error("❌ Error al cargar horas:", err))
      .finally(() => setLoading(false));
  }, [canchaId, fecha]);

  const toggleHora = (hora) => {
    const index = horas.indexOf(hora);
    let nuevaSeleccion = [...seleccion];

    if (seleccion.includes(hora)) {
      nuevaSeleccion = [];
    } else if (seleccion.length === 0) {
      nuevaSeleccion = [hora];
    } else {
      const primero = horas.indexOf(seleccion[0]);
      const ultimo = horas.indexOf(seleccion[seleccion.length - 1]);
      const inicio = Math.min(primero, index);
      const fin = Math.max(ultimo, index);
      nuevaSeleccion = horas.slice(inicio, fin + 1);
    }

    setSeleccion(nuevaSeleccion);
    onSelectRango(nuevaSeleccion);
  };

  // === COLORES ===
  const cardBg = isDarkMode ? 'bg-[#1a1d1e]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-[#2d3748]' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const secondaryText = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  
  // ✅ Colores de SELECCIÓN (más intensos y visibles)
  const selectedBg = isDarkMode ? '#2C7366' : '#41bfb2'; // fondo sólido
  const selectedText = isDarkMode ? '#ffffff' : '#ffffff'; // siempre blanco
  const unselectedBorder = isDarkMode ? 'border-gray-600' : 'border-gray-300';

  return (
    <div className={`p-6 rounded-xl ${cardBg} ${borderColor} border transition-colors duration-300`}>
      <h3
        className="text-xl font-semibold mb-5 flex items-center gap-2.5"
        style={{ fontFamily: 'var(--font-Alumni)', color: textColor }}
      >
        <Clock size={20} style={{ color: isDarkMode ? '#2C7366' : '#41bfb2' }} />
        Horarios disponibles
      </h3>

      {loading ? (
        <div className="flex items-center gap-3 opacity-90">
          <div
            className="w-4 h-4 border-2 border-transparent rounded-full animate-spin"
            style={{ borderTopColor: isDarkMode ? '#f35734' : '#f28627' }}
          ></div>
          <span
            style={{
              fontFamily: 'var(--font-josefin)',
              color: secondaryText,
              fontWeight: 600,
            }}
          >
            Buscando horarios...
          </span>
        </div>
      ) : horas.length === 0 ? (
        <p
          style={{
            fontFamily: 'var(--font-josefin)',
            color: isDarkMode ? '#8a2628' : '#d61727',
            fontWeight: 600,
          }}
        >
          No hay horarios para esta fecha
        </p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
          {horas.map((hora) => {
            const isSelected = seleccion.includes(hora);
            return (
              <motion.button
                key={hora}
                onClick={() => toggleHora(hora)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-semibold text-sm
                  transition-all duration-200 border
                  ${isSelected
                    ? `bg-[${selectedBg}] border-[${selectedBg}] text-[${selectedText}] shadow-sm`
                    : `${cardBg} ${unselectedBorder} ${secondaryText} hover:border-[${isDarkMode ? '#2C7366' : '#41bfb2'}] hover:text-[${isDarkMode ? '#2C7366' : '#41bfb2'}]`}
                `}
                style={{ fontFamily: 'var(--font-josefin)' }}
              >
                {hora}
                {isSelected && <CheckCircle size={14} />}
              </motion.button>
            );
          })}
        </div>
      )}

      {seleccion.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-6 p-3.5 rounded-lg flex items-center justify-center gap-2 text-center"
          style={{
            backgroundColor: isDarkMode ? '#2C7366' : '#41bfb2',
            color: '#ffffff',
            fontFamily: 'var(--font-josefin)',
            fontWeight: '600',
          }}
        >
          <CheckCircle size={18} />
          <span className="text-sm md:text-base">
            {seleccion.length === 1
              ? `Bloque seleccionado: ${seleccion[0]}`
              : `Rango: ${seleccion[0]} – ${seleccion[seleccion.length - 1]}`}
          </span>
        </motion.div>
      )}
    </div>
  );
}