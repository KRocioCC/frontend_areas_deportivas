// src/componentsCli/TestimoniosCli.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { getComentarios } from "../../../api/ComentarioApi"; // ← tú ya tienes esta o la creas
import { Star, Quote, User } from "lucide-react";

export default function TestimoniosCli() {
  const { isDarkMode } = useTheme();
  const [testimonios, setTestimonios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarTestimonios() {
      try {
        // Esta API debe devolver los últimos comentarios con 5 estrellas (ordenados por fecha desc)
        const data = await getComentarios(); 
        setTestimonios(data.slice(0, 9)); // Máximo 9 para el layout bonito
      } catch (err) {
        console.error("Error cargando testimonios:", err);
      } finally {
        setLoading(false);
      }
    }
    cargarTestimonios();
  }, []);

  // Layout tipo "masonry" pero sin librerías → puro CSS Grid + alturas variables
  return (
    <>
      {/* TRANSICIÓN SUPERIOR – conecta perfecto con CanchasDestacadas */}
      <div className={`-mt-1 h-32 ${isDarkMode ? 'bg-[#0f1213]' : 'bg-white'}`}>
        <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <path
            fill={isDarkMode ? "#0f1213" : "#FFFFFF"}
            d="M0,96 C360,200 1080,20 1440,96 L1440,320 L0,320 Z"
            opacity="0.9"
          />
        </svg>
      </div>

      <section
        id="testimonios"
        className={`relative py-24 px-4 md:px-8 overflow-hidden ${
          isDarkMode ? 'bg-[#0f1213]' : 'bg-gray-50'
        }`}
      >
        {/* Fondo sutil con onda deportiva */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 -left-40 w-96 h-96 rounded-full bg-[#41bfb2] blur-3xl" />
          <div className="absolute bottom-10 -right-40 w-96 h-96 rounded-full bg-[#f28627] blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Título brutal */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2
              className="text-5xl md:text-8xl font-black tracking-tighter"
              style={{ fontFamily: "var(--font-Oswald)" }}
            >
              <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                LO QUE DICEN
              </span>{" "}
              <span className={isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}>
                NUESTROS JUGADORES
              </span>
            </h2>
            <p className="mt-6 text-xl md:text-2xl opacity-90" style={{ fontFamily: "var(--font-Alumni)" }}>
              Solo comentarios reales con 5 estrellas
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
              {testimonios.map((t, index) => (
                <motion.div
                  key={t.idComentario || index}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  className={`relative p-8 rounded-3xl shadow-2xl border transition-all hover:scale-105 ${
                    isDarkMode
                      ? 'bg-black/40 backdrop-blur-md border-white/10'
                      : 'bg-white/80 backdrop-blur-md border-gray-200'
                  }`}
                  style={{
                    gridRowEnd: `span ${index % 3 === 0 ? 28 : index % 4 === 1 ? 34 : 30}` // Alturas variables
                  }}
                >
                  {/* Comillas decorativas */}
                  <Quote className={`absolute -top-4 -left-2 w-20 h-20 opacity-10 ${
                    isDarkMode ? 'text-[#2C7366]' : 'text-[#41bfb2]'
                  }`} />

                  {/* Estrellas */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Comentario */}
                  <p
                    className={`text-lg leading-relaxed mb-6 italic opacity-95 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}
                    style={{ fontFamily: "var(--font-Balo)" }}
                  >
                    "{t.comentario}"
                  </p>

                  {/* Usuario + fecha */}
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#41bfb2] to-[#2C7366] flex items-center justify-center">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold" style={{ fontFamily: "var(--font-Alumni)" }}>
                        {t.usuario?.nombre || "Jugador"}
                      </p>
                      <p className="text-sm opacity-70">
                        {new Date(t.fecha).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {testimonios.length === 0 && !loading && (
            <p className="text-center text-2xl opacity-70" style={{ fontFamily: "var(--font-Balo)" }}>
              Pronto tendremos los primeros testimonios
            </p>
          )}
        </div>

        {/* TRANSICIÓN INFERIOR – listo para Contacto */}
        <div className={`absolute bottom-0 left-0 right-0 -mb-1 h-32 overflow-hidden`}>
          <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
            <path
              fill={isDarkMode ? "#0f1213" : "#FFFFFF"}
              d="M0,160 C320,60 1120,280 1440,160 L1440,0 L0,0 Z"
              opacity="0.9"
            />
          </svg>
        </div>
      </section>
    </>
  );
}