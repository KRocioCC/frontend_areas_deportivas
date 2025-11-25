// src/pages/PreguntasFrecuentes.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../../context/ThemeContext";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "¿Puedo cancelar mi reserva?",
    answer: "Sí. Según el tiempo de anticipación:\n• Más de 24 horas → devolución 100%\n• Entre 12 y 24 horas → 70%\n• Menos de 12 horas → sin devolución (salvo fuerza mayor justificada).\nEl reembolso se hace al mismo método en máximo 7 días hábiles."
  },
  {
    question: "¿Puedo reprogramar o cambiar de cancha?",
    answer: "Sí, una vez gratis si lo haces con más de 6 horas de anticipación. Ve a “Mis Reservas” → Reprogramar o Cambiar Cancha. Si la nueva es más cara, pagas la diferencia."
  },
  {
    question: "¿Puedo reservar varias horas seguidas o varias canchas?",
    answer: "Sí, sin límite. Puedes reservar bloques consecutivos o varias canchas al mismo tiempo. Cada reserva se paga por separado."
  },
  {
    question: "¿Qué métodos de pago hay?",
    answer: "• QR y Tarjeta → siempre disponibles\n• Efectivo en cancha → solo si la reserva es para hoy y faltan menos de 12 horas\nTambién ofrecemos pago en 2, 3, 4 o 5 cuotas."
  },
  {
    question: "¿Qué pasa si no completo las cuotas?",
    answer: "Perderás la reserva y los pagos realizados. Te enviamos recordatorios automáticos antes de cada vencimiento."
  },
  {
    question: "¿Qué pasa si mi QR no funciona o lo pierdo?",
    answer: "Entra a “Mis Reservas” y vuelve a generarlo (si aún está activa). Si no carga, el personal valida manualmente con tu nombre y cédula. Siempre hay respaldo."
  },
  {
    question: "¿Cuántos amigos puedo invitar con mi QR?",
    answer: "Depende de la cancha:\n• Fútbol 7/8 → máx. 14 personas\n• Fútbol 5 → máx. 10\n• Tenis/Pádel → máx. 4\nEl límite aparece al reservar."
  },
  {
    question: "¿Qué pasa si llego tarde?",
    answer: "Tienes 10 minutos de tolerancia. Después pierdes el tiempo restante y no hay devolución."
  },
  {
    question: "¿Y si llueve?",
    answer: "• Canchas techadas → se juega sí o sí\n• Canchas al aire libre → reprogramación gratis o reembolso 100% (decide la administración)."
  },
  {
    question: "¿Hay descuentos por reservar seguido?",
    answer: "Sí, automático:\n• 5 reservas al mes → 10% off en la siguiente\n• 10 reservas → 15% off\n• 20 reservas → 20% off"
  },
  {
    question: "¿Puedo reservar sin cuenta?",
    answer: "No, es obligatorio registrarse o iniciar sesión para reservar y generar QR."
  }
];

export default function PreguntasFrecuentes() {
  const { isDarkMode } = useTheme();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className={`min-h-screen pt-20 pb-32 px-6 ${isDarkMode ? "bg-[#0f1213]" : "bg-white"}`}>
      <div className="max-w-4xl mx-auto">

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-20"
          style={{ fontFamily: "var(--font-Oswald)" }}
        >
          <span className={isDarkMode ? "text-white" : "text-black"}>
            PREGUNTAS FRECUENTES
          </span>
        </motion.h1>

        {/* Acordeón */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-2xl overflow-hidden shadow-lg
                ${isDarkMode ? "bg-[#1a1f21]" : "bg-[#f2efeb]"}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={`w-full px-6 py-5 flex justify-between items-center text-left transition-all
                  ${openIndex === index ? "pb-3" : ""}`}
              >
                <h3
                  className={`text-lg sm:text-xl font-semibold pr-8
                    ${isDarkMode ? "text-white" : "text-black"}`}
                  style={{ fontFamily: "var(--font-Alumni)" }}
                >
                  {faq.question}
                </h3>

                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown
                    size={28}
                    className={`${isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}`}
                    strokeWidth={2}
                  />
                </motion.div>
              </button>

              {/* Respuesta */}
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6">
                  <p
                    className={`text-base sm:text-lg leading-relaxed whitespace-pre-line
                      ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    style={{ fontFamily: "var(--font-Balo)" }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Footer sutil */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className={`text-lg italic ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}
             style={{ fontFamily: "var(--font-Balo)" }}>
            ¿Aún tienes dudas? Escríbenos al chat o WhatsApp y te respondemos en minutos.
          </p>
        </motion.div>
      </div>
    </div>
  );
}