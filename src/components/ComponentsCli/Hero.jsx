// src/componentsCli/Hero.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "./../../context/ThemeContext";
import { Search, MapPin, Calendar, ChevronDown } from "lucide-react";

/**
 * Hero mejorado:
 * - Mantiene la lógica de rotación de fondos (interval)
 * - Mejora tipografía, overlay, parallax sutil y transiciones
 * - Respeta sistema visual (fonts vars, colores, dark/light)
 */

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
  }, [backgrounds.length]);

  return (
    <section
      id="inicio"
      className="relative h-screen min-h-[640px] overflow-hidden"
      aria-label="Hero - reserva tu cancha"
    >
      {/* BACKGROUNDS: crossfade con parallax sutil */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.25, ease: "easeInOut" }}
        >
          {/* imagen con transform para ligera sensación de parallax */}
          <motion.img
            src={backgrounds[index]}
            alt={`Cancha ${index + 1}`}
            className="w-full h-full object-cover"
            loading="eager"
            initial={{ scale: 1.05, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
            style={{ willChange: "transform" }}
          />
          {/* overlay degradado que ayuda la transición entre secciones */}
          <div
            className={`absolute inset-0 pointer-events-none ${
              isDarkMode
                ? "bg-gradient-to-b from-black/60 via-[#0f1213]/45 to-[#0f1213]/80"
                : "bg-gradient-to-b from-black/30 via-transparent to-white/60"
            }`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        {/* TITULO: tamaños controlados con clamp para evitar saltos */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="leading-tight"
          style={{ fontFamily: "var(--font-Oswald)" }}
        >
          <span
            className={`block text-[clamp(32px,6vw,56px)] sm:text-[clamp(44px,7.2vw,72px)] font-extrabold tracking-tight ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            RESERVA TU CANCHA
          </span>

          <span
            className={`block mt-2 font-black text-[clamp(22px,4.2vw,40px)] sm:text-[clamp(30px,4.6vw,56px)] ${
              isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"
            }`}
          >
            AL INSTANTE
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className={`mt-5 text-[clamp(14px,2.2vw,18px)] max-w-2xl ${
            isDarkMode ? "text-gray-200" : "text-gray-800"
          }`}
          style={{ fontFamily: "var(--font-Alumni)" }}
        >
          Fútbol, básquet, tenis, pádel... Encuentra, reserva y juega en minutos.
        </motion.p>
        
        {/* INDICADORES: barras con ancho variable y animación */}
        <div className="flex gap-3 mt-6 items-center">
          {backgrounds.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-400 ${
                i === index
                  ? isDarkMode ? "bg-[#2C7366] w-16" : "bg-[#41bfb2] w-16"
                  : "bg-white/30 hover:bg-white/60 w-10"
              }`}
            />
          ))}
        </div>

        {/* Scroll hint: pequeña flecha animada */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="mt-8"
        >
          <button
            onClick={() => {
              const nextSection = document.querySelector("#areasdeportivas");
              if (nextSection) nextSection.scrollIntoView({ behavior: "smooth" });
            }}
            className={`p-3 rounded-full transition-all duration-200 shadow-[0_8px_20px_rgba(0,0,0,0.25)] ${
              isDarkMode ? "bg-black/50 border border-white/6 text-white" : "bg-white/90 border border-gray-100 text-gray-900"
            }`}
            aria-label="Bajar a áreas deportivas"
            style={{ fontFamily: "var(--font-josefin)" }}
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
