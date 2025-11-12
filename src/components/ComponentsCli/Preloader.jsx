// src/componentsCli/Preloader.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader({ onFinish }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      // Espera a que la animación de salida termine antes de llamar a onFinish
      const finishTimer = setTimeout(onFinish, 1000); // 1s para animación de cierre
      return () => clearTimeout(finishTimer);
    }, 3000); // 3 segundos de preloader

    return () => clearTimeout(timer);
  }, [onFinish]);

  // Variants para el logo central
  const logoVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1.2,
      opacity: 1,
      rotate: 5,
      transition: { type: "spring", stiffness: 200, damping: 10 },
    },
    exit: {
      scale: 0,
      opacity: 0,
      rotate: -10,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  // Variants para las cortinas (líneas que se abren)
  const curtainVariants = {
    hidden: { x: 0 },
    left: { x: "-100%" },
    right: { x: "100%" },
  };

  // Variants para el texto
  const textVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { delay: 0.5, duration: 0.8 },
    },
  };

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo central */}
          <motion.div
            className="relative z-20 flex flex-col items-center"
            variants={logoVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.img
              src="/logo.svg"
              alt="Logo ReservaYA"
              className="w-24 h-24 mb-4 filter drop-shadow-lg"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
                transition: {
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                },
              }}
            />
            <motion.h2
              className="text-3xl md:text-4xl font-extrabold text-white tracking-wide text-center"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              ¡Reserva YA!
            </motion.h2>
            <motion.p
              className="text-sm text-gray-300 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Tu próxima cancha te espera
            </motion.p>
          </motion.div>

          {/* Cortina izquierda (líneas que salen hacia la izquierda) */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full flex items-center justify-start px-8"
            variants={curtainVariants}
            initial="hidden"
            animate="left"
            exit="hidden"
            transition={{ duration: 1.5, staggerChildren: 0.1 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`left-${i}`}
                className={`h-1 rounded-full ${
                  i === 0 ? "bg-red-500" :
                  i === 1 ? "bg-orange-500" :
                  i === 2 ? "bg-blue-500" :
                  i === 3 ? "bg-red-400" :
                  "bg-blue-400"
                }`}
                style={{ width: `${80 - i * 10}%`, marginLeft: `${i * 2}px` }}
                variants={{
                  hidden: { scaleX: 0, x: 0 },
                  left: { scaleX: 1, x: 0 },
                }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
              />
            ))}
          </motion.div>

          {/* Cortina derecha (líneas que salen hacia la derecha) */}
          <motion.div
            className="absolute top-0 right-0 w-full h-full flex items-center justify-end px-8"
            variants={curtainVariants}
            initial="hidden"
            animate="right"
            exit="hidden"
            transition={{ duration: 1.5, staggerChildren: 0.1 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`right-${i}`}
                className={`h-1 rounded-full ${
                  i === 0 ? "bg-blue-500" :
                  i === 1 ? "bg-orange-500" :
                  i === 2 ? "bg-red-500" :
                  i === 3 ? "bg-blue-400" :
                  "bg-red-400"
                }`}
                style={{ width: `${80 - i * 10}%`, marginRight: `${i * 2}px` }}
                variants={{
                  hidden: { scaleX: 0, x: 0 },
                  right: { scaleX: 1, x: 0 },
                }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
              />
            ))}
          </motion.div>

          {/* Efecto de brillo radial (opcional) */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ background: "radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 70%)" }}
            animate={{
              background: [
                "radial-gradient(circle, rgba(255,77,77,0.2) 0%, rgba(0,0,0,0) 70%)",
                "radial-gradient(circle, rgba(255,149,0,0.2) 0%, rgba(0,0,0,0) 70%)",
                "radial-gradient(circle, rgba(0,123,255,0.2) 0%, rgba(0,0,0,0) 70%)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}