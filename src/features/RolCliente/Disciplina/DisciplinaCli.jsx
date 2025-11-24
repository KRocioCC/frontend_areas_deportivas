import { useState, useEffect } from "react";
import { FaFutbol, FaVolleyballBall, FaBasketballBall } from "react-icons/fa";
import {getDisciplinasPorCancha} from "../../../api/CanchaApi";
import { motion } from "framer-motion";



export default function DisciplinaCli({ canchaId, onSelectDisciplina }) {
  const [disciplinas, setDisciplinas] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        const data = await getDisciplinasPorCancha(canchaId);
        console.log("📦 Disciplinas:", data);
        setDisciplinas(data);
      } catch (err) {
        console.error("Error cargando disciplinas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDisciplinas();
  }, [canchaId]);

  const getIcon = (nombre) => {
    const n = nombre?.toLowerCase();
    if (n.includes("fut")) return <FaFutbol className="text-3xl" />;
    if (n.includes("vole")) return <FaVolleyballBall className="text-3xl" />;
    if (n.includes("basq") || n.includes("basket")) return <FaBasketballBall className="text-3xl" />;
    return <span className="text-3xl">🏐</span>;
  };

  if (loading)
    return <p className="text-gray-300 text-center py-4">Cargando disciplinas...</p>;

  if (!loading && disciplinas.length === 0)
    return <p className="text-gray-400 text-center py-4">No hay disciplinas disponibles.</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
            whileTap={{ scale: 0.95 }}
            className={`
              p-4 rounded-xl shadow-md flex flex-col items-center gap-2 transition border 
              ${isSelected ? "bg-p-6 text-white border-p-5" : "bg-white border-gray-300"}
              hover:shadow-lg hover:border-p-6
            `}
          >
            <div className={`${isSelected ? "text-white" : "text-p-6"}`}>
              {getIcon(disc.nombre)}
            </div>

            <p className="text-sm font-semibold text-center">
              {disc.nombre}
            </p>

            {disc.descripcion && (
              <p className="text-xs text-gray-600 text-center line-clamp-2">
                {disc.descripcion}
              </p>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
