// src/componentsCli/Hero.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero() {
  // Lista de fondos (usar rutas desde public/ para que funcionen en producción)
  const backgrounds = [
    { type: "image", src: "/contenido/images.jpg", alt: "Personas jugando fútbol" },
    { type: "image", src: "/contenido/descarga.jpg", alt: "Cancha iluminada" }
  ];

  const [index, setIndex] = useState(0);
  const [errorFallback, setErrorFallback] = useState(null);

  // Pre-cargar imágenes (mejora UX) y limpiar
  useEffect(() => {
    const imgs = backgrounds.map((b) => {
      if (b.type !== "image") return null;
      const img = new Image();
      img.src = b.src;
      img.onload = () => {};
      img.onerror = () => {
        // si falla, marcar fallback (usa la primera imagen disponible)
        setErrorFallback(backgrounds[0].src);
      };
      return img;
    });
    return () => {
      imgs.forEach((i) => {
        if (i) {
          i.onload = null;
          i.onerror = null;
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cambiar fondo cada 8 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  const handleImgError = (e) => {
    if (errorFallback && e.target.src !== errorFallback) {
      e.target.src = errorFallback;
    }
  };

  return (
    <section className="relative h-screen min-h-[480px] overflow-hidden">
      {/* Fondo dinámico con animación de fade */}
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
                aria-hidden={bg.type !== "image"}
              >
                {bg.type === "video" ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    aria-hidden="true"
                  >
                    <source src={bg.src} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={bg.src}
                    alt={bg.alt || "Fondo deportivo"}
                    onError={handleImgError}
                    loading="lazy"
                    className="w-full h-full object-cover object-center"
                    style={{ minHeight: "480px" }}
                  />
                )}
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Overlay oscuro para contraste */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg leading-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="block">
            <span className="text-white">¡Bienvenidos a</span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-blue-500">
              ReservaYA!
            </span>
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-gray-200 max-w-3xl mb-8 px-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Encuentra y reserva tu cancha ideal en segundos. ¡Juega hoy mismo!
        </motion.p>

        {/* Cuadro de filtros */}
        <motion.form
          onSubmit={(e) => e.preventDefault()}
          className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/10 max-w-4xl w-full mx-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <label className="sr-only" htmlFor="deporte-select">Deporte</label>
            <select id="deporte-select" className="p-3 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-red-500 outline-none">
              <option value="">Deporte</option>
              <option>Fútbol</option>
              <option>Básquet</option>
              <option>Vóley</option>
            </select>

            <label className="sr-only" htmlFor="zona-select">Zona</label>
            <select id="zona-select" className="p-3 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
              <option value="">Zona</option>
              <option>Norte</option>
              <option>Sur</option>
              <option>Este</option>
              <option>Oeste</option>
            </select>

            <label className="sr-only" htmlFor="fecha-input">Fecha</label>
            <input
              id="fecha-input"
              type="date"
              className="p-3 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Fecha"
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg p-3 shadow-lg hover:shadow-xl transition"
              aria-label="Buscar cancha"
            >
              🔍 Buscar Cancha
            </motion.button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
