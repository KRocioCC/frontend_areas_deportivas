// src/components/ComponentsCli/Navbar.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell, LogOut, User, Moon, Sun } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState("/inicio");
  const [accordionOpen, setAccordionOpen] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isClient } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme(); // ← ¡YA FUNCIONA!

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Items base (sin cambios)
  const baseItems = [
    { name: "Inicio", path: "/inicio#inicio" },
    { name: "Servicios", path: "/inicio#servicios" },
    { name: "Áreas", path: "/areasdeportivas" },
    { 
      name: "Reservar", 
      path: "/reservar",
      children: [
        { name: "Cómo Funciona", path: "/reservar/como-funciona" },
        { name: "Sistema QR", path: "/reservar/qr" },
      ]
    },
  
    {
      name: "¿Quienes Somos?",
      path: "/empresa", 
      children: [
        { name: "Nosotros", path: "/inicio#nosotros" },
        { name: "Misión y Visión", path: "/inicio#misionvision" },
        { name: "Contacto", path: "/inicio#contacto" },
      ]
    },
  ];

  const navItems = isClient
    ? [
        ...baseItems,
        {
          name: "MisReservas",
          path: "/cliente/reservas",
          children: [
            { name: "Nueva reserva", path: "/cliente/reservas/nueva" },
            { name: "Mis reservas", path: "/reservas/mihistorial" },
          ],
        },
      ]
    : baseItems;

  const handleNavigate = (path) => {
    const [basePath, hash] = path.split("#");

    // Si ya estás en basePath (ej: /inicio) y sólo cambia el hash → no navegar, solo scrollear
    if (basePath === location.pathname && hash) {
      // Scroll al elemento
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          const offset = 67; // altura de la navbar fija
          const y = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 50);
      setActivePath(path); // actualiza estado visual
    } else {
      // Navegar a otra página
      navigate(basePath);
      // Si hay hash, scrollear después del render
      if (hash) {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            const offset = 80;
            const y = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
          setActivePath(path);
        }, 300); // más tiempo para asegurar render
      } else {
        setActivePath(path);
      }
    }

    setMenuOpen(false);
  };
  const handleAccordionToggle = (index) => {
    setAccordionOpen(accordionOpen === index ? null : index);
  };

  const handleLogout = () => {
    logout();
    navigate("/inicio", { replace: true });
  };

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 transition-all duration-400 flex justify-center ${
          scrolled
            ? "bg-[rgba(8,10,12,0.88)] dark:bg-[rgba(10,10,10,0.75)] backdrop-blur-sm shadow-sm"
            : "bg-transparent dark:bg-transparent"
        }`}
        initial={{ y: -18 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
      >
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="cursor-pointer flex items-center"
            onClick={() => handleNavigate("/inicio")}
          >
            <img
              src={scrolled ? "../../logo.svg" : "../../logo.svg"}
              alt="LOGO QUEJUEGO"
              className="w-28 h-10 object-contain"
            />
          </motion.div>

          {/* Botón menú móvil */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="menu"
              className={`p-2 rounded-md transition-colors ${
                scrolled ? "text-[var(--color-p-5)]" : "text-text-white dark:text-gray-200"
              }`}
            >
              {menuOpen ? <X size={26} /> : <Menu size={24} />}
            </motion.button>
          </div>

          {/* Menú escritorio */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              {navItems.map((item) => (
                <div key={item.path} className="relative group">
                  <button
                    onClick={() =>
                      item.children ? null : handleNavigate(item.path)
                    }
                    className={`font-[var(--font-Balo)] text-[0.88rem] font-medium tracking-tight px-2 py-2 transition-colors duration-200 ${
                      activePath.startsWith(item.path)
                        ? "text-[var(--color-p-2)]"
                        : scrolled
                        ? "text-[var(--color-p-4)]"
                        : "text-white dark:text-gray-200"
                    }`}
                  >
                    {item.name}
                  </button>

                  {/* SUBMENÚ → MÁS OSCURO + MÁS MINIMALISTA */}
                  {item.children && (
                    <div
                      className="
                        absolute left-0 mt-2 min-w-[13rem] rounded-lg 
                        bg-[rgba(10,12,14,0.96)] shadow-lg shadow-black/30 
                        py-2 opacity-0 invisible group-hover:opacity-100 
                        group-hover:visible transition-all duration-200
                      "
                    >
                      <div className="flex flex-col">
                        {item.children.map((child) => (
                          <button
                            key={child.path}
                            onClick={() => handleNavigate(child.path)}
                            className="
                              text-[0.85rem] text-[var(--color-p-4)] text-left 
                              px-4 py-2 rounded-md transition-all duration-150 
                              hover:bg-[rgba(255,255,255,0.08)] 
                              hover:text-[var(--color-p-2)]
                            "
                          >
                            {child.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Divider sutil */}
            <div className="w-px h-6 bg-white/10 mx-2" />

            {/* Notificaciones + Usuario */}
            <div className="flex items-center gap-3">
              {/*agregue un boton de luna sol */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-md transition-colors 
                  text-white dark:text-yellow-300"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
              {/*agregue un boton notificaiones */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`p-2 rounded-md transition-colors ${
                  scrolled ? "text-[var(--color-p-5)]" : "text-white dark:text-gray-200"
                }`}
                aria-label="notificaciones"
              >
                <div className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-[var(--color-p-2)] text-white dark:text-gray-200 text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    3
                  </span>
                </div>
              </motion.button>

              {currentUser ? (
                <div className="relative group">
                  {/* Botón principal del usuario */}
                  <button
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors 
                      ${scrolled ? "bg-[rgba(255,255,255,0.08)] text-[var(--color-p-5)]" : "bg-white/10 text-white dark:text-gray-200"}
                    `}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-[var(--font-Balo)]">
                      {currentUser.nombre || currentUser.username}
                    </span>
                  </button>

                  {/* SUBMENÚ DEL USUARIO - Mismo estilo que los otros submenús */}
                  <div
                    className="
                      absolute right-0 mt-2 min-w-[12rem] rounded-lg 
                      bg-[rgba(10,12,14,0.96)] shadow-xl shadow-black/40 
                      py-2 opacity-0 invisible group-hover:opacity-100 
                      group-hover:visible transition-all duration-200
                    "
                  >
                    <div className="flex flex-col">
                      <button
                        onClick={() => handleNavigate('/perfil')}
                        className="
                          text-[0.85rem] text-[var(--color-p-4)] text-left 
                          px-4 py-2 rounded-md transition-all duration-150 
                          hover:bg-[rgba(255,255,255,0.08)] 
                          hover:text-[var(--color-p-2)]
                        "
                      >
                        Mi Perfil
                      </button>

                      <button
                        onClick={handleLogout}
                        className="
                          text-[0.85rem] text-red-400 text-left 
                          px-4 py-2 rounded-md transition-all duration-150 
                          hover:bg-red-500/20 
                          hover:text-white dark:text-gray-200
                        "
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigate("/login")}
                  className="px-4 py-2 rounded-md font-[var(--font-josefin)] text-sm bg-[var(--color-p-2)] text-white dark:text-gray-200 shadow-sm"
                >
                  Iniciar
                </motion.button>
              )}
            </div>
          </div>



        </div>


      </motion.nav>

      {/* OVERLAY cuando el menú móvil está abierto (mejora legibilidad) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* MENÚ MÓVIL: ahora aparece desde abajo (slide-up) */}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobileMenu"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed inset-0 z-50 bg-[rgba(10,12,14,0.98)] backdrop-blur-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.05)]">
              <img 
                src="../../logo.svg" 
                alt="logo" 
                className="w-24 h-8 object-contain" 
              />

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-xl bg-[rgba(255,255,255,0.05)] text-[var(--color-p-4)] hover:text-white dark:text-gray-200 transition"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Content scroll */}
            <div className="h-[calc(100vh-80px)] overflow-y-auto px-4 py-5">
              
              {/* MAIN ITEMS */}
              <div className="space-y-1 mb-6">
                {navItems.map((item, i) => (
                  <div key={item.path} className="border-b border-[rgba(255,255,255,0.03)] last:border-b-0">
                    
                    {/* Main button */}
                    <button
                      onClick={() =>
                        item.children ? handleAccordionToggle(i) : handleNavigate(item.path)
                      }
                      className={`w-full text-left py-3 px-3 text-base font-[var(--font-Balo)] flex justify-between items-center rounded-lg transition 
                        ${
                          accordionOpen === i || activePath.startsWith(item.path)
                            ? "text-[var(--color-p-2)] bg-[rgba(255,255,255,0.05)]"
                            : "text-[var(--color-p-4)] hover:text-white dark:text-gray-200 hover:bg-[rgba(255,255,255,0.03)]"
                        }`}
                    >
                      <span>{item.name}</span>

                      {item.children && (
                        <motion.span
                          animate={{ rotate: accordionOpen === i ? 180 : 0 }}
                          className="text-[var(--color-p-5)] text-xs"
                        >
                          ▼
                        </motion.span>
                      )}
                    </button>

                    {/* Submenu */}
                    {item.children && accordionOpen === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-3 mt-1 mb-2 space-y-1"
                      >
                        {item.children.map((child) => (
                          <button
                            key={child.path}
                            onClick={() => handleNavigate(child.path)}
                            className={`w-full text-left py-2 px-3 text-sm rounded-md transition 
                              ${
                                activePath === child.path
                                  ? "text-white dark:text-gray-200 bg-[var(--color-p-5)]"
                                  : "text-[var(--color-p-4)] hover:text-white dark:text-gray-200 hover:bg-[rgba(255,255,255,0.05)]"
                              }`}
                          >
                            {child.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* NOTIFICATIONS */}

              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.03)] 
                  hover:bg-[rgba(255,255,255,0.06)] transition text-[var(--color-p-4)]"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-300" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
                <span className="text-sm font-[var(--font-Balo)]">
                  {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
                </span>
              </button>
              {/*notificaiones */}
              <div className="mb-6">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition">
                  <div className="relative">
                    <Bell className="w-5 h-5 text-[var(--color-p-5)]" />
                    <span className="absolute -top-2 -right-2 bg-[var(--color-p-2)] text-white dark:text-gray-200 text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      3
                    </span>
                  </div>

                  <div>
                    <span className="text-[var(--color-p-4)] font-[var(--font-Balo)] text-sm block">
                      Notificaciones
                    </span>
                    <span className="text-[var(--color-p-5)] text-xs">3 nuevas</span>
                  </div>
                </div>
              </div>

              {/* USER SECTION */}
              <div className="border-t border-[rgba(255,255,255,0.05)] pt-5">
                {currentUser ? (
                  <div className="space-y-3">

                    {/* User info */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
                      <div className="w-9 h-9 rounded-full bg-[var(--color-p-5)] flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>

                      <div>
                        <span className="text-white dark:text-gray-200 font-[var(--font-Balo)] font-semibold text-sm block">
                          {currentUser.nombre || currentUser.username}
                        </span>
                        <span className="text-[var(--color-p-5)] text-xs">Mi cuenta</span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleNavigate("/perfil")}
                        className="py-2 px-3 rounded-lg bg-[var(--color-p-5)] text-white dark:text-gray-200 text-sm font-[var(--font-Balo)] hover:bg-[var(--color-p-5)]/90 transition"
                      >
                        Perfil
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="py-2 px-3 rounded-lg bg-[rgba(255,255,255,0.05)] text-[var(--color-p-2)] text-sm font-[var(--font-Balo)] border border-[var(--color-p-2)]/30 hover:bg-[var(--color-p-2)] hover:text-white dark:text-gray-200 transition"
                      >
                        Salir
                      </motion.button>
                    </div>

                  </div>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigate("/login")}
                    className="w-full py-3 px-3 text-sm font-[var(--font-josefin)] font-bold text-white dark:text-gray-200 bg-gradient-to-r from-[var(--color-p-2)] to-[var(--color-p-1)] rounded-lg shadow hover:shadow-md transition"
                  >
                    Iniciar Sesión
                  </motion.button>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
