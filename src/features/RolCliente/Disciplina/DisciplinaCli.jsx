/*// src/features/RolCliente/Cancha/DisciplinaCli.jsx
import { useState, useEffect } from "react";
import { FaFutbol, FaVolleyballBall, FaBasketballBall } from "react-icons/fa";

// Supongamos API: GET /api/disciplina/cancha/{canchaId}
import { getDisciplinasPorCancha } from "../../../api/EquipamientoApi";

export default function DisciplinaCli({ canchaId }) {
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        const data = await getDisciplinasPorCancha(canchaId);
        setDisciplinas(data);
      } catch (error) {
        console.error("Error al cargar disciplinas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDisciplinas();
  }, [canchaId]);

  const getIcon = (nombre) => {
    const n = nombre?.toLowerCase();
    if (n.includes("futbol")) return <FaFutbol />;
    if (n.includes("voley")) return <FaVolleyballBall />;
    if (n.includes("basquet")) return <FaBasketballBall />;
    return "⚽";
  };

  if (loading) return <p>Cargando disciplinas...</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {disciplinas.map((disciplina) => (
        <button
          key={disciplina.id}
          className="border-2 border-gray-300 hover:border-blue-500 rounded-lg p-3 flex flex-col items-center gap-2 bg-white hover:bg-blue-50 transition"
          onClick={() => {
            // → Redirigir a ReservaHorario.jsx con canchaId y disciplinaId
            window.location.href = `/reservahorario?canchaId=${canchaId}&disciplinaId=${disciplina.id}`;
          }}
        >
          <span className="text-2xl">{getIcon(disciplina.nombre)}</span>
          <span className="text-sm font-medium text-center">{disciplina.nombre}</span>
        </button>
      ))}
    </div>
  );
}*/