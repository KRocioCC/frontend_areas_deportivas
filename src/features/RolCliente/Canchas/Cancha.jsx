// src/features/RolCliente/Cancha/Cancha.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCanchasPorArea } from "../../../api/CanchaApi.js";
import { getAreadeportivaById } from "../../../api/AreadeportivaApi"; 
import { FaArrowLeft, FaDollarSign, FaUsers } from "react-icons/fa";
//import CanchaModal from "./CanchaModal";
import { useNavigate } from "react-router-dom";
// ...

export default function Cancha() {
  const [area, setArea] = useState(null);
  const [canchas, setCanchas] = useState([]);
  const [selectedCancha, setSelectedCancha] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const areaId = new URLSearchParams(location.search).get("areaId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!areaId) return;
      try {
        const [areaData, canchasData] = await Promise.all([
          getAreadeportivaById(areaId),
          getCanchasPorArea(areaId)
        ]);
        console.log("Canchas recibidas:", canchasData);
        setArea(areaData);
        setCanchas(canchasData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [areaId]);



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
  <div className="bg-white min-h-screen">

    {/* HERO - Imagen completa */}
    <div className="relative w-full h-64 md:h-80 lg:h-96">
      <img
        src={area?.urlImagen || "../../../../public/Fondos/Deporte1.png"}
        alt={area?.nombreArea}
        className="w-full h-full object-cover"
      />

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Contenido */}
      <div className="absolute bottom-6 left-6 text-white">
        <h1
          className="text-3xl md:text-4xl font-bold drop-shadow"
          style={{ fontFamily: "var(--font-Oswald)" }}
        >
          {area?.nombreArea}
        </h1>

        <p
          className="text-sm md:text-lg text-gray-200 mt-1"
          style={{ fontFamily: "var(--font-Balo)" }}
        >
          {area?.zona?.macrodistrito?.nombre || "Macrodistrito"} • {area?.zona?.nombre || "Zona"}
        </p>
      </div>
    </div>

    {/* GRID DE CANCHAS */}
    <div className="py-6 px-4 md:px-8">
      <h2 className="text-2xl text-gray-700 font-bold mb-4" style={{ fontFamily: "var(--font-Alumni)" }}>
        Canchas Disponibles
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {canchas.map((cancha) => (
          <div
            key={cancha.idCancha}
            className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            {/* Imagen */}
            <img
              src={cancha?.urlImagen || "/images/default-cancha.jpg"}
              alt={cancha.nombre}
              className="w-full h-40 object-cover"
            />

            {/* Contenido */}
            <div className="p-4">
              <h3
                className="text-xl font-semibold text-gray-900"
                style={{ fontFamily: "var(--font-Alumni)" }}
              >
                {cancha.nombre}
              </h3>

              {/* Info */}
              <div className="flex items-center justify-between mt-3 text-gray-600 text-sm">

                {/* Costo */}
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-[--color-p-5]"
                  >
                    <path d="M2 6h20v12H2z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                  S/{cancha.costoHora?.toFixed(2)}
                </span>

                {/* Capacidad */}
                <span className="flex items-center gap-1">
                  <FaUsers className="text-[--color-p-1]" /> {cancha.capacidad} pers.
                </span>
              </div>

              {/* Botones */}
              <div className="mt-4 flex gap-2">

                <button
                  className="flex-1 py-2 bg-[--color-p-4] text-gray-700 rounded-md hover:bg-gray-200 transition"
                  style={{ fontFamily: "var(--font-josefin)" }}
                  onClick={() => alert("Comentarios próximamente")}
                >
                  Comentarios
                </button>

                <button
                  className="flex-1 py-2 bg-[--color-p-1] text-white rounded-md hover:bg-[--color-p-8] transition"
                  style={{ fontFamily: "var(--font-josefin)" }}
                  onClick={() => navigate(`/canchacli/detalle/${cancha.idCancha}`)}
                >
                  Reservar
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* BOTÓN VOLVER ABAJO */}
    <div className="flex justify-center my-6">
      <button
        onClick={() => window.history.back()}
        className="px-6 py-3 bg-[--color-p-1] hover:bg-[--color-p-8] text-white rounded-full shadow-md transition"
        style={{ fontFamily: "var(--font-josefin)" }}
      >
        ← Volver
      </button>
    </div>
  </div>
);
}