// src/components/ComponentsCli/Navbar.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Bell, LogOut, User } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState("/inicio");
  const [accordionOpen, setAccordionOpen] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isClient } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔹 Items base
  const baseItems = [
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
  ];

  // 🔹 Agregar sección de reservas solo si es cliente
  const navItems = isClient
    ? [
        ...baseItems,
        {
          name: "Reservas",
          path: "/cliente/reservas",
          children: [
            { name: "Nueva reserva", path: "/cliente/reservas/nueva" },
            { name: "Mis reservas", path: "/cliente/reservas/historial" },
          ],
        },
      ]
    : baseItems;

  const handleNavigate = (path) => {
    setActivePath(path);
    setMenuOpen(false);
    navigate(path);
  };

  const handleAccordionToggle = (index) => {
    setAccordionOpen(accordionOpen === index ? null : index);
  };

  const handleLogout = () => {
    logout();
    navigate("/inicio", { replace: true });
  };

return (
  <motion.nav
    className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 transition-all duration-500 ${
      scrolled
        ? "bg-[var(--color-pb-5)]/95 backdrop-blur-lg shadow-lg border-b border-[var(--color-b-3)]"
        : "bg-black/50 backdrop-blur-sm"
    }`}
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    transition={{ type: "spring", stiffness: 250, damping: 25 }}
  >
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="cursor-pointer"
        onClick={() => handleNavigate("/inicio")}
      >
        <img
          src={scrolled ? "../../logoScroll.svg" : "../../logo.svg"}
          alt="Logo ReservaYA"
          className="w-24 h-12 drop-shadow-[0_0_6px_rgba(0,0,0,0.6)]"
        />
      </motion.div>

      {/* Botón menú móvil */}
      <div className="md:hidden">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </motion.button>
      </div>

      {/* Menú escritorio */}
      <div className="hidden md:flex gap-6 items-center">
        {navItems.map((item, i) => (
          <div key={item.path} className="relative group">
            <button
              onClick={() => (item.children ? null : handleNavigate(item.path))}
              className={`font-medium text-base transition-colors ${
                activePath.startsWith(item.path)
                  ? "text-[var(--accent1)]"
                  : "text-gray-300 hover:text-[var(--secondary)]"
              }`}
            >
              {item.name}
            </button>

            {item.children && (
              <motion.div className="absolute left-0 mt-2 w-44 bg-[var(--color-pb-3)]/95 rounded-lg shadow-md border border-[var(--color-b-3)] opacity-0 group-hover:opacity-100 invisible group-hover:visible backdrop-blur-md">
                {item.children.map((child) => (
                  <button
                    key={child.path}
                    onClick={() => handleNavigate(child.path)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      activePath === child.path
                        ? "bg-[var(--color-p-3)] text-white"
                        : "text-gray-200 hover:bg-[var(--color-pb-2)] hover:text-white"
                    }`}
                  >
                    {child.name}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        ))}

        {/* Notificaciones y usuario */}
        <div className="flex items-center gap-5">
          <motion.div whileHover={{ scale: 1.1 }} className="relative cursor-pointer">
            <Bell className="text-[var(--accent1)] w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-[var(--color-danger)] text-white text-xs rounded-full px-1">
              3
            </span>
          </motion.div>

          {/* Si el usuario está logueado */}
          {currentUser ? (
            <div className="relative group">
              <div className="flex items-center gap-2 bg-[var(--color-pb-3)] px-3 py-1.5 rounded-full cursor-pointer">
                <User className="w-5 h-5 text-white" />
                <span className="text-white text-sm font-medium">
                  {currentUser.nombre || currentUser.username}
                </span>
              </div>

              {/* Submenú de usuario */}
              <motion.div className="absolute right-0 mt-2 w-40 bg-[var(--color-pb-3)]/95 rounded-lg shadow-md border border-[var(--color-b-3)] opacity-0 group-hover:opacity-100 invisible group-hover:visible backdrop-blur-md">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-pb-2)] hover:text-white flex items-center gap-2"
                >
                  <LogOut size={16} /> Cerrar sesión
                </button>
              </motion.div>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigate("/login")}
              className="relative px-5 py-2 font-semibold rounded-full overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--color-p-1)] to-[var(--color-accent)] transition-transform duration-300 translate-x-[-100%] group-hover:translate-x-0"></span>
              <span className="relative text-white group-hover:text-white transition-all duration-300">
                Iniciar Sesión
              </span>
            </motion.button>
          )}
        </div>
      </div>
    </div>

    {/* Menú móvil */}
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden mt-3 bg-[var(--color-pb-3)]/95 rounded-lg p-3 space-y-3 border"
        >
          {navItems.map((item, i) => (
            <div key={item.path}>
              <button
                onClick={() =>
                  item.children
                    ? handleAccordionToggle(i)
                    : handleNavigate(item.path)
                }
                className={`flex justify-between w-full text-left text-white text-base font-medium ${
                  accordionOpen === i || activePath.startsWith(item.path)
                    ? "text-[var(--accent1)]"
                    : ""
                }`}
              >
                {item.name}
              </button>

              {item.children && accordionOpen === i && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <button
                      key={child.path}
                      onClick={() => handleNavigate(child.path)}
                      className={`block w-full text-left text-sm ${
                        activePath === child.path
                          ? "text-[var(--accent1)]"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {child.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-between items-center mt-4">
            <Bell className="text-[var(--accent1)] w-5 h-5" />
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-[var(--color-p-2)] rounded-full flex items-center gap-1 text-sm font-semibold"
              >
                <LogOut size={12} /> Cerrar sesión
              </button>
            ) : (
              <button
                onClick={() => handleNavigate("/login")}
                className="px-5 py-2 bg-gradient-to-r from-[var(--color-p-2)] to-[var(--color-accent)] text-white font-semibold rounded-full text-sm"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
          
        </motion.div>
      )}
    </AnimatePresence>
  </motion.nav>
);

}
