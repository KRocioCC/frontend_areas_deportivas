// src/features/RolCliente/Areadeportiva/AreaModal.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaPhone, FaMapMarkerAlt, FaClock, FaStar, FaFutbol, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getCanchasPorArea } from "../../../api/CanchaApi";

export default function AreaModal({ area, onClose }) {
  const [canchas, setCanchas] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Función para obtener la URL de la imagen actual del área
  const getCurrentImageUrl = () => {
    if (area.imagenes && area.imagenes.length > 0) {
      const imagenActual = area.imagenes[currentImageIndex];
      if (imagenActual.urlAcceso.startsWith('http')) {
        return imagenActual.urlAcceso;
      } else {
        return `http://localhost:8032${imagenActual.urlAcceso}`;
      }
    }
    return area.urlImagen || "/defaults/area-default.jpg";
  };

  // Función para obtener la primera imagen de una cancha
  const getCanchaImageUrl = (cancha) => {
    if (cancha.imagenes && cancha.imagenes.length > 0) {
      const primeraImagen = cancha.imagenes[0];
      if (primeraImagen.urlAcceso.startsWith('http')) {
        return primeraImagen.urlAcceso;
      } else {
        return `http://localhost:8032${primeraImagen.urlAcceso}`;
      }
    }
    return cancha.urlImagen || "/defaults/cancha-default.jpg";
  };

  // Función para manejar errores de carga de imagen
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/defaults/area-default.jpg";
  };

  // Función para manejar errores de carga de imagen de cancha
  const handleCanchaImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/defaults/cancha-default.jpg";
  };

  // Navegar a la siguiente imagen del área
  const nextImage = () => {
    if (area.imagenes && area.imagenes.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === area.imagenes.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Navegar a la imagen anterior del área
  const prevImage = () => {
    if (area.imagenes && area.imagenes.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? area.imagenes.length - 1 : prev - 1
      );
    }
  };

  // Ir a una imagen específica del área
  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const hasMultipleImages = area.imagenes && area.imagenes.length > 1;

  useEffect(() => {
    const cargarCanchas = async () => {
      if (!area?.idAreadeportiva) return;
      try {
        const data = await getCanchasPorArea(area.idAreadeportiva);
        console.log("✅ Canchas recibidas:", data);
        
        // Asegurarnos de que tenemos un array de canchas
        const canchaArray = Array.isArray(data) ? data : data?.canchas || [];
        console.log("📸 Canchas con imágenes:", canchaArray.map(c => ({
          nombre: c.nombre,
          tieneImagenes: c.imagenes && c.imagenes.length > 0,
          cantidadImagenes: c.imagenes ? c.imagenes.length : 0
        })));
        
        setCanchas(canchaArray.slice(0, 3));
      } catch (error) {
        console.error("❌ Error al obtener canchas:", error);
        setCanchas([]); // si falla, vacío
      }
    };
    cargarCanchas();
  }, [area?.idAreadeportiva]);

  const handleVerCanchas = () => {
    // Cierra el modal antes de navegar
    onClose();
    // Navega a la página de canchas
    navigate(`/canchacli?areaId=${area.idAreadeportiva}`);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          transition={{ type: "spring", stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Fondo de imagen con carrusel */}
          <div className="absolute inset-0">
            <img
              src={getCurrentImageUrl()}
              alt={area.nombreArea || "Área deportiva"}
              loading="eager"
              fetchPriority="high"
              onError={handleImageError}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-black/70"></div>

            {/* Flecha izquierda */}
            {hasMultipleImages && (
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 z-20"
                aria-label="Imagen anterior"
              >
                <FaChevronLeft className="text-lg" />
              </button>
            )}

            {/* Flecha derecha */}
            {hasMultipleImages && (
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 z-20"
                aria-label="Siguiente imagen"
              >
                <FaChevronRight className="text-lg" />
              </button>
            )}

            {/* Indicadores de posición (puntos) */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
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
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-full text-sm font-medium z-20">
                {currentImageIndex + 1} / {area.imagenes.length}
              </div>
            )}
          </div>

          {/* Botón de cierre */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white text-2xl bg-red-600 hover:bg-red-700 rounded-full w-10 h-10 flex items-center justify-center z-20"
          >
            <FaTimes />
          </button>

          {/* Contenido principal */}
          <div className="relative z-10 flex h-full px-10 py-8">
            {/* Columna izquierda: información del área */}
            <div className="w-2/3 flex flex-col justify-end text-white space-y-4">
              <h2 className="text-4xl font-bold">{area.nombreArea || "Centro Deportivo Costa del Sol"}</h2>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaPhone /> <span>{area.telefonoArea || "+34 555 239 9909"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaFutbol /> <span>{area.emailArea || "No contamos con email"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-white" />
                  <span>
                    {area.zona?.macrodistrito?.nombre || "Macrodistrito no disponible"},{" "}
                    {area.zona?.nombre || "Zona no disponible"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock /> <span>{area.horaInicioArea + "  " + area.horaFinArea || "6:00 AM - 10:00 PM"}</span>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed max-w-lg">
                {area.descripcionArea ||
                  "Instalaciones deportivas de alto nivel situadas en la costa, perfectas para actividades al aire libre y torneos."}
              </p>

              <div className="flex items-center gap-6 mt-2">
                <div className="flex items-center gap-1 text-yellow-400 text-lg">
                  <span className="text-white font-bold">#56</span>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < 4 ? "fill-current" : "text-gray-500"} />
                  ))}
                </div>

                {/* Botón actualizado */}
                <button
                  onClick={handleVerCanchas} // Llama a la nueva función
                  className="bg-teal-600 hover:bg-teal-700 transition px-6 py-2 rounded-lg text-white font-semibold shadow-lg"
                >
                  Ver Más Canchas
                </button>
              </div>
            </div>

            {/* Columna derecha: canchas */}
            <div className="w-1/3 flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-white mb-3 border-b-2 border-red-600 w-fit">
                Canchas Disponibles
              </h3>
              <div className="grid grid-rows-3 gap-3">
                {canchas.length > 0 ? (
                  canchas.map((cancha, i) => (
                    <div
                      key={cancha.idCancha || i}
                      className="relative rounded-lg overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={getCanchaImageUrl(cancha)}
                        alt={cancha.nombre}
                        onError={handleCanchaImageError}
                        className="w-full h-28 object-cover transform group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition"></div>
                      <div className="absolute bottom-2 left-2 text-white text-xs">
                        <p className="font-bold truncate max-w-[120px]">
                          {cancha.nombre || `Cancha ${i + 1}`}
                        </p>
                        <p className="text-gray-300">
                          S/{cancha.costoHora?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                      {/* Indicador si tiene múltiples imágenes */}
                      {cancha.imagenes && cancha.imagenes.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-1.5 py-0.5 rounded-full text-xs">
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No hay canchas disponibles.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}