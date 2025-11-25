// src/componentsCli/Hero.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "./../../context/ThemeContext";
import { Search, MapPin, Calendar } from "lucide-react";

export default function Hero() {
  const { isDarkMode } = useTheme();

  const backgrounds = [
    "/contenido/imagen1.jpg",
    "/contenido/imagen2.jpg",
    "/contenido/imagen3.jpg",
    "/contenido/imagen4.jpg",
    "/contenido/imagen5.jpg",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="inicio" className="relative h-screen min-h-[640px] overflow-hidden">
      {/* Fondo dinámico */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        >
          <img
            src={backgrounds[index]}
            alt={`Cancha ${index + 1}`}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay oscuro siempre (pero más suave en modo claro) */}
      <div className={`absolute inset-0 ${isDarkMode ? "bg-black/70" : "bg-black/60"}`} />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        {/* Título impactante */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-2xl"
          style={{ fontFamily: "var(--font-Oswald)" }}
        >
          RESERVA TU CANCHA
          <span className={`block text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-2 ${isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}`}>
            AL INSTANTE
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-6 text-lg sm:text-xl md:text-2xl text-gray-200 max-w-2xl"
          style={{ fontFamily: "var(--font-Alumni)" }}
        >
          Fútbol, básquet, tenis, pádel... Encuentra, reserva y juega en minutos.
        </motion.p>

        {/* Formulario de búsqueda - 100 % responsivo y elegante */}
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          onSubmit={(e) => e.preventDefault()}
          className={`mt-10 w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] ${
            isDarkMode 
              ? "bg-black/40 backdrop-blur-md border border-white/10" 
              : "bg-white/20 backdrop-blur-md border border-white/30"
          }`}
        >
          {/* Deporte */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              className={`w-full pl-12 pr-4 py-4 rounded-xl outline-none transition-all font-medium ${
                isDarkMode 
                  ? "bg-[#0f1213]/80 text-white placeholder-gray-500 hover:bg-white/5" 
                  : "bg-white/80 text-gray-900 placeholder-gray-600 hover:bg-white/90"
              }`}
              style={{ fontFamily: "var(--font-Balo)" }}
            >
              <option value="">Deporte</option>
              <option>Fútbol</option>
              <option>Básquet</option>
              <option>Pádel</option>
              <option>Tenis</option>
              <option>Vóley</option>
            </select>
          </div>

          {/* Zona */}
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              className={`w-full pl-12 pr-4 py-4 rounded-xl outline-none transition-all font-medium ${
                isDarkMode 
                  ? "bg-[#0f1213]/80 text-white placeholder-gray-500 hover:bg-white/5" 
                  : "bg-white/80 text-gray-900 placeholder-gray-600 hover:bg-white/90"
              }`}
              style={{ fontFamily: "var(--font-Balo)" }}
            >
              <option value="">Zona / Distrito</option>
              <option>Miraflores</option>
              <option>San Isidro</option>
              <option>Surco</option>
              <option>Lince</option>
            </select>
          </div>

          {/* Fecha */}
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              className={`w-full pl-12 pr-4 py-4 rounded-xl outline-none transition-all font-medium ${
                isDarkMode 
                  ? "bg-[#0f1213]/80 text-white" 
                  : "bg-white/80 text-gray-900"
              }`}
              style={{ fontFamily: "var(--font-Balo)" }}
            />
          </div>

          {/* Botón BUSCAR */}
          <button
            type="submit"
            className={`py-4 px-8 rounded-xl font-bold text-white transition-all duration-200 transform hover:scale-105 active:scale-98 shadow-[0_4px_14px_#00000030] ${
              isDarkMode 
                ? "bg-[#2C7366] hover:bg-[#41bfb2]" 
                : "bg-[#41bfb2] hover:bg-[#f28627]"
            }`}
            style={{ fontFamily: "var(--font-josefin)" }}
          >
            BUSCAR AHORA
          </button>
        </motion.form>

        {/* Indicadores */}
        <div className="flex gap-3 mt-10">
          {backgrounds.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-10 h-1 rounded-full transition-all duration-300 ${
                i === index 
                  ? isDarkMode ? "bg-[#2C7366] w-16" : "bg-[#41bfb2] w-16" 
                  : "bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}