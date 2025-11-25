// CanchaCardTodas.js
import React, { useEffect, useState } from "react";
import { Star, Heart, MapPin, Clock, Tag, CheckCircle } from "lucide-react";
import { getComentariosPorCancha } from "../../../../api/ComentarioApi";

export default function CanchaCardTodas({ cancha, isDarkMode }) {
  const [promedio, setPromedio] = useState(0);
  const [totalOpiniones, setTotalOpiniones] = useState(0);

  useEffect(() => {
    async function cargarPromedio() {
      try {
        const comentarios = await getComentariosPorCancha(cancha.idCancha);

        if (comentarios.length === 0) {
          setPromedio(0);
          setTotalOpiniones(0);
        } else {
          const suma = comentarios.reduce((acc, c) => acc + c.calificacion, 0);
          setPromedio((suma / comentarios.length).toFixed(1));
          setTotalOpiniones(comentarios.length);
        }
      } catch (e) {
        console.error("Error al cargar promedio:", e);
        setPromedio(0);
        setTotalOpiniones(0);
      }
    }
    cargarPromedio();
  }, [cancha.idCancha]);

  // Función para generar estrellas basadas en el promedio
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
        );
      } else if (i - 0.5 <= rating) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500 opacity-50" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  // Obtener la primera disciplina para mostrar como categoría
  const categoria = cancha.disciplinas?.[0]?.nombre || "Deportes";

  // Etiquetas adicionales
  const etiquetas = [
    cancha.tipoSuperficie,
    cancha.iluminacion,
    cancha.cubierta,
    `${cancha.capacidad} personas`,
  ].filter(Boolean);

  // Horario de la cancha
  const horarioCancha = `${cancha.horaInicio} - ${cancha.horaFin}`;

  // Estado de la cancha (abierto/cerrado)
  const estadoCancha = "Abierto ahora"; // Puedes hacer lógica real con la hora actual
  // Ejemplo: const now = new Date(); const isOpen = ... 

  return (
    <div
      className={`flex flex-col md:flex-row gap-4 p-4 rounded-xl border transition-all hover:shadow-lg cursor-pointer
      ${isDarkMode ? "bg-[#131617] border-[#1f2426]" : "bg-white border-gray-200"}`}
    >
      {/* Imagen a la izquierda */}
      <div className="md:w-1/3 w-full h-48 md:h-auto overflow-hidden rounded-lg">
        <img
          src={cancha.urlImagen}
          alt={cancha.nombre}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido a la derecha */}
      <div className="md:w-2/3 w-full flex flex-col justify-between">
        {/* Encabezado: Nombre, calificación, corazón */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold">{cancha.nombre}</h3>
            <div className="flex items-center gap-2 mt-1">
              {renderStars(parseFloat(promedio))}
              <span className="font-semibold text-sm">{promedio}</span>
              <span className="text-xs opacity-70">({totalOpiniones} opiniones)</span>
            </div>
          </div>
          <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 cursor-pointer" />
        </div>

        {/* Categorías y etiquetas */}
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
            {categoria}
          </span>
          {etiquetas.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Información adicional: Ubicación, horario, estado */}
        <div className="flex flex-wrap gap-4 text-xs mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{cancha.areaDeportiva?.zona?.nombre || "Zona desconocida"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{horarioCancha}</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-green-500">{estadoCancha}</span>
          </div>
        </div>

        {/* Descripción breve o reseña destacada */}
        <div className="mb-3">
          <p className="text-sm line-clamp-2">
            {cancha.areaDeportiva?.descripcionArea || "Esta cancha ofrece un excelente espacio para practicar deportes en un entorno moderno y seguro."}
          </p>
        </div>

        {/* Botones: Carta, Patrocinado, etc. */}
        <div className="flex gap-2">
          <button className="text-xs px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100">
            Ver disponibilidad
          </button>
          <button className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">
            Reservar
          </button>
          {/* Si quieres añadir "Patrocinado" como en la imagen */}
          {/* <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">Patrocinado</span> */}
        </div>
      </div>
    </div>
  );
}