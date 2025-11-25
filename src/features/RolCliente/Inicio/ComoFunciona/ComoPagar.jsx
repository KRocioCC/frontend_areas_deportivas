// src/pages/ComoPagar.jsx
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../../context/ThemeContext";
import { 
  CreditCard, 
  QrCode, 
  Wallet, 
  CalendarCheck,
  CheckCircle2,
  LogIn
} from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Accede a Mis Reservas",
    icon: LogIn,
    description: "Debes estar logueado para ver esta sección. En “Mis Reservas” aparecen todas tus reservas activas con cancha, disciplina, horario y estado actual. Desde aquí puedes cancelar o reprogramar sin costo (si aplica).",
  },
  {
    number: "2",
    title: "Elige tu Tipo de Pago",
    icon: Wallet,
    description: "Al hacer clic en “Pagar”, eliges entre tres opciones:\n• Pago Total (de una vez)\n• Pago Anticipado (2 cuotas)\n• Pago Parcial (3 a 5 cuotas fijas o personalizadas)\nSegún el tipo, se habilitan los métodos disponibles.",
  },
  {
    number: "3",
    title: "Métodos Disponibles",
    icon: CreditCard,
    description: "• QR y Tarjeta → siempre disponibles\n• Efectivo → solo si la reserva es para hoy y faltan menos de 12 horas\nPago Total habilita los 3 métodos. Anticipado y Parcial solo QR + Tarjeta.",
  },
  {
    number: "4",
    title: "Confirma y Listo",
    icon: CheckCircle2,
    description: "Completa el pago siguiendo las instrucciones. Recibirás confirmación inmediata y el estado cambiará a “Pagada”. Si elegiste cuotas, te enviaremos recordatorios automáticos por email.",
  }
];

export default function ComoPagar() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen pt-20 pb-24 px-6 ${isDarkMode ? "bg-[#0f1213]" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto">

        {/* Título Principal */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-20"
          style={{ fontFamily: "var(--font-Oswald)" }}
        >
          <span className={isDarkMode ? "text-white" : "text-black"}>
            ¿CÓMO PAGAR?
          </span>
        </motion.h1>

        {/* Pasos */}
        <div className="space-y-28 md:space-y-36">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isEven ? -80 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.9, delay: index * 0.2, ease: "easeOut" }}
                className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} 
                           gap-12 md:gap-20 items-center justify-center`}
              >

                {/* Número grande sutil */}
                <div className="flex-shrink-0">
                  <div
                    className={`text-[130px] sm:text-[150px] md:text-[170px] font-black 
                               leading-none opacity-15 select-none
                               ${isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}`}
                    style={{ fontFamily: "var(--font-Oswald)" }}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Contenido refinado */}
                <div className="flex-1 max-w-2xl text-center md:text-left space-y-7">

                  {/* Título elegante y más pequeño */}
                  <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.4 }}
                    className={`text-3xl sm:text-4xl md:text-4xl font-bold leading-snug
                      ${isDarkMode 
                        ? index === 1 || index === 2 ? "text-[#f35734]" : "text-[#2C7366]"
                        : index === 1 || index === 2 ? "text-[#f28627]" : "text-[#41bfb2]"
                      }`}
                    style={{ fontFamily: "var(--font-Alumni)" }}
                  >
                    {step.title}
                  </motion.h2>

                  {/* Descripción clara */}
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 + 0.5 }}
                    className={`text-base sm:text-lg md:text-lg leading-relaxed whitespace-pre-line
                      ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    style={{ fontFamily: "var(--font-Balo)" }}
                  >
                    {step.description}
                  </motion.p>

                  {/* Ícono pequeño y elegante */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 + 0.6 }}
                    className="flex justify-center md:justify-start pt-4"
                  >
                    <div className={`p-7 rounded-3xl shadow-[0_8px_25px_rgba(0,0,0,0.1)]
                      ${isDarkMode ? "bg-[#1a1f21]" : "bg-[#f2efeb]"}`}>
                      <step.icon
                        size={64}
                        className={`${isDarkMode 
                          ? index === 1 || index === 2 ? "text-[#f35734]" : "text-[#2C7366]"
                          : index === 1 || index === 2 ? "text-[#f28627]" : "text-[#41bfb2]"
                        }`}
                        strokeWidth={1.6}
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mensaje final */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-32"
        >
          <p
            className={`text-xl sm:text-2xl md:text-3xl font-medium italic
              ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            style={{ fontFamily: "var(--font-Balo)" }}
          >
            Paga como prefieras y asegura tu cancha al instante.
          </p>
        </motion.div>
      </div>
    </div>
  );
}