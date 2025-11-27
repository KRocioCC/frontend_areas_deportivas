// src/pages/SobreNosotros.jsx
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../../context/ThemeContext";
import { Zap, Shield, Users, QrCode, Target, Eye } from "lucide-react";

export default function SobreNosotros() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#0f1213]" : "bg-gray-50"} overflow-hidden`}>
      
      {/* Hero */}
      <section className="pt-16 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-4xl md:text-5xl font-black mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            style={{ fontFamily: "var(--font-Oswald)" }}
          >
            SOBRE NOSOTROS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-base md:text-lg max-w-2xl mx-auto ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            style={{ fontFamily: "var(--font-Balo)" }}
          >
            Creamos esta app porque buscar una cancha era un dolor de cabeza.  
            Ahora todo es simple, rápido y con tu QR listo al instante.
          </motion.p>
        </div>
      </section>

      {/* Origen */}
      <section id="origen" className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2
                className={`text-2xl md:text-3xl font-bold mb-4 ${isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}`}
                style={{ fontFamily: "var(--font-Alumni)" }}
              >
                ¿Por qué nació esto?
              </h2>
              <p className={`text-sm md:text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                 style={{ fontFamily: "var(--font-Balo)" }}>
                Buscábamos canchas, llamábamos, y o no respondían o ya estaban ocupadas.  
                Decidimos construir una app **hecha por jugadores, para jugadores** —y para quienes gestionan canchas.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="bg-gradient-to-br from-[#41bfb2] to-[#2C7366] p-1 rounded-xl">
                <div className={`w-40 h-40 rounded-xl flex flex-col items-center justify-center ${
                  isDarkMode ? "bg-[#0f1213]" : "bg-white"
                }`}>
                  <QrCode size={48} className="text-[#2C7366]" />
                  <span className="text-xs mt-2 text-center px-2" style={{ fontFamily: "var(--font-Balo)" }}>
                    Acceso instantáneo
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Misión y Visión - SI O SI */}
      <section id="mision-vision" className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Misión */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`p-5 rounded-xl ${
                isDarkMode ? "bg-[#1a1f21] border border-white/10" : "bg-white"
              } shadow-sm`}
            >
              <div className="flex items-start gap-3 mb-3">
                <Target size={28} className={`${isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}`} />
                <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-Alumni)" }}>Misión</h3>
              </div>
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                 style={{ fontFamily: "var(--font-Balo)" }}>
                Hacer que reservar una cancha sea tan fácil como abrir la app.  
                Sin llamadas, sin dudas, con tu QR listo al instante.
              </p>
            </motion.div>

            {/* Visión */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className={`p-5 rounded-xl ${
                isDarkMode ? "bg-[#1a1f21] border border-white/10" : "bg-white"
              } shadow-sm`}
            >
              <div className="flex items-start gap-3 mb-3">
                <Eye size={28} className={`${isDarkMode ? "text-[#f35734]" : "text-[#f28627]"}`} />
                <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-Alumni)" }}>Visión</h3>
              </div>
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                 style={{ fontFamily: "var(--font-Balo)" }}>
                Ser la app que todo deportista usa para jugar sin complicaciones,  
                ya sea solo, en equipo o gestionando su propia cancha.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Valores clave - compacto */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Zap, title: "Rápido", desc: "Reserva en menos de 60 segundos.", color: isDarkMode ? "text-[#f28627]" : "text-[#f28627]" },
              { icon: Shield, title: "Confiable", desc: "Tu QR es tu entrada garantizada.", color: isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]" },
              { icon: Users, title: "Para todos", desc: "Jugadores y administradores en un mismo lugar.", color: isDarkMode ? "text-[#f35734]" : "text-[#f35734]" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-lg text-center ${
                  isDarkMode ? "bg-[#1a1f21] border border-white/5" : "bg-gray-100"
                }`}
              >
                <item.icon size={32} className={`mx-auto mb-2 ${item.color}`} />
                <h4 className="font-bold text-sm mb-1" style={{ fontFamily: "var(--font-Alumni)" }}>
                  {item.title}
                </h4>
                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                   style={{ fontFamily: "var(--font-Balo)" }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Centralización */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}`}
                  style={{ fontFamily: "var(--font-Alumni)" }}>
                Todo en un solo lugar
              </h2>
              <p className={`text-sm md:text-base ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                 style={{ fontFamily: "var(--font-Balo)" }}>
                Gestioná múltiples canchas, áreas deportivas y reservas desde un solo panel.  
                Sin apps externas, sin hojas de cálculo, sin caos.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className={`rounded-lg p-4 w-full max-w-xs ${
                isDarkMode ? "bg-[#1a1f21] border border-white/10" : "bg-gray-100"
              }`}>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="text-center text-xs py-2 rounded bg-gradient-to-r from-[#41bfb2] to-[#2C7366] text-white">
                      Cancha {i}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center">
                  <QrCode size={36} className="text-[#2C7366]" />
                  <span className="text-xs mt-1 text-gray-500">Reserva activa</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cierre */}
      <section className="py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <HeartIcon color={isDarkMode ? "#2C7366" : "#41bfb2"} size={40} className="mx-auto mb-4" />
          <p className={`text-base italic ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
             style={{ fontFamily: "var(--font-Balo)" }}>
            El deporte no debería esperar.  
            <br />
            <span className="font-bold not-italic">¡Debería empezar ya!</span>
          </p>
        </div>
      </section>
    </div>
  );
}

// Icono personalizado para evitar conflicto con Heart de lucide si ya lo usas
const HeartIcon = ({ color, size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
  </svg>
);