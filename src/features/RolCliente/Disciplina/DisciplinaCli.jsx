// src/features/RolCliente/Cancha/DisciplinaCli.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { getDisciplinasPorCancha } from "../../../api/CanchaApi";
import { 
  Footprints, 
  Square, 
  Circle, 
  Star, 
  Activity 
} from "lucide-react";

export default function DisciplinaCli({ canchaId, onSelectDisciplina }) {
  const { isDarkMode } = useTheme();
  const [disciplinas, setDisciplinas] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        const data = await getDisciplinasPorCancha(canchaId);
        setDisciplinas(data || []);
      } catch (err) {
        console.error("Error cargando disciplinas:", err);
        setDisciplinas([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDisciplinas();
  }, [canchaId]);

  // Función para elegir ícono según disciplina
  const getIcon = (nombre) => {
    const n = (nombre || "").toLowerCase();
    if (n.includes("fut")) return <Footprints className="w-7 h-7" />;
    if (n.includes("vole")) return <Circle className="w-7 h-7" />;
    if (n.includes("basq") || n.includes("basket")) return <Square className="w-7 h-7" />;
    if (n.includes("tenis")) return <Activity className="w-7 h-7" />;
    return <Star className="w-7 h-7" />;
  };

  // Colores dinámicos
  const bgColor = isDarkMode ? 'bg-[#1a1d1e]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-[#2d3748]' : 'border-gray-200';
  const selectedColor = isDarkMode ? '#2C7366' : '#41bfb2';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const secondaryText = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const selectedBg = isDarkMode ? `${selectedColor}20` : `${selectedColor}10`;

  if (loading) {
    return (
      <p 
        className="text-center py-4 opacity-80"
        style={{ 
          fontFamily: 'var(--font-Balo)', 
          color: isDarkMode ? '#a0aec0' : '#6b7280' 
        }}
      >
        Cargando disciplinas...
      </p>
    );
  }

  if (disciplinas.length === 0) {
    return (
      <p 
        className="text-center py-4 opacity-70"
        style={{ 
          fontFamily: 'var(--font-Balo)', 
          color: isDarkMode ? '#718096' : '#9ca3af' 
        }}
      >
        No hay disciplinas disponibles.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {disciplinas.map((disc) => {
        const isSelected = selected === disc.idDisciplina;
        return (
          <motion.button
            key={disc.idDisciplina}
            onClick={() => {
              setSelected(disc.idDisciplina);
              onSelectDisciplina({
                idDisciplina: disc.idDisciplina,
                idCancha: canchaId,
                ...disc
              });
            }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative p-5 rounded-xl border transition-all duration-250
              ${bgColor} ${borderColor}
              ${isSelected 
                ? `border-[${selectedColor}] shadow-[0_4px_12px_${selectedColor}20]` 
                : 'hover:border-gray-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]'}
              flex flex-col items-center text-center gap-3
            `}
          >
            {/* Ícono */}
            <div 
              className={`p-2 rounded-full transition-colors ${isSelected ? 'bg-white/10' : 'bg-gray-100/30'}`}
              style={{ color: isSelected ? selectedColor : (isDarkMode ? '#cbd5e1' : '#4b5563') }}
            >
              {getIcon(disc.nombre)}
            </div>

            {/* Nombre */}
            <p
              className="font-semibold text-sm"
              style={{
                fontFamily: 'var(--font-josefin)',
                color: isSelected ? selectedColor : textColor
              }}
            >
              {disc.nombre}
            </p>

            {/* Descripción */}
            {disc.descripcion && (
              <p
                className="text-xs line-clamp-2 mt-1"
                style={{
                  fontFamily: 'var(--font-Balo)',
                  color: secondaryText
                }}
              >
                {disc.descripcion}
              </p>
            )}

            {/* Indicador de selección (opcional visual) */}
            {isSelected && (
              <div 
                className="absolute top-2 right-2 w-2 h-2 rounded-full"
                style={{ backgroundColor: selectedColor }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}