import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { getComentariosPorCancha } from "../../api/ComentariosApi";

export default function CanchaCardTodas({ cancha, isDarkMode }) {
  const [promedio, setPromedio] = useState(0);

  useEffect(() => {
    async function cargarPromedio() {
      try {
        const comentarios = await getComentariosPorCancha(cancha.idCancha);

        if (comentarios.length === 0) {
          setPromedio(0);
        } else {
          const suma = comentarios.reduce((acc, c) => acc + c.calificacion, 0);
          setPromedio((suma / comentarios.length).toFixed(1));
        }
      } catch (e) {
        console.error("Error al cargar promedio:", e);
      }
    }
    cargarPromedio();
  }, [cancha.idCancha]);

  return (
    <div
      className={`rounded-2xl overflow-hidden shadow-lg border
      transition-all hover:scale-[1.02] hover:shadow-xl cursor-pointer
      ${isDarkMode ? "bg-[#131617] border-[#1f2426]" : "bg-white border-gray-200"}`}
    >
      {/* Imagen */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={cancha.urlImagen}
          alt={cancha.nombre}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        {/* Título */}
        <h3 className="text-xl font-bold mb-1">
          {cancha.nombre}
        </h3>

        {/* ⭐ Promedio */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
          <span className="font-semibold text-lg">{promedio}</span>
          <span className="text-sm opacity-70">
            ({promedio === 0 ? "Sin reseñas" : "Promedio"})
          </span>
        </div>

        {/* Detalles principales */}
        <div className="text-sm opacity-90 mb-3">
          <p><strong>Zona:</strong> {cancha.areaDeportiva?.zona?.nombre}</p>
          <p><strong>Costo/hora:</strong> Bs {cancha.costoHora}</p>
          <p><strong>Capacidad:</strong> {cancha.capacidad} personas</p>
        </div>

        {/* Etiquetas estilo TripAdvisor */}
        <div className="flex flex-wrap gap-2 mt-2">
          {cancha.disciplinas?.slice(0, 3).map((d) => (
            <span
              key={d.idDisciplina}
              className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold"
            >
              {d.nombre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
