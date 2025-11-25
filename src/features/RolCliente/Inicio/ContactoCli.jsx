// src/componentsCli/ContactosCli.jsx
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Clock, 
  Send,
  User,
  FileText
} from "lucide-react";
import { useToast } from "../../../context/ToastContext";

export default function ContactosCli() {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("¡Mensaje enviado! Te respondemos en menos de 1 hora", "success");
    e.target.reset();
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/59171234567", "_blank");
  };

  return (
    <>
      {/* TRANSICIÓN SUPERIOR – conecta perfecto con Testimonios */}
      <div className={`-mt-1 h-32 ${isDarkMode ? 'bg-[#0f1213]' : 'bg-white'}`}>
        <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
          <path
            fill={isDarkMode ? "#0f1213" : "#FFFFFF"}
            d="M0,160 C320,60 1120,280 1440,160 L1440,0 L0,0 Z"
            opacity="0.9"
          />
        </svg>
      </div>

      <section
        id="contacto"
        className={`relative py-24 px-4 md:px-8 overflow-hidden ${
          isDarkMode 
            ? 'bg-gradient-to-br from-[#0f1213] via-[#0a0e0f] to-[#0f1213]' 
            : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
        }`}
      >
        {/* Fondo con formas orgánicas y deportivas */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#41bfb2] blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#f28627] blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[800px] 
                          rotate-12 bg-[#41bfb2]/5 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Título FINAL ÉPICO */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2
              className="text-5xl md:text-8xl font-black tracking-tighter"
              style={{ fontFamily: "var(--font-Oswald)" }}
            >
              <span className={isDarkMode ? "text-white" : "text-gray-900"}>
                ¿NECESITAS
              </span>{" "}
              <span className={isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}>
                AYUDA?
              </span>
            </h2>
            <p className="mt-6 text-xl md:text-2xl opacity-90" style={{ fontFamily: "var(--font-Alumni)" }}>
              Estamos aquí 24/7 para que nunca te quedes sin jugar
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* COL 1: Formulario + contacto rápido */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <div className={`rounded-3xl p-8 lg:p-12 shadow-2xl border ${
                isDarkMode 
                  ? 'bg-black/40 backdrop-blur-md border-white/10' 
                  : 'bg-white/80 backdrop-blur-md border-gray-200'
              }`}>
                <h3 className="text-3xl font-bold mb-8" style={{ fontFamily: "var(--font-Alumni)" }}>
                  Escríbenos ahora
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <User className="absolute left-4 top-4 w-6 h-6 text-[#41bfb2]" />
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre"
                      className={`w-full pl-14 pr-6 py-5 rounded-2xl outline-none transition-all text-lg
                        ${isDarkMode 
                          ? 'bg-[#0f1213]/60 placeholder-gray-500 text-white focus:bg-white/10' 
                          : 'bg-white/70 placeholder-gray-600 text-gray-900 focus:bg-white'
                        }`}
                      style={{ fontFamily: "var(--font-Balo)" }}
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-4 w-6 h-6 text-[#41bfb2]" />
                    <input
                      type="email"
                      required
                      placeholder="tu@email.com"
                      className={`w-full pl-14 pr-6 py-5 rounded-2xl outline-none transition-all text-lg
                        ${isDarkMode 
                          ? 'bg-[#0f1213]/60 placeholder-gray-500 text-white focus:bg-white/10' 
                          : 'bg-white/70 placeholder-gray-600 text-gray-900 focus:bg-white'
                        }`}
                      style={{ fontFamily: "var(--font-Balo)" }}
                    />
                  </div>

                  <div className="relative">
                    <FileText className="absolute left-4 top-4 w-6 h-6 text-[#41bfb2]" />
                    <textarea
                      required
                      rows="5"
                      placeholder="¿En qué podemos ayudarte?"
                      className={`w-full pl-14 pr-6 pt-5 rounded-2xl outline-none transition-all text-lg resize-none
                        ${isDarkMode 
                          ? 'bg-[#0f1213]/60 placeholder-gray-500 text-white focus:bg-white/10' 
                          : 'bg-white/70 placeholder-gray-600 text-gray-900 focus:bg-white'
                        }`}
                      style={{ fontFamily: "var(--font-Balo)" }}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-6 rounded-2xl font-bold text-xl text-white shadow-lg transition-all
                      ${isDarkMode 
                        ? 'bg-[#2C7366] hover:bg-[#41bfb2]' 
                        : 'bg-[#41bfb2] hover:bg-[#f28627]'
                      }`}
                    style={{ fontFamily: "var(--font-josefin)" }}
                  >
                    <Send className="inline w-6 h-6 mr-3" />
                    ENVIAR MENSAJE
                  </motion.button>
                </form>

                {/* WhatsApp directo */}
                <motion.button
                  onClick={handleWhatsApp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 w-full py-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-4 text-white shadow-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  style={{ fontFamily: "var(--font-josefin)" }}
                >
                  <MessageCircle className="w-8 h-8" />
                  CHATEAR POR WHATSAPP
                </motion.button>
              </div>
            </motion.div>

            {/* COL 2: Info de contacto + horarios */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="space-y-10"
            >
              {/* Tarjeta contacto rápido */}
              <div className={`rounded-3xl p-10 shadow-2xl border ${
                isDarkMode 
                  ? 'bg-black/40 backdrop-blur-md border-white/10' 
                  : 'bg-white/80 backdrop-blur-md border-gray-200'
              }`}>
                <h3 className="text-4xl font-bold mb-10" style={{ fontFamily: "var(--font-Alumni)" }}>
                  Contáctanos 24/7
                </h3>

                <div className="space-y-8 text-lg">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#41bfb2] flex items-center justify-center">
                      <Phone className="w-9 h-9 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Teléfono / WhatsApp</p>
                      <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-Alumni)" }}>
                        +591 7123-4567
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#f28627] flex items-center justify-center">
                      <Mail className="w-9 h-9 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-xl">hola@tucancha.bo</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-[#2C7366] flex items-center justify-center">
                      <Clock className="w-9 h-9 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Atención</p>
                      <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-Alumni)" }}>
                        24 horas · 7 días
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini mapa (opcional futuro) */}
              <div className={`rounded-3xl h-64 bg-gray-200 dark:bg-gray-800 border-2 border-dashed border-gray-400 flex items-center justify-center text-3xl font-bold opacity-50`}>
                Mapa de La Paz (próximamente)
              </div>
            </motion.div>
          </div>
        </div>

        {/* CIERRE FINAL DE LA PÁGINA – curva suave */}
        <div className={`absolute bottom-0 left-0 right-0 h-40 ${isDarkMode ? 'bg-[#0f1213]' : 'bg-white'}`}>
          <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
            <path
              fill={isDarkMode ? "#0f1213" : "#FFFFFF"}
              d="M0,96 C360,200 1080,20 1440,96 L1440,320 L0,320 Z"
            />
          </svg>
        </div>
      </section>
    </>
  );
}