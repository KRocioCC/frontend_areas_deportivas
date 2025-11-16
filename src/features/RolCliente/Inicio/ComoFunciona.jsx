// src/features/Reserva/pages/ComoFunciona.jsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

const steps = [
  { title: "Selecciona un área deportiva", img: "/contenido/step1.png" },
  { title: "Elige una cancha y disciplina", img: "/contenido/step2.png" },
  { title: "Accede a horarios disponibles", img: "/contenido/step3.png" },
  { title: "Confirma tus datos", img: "/contenido/step4.png" },
  { title: "Elige el tipo de pago", img: "/contenido/step5.png" },
  { title: "Realiza tu pago", img: "/contenido/step6.png" },
  { title: "Genera tu código QR", img: "/contenido/step7.png" },
  { title: "Invita acompañantes con QR personalizado", img: "/contenido/step8.png" },
];

export default function ComoFunciona() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Línea se dibuja desde arriba hacia abajo
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-red-900 via-red-800 to-black"
    >
      {/* Título */}
      <motion.h2
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 text-center pt-16 pb-12 text-4xl md:text-6xl font-bold text-orange-100"
      >
        Cómo Reservar
      </motion.h2>

      {/* Línea central gruesa + dashed */}
      <div className="absolute left-1/2 z-10 top-40 w-4 -translate-x-1/2 h-full pointer-events-none">
        {/* Línea de fondo (gruesa, sólida) */}
        <div className="absolute inset-0 w-full bg-orange-600/20 rounded-full" />

        {/* Línea dashed que se dibuja */}
        <motion.div
          className="absolute top-0 z-12 inset-0 w-full bg-white rounded-full"
          style={{
            height: lineHeight,
          }}
        />

        {/* Punto de inicio */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-orange-400 rounded-full border-4 border-white shadow-lg"
        />
      </div>

      {/* Pasos */}
      <div className="relative absolute top-[-40px]  z-30 max-w-5xl mx-auto px-6 md:px-12">
        <div className="space-y-32 md:space-y-48 pt-32 pb-32">
          {steps.map((step, i) => {
            const direction = i % 2 === 0 ? -1 : 1;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: direction * 150, scale: 0.7 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`flex items-center gap-8 md:gap-12 ${
                  i % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`
                    flex items-center gap-6 md:gap-8 max-w-md
                    ${i % 2 === 0 ? "flex-row" : "flex-row-reverse text-right"}
                  `}
                >
                  {/* Ícono */}
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="
                      w-20 h-20 md:w-24 md:h-24 rounded-full
                      bg-orange-200 shadow-2xl
                      flex items-center justify-center
                      border-4 border-orange-500
                      overflow-hidden
                    "
                  >
                    <img
                      src={step.img}
                      alt=""
                      className="w-12 h-12 md:w-14 md:h-14 object-contain"
                    />
                  </motion.div>

                  {/* Texto */}
                  <div>
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl md:text-2xl font-bold text-orange-100 leading-tight"
                    >
                      <span className="text-3xl text-orange-400">{i + 1}</span>.{" "}
                      {step.title}
                    </motion.h3>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Botón final - conectado a la línea */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center pb-32"
        >
          <div className="relative">
            {/* Punto final de la línea */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-orange-400 rounded-full border-4 border-white shadow-lg -mt-3" />

            {/* Botón */}
            <Link
              to="/canchas"
              className="
                relative mt-4 px-10 py-5 text-xl md:text-2xl font-bold
                bg-white text-red-800 rounded-full shadow-2xl
                hover:bg-orange-100 hover:scale-105
                transition-all duration-300
                flex items-center gap-3
                ring-4 ring-orange-500
              "
            >
              Ver Canchas
              <motion.span
                animate={{ x: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}