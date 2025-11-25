// src/componentsCli/TestimoniosCli.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { getComentarios } from "../../../api/ComentarioApi";
import { Quote, User } from "lucide-react";

export default function TestimoniosCli() {
  const { isDarkMode } = useTheme();
  const [testimonios, setTestimonios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarTestimonios() {
      try {
        const data = await getComentarios();
        setTestimonios(data.slice(0, 9));
      } catch (err) {
        console.error("Error cargando testimonios:", err);
      } finally {
        setLoading(false);
      }
    }
    cargarTestimonios();
  }, []);

  return (
    <section
      id="testimonios"
      className={`relative py-24 px-4 md:px-8 overflow-hidden ${
        isDarkMode ? 'bg-[#0f1213]' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2
            className="text-3xl md:text-5xl font-black tracking-tighter"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna testimonios */}
            <div className="flex flex-col gap-4">
              {testimonios.map((t, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <motion.div
                    key={t.idComentario || index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[85%] p-6 rounded-2xl shadow-lg border relative ${
                        isDarkMode
                          ? 'bg-black/40 border-white/10 text-gray-200'
                          : 'bg-white border-gray-200 text-gray-800'
                      }`}
                    >
                      <Quote className={`absolute -top-3 ${isLeft ? '-left-3' : '-right-3'} w-12 h-12 opacity-10`} />
                      <p className="text-lg italic leading-relaxed mb-4" style={{ fontFamily: "var(--font-Balo)" }}>
                        "{t.comentario}"
                      </p>
                      <div className="flex items-center gap-24">
                        {isLeft && (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#41bfb2] to-[#2C7366] flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div className="text-sm">
                          <p className="font-bold" style={{ fontFamily: "var(--font-Alumni)" }}>
                            {t.usuario?.nombre || "Jugador"}
                          </p>
                          <p className="opacity-70">
                            {new Date(t.fecha).toLocaleDateString("es-ES", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        {!isLeft && (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#41bfb2] to-[#2C7366] flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Columna imagen */}
            <div className="flex justify-center items-start">
              <div
                className="w-full aspect-square rounded-2xl bg-gray-300 dark:bg-gray-700"
                style={{ maxWidth: '500px' }}
              >
                {/* Aquí agregarás tu imagen */}
              </div>
            </div>
          </div>
        )}

        {testimonios.length === 0 && !loading && (
          <p className="text-center text-2xl opacity-70" style={{ fontFamily: "var(--font-Balo)" }}>
            Pronto tendremos los primeros testimonios
          </p>
        )}
      </div>
    </section>
  );
}
