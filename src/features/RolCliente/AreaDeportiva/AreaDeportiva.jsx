// src/features/RolCliente/Areadeportiva/Areadeportiva.jsx
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAreadeportivaActivos } from "../../../api/AreadeportivaApi";
import AreaModal from "./AreaModal";
import "./AreaDeportiva.css";

export default function Areadeportiva() {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const galleryRef = useRef(null);
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef(null);
  const autoIntervalRef = useRef(null);
  //sirve para pausar y despue svover  ala animaciona utoscroll
  const pauseAuto = () => {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    // reanudar automáticamente 5s después de la última interacción
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
      resumeTimeoutRef.current = null;
    }, 5000);
  };

  const manualNavigate = (newIndex) => {
    pauseAuto();
    setCurrentIndex(newIndex);//cambia estado para que el carrusel muestre elemento en esa posiscion
    // scroll al elemento
    const g = galleryRef.current;
    if (!g) return;
    const child = g.children[newIndex];
    if (child && typeof child.scrollIntoView === "function") {
      child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  const next = () => {
    const total = areas.length;
    if (total === 0) return;
    manualNavigate((currentIndex + 1) % total); //si llega al ultimo volver a al aprimera iamgen
  };

  const prev = () => {
    const total = areas.length;
    if (total === 0) return;
    manualNavigate((currentIndex - 1 + total) % total);
  };

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await getAreadeportivaActivos();
        setAreas(data);
      } catch (error) {
        console.error("Error al cargar áreas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  // Auto-scroll cada 5 segundos (pausable tras interacción y hover)
  useEffect(() => {
    if (!areas || areas.length <= 1) return;
    // limpia si ya hay uno
    if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);

    autoIntervalRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setCurrentIndex((prev) => (prev + 1) % areas.length);
      }
    }, 5000);

    return () => {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [areas]);

  // Scroll hacia el elemento activo cuando cambia currentIndex
  useEffect(() => {
    const g = galleryRef.current;
    if (!g) return;
    const child = g.children[currentIndex];
    if (child && typeof child.scrollIntoView === "function") {
      child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [currentIndex]);
  //sprinter animado
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!areas || areas.length === 0) {
    return (
      <div className="py-12 px-4 md:px-8 bg-[#F2EFEB] text-center">
        <p className="text-gray-600">No hay áreas deportivas disponibles.</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 md:px-8 bg-[#F2EFEB]">
      <motion.h2
        className="text-2xl md:text-3xl font-Alumni text-center mb-1 text-gray-800"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Explora las Areas Deportivas Disponibles
      </motion.h2>
      <p className="text-sm text-gray-600 font-Balo text-center mb-2">
        Aqui encotraras las disciplinas  y canchas que ofrecen muestras Areas Deportivas
      </p>

      <div
        className="relative"
        // pausamos auto al hacer hover en la galería completa 
        onMouseEnter={() => { pausedRef.current = true; }}//pausamo el autoplay
        onMouseLeave={() => {
          // reanudar con pequeño retraso para evitar saltos
          if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
          resumeTimeoutRef.current = setTimeout(() => { pausedRef.current = false; resumeTimeoutRef.current = null; }, 700);
        }}
      >
        {/* Contenedor del carrusel*/}
        <div
          ref={galleryRef}
          id="gallery"
          className="gallery flex gap-6 py-5 px-4"
          style={{ scrollSnapType: "x mandatory", overflowX: "auto" }}
        >
          {areas.map((area, index) => (
            <motion.div
              key={area.id}
              className={`flex-shrink-0 w-[340px] h-[440px] overflow-hidden bg-white cursor-pointer relative group rounded-none ${index === currentIndex ? "opacity-100" : "opacity-70"}`}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.41)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedArea(area)}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Imagen ocupa todo el card */}
              <div className="w-full h-full relative">
                <img
                  src={area.urlImagen || "/images/default-area.jpg"}
                  alt={area.nombreArea}
                  className="object-cover w-full h-full"
                />

                {/* overlay que aparece al hover: sombreado de arriba hacia abajo */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* icono ojito arriba derecha */}
                <div className="absolute top-3 right-3 bg-[#f28627] text-white p-2 rounded-full shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>

                {/* info abajo - texto más largo y con fuente Alumni */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-2xl text-white font-Alumni mb-1 leading-tight">{area.nombreArea}</h3>
                  <div className="flex items-center gap-2 text-white text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 text-white" 
                        fill="currentColor" 
                        viewBox="0 0 24 24">
                      <path d="M3 5a2 2 0 012-2h3a1 1 0 011 .76l1 4a1 1 0 01-.27.95l-2 2a16 16 0 006.36 6.36l2-2a1 1 0 01.95-.27l4 1a1 1 0 01.76 1v3a2 2 0 01-2 2h-2C9.82 21 3 14.18 3 6V5z"/>
                    </svg>

                    <span>{area.telefonoArea || "No disponible"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Flechas de navegación — fuera del contenedor gallery para no recibir pointer-events: none */}
        <div className="area-controls">
          <button onClick={prev} aria-label="Anterior área" className="area-btn left">
            ❮
          </button>
          <button onClick={next} aria-label="Siguiente área" className="area-btn right">
            ❯
          </button>
        </div>

        {/* Puntos indicadores */}
        <div className="flex justify-center mt-4 gap-2">
          {areas.map((_, index) => (
            <button
              key={index}
              onClick={() => manualNavigate(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? "bg-[#f28627]" : "bg-gray-300"}`}
              aria-label={`Ir a área ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedArea && <AreaModal area={selectedArea} onClose={() => setSelectedArea(null)} />}
      </AnimatePresence>
    </div>
  );
}
