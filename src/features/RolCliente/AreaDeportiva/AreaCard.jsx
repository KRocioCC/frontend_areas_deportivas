// src/features/RolCliente/Areadeportiva/AreaCard.jsx
import { memo } from "react";
import { motion } from "framer-motion";
import { EyeIcon } from '@heroicons/react/24/outline';

// memo() evita re-renders si props no cambian
const AreaCard = memo(({ area, index, currentIndex, onClick }) => {
  // Función para obtener la URL de la imagen
  const getImageUrl = () => {
    // Si hay imágenes subidas por el administrador, tomar la primera
    if (area.imagenes && area.imagenes.length > 0) {
      const primeraImagen = area.imagenes[0];
      // Verificar si la URL ya incluye el dominio completo o es relativa
      if (primeraImagen.urlAcceso.startsWith('http')) {
        return primeraImagen.urlAcceso;
      } else {
        return `http://localhost:8032${primeraImagen.urlAcceso}`;
      }
    }
    
    // Si no hay imágenes, usar la imagen por defecto
    return area.urlImagen || "/defaults/area-default.jpg";
  };

  // Función para manejar errores de carga de imagen
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/defaults/area-default.jpg";
  };

  return (
    <motion.div
      className={`flex-shrink-0 w-[340px] h-[440px] overflow-hidden bg-white cursor-pointer relative group rounded-sm ${
        index === currentIndex ? "opacity-100" : "opacity-80"
      }`}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.18)",
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={{ opacity: 0, x: index === 0 ? 0 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="w-full h-full relative">
        <img
          src={getImageUrl()}
          alt={area.nombreArea || "Área deportiva"}
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "low"}
          onError={handleImageError}
          className="object-cover w-full h-full"
        />

        {/* Indicador de múltiples imágenes */}
        {area.imagenes && area.imagenes.length > 1 && (
          <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
          </div>
        )}

        {/* overlay hover */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* ícono ojito */}
        <div className="absolute top-3 right-3 bg-[#f38321] text-white p-2 rounded-full shadow-sm">
          <EyeIcon className="h-5 w-5" />
        </div>

        {/* texto inferior */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-2xl text-white font-Alumni mb-1 leading-tight">
            {area.nombreArea}
          </h3>
          
          {/* Información de contacto */}
          <div className="flex items-center gap-2 text-white text-sm mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 5a2 2 0 012-2h3a1 1 0 011 .76l1 4a1 1 0 01-.27.95l-2 2a16 16 0 006.36 6.36l2-2a1 1 0 01.95-.27l4 1a1 1 0 01.76 1v3a2 2 0 01-2 2h-2C9.82 21 3 14.18 3 6V5z"/>
            </svg>
            <span>{area.telefonoArea || "No disponible"}</span>
          </div>

          {/* Email */}
          {area.emailArea && (
            <div className="flex items-center gap-2 text-white text-sm mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{area.emailArea}</span>
            </div>
          )}

          {/* Zona */}
          {area.zona && (
            <div className="flex items-center gap-2 text-white text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{area.zona.nombre}</span>
              {area.zona.macrodistrito && (
                <span className="text-xs opacity-90">({area.zona.macrodistrito.nombre})</span>
              )}
            </div>
          )}

          {/* Estado */}
          <div className="flex justify-between items-center mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              area.estado 
                ? 'bg-green-500/80 text-white' 
                : 'bg-red-500/80 text-white'
            }`}>
              {area.estado ? 'Abierto' : 'Cerrado'}
            </span>
            
            {/* Contador de imágenes */}
            {area.imagenes && area.imagenes.length > 0 && (
              <span className="text-xs text-white/80 bg-black/50 px-2 py-1 rounded-full">
                {area.imagenes.length} foto{area.imagenes.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default AreaCard;