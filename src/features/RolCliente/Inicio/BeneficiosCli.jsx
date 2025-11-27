import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { 
  Shield, Zap, QrCode, Users, CalendarCheck, Gift,
} from "lucide-react";

const beneficios = [
  { title: "Reserva en segundos", subtitle: "24/7 desde tu celular", icon: Zap, delay: 0.1 },
  { title: "Acceso directo con QR", subtitle: "Sin filas ni esperas", icon: QrCode, delay: 0.2 },
  { title: "Invita a tus amigos", subtitle: "Comparte el acceso QR con tu equipo", icon: Users, delay: 0.3 },
  { title: "Pago 100% seguro", subtitle: "QR · Tarjeta · Transferencia", icon: Shield, delay: 0.4 },
  { title: "Cancelación flexible", subtitle: "Hasta 12 horas antes", icon: CalendarCheck, delay: 0.5 },
  { title: "Promociones exclusivas", subtitle: "Cumpleaños, torneos y más", icon: Gift, delay: 0.6 },
];

export default function BeneficiosCli() {
  const { isDarkMode } = useTheme();

  return (
    <>
      {/* Beneficios */}
      <section 
        id="beneficios"
        className={`relative py-28 px-4 md:px-10 overflow-hidden borde-0`}
      >
        {/* FONDO NUEVO DE LA SECCIÓN */}
        <div 
          className={`absolute inset-0 -z-10 transition-colors duration-300`}
          style={{
            background: isDarkMode ? "#000000ff" : "#000000ff",
          }}
        />

        <div className="max-w-6xl mx-auto relative z-20">

          {/* Título */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-center mb-20"
          >
            <h2 
              className="text-5xl md:text-6xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-Oswald)" }}
            >
              <span className={isDarkMode ? "text-white" : "text-gray-900"}>BENEFICIOS</span>{" "}
              <span className={isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}>EXCLUSIVOS</span>
            </h2>

            <p 
              className="mt-6 text-xl md:text-2xl opacity-90 max-w-3xl mx-auto"
              style={{ fontFamily: "var(--font-Alumni)" }}
            >
              La forma más rápida y cómoda de jugar en las mejores canchas de La Paz
            </p>
          </motion.div>

          {/* GRID de Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

            {beneficios.map((b, index) => {
              const Icon = b.icon;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: b.delay }}
                  className="group z-20"
                >
                  <div 
                    className={`relative p-8 rounded-3xl transition-all duration-500 border z-20
                      ${isDarkMode 
                        ? "bg-black/20 border-white/10 shadow-md" 
                        : "bg-white border-gray-200 shadow-xl"} 
                      hover:shadow-2xl hover:-translate-y-1`}
                  >

                    {/* Icono Moderno */}
                    <div 
                      className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center 
                        shadow-md mb-6 transition-all duration-500
                        ${isDarkMode ? "bg-[#2C7366]/20" : "bg-[#41bfb2]/15"}`}
                    >
                      <Icon className="w-8 h-8 text-[#41bfb2]" />
                    </div>

                    <h3 
                      className={`text-2xl font-bold mb-2 text-center`}
                      style={{ fontFamily: "var(--font-Alumni)" }}
                    >
                      {b.title}
                    </h3>

                    <p 
                      className={`text-center text-lg opacity-80 leading-relaxed 
                        ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                      style={{ fontFamily: "var(--font-Balo)" }}
                    >
                      {b.subtitle}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-44 -z-10">
          <svg 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none" 
            className="w-full h-full"
          >
            <polygon 
              points="0,100 100,80 100,100 0,100" 
              fill={isDarkMode ? "#34a4dcff" : "#e30505ff"}
            />
          </svg>
        </div>
      </section>
    </>
  );
}
