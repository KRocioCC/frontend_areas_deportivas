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
        className={`flex justify-center items-center h-64 transition-colors duration-300 ${
          isDarkMode ? 'bg-[#0f1213]' : 'bg-[#f2efeb]'
        }`}
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
        className={`py-16 px-4 text-center transition-colors duration-300 ${
          isDarkMode ? 'bg-[#0f1213] text-gray-300' : 'bg-[#f2efeb] text-gray-700'
        }`}
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
    <div className={`py-10 px-4 md:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-[#0f1213]' : 'bg-[#f2efeb]'}`}>
      <motion.h2
        className="text-2xl md:text-3xl mb-3 text-center"
        style={{ fontFamily: 'var(--font-Oswald)' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
          Explora las Áreas Deportivas Disponibles
        </span>
      </motion.h2>
      <p 
        className="text-center mb-8 opacity-90"
        style={{ 
          fontFamily: 'var(--font-Balo)',
          color: isDarkMode ? '#cbd5e1' : '#4b5563',
          fontSize: '1rem'
        }}
      >
        Aquí encontrarás las disciplinas y canchas que ofrecen nuestras Áreas Deportivas
      </p>

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
        <div
          ref={galleryRef}
          id="gallery"
          className="gallery flex gap-6 py-5 px-2 md:px-4"
          style={{ scrollSnapType: "x mandatory", overflowX: "auto"}}
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

        {/* Flechas de navegación */}
        <div className="area-controls">
          <button 
            onClick={prev} 
            aria-label="Área anterior" 
            className="area-btn left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button 
            onClick={next} 
            aria-label="Siguiente área" 
            className="area-btn right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center mt-6 gap-2">
          {areas.map((_, index) => (
            <button
              key={index}
              onClick={() => manualNavigate(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                index === currentIndex 
                  ? (isDarkMode ? 'bg-[#2C7366]' : 'bg-[#41bfb2]') 
                  : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300')
              }`}
              aria-label={`Ir a área ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedArea && (
          <Suspense fallback={null}>
            <AreaModal area={selectedArea} onClose={() => setSelectedArea(null)} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}