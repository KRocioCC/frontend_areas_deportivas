// src/features/Info/MisionVision.jsx
import { motion } from "framer-motion";
import "./MisionVision.css";
import { FaBullseye, FaRocket } from "react-icons/fa";

export default function MisionVision() {
  return (
    <section id="misionvision" className="mv-container">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mv-title"
      >
        Lo que nos mueve cada día
      </motion.h2>

      <div className="mv-content">
        <motion.div 
          className="mv-card"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaBullseye className="mv-icon" />
          <h3>Misión</h3>
          <p>
            Brindar servicios accesibles, seguros y personalizados que se adapten
            a cada necesidad, con atención humana y tecnología confiable.
          </p>
        </motion.div>

        <motion.div 
          className="mv-card"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaRocket className="mv-icon" />
          <h3>Visión</h3>
          <p>
            Ser reconocidos como una empresa cercana, flexible y confiable,
            que transforma la forma en que las personas reservan y pagan por servicios.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
