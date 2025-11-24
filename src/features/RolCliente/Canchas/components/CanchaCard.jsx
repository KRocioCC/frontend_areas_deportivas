// src/features/RolCliente/Cancha/components/CanchaCard.jsx
import React from "react";
import { Users, CalendarCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../../context/ThemeContext";
import { motion } from "framer-motion";

const CanchaCard = ({ cancha }) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Colores según modo
  const cardBg = isDarkMode ? 'bg-[#0b0d0e]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-[#2C7366]' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const secondaryText = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const iconColor = isDarkMode ? '#cbd5e1' : '#41bfb2';

  // Botón: Reservar → color naranja (pago/continuar)
 // const reservarBg = isDarkMode ? '#f35734' : '#f28627';
  // Botón: Comentarios → color secundario verde (alternativo, suave)
  const reservarBg = isDarkMode ? '#2C7366' : '#41bfb2';

  return (
    <motion.div
      className={`rounded-xl overflow-hidden border ${borderColor} shadow-sm transition-all duration-300 ${cardBg}`}
      whileHover={{ y: -6, boxShadow: isDarkMode ? '0 10px 24px rgba(0,0,0,0.4)' : '0 10px 24px rgba(0,0,0,0.12)' }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Imagen */}
      <div className="relative w-full h-40 overflow-hidden">
        <img
          src={cancha?.urlImagen || "/defaults/cancha-default.jpg"}
          alt={cancha.nombre || "Cancha deportiva"}
          className="w-full h-full object-cover transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/defaults/cancha-default.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3
          className="text-lg md:text-xl font-semibold mb-3"
          style={{ fontFamily: 'var(--font-Alumni)', color: textColor }}
        >
          {cancha.nombre}
        </h3>

        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-sm">
          {/* Costo */}
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: isDarkMode ? '#2C7366' : '#41bfb2' }}
            >
              <CalendarCheck className="w-3 h-3 text-white" />
            </div>
            <span style={{ color: secondaryText }}>
              {cancha.costoHora?.toFixed(2) || '0.00'} Bs / h
            </span>
          </div>

          {/* Capacidad */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" style={{ color: iconColor }} />
            <span style={{ color: secondaryText }}>
              {cancha.capacidad || 0} pers.
            </span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-2 mt-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/canchacli/detalle/${cancha.idCancha}`)}
            className="flex-1 py-2 px-3 rounded-lg font-semibold text-white shadow-sm flex items-center justify-center gap-1.5 text-sm"
            style={{
              fontFamily: 'var(--font-josefin)',
              backgroundColor: reservarBg,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            Detalle Cancha
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(CanchaCard);