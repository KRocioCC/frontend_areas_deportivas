// src/features/RolCliente/Areadeportiva/Areadeportiva.jsx
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAreadeportivaActivos } from "../../../api/AreadeportivaApi";
import AreaCard from "./AreaCard";
import "./AreaDeportiva.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { lazy, Suspense } from "react";
import { useTheme } from "../../../context/ThemeContext";

const AreaModal = lazy(() => import("./AreaModal"));

export default function Areadeportiva() {
  const { isDarkMode } = useTheme();
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const galleryRef = useRef(null);
  const pausedRef = useRef(false);
  const resumeTimeoutRef = useRef(null);
  const autoIntervalRef = useRef(null);

  const pauseAuto = () => {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 5000);
  };

  const manualNavigate = (newIndex) => {
    pauseAuto();
    setCurrentIndex(newIndex);
    const g = galleryRef.current;
    if (!g) return;
    const child = g.children[newIndex];
    if (child) {
      const containerWidth = g.offsetWidth;
      const childLeft = child.offsetLeft;
      const childWidth = child.offsetWidth;
      const scrollPosition = childLeft - (containerWidth / 2) + (childWidth / 2);
      g.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  };

  const next = () => {
    const total = areas.length;
    if (total === 0) return;
    manualNavigate((currentIndex + 1) % total);
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

  useEffect(() => {
    if (!areas || areas.length <= 1) return;
    if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
    autoIntervalRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setCurrentIndex((prev) => (prev + 1) % areas.length);
      }
    }, 4000);
    return () => {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [areas]);

  useEffect(() => {
    const g = galleryRef.current;
    if (!g) return;
    const child = g.children[currentIndex];
    if (!child) return;
    const containerWidth = g.clientWidth;
    const childLeft = child.offsetLeft;
    const childWidth = child.offsetWidth;
    const scrollX = childLeft - (containerWidth / 2) + (childWidth / 2);
    g.scrollTo({ left: scrollX, behavior: "smooth" });
  }, [currentIndex]);

  if (loading) {
    return (
      <div 
        className={`flex justify-center items-center h-64 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f1213]' : 'bg-[#f2efeb]'}`}
      >
        <div 
          className="animate-spin rounded-full h-10 w-10 border-t-2 border-r-2"
          style={{
            borderColor: isDarkMode ? '#f35734' : '#f28627',
            borderLeftColor: 'transparent',
            borderTopColor: isDarkMode ? '#f35734' : '#f28627',
          }}
        ></div>
      </div>
    );
  }

  if (!areas || areas.length === 0) {
    return (
      <div 
        className={`py-16 px-4 text-center transition-colors duration-300 ${isDarkMode ? 'bg-[#0f1213] text-gray-300' : 'bg-[#f2efeb] text-gray-700'}`}
        style={{ fontFamily: 'var(--font-Balo)' }}
      >
        <p className="text-base opacity-80">No hay áreas deportivas disponibles en este momento.</p>
      </div>
    );
  }

  const handleOpenModal = (area) => {
    if (area.urlImagen) {
      const img = new Image();
      img.src = area.urlImagen;
    }
    setSelectedArea(area);
  };

  return (
    <>
      {/* CURVA SUPERIOR (mantengo tu intención pero más orgánica) */}
      <div className="relative">
        <div className={`absolute top-0 left-0 right-0 -mt-1 h-36 ${isDarkMode ? 'bg-[#0f1213] z-0' : 'bg-white z-0'}`}>
          <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
            <path
              fill={isDarkMode ? "#0f1213" : "#FFFFFF"}
              d="M0,64 C220,160 420,0 720,80 C1020,160 1220,80 1440,120 L1440,320 L0,320 Z"
              opacity="0.92"
            />
          </svg>
        </div>
      </div>

      <section 
        id="areasdeportivas"
        className={`relative py-20 px-4 md:px-8 overflow-visible transition-all duration-700 ${isDarkMode ? 'bg-[#0f1213]' : 'bg-white'}`}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-center mb-12"
          >
            <h2 
              className="text-4xl md:text-6xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-Oswald)" }}
            >
              <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                ÁREAS
              </span>{" "}
              <span className={isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}>
                DEPORTIVAS
              </span>
            </h2>
            <p 
              className="mt-4 text-base md:text-lg max-w-3xl mx-auto opacity-90"
              style={{ fontFamily: "var(--font-Alumni)" }}
            >
              Descubre las mejores canchas y disciplinas cerca de ti
            </p>
          </motion.div>

          <div 
            className="relative"
            onMouseEnter={() => { pausedRef.current = true; }}
            onMouseLeave={() => {
              if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
              resumeTimeoutRef.current = setTimeout(() => {
                pausedRef.current = false;
              }, 1000);
            }}
          >
            {/* GALLERY: oculto scrollbar, mantengo scroll-snap y hago cards animadas */}
            <div
              ref={galleryRef}
              className="flex gap-8 py-8 overflow-x-auto no-scrollbar scroll-snap-x"
              style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
            >
              {areas.map((area, index) => {
                const isActive = index === currentIndex;
                return (
                  <motion.div
                    key={area.id}
                    initial={{ opacity: 0.85, scale: 0.96 }}
                    animate={isActive ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0.82, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    whileHover={isActive ? { scale: 1.02 } : { scale: 0.98 }}
                    style={{ scrollSnapAlign: "center", minWidth: "320px", maxWidth: "420px" }}
                    className="area-card-wrapper"
                    onClick={() => handleOpenModal(area)}
                  >
                    {/* No cambio AreaCard internamente — sólo lo envuelvo para animaciones */}
                    <AreaCard
                      area={area}
                      index={index}
                      currentIndex={currentIndex}
                      onClick={() => handleOpenModal(area)}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Flechas refinadas (sobre el contenido, no tapan los indicadores) */}
            <button
              onClick={prev}
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-20 hover:scale-105 active:scale-95
                ${isDarkMode 
                  ? "bg-[#0f1213]/75 border border-white/12 text-[#2C7366] shadow-md" 
                  : "bg-white/90 border border-gray-100 text-[#41bfb2] shadow-md"
                }`}
              style={{ fontFamily: "var(--font-josefin)" }}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={next}
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-20 hover:scale-105 active:scale-95
                ${isDarkMode 
                  ? "bg-[#0f1213]/75 border border-white/12 text-[#2C7366] shadow-md" 
                  : "bg-white/90 border border-gray-100 text-[#41bfb2] shadow-md"
                }`}
              style={{ fontFamily: "var(--font-josefin)" }}
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* INDICADORES: los posiciono absolute y con z-index alto para que nunca los tape el SVG */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-6 z-30">
              <div className="flex items-center gap-3">
                {areas.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => manualNavigate(i)}
                    className="indicator-btn"
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Ir al área ${i + 1}`}
                  >
                    <div
                      className={`rounded-full transition-all duration-500 ${i === currentIndex ? (isDarkMode ? 'bg-[#2C7366]' : 'bg-[#41bfb2]') : (isDarkMode ? 'bg-gray-700' : 'bg-gray-300')}`}
                      style={{ width: i === currentIndex ? 48 : 10, height: 10, borderRadius: 999 }}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Curva inferior (z-0) */}
        {/* DIAGONAL INFERIOR PROFESIONAL (/ ) */}
        <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden pointer-events-none z-0">
          <svg 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none" 
            className="w-full h-full"
          >
            <polygon 
              points="0,60 100,100 100,100 0,100" 
              fill={isDarkMode ? "#000000ff" : "#000000ff"} 
              opacity="1"
            />
          </svg>
        </div>
      </section>

      <AnimatePresence>
        {selectedArea && (
          <Suspense fallback={null}>
            <AreaModal area={selectedArea} onClose={() => setSelectedArea(null)} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
}
