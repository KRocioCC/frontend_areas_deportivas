// src/componentsCli/CanchasDestacadas.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { getCanchasActivas } from "../../../api/CanchaApi"; 
import { getComentariosPorCancha } from "../../../api/ComentarioApi";
import { Star, MapPin, Clock, Users } from "lucide-react";
import CardCancha from "./CanchaCard";
export default function CanchasDestacadas() {
  const { isDarkMode } = useTheme();
  const [canchasTop, setCanchasTop] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarCanchasDestacadas() {
      try {
        const todas = await getCanchasActivas();
        const conPromedio = await Promise.all(
          todas.map(async (cancha) => {
            try {
              const comentarios = await getComentariosPorCancha(cancha.idCancha);
              const promedio = comentarios.length > 0
                ? (comentarios.reduce((a, c) => a + c.calificacion, 0) / comentarios.length).toFixed(1)
                : 0;
              return { ...cancha, promedio: Number(promedio), totalResenas: comentarios.length };
            } catch (err) {
              return { ...cancha, promedio: 0, totalResenas: 0 };
            }
          })
        );

        // Ordenamos por promedio ↓ y luego por cantidad de reseñas
        const ordenadas = conPromedio
          .filter(c => c.promedio > 0)
          .sort((a, b) => b.promedio - a.promedio || b.totalResenas - a.totalResenas)
          .slice(0, 6); // Top 6

        setCanchasTop(ordenadas);
      } catch (error) {
        console.error("Error cargando canchas destacadas:", error);
      } finally {
        setLoading(false);
      }
    }
    cargarCanchasDestacadas();
  }, []);

  return (
    <>
      <section
        id="canchas"
        className={`relative py-24 px-4 md:px-8 overflow-hidden ${
          isDarkMode ? 'bg-gradient-to-b from-[#0f1213] via-[#0a0e0f] to-[#0f1213]' 
                    : 'bg-gradient-to-b from-gray-50 via-white to-gray-50'
        }`}
      >
        {/* Fondo sutil con formas deportivas (no recto, como pediste) */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[#41bfb2] blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full bg-[#f28627] blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] 
                          rotate-45 bg-[#41bfb2]/10 blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Título ÉPICO */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <h2
              className="text-4xl md:text-6xl font-black tracking-tighter"
              style={{ fontFamily: "var(--font-Oswald)" }}
            >
              <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                CANCHAS
              </span>{" "}
              <span className={isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}>
                MÁS VALORADAS
              </span>
            </h2>
            <p
              className="mt-6 text-xl md:text-2xl opacity-90"
              style={{ fontFamily: "var(--font-Alumni)" }}
            >
              Las favoritas de la comunidad en La Paz
            </p>
          </motion.div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-3xl h-96 animate-pulse" />
              ))}
            </div>
          )}

          {/* Grid de canchas destacadas */}
          {/* GALERÍA DINÁMICA – 3 NIVELES */}
          <div className="space-y-16">

            {/* 🟩 NIVEL 1 — 2 tarjetas grandes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {canchasTop.slice(0, 2).map((cancha, index) => (
                <motion.div
                  key={cancha.idCancha}
                  initial={{ opacity: 0, y: 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-3xl overflow-hidden shadow-2xl border 
                            group cursor-pointer h-[420px]"
                >
                  <CardCancha cancha={cancha} index={index} isDarkMode={isDarkMode} />
                </motion.div>
              ))}
            </div>

            {/* 🟧 NIVEL 2 — 3 tarjetas medianas tipo mosaico */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {canchasTop.slice(2, 5).map((cancha, subIndex) => (
                <motion.div
                  key={cancha.idCancha}
                  initial={{ opacity: 0, y: 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  whileHover={{ y: -10 }}
                  className="relative rounded-3xl overflow-hidden shadow-xl border 
                            group cursor-pointer h-[360px]"
                >
                  <CardCancha cancha={cancha} index={subIndex + 2} isDarkMode={isDarkMode} />
                </motion.div>
              ))}
            </div>

            {/* 🟥 NIVEL 3 — 1 tarjeta XL full width */}
            {canchasTop[5] && (
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                whileHover={{ scale: 1.01 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl border 
                          group cursor-pointer h-[500px]"
              >
                <CardCancha cancha={canchasTop[5]} index={5} isDarkMode={isDarkMode} />
              </motion.div>
            )}

          </div>



          {canchasTop.length === 0 && !loading && (
            <p className="text-center text-xl opacity-70" style={{ fontFamily: "var(--font-Balo)" }}>
              Pronto tendremos las canchas más valoradas
            </p>
          )}
        </div>
      </section>
    </>
  );
}