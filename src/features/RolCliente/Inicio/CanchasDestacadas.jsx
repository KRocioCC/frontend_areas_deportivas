// src/componentsCli/CanchasDestacadas.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { getCanchasActivas } from "../../../api/CanchaApi"; 
import { getComentariosPorCancha } from "../../../api/ComentarioApi";
import { Star, MapPin, Clock, Users } from "lucide-react";

export default function CanchasDestacadas() {
  const { isDarkMode } = useTheme();
  const [canchasTop, setCanchasTop] = useState([]);
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
      {/* TRANSICIÓN SUPERIOR – conecta perfectamente con BeneficiosCli */}
      <div className={`-mt-1 h-32 ${isDarkMode ? 'bg-[#0f1213]' : 'bg-white'}`}>
        <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <path
            fill={isDarkMode ? "#0f1213" : "#FFFFFF"}
            d="M0,160 C320,280 1120,60 1440,160 L1440,0 L0,0 Z"
            opacity="0.9"
          />
        </svg>
      </div>

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

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Título ÉPICO */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-20"
          >
            <h2
              className="text-5xl md:text-8xl font-black tracking-tighter"
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
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            {canchasTop.map((cancha, index) => (
              <motion.div
                key={cancha.idCancha}
                variants={{
                  hidden: { opacity: 0, y: 60 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.7 }}
                whileHover={{ y: -12 }}
                className="group"
              >
                <div
                  className={`relative rounded-3xl overflow-hidden shadow-2xl border transition-all duration-500
                    ${isDarkMode 
                      ? 'bg-black/40 backdrop-blur-md border-white/10' 
                      : 'bg-white/80 backdrop-blur-md border-gray-200'
                    }`}
                >
                  {/* Imagen + overlay */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={cancha.urlImagen || "/placeholder-cancha.jpg"}
                      alt={cancha.nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Ranking badge */}
                    <div className={`absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl
                      ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                        index === 2 ? 'bg-gradient-to-br from-orange-600 to-red-700' :
                        'bg-gradient-to-br from-[#41bfb2] to-[#2C7366]'
                      }`}>
                      {index + 1}
                    </div>

                    {/* Calificación destacada */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full">
                      <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      <span className="text-xl font-bold text-white">{cancha.promedio}</span>
                      <span className="text-sm text-gray-300">({cancha.totalResenas})</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3
                      className="text-2xl md:text-3xl font-bold mb-3"
                      style={{ fontFamily: "var(--font-Alumni)" }}
                    >
                      {cancha.nombre}
                    </h3>

                    <div className="space-y-3 text-sm opacity-90" style={{ fontFamily: "var(--font-Balo)" }}>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#41bfb2]" />
                        <span>{cancha.areaDeportiva?.zona?.nombre || "La Paz"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#f28627]" />
                        <span>Bs {cancha.costoHora}/hora</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#41bfb2]" />
                        <span>Hasta {cancha.capacidad} personas</span>
                      </div>
                    </div>

                    {/* Disciplinas */}
                    <div className="flex flex-wrap gap-2 mt-5">
                      {cancha.disciplinas?.slice(0, 3).map((d) => (
                        <span
                          key={d.idDisciplina}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold
                            ${isDarkMode 
                              ? 'bg-[#2C7366]/30 text-[#2C7366]' 
                              : 'bg-[#41bfb2]/20 text-[#41bfb2]'
                            }`}
                        >
                          {d.nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {canchasTop.length === 0 && !loading && (
            <p className="text-center text-xl opacity-70" style={{ fontFamily: "var(--font-Balo)" }}>
              Pronto tendremos las canchas más valoradas
            </p>
          )}
        </div>

        {/* TRANSICIÓN INFERIOR – para conectar con Testimonios */}
        <div className={`absolute bottom-0 left-0 right-0 -mb-1 h-32 overflow-hidden`}>
          <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
            <path
              fill={isDarkMode ? "#0f1213" : "#FFFFFF"}
              d="M0,96 C360,200 1080,20 1440,96 L1440,320 L0,320 Z"
              opacity="0.9"
            />
          </svg>
        </div>
      </section>
    </>
  );
}