// src/features/RolCliente/Cancha/Cancha.jsx
import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCanchasActivasPorArea } from "../../../api/CanchaApi.js";
import { getAreadeportivaById } from "../../../api/AreadeportivaApi";
import CanchaCard from "./components/CanchaCard.jsx";
import { useTheme } from "../../../context/ThemeContext";
import { motion } from "framer-motion";
// NOTA: Reemplazamos FancyButton por un botón estándar que respeta tu sistema visual
// Si FancyButton ya sigue tus reglas, puedes reusarlo, pero aquí lo hago explícito
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Cancha() {
  const { isDarkMode } = useTheme();
  const [area, setArea] = useState(null);
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const areaId = new URLSearchParams(location.search).get("areaId");

  // Función para obtener la URL de la imagen actual del área
  const getCurrentImageUrl = () => {
    if (area?.imagenes && area.imagenes.length > 0) {
      const imagenActual = area.imagenes[currentImageIndex];
      if (imagenActual.urlAcceso.startsWith('http')) {
        return imagenActual.urlAcceso;
      } else {
        return `http://localhost:8032${imagenActual.urlAcceso}`;
      }
    }
    return area?.urlImagen || "/defaults/area-default.jpg";
  };

  // Función para manejar errores de carga de imagen
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/defaults/area-default.jpg";
  };

  // Navegar a la siguiente imagen del área
  const nextImage = () => {
    if (area?.imagenes && area.imagenes.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === area.imagenes.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Navegar a la imagen anterior del área
  const prevImage = () => {
    if (area?.imagenes && area.imagenes.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? area.imagenes.length - 1 : prev - 1
      );
    }
  };

  // Ir a una imagen específica del área
  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const hasMultipleImages = area?.imagenes && area.imagenes.length > 1;

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
          getCanchasActivasPorArea(areaId)
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
    <div className={`${isDarkMode ? 'bg-[#0f1213]' : 'bg-white'} min-h-screen pb-6 transition-colors duration-300`}>
      {/* HERO CON CARRUSEL */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        {/* Imagen principal */}
        <img
          src={getCurrentImageUrl()}
          alt={area?.nombreArea}
          className="w-full h-full object-cover transition-opacity duration-500"
          loading="eager"
          onError={handleImageError}
        />

        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Flecha izquierda */}
        {hasMultipleImages && (
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 z-10"
            aria-label="Imagen anterior"
          >
            <FaChevronLeft className="text-lg" />
          </button>
        )}

        {/* Flecha derecha */}
        {hasMultipleImages && (
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 z-10"
            aria-label="Siguiente imagen"
          >
            <FaChevronRight className="text-lg" />
          </button>
        )}

        {/* Indicadores de posición (puntos) */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
            {area.imagenes.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentImageIndex 
                    ? 'bg-white shadow-lg scale-125' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Contador de imágenes */}
        {hasMultipleImages && (
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-full text-sm font-medium z-10">
            {currentImageIndex + 1} / {area.imagenes.length}
          </div>
        )}

        {/* Información del área */}
        <div className="absolute bottom-6 left-6 text-white z-10">
          <h1 className="text-3xl md:text-4xl font-bold drop-shadow"
            style={{ fontFamily: "var(--font-Oswald)" }}>
            {area?.nombreArea}
          </h1>
          <p
            className="text-sm sm:text-base mt-1 opacity-90"
            style={{ fontFamily: 'var(--font-Balo)' }}
          >
            {area?.zona?.macrodistrito?.nombre || "Macrodistrito"} • {area?.zona?.nombre || "Zona"}
          </p>

          {/* Información adicional del área */}
          <div className="flex flex-wrap gap-4 mt-2 text-xs md:text-sm">
            {area?.telefonoArea && (
              <div className="flex items-center gap-1">
                <span>📞</span>
                <span>{area.telefonoArea}</span>
              </div>
            )}
            {area?.emailArea && (
              <div className="flex items-center gap-1">
                <span>✉️</span>
                <span>{area.emailArea}</span>
              </div>
            )}
            {area?.horaInicioArea && area?.horaFinArea && (
              <div className="flex items-center gap-1">
                <span>🕒</span>
                <span>{area.horaInicioArea} - {area.horaFinArea}</span>
              </div>
            )}
          </div>
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