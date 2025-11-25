// src/features/Info/Nosotros.jsx
import { motion } from "framer-motion";
import "./Nosotros.css";

export default function Nosotros() {
  return (
    <section id="nosotros" className="nosotros-container">
      <motion.div 
        className="nosotros-content"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img 
          src="/Fondos/Deporte1.png"
          alt="Equipo trabajando"
          className="nosotros-img"
        />

        <div className="nosotros-text">
          <h2>Creamos experiencias que conectan</h2>
          <p>
            Somos un equipo comprometido con ofrecer servicios flexibles, seguros y personalizados.
            Creemos que cada cliente merece atención cercana, procesos simples y beneficios reales.
          </p>

          <p>
            Nuestra historia comenzó con una idea sencilla: hacer que reservar y pagar sea fácil, confiable y humano.
            Hoy seguimos creciendo, guiados por la pasión de brindar experiencias que generan confianza y satisfacción.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
