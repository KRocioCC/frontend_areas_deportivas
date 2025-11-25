import React, { useState, useCallback } from "react";
import { FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import FancyButton from "../../../../components/ui/FancyButton";

function CanchaCard({ cancha }) {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const totalImages = cancha?.imagenes?.length || 0;
  const hasMultipleImages = totalImages > 1;

  // Obtener URL de la imagen actual
  const getCurrentImageUrl = () => {
    if (cancha.imagenes && cancha.imagenes.length > 0) {
      const imagenActual = cancha.imagenes[currentImageIndex];
      if (!imagenActual) return "/defaults/cancha-default.jpg";
      const raw = imagenActual.urlAcceso || imagenActual.url || "";
      if (raw.startsWith("http")) return raw;
      if (raw) return `http://localhost:8032${raw}`;
      return "/defaults/cancha-default.jpg";
    }
    return cancha.urlImagen || "/defaults/cancha-default.jpg";
  };

  // Manejar error de carga de imagen
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/defaults/cancha-default.jpg";
  };

  // Navegar a la siguiente imagen
  const nextImage = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (totalImages > 0) {
      setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    }
  }, [totalImages]);

  // Navegar a la imagen anterior
  const prevImage = useCallback((e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (totalImages > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    }
  }, [totalImages]);

  // Ir a una imagen específica
  const goToImage = (e, idx) => {
    e.stopPropagation();
    e.preventDefault();
    if (idx >= 0 && idx < totalImages) setCurrentImageIndex(idx);
  };

  return (
    <div className="rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      
      {/* Imagen con carrusel */}
      <div className="relative w-full h-40 overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={getCurrentImageUrl()}
            alt={`${cancha.nombre} imagen ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={handleImageError}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            draggable={false}
          />
        </AnimatePresence>

        {/* Flecha izquierda */}
        {hasMultipleImages && (
          <button
            onClick={prevImage}
            className="nav-btn absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Imagen anterior"
            type="button"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
        )}

        {/* Flecha derecha */}
        {hasMultipleImages && (
          <button
            onClick={nextImage}
            className="nav-btn absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Siguiente imagen"
            type="button"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        )}

        {/* Indicadores de posición (puntos) */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
            {cancha.imagenes.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToImage(e, index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
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
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-0.5 rounded-full text-xs font-medium">
            {currentImageIndex + 1} / {totalImages}
          </div>
        )}
      </div>

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
