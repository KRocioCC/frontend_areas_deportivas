// src/componentsCli/BeneficiosCli.jsx
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { 
  Shield, 
  Zap, 
  QrCode, 
  Users, 
  CalendarCheck, 
  Gift, 
  Clock, 
  MapPin 
} from "lucide-react";

const beneficios = [
  {
    title: "Reserva en segundos",
    subtitle: "24/7 desde tu celular",
    icon: Zap,
    color: "from-[#41bfb2] to-[#2C7366]",
    delay: 0.1
  },
  {
    title: "Acceso directo con QR",
    subtitle: "Entras sin hacer fila ni esperar",
    icon: QrCode,
    color: "from-[#41bfb2] to-[#2C7366]",
    delay: 0.2
  },
  {
    title: "Invita a tus amigos",
    subtitle: "Comparte el acceso QR con tu equipo",
    icon: Users,
    color: "from-[#f28627] to-[#f35734]",
    delay: 0.3
  },
  {
    title: "Pago 100% seguro",
    subtitle: "QR · Tarjeta · Transferencia",
    icon: Shield,
    color: "from-[#41bfb2] to-[#2C7366]",
    delay: 0.4
  },
  {
    title: "Cancelación flexible",
    subtitle: "Hasta 2 horas antes sin penalidad",
    icon: CalendarCheck,
    color: "from-[#f28627] to-[#f35734]",
    delay: 0.5
  },
  {
    title: "Promociones exclusivas",
    subtitle: "Cumpleaños, torneos y más",
    icon: Gift,
    color: "from-[#41bfb2] to-[#2C7366]",
    delay: 0.6
  }
];

export default function BeneficiosCli() {
  const { isDarkMode } = useTheme();

  return (
    <>
      {/* TRANSICIÓN SUPERIOR CONEXIÓN PERFECTA CON Areadeportiva */}
      <div className={`-mt-1 h-32 ${isDarkMode ? 'bg-[#0f1213]' : 'bg-white'}`}>
        <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <path
            fill={isDarkMode ? "#0f1213" : "#FFFFFF"}
            d="M0,96 C360,200 1080,20 1440,96 L1440,320 L0,320 Z"
            opacity="0.85"
          />
        </svg>
      </div>

      <section 
        id="beneficios"
        className={`relative py-24 px-4 md:px-8 overflow-hidden ${isDarkMode ? 'bg-[#0f1213]' : 'bg-white'}`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Título impactante */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-center mb-20"
          >
            <h2 
              className="text-5xl md:text-7xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-Oswald)" }}
            >
              <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                POR QUÉ RESERVAR
              </span>{" "}
              <span className={isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}>
                CON NOSOTROS
              </span>
            </h2>
            <p 
              className="mt-6 text-xl md:text-2xl opacity-90 max-w-3xl mx-auto"
              style={{ fontFamily: "var(--font-Alumni)" }}
            >
              La forma más rápida y cómoda de jugar en las mejores canchas de La Paz
            </p>
          </motion.div>

          {/* Grid dinámico y moderno (no 4 cards aburridos) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {beneficios.map((beneficio, index) => {
              const Icon = beneficio.icon;
              const isOrange = beneficio.color.includes("f28");

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: beneficio.delay }}
                  className="group"
                >
                  <div 
                    className={`relative p-8 rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                      isDarkMode 
                        ? 'bg-black/30 backdrop-blur-md border border-white/10' 
                        : 'bg-white/70 backdrop-blur-md border border-gray-200 shadow-xl'
                    }`}
                  >
                    {/* Icono con fondo degradado sutil */}
                    <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br ${beneficio.color} ${isDarkMode ? 'opacity-90' : 'opacity-100'}`}>
                      <Icon className="w-9 h-9 text-white" />
                    </div>

                    {/* Contenido */}
                    <div className="mt-10 text-center">
                      <h3 
                        className={`text-2xl md:text-3xl font-bold mb-3 ${
                          isOrange 
                            ? isDarkMode ? 'text-[#f35734]' : 'text-[#f28627]'
                            : isDarkMode ? 'text-[#2C7366]' : 'text-[#41bfb2]'
                        }`}
                        style={{ fontFamily: "var(--font-Alumni)" }}
                      >
                        {beneficio.title}
                      </h3>
                      <p 
                        className={`text-lg leading-relaxed opacity-90 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                        style={{ fontFamily: "var(--font-Balo)" }}
                      >
                        {beneficio.subtitle}
                      </p>
                    </div>

                    {/* Efecto hover sutil */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: isOrange
                          ? "radial-gradient(circle at 30% 30%, rgba(243,87,52,0.15), transparent 70%)"
                          : "radial-gradient(circle at 30% 30%, rgba(65,191,178,0.15), transparent 70%)"
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Extra: toque deportivo sutil en el fondo */}
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-[#41bfb2] blur-3xl" />
            <div className="absolute bottom-32 right-20 w-80 h-80 rounded-full bg-[#f28627] blur-3xl" />
          </div>
        </div>

        {/* TRANSICIÓN INFERIOR FLUIDA para conectar con la siguiente sección */}
        <div className={`absolute bottom-0 left-0 right-0 -mb-1 h-32 overflow-hidden ${isDarkMode ? 'bg-[#0f1213]' : 'bg-white'}`}>
          <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
            <path
              fill={isDarkMode ? "#0f1213" : "#FFFFFF"}
              d="M0,160 C320,280 1120,60 1440,160 L1440,0 L0,0 Z"
              opacity="0.9"
            />
          </svg>
        </div>
      </section>
    </>
  );
}