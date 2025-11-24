// src/features/RolCliente/Cancha/Cancha.jsx
import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCanchasPorArea } from "../../../api/CanchaApi.js";
import { getAreadeportivaById } from "../../../api/AreadeportivaApi";
import CanchaCard from "./components/CanchaCard.jsx";
import { useTheme } from "../../../context/ThemeContext";
import { motion } from "framer-motion";
// NOTA: Reemplazamos FancyButton por un botón estándar que respeta tu sistema visual
// Si FancyButton ya sigue tus reglas, puedes reusarlo, pero aquí lo hago explícito

export default function Cancha() {
  const { isDarkMode } = useTheme();
  const [area, setArea] = useState(null);
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const areaId = new URLSearchParams(location.search).get("areaId");

  useEffect(() => {
    if (!areaId) {
      setError("ID de área no proporcionado en la URL.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        const [areaData, canchasData] = await Promise.allSettled([
          getAreadeportivaById(areaId),
          getCanchasPorArea(areaId)
        ]);

        if (!isMounted) return;

        if (areaData.status === 'fulfilled') {
          setArea(areaData.value);
        } else {
          setError("No se pudo cargar la información del área.");
        }

        if (canchasData.status === 'fulfilled') {
          setCanchas(Array.isArray(canchasData.value) ? canchasData.value : []);
        } else {
          setError("No se pudieron cargar las canchas.");
          setCanchas([]);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => { isMounted = false; };
  }, [areaId]);

  const handleVolver = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Colores según modo
  const bgColor = isDarkMode ? 'bg-[#0f1213]' : 'bg-[#f2efeb]';
  const textColor = isDarkMode ? 'text-gray-200' : 'text-gray-700';
  const heroOverlay = isDarkMode ? 'bg-black/60' : 'bg-black/40';
  const errorBg = isDarkMode ? 'bg-[#8a2628]/20 border-[#8a2628]' : 'bg-red-50 border-red-200';
  const errorText = isDarkMode ? 'text-[#f35734]' : 'text-red-500';
  const errorTitle = isDarkMode ? 'text-[#f35734]' : 'text-red-600';
  const spinnerColor = isDarkMode ? '#f35734' : '#f28627';

  /* LOADING STATE */
  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen transition-colors duration-300 ${bgColor}`}>
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-10 w-10 mx-auto border-t-2 border-b-2"
            style={{ borderColor: spinnerColor }}
          ></div>
          <p
            className="mt-4"
            style={{
              fontFamily: 'var(--font-josefin)',
              color: isDarkMode ? '#cbd5e1' : '#4b5563'
            }}
          >
            Cargando canchas...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center min-h-screen transition-colors duration-300 ${bgColor}`}>
        <div className={`text-center p-6 rounded-xl border max-w-md transition-colors duration-300 ${errorBg}`}>
          <h3
            className="text-xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-Alumni)', color: errorTitle }}
          >
            Error
          </h3>
          <p className="mb-4" style={{ color: errorText }}>
            {error}
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleVolver}
            className="px-5 py-2.5 rounded-lg font-semibold transition-colors duration-200 shadow-sm"
            style={{
              fontFamily: 'var(--font-josefin)',
              backgroundColor: isDarkMode ? '#8a2628' : '#d61727',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            Volver
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-8 transition-colors duration-300 ${bgColor}`}>
      {/* HERO */}
      <div className="relative w-full h-60 sm:h-72 md:h-80 lg:h-96">
        <img
          src={area?.urlImagen || "/Fondos/Deporte1.png"}
          alt={area?.nombreArea || "Área deportiva"}
          className="w-full h-full object-cover"
          loading="eager"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/Fondos/Deporte1.png";
          }}
        />
        <div className={`absolute inset-0 ${heroOverlay}`}></div>

        <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 text-white">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-md"
            style={{ fontFamily: 'var(--font-Oswald)' }}
          >
            {area?.nombreArea}
          </h1>
          <p
            className="text-sm sm:text-base mt-1 opacity-90"
            style={{ fontFamily: 'var(--font-Balo)' }}
          >
            {area?.zona?.macrodistrito?.nombre || "Macrodistrito"} • {area?.zona?.nombre || "Zona"}
          </p>
        </div>
      </div>

      {/* GRID DE CANCHAS */}
      <div className="py-7 px-4 md:px-8">
        <h2
          className="text-xl md:text-2xl mb-5"
          style={{
            fontFamily: 'var(--font-Alumni)',
            color: isDarkMode ? '#e2e8f0' : '#1f2937'
          }}
        >
          Canchas Disponibles
        </h2>

        {canchas.length === 0 ? (
          <div className="text-center py-12">
            <p
              className="text-lg mb-2"
              style={{
                fontFamily: 'var(--font-Balo)',
                color: isDarkMode ? '#a0aec0' : '#6b7280'
              }}
            >
              No hay canchas disponibles en este momento.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-Balo)',
                color: isDarkMode ? '#718096' : '#9ca3af'
              }}
            >
              Por favor, inténtelo más tarde o contacte al administrador.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {canchas.map((cancha) => (
              <CanchaCard key={cancha.idCancha} cancha={cancha} />
            ))}
          </div>
        )}
      </div>

      {/* BOTÓN VOLVER — estilo coherente con tu sistema */}
      <div className="flex justify-center mt-8 px-4">
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 6px 16px rgba(0,0,0,0.2)" }}
          whileTap={{ scale: 0.97 }}
          onClick={handleVolver}
          className="px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm"
          style={{
            fontFamily: 'var(--font-josefin)',
            backgroundColor: isDarkMode ? '#8a2628' : '#d61727',
            color: 'white',
            boxShadow: '0 4px 14px rgba(0,0,0,0.18)'
          }}
          aria-label="Volver atrás"
        >
          ← Volver Atrás
        </motion.button>
      </div>
    </div>
  );
}