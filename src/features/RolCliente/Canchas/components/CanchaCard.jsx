import React from "react";
import { FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import FancyButton from "../../../../components/ui/FancyButton";

function CanchaCard({ cancha }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      
      {/* Imagen */}
      <img
        src={cancha?.urlImagen || "../../../../../public/defaults/cancha-default.jpg"}
        alt={cancha.nombre}
        className="w-full h-40 object-cover"
        loading="lazy"
      />

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "var(--font-Alumni)" }}>
          {cancha.nombre}
        </h3>

        <div className="flex items-center justify-between mt-3 text-gray-600 text-sm">
          
          {/* Costo */}
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="currentColor" className="w-5 h-5 text-[--color-p-5]">
              <path d="M2 6h20v12H2z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
            {cancha.costoHora?.toFixed(2)} Bs / h
          </span>

          {/* Capacidad */}
          <span className="flex items-center gap-1">
            <FaUsers className="text-[--color-p-1]" /> {cancha.capacidad} pers.
          </span>
        </div>

        {/* Botones */}
        <div className="mt-4 flex gap-2">

          <FancyButton
            onClick={() => navigate(`/canchacli/detalle/${cancha.idCancha}`)}
            bgColor="var(--color-p-10)"
            lineColor="var(--color-p-1)"
            hoverColor="var(--color-p-1)"
          >
            Reservar
          </FancyButton>

          <FancyButton
            onClick={() => alert("Comentarios próximamente")}
            bgColor="var(--color-p-10)"
            lineColor="var(--color-p-2)"
            hoverColor="var(--color-p-2)"
          >
            Comentarios
          </FancyButton>

        </div>
      </div>
    </div>
  );
}

export default React.memo(CanchaCard);
