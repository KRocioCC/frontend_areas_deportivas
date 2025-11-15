// src/features/Reserva/pages/SistemaQR.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function SistemaQR() {
  const navigate = useNavigate();

  return (
    <section className="pt-[60px] px-4 sm:px-6 md:px-12 w-full max-w-4xl mx-auto text-center">
      <motion.h2
        className="text-3xl sm:text-4xl font-[var(--font-Oswald)] font-bold text-[var(--color-p-1)] mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Sistema QR
      </motion.h2>

      <motion.p
        className="text-[var(--color-p-4)] mb-6 text-base sm:text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Con nuestro sistema QR, tus reservas se activan automáticamente al llegar. Cada código tiene un límite de acceso definido para garantizar seguridad y control.
      </motion.p>

      <motion.button
        onClick={() => navigate("/reservar/qr/acceso")}
        className="bg-gradient-to-r from-[var(--color-p-1)] to-[var(--color-p-2)] text-white font-[var(--font-josefin)] font-bold px-6 py-3 rounded-xl shadow-sm hover:scale-105 transition-transform duration-300"
        whileHover={{ scale: 1.03 }}
      >
        Ver Ejemplo QR
      </motion.button>
    </section>
  );
}
