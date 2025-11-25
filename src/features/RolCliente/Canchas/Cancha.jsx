// src/features/RolCliente/Cancha/Cancha.jsx
import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCanchasPorArea } from "../../../api/CanchaApi.js";
import { getAreadeportivaById } from "../../../api/AreadeportivaApi";
import CanchaCard from "./components/CanchaCard.jsx";
import FancyButton from "../../../components/ui/FancyButton.jsx";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Cancha() {
  const [area, setArea] = useState(null);
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  // Extraer areaId de la URL
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

    let isMounted = true; // Bandera para evitar setState si el componente se desmonta

    const fetchData = async () => {
      try {
        const [areaData, canchasData] = await Promise.allSettled([
          getAreadeportivaById(areaId),
          getCanchasPorArea(areaId)
        ]);

        if (!isMounted) return; // Verificar si el componente sigue montado

        if (areaData.status === 'fulfilled') {
          setArea(areaData.value);
        } else {
          console.error("Error al cargar el área:", areaData.reason);
          setError("No se pudo cargar la información del área.");
        }

        if (canchasData.status === 'fulfilled') {
          setCanchas(canchasData.value);
        } else {
          console.error("Error al cargar las canchas:", canchasData.reason);
          setError("No se pudieron cargar las canchas.");
          setCanchas([]); // Asegurar que canchas es un array vacío en caso de error
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          console.error("Error general:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup: marcar como desmontado
    return () => {
      isMounted = false;
    };
  }, [areaId]);

  const handleVolver = useCallback(() => {
    // Opción 1: Volver a la página anterior en el historial
    navigate(-1);

    // Opción 2: Volver a una ruta específica si la anterior falla o no es deseada
    // navigate('/areas'); // Reemplaza '/areas' con la ruta correcta
  }, [navigate]);

  /* LOADING STATE */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600" style={{ fontFamily: "var(--font-josefin)" }}>Cargando canchas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg max-w-md">
          <h3 className="text-xl font-bold text-red-600 mb-2">Error</h3>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleVolver}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            style={{ fontFamily: "var(--font-josefin)" }}
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-6">
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

          <p className="text-sm md:text-lg text-gray-200 mt-1"
            style={{ fontFamily: "var(--font-Balo)" }}>
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
      <div className="py-6 px-4 md:px-8">
        <h2 className="text-2xl text-gray-700 font-bold mb-4"
          style={{ fontFamily: "var(--font-Alumni)" }}>
          Canchas Disponibles
        </h2>

        {canchas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">No hay canchas disponibles en este momento.</p>
            <p className="text-gray-400">Por favor, inténtelo más tarde o contacte al administrador.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {canchas.map((cancha) => (
              <CanchaCard key={cancha.idCancha} cancha={cancha} />
            ))}
          </div>
        )}
      </div>

      {/* BOTÓN VOLVER */}
      <div className="flex justify-center my-6 mx-6">
        <FancyButton
          onClick={handleVolver}
          bgColor="var(--color-p-1)"
          lineColor="var(--color-p-1)"
          hoverColor="var(--color-p-10)"
        >
          ← Volver Atrás
        </FancyButton>
      </div>
    </div>
  );
}