// CardCancha Component
import { motion } from "framer-motion";

export default function CardCancha({ cancha }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg duration-300 border border-gray-200"
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={cancha.imagen}
          alt={cancha.nombre}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{cancha.nombre}</h3>

        <p className="text-gray-600 text-sm line-clamp-2">{cancha.descripcion}</p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium text-green-600">⭐ {cancha.rating}</span>
          <span className="text-sm font-semibold text-blue-600">{cancha.precio} Bs/h</span>
        </div>
      </div>
    </motion.div>
  );
}
