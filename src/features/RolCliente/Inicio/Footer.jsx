import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Facebook, Smartphone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0b0d0e] text-[var(--color-pb-4)] pt-14 pb-6 px-6 md:px-14 border-t border-white/5">
      
      {/* CONTENEDOR */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* --------- SOBRE NOSOTROS --------- */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl font-[var(--font-Oswald)] text-[var(--color-pb-5)] mb-3"
          >
            QUEJUEGO
          </motion.h3>

          <p className="text-sm font-[var(--font-Balo)] leading-relaxed text-[var(--color-pb-4)]/90">
            Creamos experiencias simples, confiables y humanas.  
            Nuestro compromiso es brindarte comodidad, rapidez y seguridad,
            desde la reserva hasta el pago.
          </p>
        </div>

        {/* --------- ENLACES RÁPIDOS --------- */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl font-[var(--font-Oswald)] text-[var(--color-pb-5)] mb-4"
          >
            Enlaces
          </motion.h3>

          <ul className="space-y-2 text-sm font-[var(--font-Balo)]">
            <li><a href="#inicio" className="hover:text-[var(--color-pb-2)] transition cursor-pointer">Inicio</a></li>
            <li><a href="#servicios" className="hover:text-[var(--color-pb-2)] transition cursor-pointer">Servicios</a></li>
            <li><a href="#quienes-somos" className="hover:text-[var(--color-pb-2)] transition cursor-pointer">¿Quiénes Somos?</a></li>
            <li><a href="#reservas" className="hover:text-[var(--color-pb-2)] transition cursor-pointer">Reservas</a></li>
          </ul>

        </div>

        {/* --------- CONTACTO --------- */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl font-[var(--font-Oswald)] text-[var(--color-pb-5)] mb-4"
          >
            Contacto
          </motion.h3>

          <div className="space-y-3 text-sm font-[var(--font-Balo)]">

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[var(--color-pb-5)]" />
              <span>correo@empresa.com</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[var(--color-pb-5)]" />
              <span>+591 70000000</span>
            </div>

            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-[var(--color-pb-5)]" />
              <span>WhatsApp disponible 24/7</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[var(--color-pb-5)]" />
              <span>La Paz - Bolivia</span>
            </div>

          </div>

          {/* REDES */}
          <div className="flex items-center gap-4 mt-5">
            <Facebook className="w-5 h-5 cursor-pointer hover:text-white transition" />
            <Instagram className="w-5 h-5 cursor-pointer hover:text-white transition" />
          </div>
        </div>

      </div>

      {/* DIVISOR */}
      <div className="w-full mt-10 border-t border-white/10"></div>

      {/* COPY */}
      <p className="text-center mt-5 text-xs font-[var(--font-josefin)] text-[var(--color-pb-4)]/70">
        © {new Date().getFullYear()} QUEJUEGO — Todos los derechos reservados.
      </p>
    </footer>
  );
}
