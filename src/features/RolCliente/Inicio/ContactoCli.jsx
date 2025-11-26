// src/componentsCli/ContactosCli.jsx
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { 
  Phone, Mail, MessageCircle, Clock, Send,
  User, FileText
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
      <section
        id="contacto"
        className={`relative py-20 px-4 md:px-8 ${
          isDarkMode ? 'bg-[#0f1213]' : 'bg-gray-50'
        }`}
      >
        {/* Fondo sutil */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-[#41bfb2] blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#f28627] blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Título */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ fontFamily: "var(--font-Oswald)" }}>
              <span className={isDarkMode ? "text-white" : "text-gray-900"}>¿NECESITAS</span>{" "}
              <span className={isDarkMode ? "text-[#2C7366]" : "text-[#41bfb2]"}>AYUDA?</span>
            </h2>
            <p className="mt-3 text-lg md:text-xl opacity-90" style={{ fontFamily: "var(--font-Alumni)" }}>
              Estamos aquí 24/7 para que nunca te quedes sin jugar
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
            {/* Formulario */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className={`rounded-2xl p-6 lg:p-8 shadow-md border ${
                isDarkMode 
                  ? 'bg-black/40 backdrop-blur-sm border-white/10' 
                  : 'bg-white/90 border-gray-200'
              }`}>
                <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-Alumni)" }}>
                  Escríbenos
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-[#41bfb2]" />
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none text-base transition-all
                        ${isDarkMode 
                          ? 'bg-[#0f1213]/60 placeholder-gray-500 text-white focus:bg-white/10' 
                          : 'bg-white/70 placeholder-gray-600 text-gray-900 focus:bg-white'
                        }`}
                      style={{ fontFamily: "var(--font-Balo)" }}
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-[#41bfb2]" />
                    <input
                      type="email"
                      required
                      placeholder="tu@email.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none text-base transition-all
                        ${isDarkMode 
                          ? 'bg-[#0f1213]/60 placeholder-gray-500 text-white focus:bg-white/10' 
                          : 'bg-white/70 placeholder-gray-600 text-gray-900 focus:bg-white'
                        }`}
                      style={{ fontFamily: "var(--font-Balo)" }}
                    />
                  </div>

                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-[#41bfb2]" />
                    <textarea
                      required
                      rows="4"
                      placeholder="¿En qué podemos ayudarte?"
                      className={`w-full pl-10 pr-4 pt-3 rounded-lg outline-none text-base resize-none transition-all
                        ${isDarkMode 
                          ? 'bg-[#0f1213]/60 placeholder-gray-500 text-white focus:bg-white/10' 
                          : 'bg-white/70 placeholder-gray-600 text-gray-900 focus:bg-white'
                        }`}
                      style={{ fontFamily: "var(--font-Balo)" }}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-4 rounded-lg font-semibold text-white shadow transition-colors
                      ${isDarkMode 
                        ? 'bg-[#2C7366] hover:bg-[#41bfb2]' 
                        : 'bg-[#41bfb2] hover:bg-[#f28627]'
                      }`}
                    style={{ fontFamily: "var(--font-josefin)" }}
                  >
                    <Send className="inline w-5 h-5 mr-2" />
                    Enviar
                  </motion.button>
                </form>

                {/* WhatsApp */}
                <motion.button
                  onClick={handleWhatsApp}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-3 text-white shadow bg-green-500 hover:bg-green-600"
                  style={{ fontFamily: "var(--font-josefin)" }}
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </motion.button>
              </div>
            </motion.div>

            {/* Info de contacto */}
            {/*
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className={`rounded-2xl p-6 shadow-md border ${
                isDarkMode 
                  ? 'bg-black/40 backdrop-blur-sm border-white/10' 
                  : 'bg-white/90 border-gray-200'
              }`}>
                <h3 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--font-Alumni)" }}>
                  Contáctanos
                </h3>

                <div className="space-y-4 text-base">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#41bfb2] flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Teléfono / WhatsApp</p>
                      <p className="font-bold">+591 7123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#f28627] flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p>qjuego@tucancha.com.bo</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#2C7366] flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Atención</p>
                      <p className="font-bold">24/7</p>
                    </div>
                  </div>
                </div>
              </div>*

              Mini mapa 
              <div className={`rounded-2xl h-48 bg-gray-200 dark:bg-gray-800 border border-dashed border-gray-400 flex items-center justify-center text-lg font-semibold opacity-50`}>
                Mapa (próximamente)
              </div>
            </motion.div>
              */}
          </div>
        </div>

      </section>
    </>
  );
}
