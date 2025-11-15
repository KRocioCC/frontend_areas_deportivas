// src/features/Reserva/components/AnimacionTransicion.jsx
import { motion } from "framer-motion";

export default function AnimacionTransicion({ children, direction = "right" }) {
  const variants = {
    initial: { x: direction === "right" ? "100%" : "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { x: direction === "right" ? "-100%" : "100%", opacity: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      className="min-h-screen w-full"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
