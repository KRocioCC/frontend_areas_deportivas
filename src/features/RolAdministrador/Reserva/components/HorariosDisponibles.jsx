// src/features/RolCliente/Reserva/HorariosDisponibles.jsx
import { useEffect, useState } from "react";
import { getHorasDisponibles } from "../../../../api/ReservaApi";
import { FaClock, FaCheckCircle } from "react-icons/fa";

export default function HorariosDisponibles({ canchaId, fecha, onSelectRango }) {
  const [horas, setHoras] = useState([]);
  const [seleccion, setSeleccion] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!canchaId || !fecha) return;
    setLoading(true);
    getHorasDisponibles(canchaId, fecha)
      .then((data) => {
        console.log(" Datos recibidos de getHorasDisponibles:", data);
        // Si son objetos, por ejemplo [{hora: "09:00"}], los transformamos:
        let horasFormateadas = [];
         if (Array.isArray(data)) {
          if (typeof data[0] === "object") {
            horasFormateadas = data.map((h) => h.hora || h.horario || h.horaInicio || h);
          } else {
            horasFormateadas = data;
          }
        }
        console.log("🕒 Horas formateadas finales:", horasFormateadas);
        
        const ordenadas = [...data].sort();
        setHoras(ordenadas);
      })
      .catch((err) => console.error("❌ Error al cargar horas:", err))
      .finally(() => setLoading(false));
  }, [canchaId, fecha]);

  const toggleHora = (hora) => {
    const index = horas.indexOf(hora);
    let nuevaSeleccion = [...seleccion];

    // Si ya está seleccionada → limpiar todo (como un reset)
    if (seleccion.includes(hora)) {
      nuevaSeleccion = [];
    } else if (seleccion.length === 0) {
      // Primera selección
      nuevaSeleccion = [hora];
    } else {
      // Obtener el índice de la primera y última seleccionada
      const primero = horas.indexOf(seleccion[0]);
      const ultimo = horas.indexOf(seleccion[seleccion.length - 1]);

      if (index === ultimo + 1 || index === primero - 1) {
        // Si el nuevo horario es consecutivo
        const inicio = Math.min(primero, index);
        const fin = Math.max(ultimo, index);
        nuevaSeleccion = horas.slice(inicio, fin + 1);
      } else {
        // Si no es consecutivo → selecciona todo el rango intermedio
        const inicio = Math.min(primero, index);
        const fin = Math.max(ultimo, index);
        nuevaSeleccion = horas.slice(inicio, fin + 1);
      }
    }

    setSeleccion(nuevaSeleccion);
    onSelectRango(nuevaSeleccion);
  };

  return (
    <div
      className="p-6 rounded-2xl shadow-md border border-[var(--color-pb-4)] bg-[var(--color-p-4)] transition-all duration-300 hover:shadow-lg"
      style={{
        fontFamily: "var(--font-Balo)",
      }}
    >
      <h3
        className="text-2xl font-semibold mb-5 flex items-center gap-3 text-[var(--color-p-1)]"
        style={{ fontFamily: "var(--font-Alumni)" }}
      >
        <FaClock className="text-[var(--color-p-1)]" />
        Horarios disponibles
      </h3>

      {loading ? (
        <div className="flex items-center gap-3 text-[var(--color-p-3)] animate-pulse">
          <div className="w-5 h-5 border-2 border-[var(--color-p-3)] border-t-transparent rounded-full animate-spin"></div>
          <span
            style={{
              fontFamily: "var(--font-josefin)",
              fontWeight: "600",
            }}
          >
            Buscando horarios disponibles...
          </span>
        </div>
      ) : horas.length === 0 ? (
        <p
          className="text-[var(--color-p-8)] font-medium mt-3"
          style={{ fontFamily: "var(--font-josefin)" }}
        >
          No hay horarios para esta fecha
        </p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {horas.map((hora) => {
            const isSelected = seleccion.includes(hora);
            return (
              <button
                key={hora}
                onClick={() => toggleHora(hora)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-medium border transition-all duration-200
                  ${
                    isSelected
                      ? "bg-[var(--color-p-1)] text-[var(--color-p-6)] border-[var(--color-p-1)] shadow-md scale-105"
                      : "bg-[var(--color-p-6)] text-[var(--color-t-2)] border-[var(--color-pb-5)] hover:border-[var(--color-p-1)] hover:text-[var(--color-p-1)]"
                  }`}
                style={{
                  fontFamily: "var(--font-josefin)",
                  fontSize: "0.95rem",
                }}
              >
                <FaClock size={13} />
                <span>{hora}</span>
                {isSelected && <FaCheckCircle className="text-[var(--color-p-6)]" size={14} />}
              </button>
            );
          })}
        </div>
      )}

      {seleccion.length > 0 && (
        <div
          className="mt-6 flex flex-wrap items-center gap-3 justify-center bg-[var(--color-p-5)] text-[var(--color-p-6)] px-4 py-2 rounded-xl shadow-sm"
          style={{ fontFamily: "var(--font-josefin)" }}
        >
          <FaCheckCircle />
          <span className="font-semibold">
            {seleccion.length === 1
              ? `Hora seleccionada: ${seleccion[0]}`
              : `Rango seleccionado: ${seleccion[0]} - ${seleccion[seleccion.length - 1]}`}
          </span>
        </div>
      )}
    </div>
  );
}
