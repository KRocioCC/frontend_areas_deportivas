import { useEffect, useState } from "react";
import { getHorasDisponibles } from "../../../../api/ReservaApi";
import { FaClock } from "react-icons/fa";

export default function HorariosDisponibles({ canchaId, fecha, onSelectRango }) {
  const [horas, setHoras] = useState([]);
  const [seleccion, setSeleccion] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!canchaId || !fecha) return;
    setLoading(true);
    getHorasDisponibles(canchaId, fecha)
      .then(setHoras)
      .catch((err) => console.error("❌ Error al cargar horas:", err))
      .finally(() => setLoading(false));
  }, [canchaId, fecha]);

  const toggleHora = (hora) => {
    const nueva = seleccion.includes(hora)
      ? seleccion.filter((h) => h !== hora)
      : [...seleccion, hora].sort();
    setSeleccion(nueva);
    onSelectRango(nueva);
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 h-fit">
      <h3
        className="text-xl font-semibold mb-4 flex items-center gap-2"
        style={{ fontFamily: "var(--font-Alumni)", color: "var(--color-p-1)" }}
      >
        <FaClock /> Horarios disponibles
      </h3>

      {loading ? (
        <div className="flex items-center gap-3 text-orange-600 animate-pulse">
            <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <span style={{ fontFamily: "var(--font-josefin)", fontWeight: "600" }}>
            Buscando horarios disponibles...
            </span>
        </div>
        ) : horas.length === 0 ? (
        <p className="text-red-600 font-medium" style={{ fontFamily: "var(--font-josefin)" }}>
            No hay horarios para esta fecha
        </p>
        ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {horas.map((hora) => (
            <button
              key={hora}
              onClick={() => toggleHora(hora)}
              className={`px-3 py-2.5 rounded-lg font-medium flex items-center justify-center gap-1 transition-all border
                ${seleccion.includes(hora)
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:border-primary"}`}
              style={{
                fontFamily: "var(--font-josefin)",
                fontSize: "0.95rem",
              }}
            >
              <FaClock size={12} />
              {hora}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}