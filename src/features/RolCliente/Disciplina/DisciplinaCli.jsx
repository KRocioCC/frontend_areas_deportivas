import { useState, useEffect } from "react";
import { FaFutbol, FaVolleyballBall, FaBasketballBall } from "react-icons/fa";
import { getDisciplinasActivas } from "../../../api/DisciplinaApi";

export default function DisciplinaCli({ idCancha, onSelectDisciplina }) {
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        const data = await getDisciplinasActivas(idCancha);
        console.log("📦 Disciplinas cargadas:", data);
        setDisciplinas(data);
      } catch (error) {
        console.error("❌ Error al cargar disciplinas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDisciplinas();
  }, [idCancha]);

  const getIcon = (nombre) => {
    const n = nombre?.toLowerCase();
    if (n.includes("futbol")) return <FaFutbol />;
    if (n.includes("voley")) return <FaVolleyballBall />;
    if (n.includes("basquet")) return <FaBasketballBall />;
    return "🏐";
  };

  if (loading) return <p>Cargando disciplinas...</p>;
  if (!loading && disciplinas.length === 0)
    return <p className="text-gray-500 text-center">No hay disciplinas disponibles.</p>;

  return (



    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {disciplinas.map((disciplina) => (
        <button
          key={disciplina.idDisciplina}
          className="border-2 border-gray-300 hover:border-blue-500 rounded-lg p-3 flex flex-col items-center gap-2 bg-white hover:bg-blue-50 transition"
          onClick={() => onSelectDisciplina(disciplina)}
        >
          <span className="text-2xl">{getIcon(disciplina.nombre)}</span>
          <span className="text-sm font-medium text-center">{disciplina.nombre}</span>
          <span className="text-sm font-medium text-center">{disciplina.descripcion}</span>
        </button>
      ))}
    </div>
  );
}
