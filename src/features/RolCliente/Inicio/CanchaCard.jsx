// src/componentsCli/CanchaCard.jsx
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

export default function CardCancha({ cancha }) {
  const { isDarkMode } = useTheme();

  const nombre = cancha.nombre || "Sin nombre";
  const precio = cancha.costoHora || 0;
  const capacidad = cancha.capacidad || 0;
  const abierto = cancha.estado === true; // asumiendo que 'estado: true' = activo/abierto
  const promedioPuntuacion = cancha.promedioPuntuacion; // debe venir del endpoint

  // Estilos según modo
  const bg = isDarkMode ? "bg-[#141717]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#2a2e2f]" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-300" : "text-gray-600";
  const statusColor = abierto
    ? isDarkMode
      ? "text-[#2C7366]"
      : "text-[#41bfb2]"
    : isDarkMode
    ? "text-[#8a2628]"
    : "text-[#d61727]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl p-5 shadow-sm border ${bg} ${borderColor} cursor-pointer hover:shadow-md transition-shadow duration-200`}
    >
      {/* Imagen */}
      <div className="relative w-full h-40 overflow-hidden rounded-xl mb-4">
        {cancha.imagen ? (
          <img
            src={cancha.imagen}
            alt={nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${
              isDarkMode ? "bg-[#0f1213]" : "bg-gray-100"
            }`}
          >
            <span className={`text-sm font-['Alumni'] ${textSecondary}`}>
              Sin imagen
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="space-y-3">
        {/* Nombre */}
        <h3
          className={`text-lg font-bold font-['Oswald'] tracking-tight ${textColor}`}
        >
          {nombre}
        </h3>

        {/* Capacidad */}
        <p className={`text-sm font-['Alumni'] ${textSecondary}`}>
          Capacidad: {capacidad} personas
        </p>

        {/* Estado */}
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${
              abierto
                ? isDarkMode
                  ? "bg-[#2C7366]"
                  : "bg-[#41bfb2]"
                : isDarkMode
                ? "bg-[#8a2628]"
                : "bg-[#d61727]"
            }`}
          />
          <span
            className={`text-xs font-['Josefin'] font-medium uppercase tracking-wide ${statusColor}`}
          >
            {abierto ? "Abierto" : "Cerrado"}
          </span>
        </div>

        {/* Puntuación (si existe) */}
        {promedioPuntuacion !== undefined &&
          promedioPuntuacion !== null &&
          !isNaN(promedioPuntuacion) && (
            <div className="flex items-center gap-1.5">
              <Star
                className={`w-4 h-4 ${
                  isDarkMode ? "text-[#f35734]" : "text-[#f28627]"
                } fill-current`}
              />
              <span className={`text-sm font-['Alumni'] font-medium ${textColor}`}>
                {Number(promedioPuntuacion).toFixed(1)}
              </span>
            </div>
          )}

        {/* Precio */}
        <div className="pt-1">
          <span
            className={`text-lg font-bold font-['Josefin'] ${
              isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"
            }`}
          >
            Bs. {Number(precio).toFixed(2)}
          </span>
          <span className={`text-sm ml-1 ${textSecondary}`}>/hora</span>
        </div>
      </div>
    </motion.div>
  );
}