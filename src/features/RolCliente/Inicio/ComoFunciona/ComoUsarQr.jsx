// src/pages/ComoUsarQr.jsx
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../../context/ThemeContext";
import { 
  QrCode, 
  Download, 
  Share2, 
  Smartphone, 
  Clock, 
  Users,
  CheckCircle2
} from "lucide-react";

export default function ComoUsarQr() {
  const { isDarkMode } = useTheme();

  const steps = [
    {
      title: "Se genera automáticamente",
      desc: "Al completar el pago total o la última cuota, tu QR aparece al instante en “Mis Reservas” y te llega por email.",
      icon: QrCode,
    },
    {
      title: "Tiene fecha y hora exacta",
      desc: "Se activa al inicio de tu reserva y expira automáticamente al terminar el horario. Si no lo usas, desaparece para siempre.",
      icon: Clock,
    },
    {
      title: "Descárgalo o muéstralo online",
      desc: "Guárdalo en tu galería o ábrelo directamente desde la web. Funciona sin internet si ya lo descargaste.",
      icon: Download,
    },
    {
      title: "Compártelo con tus amigos",
      desc: "Genera un link de invitación. Tus amigos reclaman su propio QR y entran contigo (máximo según la cancha).",
      icon: Share2,
    },
    {
      title: "Solo escanean y entran",
      desc: "En la entrada de la cancha, el personal o lector escanea tu QR → ¡Acceso inmediato garantizado!",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className={`min-h-screen pt-20 pb-32 px-6 overflow-x-hidden ${isDarkMode ? "bg-[#0f1213]" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto">

        {/* Título principal */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-center text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-24"
          style={{ fontFamily: "var(--font-Oswald)" }}
        >
          <span className={isDarkMode ? "text-white" : "text-black"}>
            ¿CÓMO USAR TU QR?
          </span>
        </motion.h1>

        {/* QR Mockup flotante en el centro (aparece al hacer scroll) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex justify-center my-20 pointer-events-none"
        >
          <div className={`relative p-12 rounded-3xl shadow-2xl
            ${isDarkMode ? "bg-[#1a1f21]" : "bg-[#f2efeb]"}`}>
            <div className="bg-white p-8 rounded-2xl">
              <QrCode size={180} className="text-black" strokeWidth={1} />
            </div>
            <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 
              px-6 py-3 rounded-full text-sm font-semibold
              ${isDarkMode ? "bg-[#2C7366] text-white" : "bg-[#41bfb2] text-black"}`}
              style={{ fontFamily: "var(--font-josefin)" }}>
              Tu pase digital
            </div>
          </div>
        </motion.div>

        {/* Timeline vertical */}
        <div className="relative">
          {/* Línea central */}
          <div className={`absolute left-1/2 transform -translate-x-1/2 w-1 
            ${isDarkMode ? "bg-[#2C7366]/30" : "bg-[#41bfb2]/30"} h-full`} />

          {steps.map((step, index) => {
            const isLeft = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isLeft ? -100 : 100, y: 50 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className={`flex items-center justify-center mb-20 md:mb-32
                  ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                {/* Contenido */}
                <div className={`w-full md:w-5/12 ${isLeft ? "text-right pr-8" : "text-left pl-8"}`}>
                  <div className={`inline-block p-6 rounded-3xl shadow-lg
                    ${isDarkMode ? "bg-[#1a1f21]" : "bg-[#f2efeb]"}`}>
                    <h3 className={`text-2xl md:text-3xl font-bold mb-3
                      ${isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}`}
                      style={{ fontFamily: "var(--font-Alumni)" }}>
                      {step.title}
                    </h3>
                    <p className={`text-base md:text-lg leading-relaxed
                      ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                      style={{ fontFamily: "var(--font-Balo)" }}>
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Punto + ícono */}
                <div className="w-20 h-20 flex-shrink-0 relative z-10">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl
                    ${isDarkMode ? "bg-[#2C7366]" : "bg-[#41bfb2]"}`}>
                    <step.icon size={36} className="text-white" strokeWidth={2} />
                  </div>
                </div>

                {/* Espacio vacío del otro lado */}
                <div className="hidden md:block w-5/12" />
              </motion.div>
            );
          })}
        </div>

        {/* Mensaje final */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mt-32"
        >
          <p className={`text-2xl md:text-3xl font-medium italic max-w-4xl mx-auto
            ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            style={{ fontFamily: "var(--font-Balo)" }}>
            Llega, escanea tu QR y juega.  
            Así de simple, así de rápido.
          </p>
        </motion.div>
      </div>
    </div>
  );
}