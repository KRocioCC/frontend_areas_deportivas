import React, { useState } from "react";
import { motion } from "framer-motion";

export default function FancyButton({
  children = "Add to Cart",
  onClick,
  className = "",
  bgColor = "#000000ff",
  textColor = "#ffffff",
  lineColor = "#fd0000ff",
  hoverColor = "rgba(255, 120, 120, 0.35)", 
  icon: IconRight,
  height = 40,
  borderRadius = 8,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      /*whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}*/
      className={`relative flex items-center font-semibold overflow-hidden shadow-md ${className}`}
      style={{
        fontFamily: "var(--font-josefin)",
        background: bgColor,
        color: textColor,
        height,
        padding: "0 24px",
        borderRadius,
      }}
    >

      {/* LÍNEA DIAGONAL MEJORADA */}
      <div
        style={{
          position: "absolute",
          left: 8,               // más a la derecha
          top: "-45%",           // más larga
          width: 6,              // más delgada
          height: "150%",        // más alta
          background: lineColor,
          transform: "rotate(-15deg)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {/* ANIMACIÓN IZQUIERDA → DERECHA + DERECHA → IZQUIERDA */}
      <motion.span
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          background: hoverColor,
          transformOrigin: hovered ? "left" : "right", // dirección dinámica
          zIndex: 1,
        }}
      />

      {/* CONTENIDO SIEMPRE ADELANTE */}
      <span className="relative z-20 flex items-center gap-2">
        {children}
        {IconRight && <IconRight size={18} />}
      </span>

    </motion.button>
  );
}
