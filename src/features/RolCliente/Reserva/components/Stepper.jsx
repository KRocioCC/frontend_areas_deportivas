// src/features/Reserva/components/Stepper.jsx
import React from "react";

export default function Stepper({ step = 1, isDarkMode }) {
  const steps = ["Fecha y horario", "Cliente", "Confirmación"];
  const activeColor = isDarkMode ? "#2C7366" : "#41bfb2";
  const inactiveColor = isDarkMode ? "#4b5563" : "#d1d5db";

  return (
    <div className="flex justify-center gap-6 mb-8">
      {steps.map((label, index) => {
        const current = index + 1 === step;
        const done = index + 1 < step;
        return (
          <div key={label} className="flex flex-col items-center">
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full font-bold text-white"
              style={{
                backgroundColor: done ? activeColor : current ? activeColor : inactiveColor,
              }}
            >
              {index + 1}
            </div>
            <span
              className="mt-2 text-xs text-center"
              style={{ color: current || done ? activeColor : inactiveColor }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
