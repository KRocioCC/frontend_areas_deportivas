// src/features/RolCliente/Areadeportiva/AreaCard.jsx
import { memo } from "react";
import { motion } from "framer-motion";
import { EyeIcon } from '@heroicons/react/24/outline';
// memo() evita re-renders si props no cambian
const AreaCard = memo(({ area, index, currentIndex, onClick }) => {
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
          src={area.urlImagen || "/frontend-espacios-qr/public/defaults/area-default.jpg"}
          alt={area.nombreArea || "Área deportiva"}
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "low"}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/defaults/area-default.jpg";
          }}
          className="object-cover w-full h-full"
        />

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
          <div className="flex items-center gap-2 text-white text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 5a2 2 0 012-2h3a1 1 0 011 .76l1 4a1 1 0 01-.27.95l-2 2a16 16 0 006.36 6.36l2-2a1 1 0 01.95-.27l4 1a1 1 0 01.76 1v3a2 2 0 01-2 2h-2C9.82 21 3 14.18 3 6V5z"/>
            </svg>
            <span>{area.telefonoArea || "No disponible"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default AreaCard;