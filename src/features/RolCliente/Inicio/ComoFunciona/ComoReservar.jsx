// src/pages/ComoReservar.jsx
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../../context/ThemeContext";
import { 
  MapPin, 
  Calendar, 
  UserCheck, 
  CheckCircle2 
} from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Selección de Cancha y Disciplina",
    icon: MapPin,
    description:
      "Elige la cancha que más te guste y selecciona la disciplina que vas a practicar. Si aún no tienes cuenta, te pediremos que inicies sesión o te registres — ¡es rápido!",
  },
  {
    number: "2",
    title: "Elige tu Horario",
    icon: Calendar,
    description:
      "Te mostramos en tiempo real todos los horarios disponibles. Solo puedes reservar un bloque continuo. ¡Los horarios se actualizan al instante!",
  },
  {
    number: "3",
    title: "Confirma tus Datos",
    icon: UserCheck,
    description:
      "Revisa que tu nombre, teléfono y correo estén correctos. Si todo está bien, avanzas al resumen final.",
  },
  {
    number: "4",
    title: "Revisa y Acepta",
    icon: CheckCircle2,
    description:
      "Verás el detalle completo: cancha, horario y precio total. Acepta los términos y confirma tu reserva.",
  },
];

export default function ComoReservar() {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`min-h-screen pt-20 pb-20 px-5 ${
        isDarkMode ? "bg-[#0f1213]" : "bg-white"
      }`}
    >
      <div className="max-w-5xl mx-auto">

        {/* TÍTULO */}
        <motion.h1
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-14"
          style={{ fontFamily: "var(--font-Oswald)" }}
        >
          <span className={isDarkMode ? "text-white" : "text-black"}>
            ¿CÓMO RESERVAR?
          </span>
        </motion.h1>

        {/* STEPS */}
        <div className="space-y-20 md:space-y-28">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: isEven ? -60 : 60,
                }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                }}
                className={`flex flex-col ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                } 
                gap-10 md:gap-14 items-center justify-center`}
              >
                {/* NÚMERO */}
                <div className="flex-shrink-0">
                  <div
                    className={`text-[90px] sm:text-[110px] md:text-[135px] font-black 
                      opacity-15 select-none leading-none 
                      ${isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}`}
                    style={{ fontFamily: "var(--font-Oswald)" }}
                  >
                    {step.number}
                  </div>
                </div>

                {/* CONTENIDO */}
                <div className="flex-1 max-w-xl text-center md:text-left space-y-5">
                  
                  {/* Título */}
                  <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`text-2xl sm:text-3xl md:text-4xl font-bold leading-tight
                      ${
                        isDarkMode
                          ? index === 2
                            ? "text-[#f35734]"
                            : "text-[#2C7366]"
                          : index === 2
                          ? "text-[#f28627]"
                          : "text-[#41bfb2]"
                      }`}
                    style={{ fontFamily: "var(--font-Alumni)" }}
                  >
                    {step.title}
                  </motion.h2>

                  {/* Descripción */}
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className={`text-base sm:text-lg leading-relaxed 
                      ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    style={{ fontFamily: "var(--font-Balo)" }}
                  >
                    {step.description}
                  </motion.p>

                  {/* Ícono */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center md:justify-start pt-3"
                  >
                    <div
                      className={`p-7 rounded-2xl shadow-md
                      ${isDarkMode ? "bg-[#1a1f21]" : "bg-[#f4f1ed]"}`}
                    >
                      <step.icon
                        size={55}
                        className={`${
                          isDarkMode
                            ? index === 2
                              ? "text-[#f35734]"
                              : "text-[#2C7366]"
                            : index === 2
                            ? "text-[#f28627]"
                            : "text-[#41bfb2]"
                        }`}
                        strokeWidth={1.5}
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Texto final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-24"
        >
          <p
            className={`text-lg sm:text-xl md:text-2xl font-medium italic
              ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            style={{ fontFamily: "var(--font-Balo)" }}
          >
            ¡En menos de 2 minutos tienes tu cancha reservada y lista para jugar!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
