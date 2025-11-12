import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell } from "lucide-react"; // ✅ Notificaciones agregadas

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("/inicio");
  const [accordionOpen, setAccordionOpen] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Inicio", path: "/inicio" },
    {
      name: "Sobre nosotros",
      path: "/sobre-nosotros",
      children: [
        { name: "Historia", path: "/sobre-nosotros/historia" },
        { name: "Ubicación", path: "/sobre-nosotros/ubicacion" },
        { name: "Contacto", path: "/sobre-nosotros/contacto" },
      ],
    },
    {
      name: "Disciplinas",
      path: "/disciplinas",
      children: [
        { name: "Fútbol", path: "/disciplinas/futbol" },
        { name: "Básquet", path: "/disciplinas/basquet" },
        { name: "Tenis", path: "/disciplinas/tenis" },
      ],
    },
    {
      name: "Reservas",
      path: "/reservas",
      children: [
        { name: "Nueva reserva", path: "/reservas/nuevareserva" },
        { name: "Mis reservas", path: "/reservas/historialReservas" },
      ],
    },
  ];

  const handleAccordionToggle = (index) => {
    setAccordionOpen(accordionOpen === index ? null : index);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 px-5 md:px-8 py-3 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--color-pb-5)] backdrop-blur-lg shadow-lg border-b border-[var(--color-b-3)]"
          : "bg-black/60 backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 250, damping: 25 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* ✅ Logo que cambia al hacer scroll */}
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
          <img
            src={scrolled ? "../../logoScroll.svg" : "../../logo.svg"}
            alt="Logo ReservaYA"
            className="w-28 h-14 drop-shadow-[0_0_8px_rgba(0,0,0,0.6)] transition-all duration-500"
          />
        </motion.div>

        {/* Botón hamburguesa móvil */}
        <div className="md:hidden flex items-center">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </motion.button>
        </div>

        {/* Menú en desktop */}
        <div className="hidden md:flex gap-8 items-center relative">
          {navItems.map((item) => (
            <div key={item.path} className="relative group">
              <Link
                to={item.path}
                onClick={() => setActiveNav(item.path)}
                className={`font-medium text-lg transition-colors ${
                  location.pathname === item.path
                    ? "text-[var(--primary)]"
                    : "text-gray-300 hover:text-[var(--accent1)]"
                }`}
              >
                {item.name}
              </Link>

              {/* ✅ Línea animada */}
              {activeNav === item.path && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[var(--secondary)] rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {/* Submenú */}
              {item.children && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-44 bg-[var(--color-pb-3)]/90 backdrop-blur-md rounded-lg shadow-lg border border-[var(--color-pb-4)] opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        onClick={() => setActiveNav(child.path)}
                        className={`block px-4 py-2 text-sm rounded-md ${
                          location.pathname === child.path
                            ? "bg-[var(--color-p-3)] text-white"
                            : "text-gray-200 hover:bg-[var(--color-pb-2)] hover:text-white"
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          ))}

          {/* ✅ Notificaciones + Login */}
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.1 }} className="relative cursor-pointer">
              <Bell className="text-[var(--accent1)] w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-[var(--color-danger)] text-white text-xs rounded-full px-1.5">
                3
              </span>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/login"
                className="px-5 py-2 bg-gradient-to-r from-[var(--color-p-1)] to-[var(--color-accent)] text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all"
              >
                Perfil / Login
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ✅ Menú móvil */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-3 bg-[var(--color-pb-3)]/95 rounded-lg p-4 space-y-4 border border-[var(--color-pb-4)]"
          >
            {navItems.map((item, i) => (
              <div key={item.path}>
                <button
                  onClick={() =>
                    item.children ? handleAccordionToggle(i) : setActiveNav(item.path)
                  }
                  className={`flex justify-between items-center w-full text-left text-white text-lg font-medium ${
                    accordionOpen === i ? "text-[var(--accent1)]" : ""
                  }`}
                >
                  {item.name}
                  {item.children && (
                    <span className="text-[var(--secondary)]">
                      {accordionOpen === i ? "▲" : "▼"}
                    </span>
                  )}
                </button>

                {item.children && accordionOpen === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-4 mt-1 space-y-1"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        onClick={() => {
                          setActiveNav(child.path);
                          setMenuOpen(false);
                        }}
                        className={`block text-gray-300 text-sm hover:text-white ${
                          location.pathname === child.path
                            ? "text-[var(--color-p-3)] font-semibold"
                            : ""
                        }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}

            {/* ✅ Notificaciones + Login dentro del menú */}
            <div className="flex justify-between items-center mt-5">
              <motion.div whileHover={{ scale: 1.1 }} className="relative cursor-pointer">
                <Bell className="text-[var(--accent1)] w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-[var(--color-danger)] text-white text-xs rounded-full px-1.5">
                  3
                </span>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/login"
                  className="px-5 py-2 bg-gradient-to-r from-[var(--color-p-1)] to-[var(--color-accent)] text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all"
                >
                  Perfil / Login
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
