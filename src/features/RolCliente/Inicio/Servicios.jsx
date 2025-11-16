// src/features/Reserva/pages/Servicios.jsx
import { motion } from "framer-motion";
import { FaFutbol, FaVolleyballBall, FaTableTennis, FaQrcode, FaCreditCard, FaCashRegister, FaShieldAlt } from "react-icons/fa";

const features = [
  {
    icon: <FaFutbol size={32} className="text-[var(--color-p-2)]" />,
    title: "Canchas listas para ti",
    desc: "Reserva tu hora en canchas de fútbol, vóley o tenis de mesa. ¡Disponibles las 24 horas!",
    cta: "Ver disponibilidad",
    color: "var(--color-p-2)",
  },
  {
    icon: <FaQrcode size={32} className="text-[var(--color-p-3)]" />,
    title: "Acceso por QR",
    desc: "Escanea el código al llegar y entra directamente. Sin esperas, sin papel, sin complicaciones.",
    cta: "Cómo funciona",
    color: "var(--color-p-3)",
  },
  {
    icon: <FaCreditCard size={32} className="text-[var(--color-p-5)]" />,
    title: "Paga como quieras",
    desc: "Tarjeta, efectivo, transferencia o QR. Todo seguro y con comprobante automático.",
    cta: "Métodos de pago",
    color: "var(--color-p-5)",
  },
  {
    icon: <FaShieldAlt size={32} className="text-[var(--color-p-1)]" />,
    title: "Reserva segura",
    desc: "Tu pago está protegido. Cancela hasta 2 horas antes sin penalización. ¡Confianza garantizada!",
    cta: "Política de cancelación",
    color: "var(--color-p-1)",
  },
];

export default function Servicios() {
  return (
    <section
      id="servicios"
      className="min-h-screen w-full bg-white py-12 px-4 sm:px-6 md:px-8 flex flex-col justify-center"
    >
      {/* Título principal */}
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl font-[var(--font-Oswald)] font-bold text-center text-[var(--color-p-2)] mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Tu reserva, simple y segura
      </motion.h2>

      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16 font-[var(--font-Balo)]">
        No solo te ofrecemos canchas — te damos la experiencia completa: desde la reserva hasta el último minuto de juego.
      </p>

      {/* Bloques de valor — estilo artículo / feature card */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-4 p-6 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 group cursor-pointer"
            whileHover={{ scale: 1.02, boxShadow: "0 8px 20px -6px rgba(0,0,0,0.05)" }}
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            {/* Icono */}
            <div className="flex-shrink-0 mt-1">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${feature.color}10` }} // color suave
              >
                {feature.icon}
              </div>
            </div>

            {/* Texto */}
            <div className="flex-grow">
              <h3
                className="text-lg font-[var(--font-Alumni)] font-semibold mb-2"
                style={{ color: feature.color }}
              >
                {feature.title}
              </h3>
              <p className="text-gray-700 text-sm font-[var(--font-Balo)] mb-4">
                {feature.desc}
              </p>
              <span
                className="inline-block text-xs font-[var(--font-josefin)] text-gray-500 group-hover:text-gray-700 transition-colors"
              >
                → {feature.cta}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Llamada final — CTA global */}
      <div className="mt-20 text-center">
        <motion.button
          className="px-8 py-3 bg-[var(--color-p-2)] text-white font-[var(--font-josefin)] font-semibold rounded-lg shadow-md hover:bg-[var(--color-p-1)] transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Reservar ahora →
        </motion.button>
      </div>
    </section>
  );
}