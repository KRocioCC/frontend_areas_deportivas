// src/pages/SobreNosotros.jsx
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../../context/ThemeContext";
import { Users, Target, Trophy, Heart, Sparkles } from "lucide-react";

export default function SobreNosotros() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#0f1213]" : "bg-white"} overflow-hidden`}>
      
      {/* Hero con onda suave */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center relative z-10"
          >
            <h1
              className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight mb-8"
              style={{ fontFamily: "var(--font-Oswald)" }}
            >
              <span className={isDarkMode ? "text-white" : "text-black"}>
                SOBRE NOSOTROS
              </span>
            </h1>
            <p
              className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
              style={{ fontFamily: "var(--font-Balo)" }}
            >
              Somos más que una plataforma de reservas. Somos el punto de encuentro donde el deporte, 
              la pasión y la comunidad se encuentran todos los días.
            </p>
          </motion.div>

          {/* Onda decorativa */}
          <div className="absolute inset-0 -z-10">
            <div className={`absolute top-20 left-0 w-96 h-96 rounded-full blur-3xl opacity-20
              ${isDarkMode ? "bg-[#2C7366]" : "bg-[#41bfb2]"}`} />
            <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20
              ${isDarkMode ? "bg-[#f35734]" : "bg-[#f28627]"}`} />
          </div>
        </div>
      </section>

      {/* ¿Quiénes Somos? */}
      <section id="nosotros" className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2
                className={`text-3xl md:text-6xl font-bold mb-8 leading-tight
                  ${isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}`}
                style={{ fontFamily: "var(--font-Alumni)" }}
              >
                ¿Quiénes Somos?
              </h2>
              <p
                className={`text-lg md:text-xl leading-relaxed mb-6 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
                style={{ fontFamily: "var(--font-Balo)" }}
              >
                Nacimos en 2023 con una idea simple: <strong>hacer que jugar sea fácil</strong>.
                Vimos que reservar una cancha era complicado, caro y lleno de trabas. 
                Decidimos cambiar eso.
              </p>
              <p
                className={`text-lg md:text-xl leading-relaxed ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
                style={{ fontFamily: "var(--font-Balo)" }}
              >
                Hoy somos la plataforma líder en reservas deportivas en tu ciudad, 
                conectando a miles de jugadores con las mejores canchas, 24/7, 
                con pagos flexibles y acceso instantáneo por QR.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1575361208107-2f7c32b2a0bb?w=800&q=80"
                  alt="Equipo jugando fútbol"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`absolute -bottom-6 -left-6 p-6 rounded-3xl shadow-xl
                ${isDarkMode ? "bg-[#1a1f21]" : "bg-[#f2efeb]"}`}>
                <Sparkles className={`${isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}`} size={40} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section id="misionvision" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Misión */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`p-10 rounded-3xl shadow-xl relative overflow-hidden
                ${isDarkMode ? "bg-[#1a1f21]" : "bg-[#f2efeb]"}`}
            >
              <Target size={60} className={`${isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"} mb-6`} />
              <h3 className={`text-4xl font-bold mb-6`} style={{ fontFamily: "var(--font-Alumni)" }}>
                Nuestra Misión
              </h3>
              <p className={`text-lg leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                 style={{ fontFamily: "var(--font-Balo)" }}>
                Democratizar el acceso al deporte. Que nadie deje de jugar por falta de cancha, 
                tiempo o dinero. Queremos que reserves en 60 segundos y llegues directo a disfrutar.
              </p>
            </motion.div>

            {/* Visión */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`p-10 rounded-3xl shadow-xl relative overflow-hidden
                ${isDarkMode ? "bg-[#1a1f21]" : "bg-[#f2efeb]"}`}
            >
              <Trophy size={60} className={`${isDarkMode ? "text-[#f35734]" : "text-[#f28627]"} mb-6`} />
              <h3 className={`text-4xl font-bold mb-6`} style={{ fontFamily: "var(--font-Alumni)" }}>
                Nuestra Visión
              </h3>
              <p className={`text-lg leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                 style={{ fontFamily: "var(--font-Balo)" }}>
                Ser la app que todo deportista lleva en el bolsillo. 
                Donde encuentres cancha, armes equipo, pagues fácil y vivas el deporte sin complicaciones.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section id="equipo" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2
              className={`text-5xl md:text-6xl font-bold mb-6
                ${isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}`}
              style={{ fontFamily: "var(--font-Alumni)" }}
            >
              Nuestro Equipo
            </h2>
            <p className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
               style={{ fontFamily: "var(--font-Balo)" }}>
              Apasionados del deporte que construimos esta plataforma jugando y sudando la camiseta.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Mateo", rol: "Fundador & CEO", img: "https://i.pravatar.cc/300?img=1" },
              { name: "Lucía", rol: "Operaciones", img: "https://i.pravatar.cc/300?img=5" },
              { name: "Diego", rol: "Desarrollo", img: "https://i.pravatar.cc/300?img=12" },
              { name: "Camila", rol: "Atención al cliente", img: "https://i.pravatar.cc/300?img=8" }
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className={`rounded-3xl overflow-hidden shadow-xl transition-transform group-hover:scale-105`}>
                  <img src={member.img} alt={member.name} className="w-full aspect-square object-cover" />
                  <div className={`p-6 text-center ${isDarkMode ? "bg-[#1a1f21]" : "bg-[#f2efeb]"}`}>
                    <h4 className="text-xl font-bold" style={{ fontFamily: "var(--font-Alumni)" }}>
                      {member.name}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                       style={{ fontFamily: "var(--font-josefin)" }}>
                      {member.rol}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer call to action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <Heart size={80} className={`mx-auto mb-8 ${isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}`} />
          <p className={`text-2xl md:text-3xl font-medium italic
            ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
             style={{ fontFamily: "var(--font-Balo)" }}>
            No somos solo una app. Somos jugadores que queremos que todos jueguen más.
          </p>
        </div>
      </section>
    </div>
  );
}