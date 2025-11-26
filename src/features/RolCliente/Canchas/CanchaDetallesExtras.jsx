// src/features/RolCliente/Cancha/CanchaDetallesExtras.jsx
import { 
  FaRulerCombined, 
  FaToolbox, 
  FaLightbulb, 
  FaUmbrellaBeach, 
  FaClock, 
  FaLayerGroup 
} from "react-icons/fa6";
import { useTheme } from "../../../context/ThemeContext";
//{/*{ icon: <FaClock style={{ color: iconColor }} />, titulo: "Horario", valor: cancha.horaInicio ? `${cancha.horaInicio} - ${cancha.horaFin}` : "No especificado" },*/}
export default function CanchaDetallesExtras({ cancha }) {
  const { isDarkMode } = useTheme();

  // Color de íconos: usa el acento secundario (naranja) en ambos modos
  const iconColor = isDarkMode ? '#f35734' : '#f28627';
  const textColor = isDarkMode ? 'text-gray-200' : 'text-gray-800';
  const labelColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const hoverBg = isDarkMode ? 'hover:bg-[#2d3748]/40' : 'hover:bg-[#f2efeb]';

  const detalles = [
    { icon: <FaLayerGroup style={{ color: iconColor }} />, titulo: "Tipo de Superficie", valor: cancha.tipoSuperficie },
    { icon: <FaRulerCombined style={{ color: iconColor }} />, titulo: "Tamaño", valor: cancha.tamano },
    { icon: <FaToolbox style={{ color: iconColor }} />, titulo: "Mantenimiento", valor: cancha.mantenimiento },
    { icon: <FaLightbulb style={{ color: iconColor }} />, titulo: "Iluminación", valor: cancha.iluminacion === "Si" ? "Sí" : "No" },
    { icon: <FaUmbrellaBeach style={{ color: iconColor }} />, titulo: "Cubierta", valor: cancha.cubierta === "Si" ? "Sí" : "No" },
    { icon: <FaClock style={{ color: iconColor }} />, titulo: "Horario",valor: cancha.areaDeportiva?.horaInicioArea? `${cancha.areaDeportiva.horaInicioArea} - ${cancha.areaDeportiva.horaFinArea}`: "No especificado"},
  ];

  return (
    <div className="p-0 transition-all">
      <h3
        className="text-xl mb-5 tracking-wide"
        style={{
          fontFamily: 'var(--font-Oswald)',
          color: isDarkMode ? '#e2e8f0' : '#1f2937'
        }}
      >
        Detalles de la Cancha
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {detalles.map((item, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-3 rounded-lg transition-colors duration-200 ${hoverBg}`}
          >
            <div className="mt-0.5 flex-shrink-0 text-xl">
              {item.icon}
            </div>
            <div>
              <h4
                className="text-sm font-semibold"
                style={{
                  fontFamily: 'var(--font-josefin)',
                  color: textColor
                }}
              >
                {item.titulo}
              </h4>
              <p
                className="text-sm mt-0.5"
                style={{
                  fontFamily: 'var(--font-Balo)',
                  color: labelColor
                }}
              >
                {item.valor || "No especificado"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}