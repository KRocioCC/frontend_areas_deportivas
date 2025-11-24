
import React, { useEffect, useRef } from "react";

export default function QRCode({ value, size = 150, isDarkMode = false }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = isDarkMode ? "#111" : "#fff";
    ctx.fillRect(0, 0, size, size);

    // Dibujar un cuadrado simple como simulación de QR
    ctx.fillStyle = isDarkMode ? "#fff" : "#000";
    const n = 10; // número de bloques
    const block = size / n;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (Math.random() > 0.5) ctx.fillRect(i * block, j * block, block, block);
      }
    }
  }, [value, size, isDarkMode]);

  return <canvas ref={canvasRef} width={size} height={size} className="mx-auto" />;
}
