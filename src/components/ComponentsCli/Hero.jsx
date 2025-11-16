// src/componentsCli/Hero.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero() {
  const backgrounds = [
    { src: "/contenido/imagen1.jpg", alt: "Personas jugando fútbol" },
    { src: "/contenido/imagen2.jpg", alt: "Personas jugando basquet" },
    { src: "/contenido/imagen3.jpg", alt: "Personas jugan voley" },
    { src: "/contenido/imagen4.jpg", alt: "Personas jugando disciplia" },
    { src: "/contenido/imagen5.jpg", alt: "Personas jugando" }
  ];

  const [index, setIndex] = useState(0);
  const [errorFallback, setErrorFallback] = useState(backgrounds[0].src);

  useEffect(() => {
    const imgs = backgrounds.map((b) => {
      const img = new Image();
      img.src = b.src;
      img.onerror = () => setErrorFallback(backgrounds[0].src);
      return img;
    });
    return () => imgs.forEach((i) => (i.onload = i.onerror = null));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % backgrounds.length), 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="inicio" className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Fondo dinámico */}
      <AnimatePresence mode="wait">
        {backgrounds.map(
          (bg, i) =>
            i === index && (
              <motion.div
                key={i}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              >
                <img
                  src={bg.src}
                  alt={bg.alt}
                  onError={(e) => (e.target.src = errorFallback)}
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                />
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Overlay degradado */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 pointer-events-none" />

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full px-4">
        {/* Título */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-[var(--font-Oswald)] font-bold mb-4 leading-snug text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Encuentra tu cancha ideal
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          className="text-sm sm:text-base md:text-lg text-[var(--color-p-4)] mb-8 max-w-xl leading-relaxed font-[var(--font-Balo)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Reserva en segundos y asegura tu espacio sin complicaciones.
        </motion.p>

        {/* Filtros minimalistas */}
        <motion.form
          onSubmit={(e) => e.preventDefault()}
          className="bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 w-full max-w-3xl flex flex-col md:flex-row gap-3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <select className="flex-1 p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none font-[var(--font-Balo)]">
            <option value="">Deporte</option>
            <option>Fútbol</option>
            <option>Básquet</option>
            <option>Vóley</option>
            <option>Tenis</option>
          </select>

          <select className="flex-1 p-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none font-[var(--font-Balo)]">
            <option value="">Zona</option>
            <option>Norte</option>
            <option>Sur</option>
            <option>Este</option>
            <option>Oeste</option>
            <option>Centro</option>
          </select>

          <input
            type="date"
            className="flex-1 p-3 rounded-lg bg-white/10 text-white outline-none font-[var(--font-Balo)]"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-[var(--color-p-1)] to-[var(--color-p-2)] text-white font-[var(--font-josefin)] font-bold rounded-lg p-3 hover:scale-105 transition-transform duration-300"
          >
            Buscar
          </button>
        </motion.form>

        {/* Indicadores de fondo */}
        <motion.div className="flex gap-2 mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          {backgrounds.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === index ? "bg-[var(--color-p-2)] scale-125" : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
