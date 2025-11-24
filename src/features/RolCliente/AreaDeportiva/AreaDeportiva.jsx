// src/features/RolCliente/Areadeportiva/Areadeportiva.jsx
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAreadeportivaActivos } from "../../../api/AreadeportivaApi";
//import AreaModal from "./AreaModal";
import AreaCard from "./AreaCard";
import "./AreaDeportiva.css";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

import { lazy, Suspense } from "react";

const AreaModal = lazy(() => import("./AreaModal"));

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
    setCurrentIndex(newIndex);
    
    const g = galleryRef.current;
    if (!g) return;
    const child = g.children[newIndex];
    if (child) {
      const containerWidth = g.offsetWidth;
      const childLeft = child.offsetLeft;
      const childWidth = child.offsetWidth;
      
      const scrollPosition = childLeft - (containerWidth / 2) + (childWidth / 2);
      
      g.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
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

// Scroll horizontal SIN afectar scroll vertical del body
  useEffect(() => {
    const g = galleryRef.current;
    if (!g) return;

    const child = g.children[currentIndex];
    if (!child) return;

    // coordenadas del hijo relativo al contenedor
    const containerWidth = g.clientWidth;
    const childLeft = child.offsetLeft;
    const childWidth = child.offsetWidth;

    // posición centrada
    const scrollX = childLeft - (containerWidth / 2) + (childWidth / 2);

    g.scrollTo({
      left: scrollX,
      behavior: "smooth"
    });

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
  const handleOpenModal = (area) => {
    if (area.urlImagen) {
      const img = new Image();
      img.src = area.urlImagen;
    }
    setSelectedArea(area);
  };

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
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
          resumeTimeoutRef.current = setTimeout(() => {
            pausedRef.current = false;
            resumeTimeoutRef.current = null;
          }, 1000); // Reanudar después de 1 segundo
        }}
      >
        {/* Contenedor del carrusel*/}
        <div
          ref={galleryRef}
          id="gallery"
          className="gallery flex gap-6 py-5 px-4"
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

        {/* Flechas de navegación — fuera del contenedor gallery para no recibir pointer-events: none */}
        <div className="area-controls">
          <button 
            onClick={prev} 
            aria-label="Área anterior" 
            className="area-btn left flex items-center justify-center"
          >
            <ChevronLeftIcon className="h-6 w-6 text-[#f38321]" />
          </button>
          
          <button 
            onClick={next} 
            aria-label="Siguiente área" 
            className="area-btn right flex items-center justify-center"
          >
            <ChevronRightIcon className="h-6 w-6 text-[#f38321]" />
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
        {selectedArea && (
          <Suspense fallback={null}>
            <AreaModal area={selectedArea} onClose={() => setSelectedArea(null)} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}
