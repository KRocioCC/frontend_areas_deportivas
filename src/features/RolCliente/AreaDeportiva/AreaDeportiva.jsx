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
      {/* MANTENGO tus curvas pero aseguro que los indicadores estén por encima (z-index) */}
      <div className="relative">
        <div className={`absolute top-0 left-0 right-0 -mt-1 h-32 ${isDarkMode ? 'bg-[#0f1213] z-0' : 'bg-white z-0'}`}>
          <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
            <path
              fill={isDarkMode ? "#0f1213" : "#FFFFFF"}
              d="M0,96 C360,180 1080,20 1440,96 L1440,320 L0,320 Z"
              opacity="0.8"
            />
          </svg>
        </div>
      </div>

      <section 
        id="areasdeportivas"
        /* CAMBIO: overflow-visible para que elementos posicionado con z-index no se corten.
           Si necesitas mantener overflow-hidden por alguna razón, puedes extraer las curvas a otro wrapper
           y dejar el contenido principal con overflow-visible. */
        className={`relative py-20 px-4 md:px-8 overflow-visible transition-all duration-1000 ${isDarkMode ? 'bg-[#0f1213]' : 'bg-white'}`}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-center mb-16"
          >
            <h2 
              className="text-5xl md:text-7xl font-bold tracking-tight"
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
              className="mt-6 text-lg md:text-xl max-w-3xl mx-auto opacity-90"
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
              }, 1000); // resume rápido al salir
            }}
          >
            <div
              ref={galleryRef}
              className="flex gap-8 py-8 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {areas.map((area, index) => (
                <AreaCard
                  key={area.id}
                  area={area}
                  index={index}
                  currentIndex={currentIndex}
                  onClick={() => handleOpenModal(area)}
                />
              ))}
            </div>

            {/* Flechas (les doy z-index para que estén sobre otros elementos) */}
            <button
              onClick={prev}
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-md z-20 hover:scale-110 active:scale-95 ${
                isDarkMode 
                  ? "bg-[#0f1213]/80 border border-white/20 text-[#2C7366] hover:bg-[#2C7366]/20" 
                  : "bg-white/80 border border-gray-200 text-[#41bfb2] hover:bg-[#41bfb2]/10"
              }`}
              style={{ fontFamily: "var(--font-josefin)" }}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={next}
              className={`absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-md z-20 hover:scale-110 active:scale-95 ${
                isDarkMode 
                  ? "bg-[#0f1213]/80 border border-white/20 text-[#2C7366] hover:bg-[#2C7366]/20" 
                  : "bg-white/80 border border-gray-200 text-[#41bfb2] hover:bg-[#41bfb2]/10"
              }`}
              style={{ fontFamily: "var(--font-josefin)" }}
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* INDICADORES: pongo z-index alto y relative para que no los tape el SVG */}
            <div className="flex justify-center gap-3 mt-10 relative z-30" aria-hidden={false}>
              {areas.map((_, i) => (
                <motion.div
                  key={i}
                  onClick={() => manualNavigate(i)}
                  className="cursor-pointer"
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div 
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      i === currentIndex
                        ? isDarkMode ? "bg-[#2C7366] w-12" : "bg-[#41bfb2] w-12"
                        : isDarkMode ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Curva inferior: le doy z-0 para que no tape los indicadores */}
        <div className="absolute bottom-0 left-0 right-0 -mb-1 h-32 overflow-hidden z-0 pointer-events-none">
          <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
            <path
              fill={isDarkMode ? "#0f1213" : "#FFFFFF"}
              d="M0,160 C360,80 1080,280 1440,160 L1440,0 L0,0 Z"
              opacity="0.9"
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
