// src/features/Info/Contacto.jsx
import { motion } from "framer-motion";
import "./Contacto.css";
import { FaEnvelope, FaPhone, FaComments, FaMapMarkerAlt } from "react-icons/fa";

export default function Contacto() {
  return (
    <section id="contacto" className="contact-container">
      <motion.div 
        className="contact-box"
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2>¿Tienes dudas? Estamos para ayudarte</h2>

        <p>
          Escríbenos, llámanos o chatea con nosotros.  
          Nuestro equipo está disponible <strong>24/7</strong>.
        </p>

        <div className="contact-items">
          <div className="item"><FaEnvelope /> contacto@tuservicio.com</div>
          <div className="item"><FaPhone /> +591 70000000</div>
          <div className="item"><FaComments /> Chat en vivo</div>
          <div className="item"><FaMapMarkerAlt /> Dirección (opcional)</div>
        </div>
      </motion.div>
    </section>
  );
}
