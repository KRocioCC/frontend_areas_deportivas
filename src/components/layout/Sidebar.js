import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { TfiCalendar } from "react-icons/tfi";
import {
  TfiLayoutSidebarLeft,
  TfiMapAlt,
  TfiLocationPin,
  TfiBasketball,
  TfiLayersAlt,
  TfiAngleDown,
  TfiAngleRight,
  TfiUser,
  TfiPowerOff
} from "react-icons/tfi";
import { useAuth } from "../../auth/hooks/useAuth";
import "../../styles/Sidebar.css";

function Sidebar({ open }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [ubicacionOpen, setUbicacionOpen] = useState(false);
  const [personaOpen, setPersonaOpen] = useState(false);
  const { isAuthenticated, isAdmin, isSuperuser, isClient, logout } = useAuth();

  if (!isAuthenticated) return null;

  const isUbicacionActive = ["/macrodistritos", "/zonas"].includes(location.pathname);
  const isPersonaActive = [
    "/personas/clientes",
    "/personas/administradores",
    "/personas/usuarios-control",
    "/personas/invitados"
  ].includes(location.pathname);

  const menuItems = [];

  if (isAdmin || isSuperuser) {
    menuItems.push(
      { label: "Control Accesos", icon: <TfiLocationPin />, path: "/solicitudes" },
      {
        label: "Ubicación",
        icon: <TfiMapAlt />,
        isDropdown: true,
        isActive: isUbicacionActive,
        isOpen: ubicacionOpen,
        toggle: () => setUbicacionOpen(!ubicacionOpen),
        items: [
          { label: "Macrodistritos", icon: <TfiLayoutSidebarLeft />, path: "/macrodistritos" },
          { label: "Zonas", icon: <TfiLocationPin />, path: "/zonas" }
        ]
      },
      {
        label: "Persona",
        icon: <TfiUser />,
        isDropdown: true,
        isActive: isPersonaActive,
        isOpen: personaOpen,
        toggle: () => setPersonaOpen(!personaOpen),
        items: [
          { label: "Cliente", path: "/personas/clientes" },
          { label: "Administrador", path: "/personas/administradores" },
          { label: "Usuario de Control", path: "/personas/usuarios-control" },
          { label: "Invitado", path: "/personas/invitados" }
        ]
      },
      { label: "Áreas Deportivas", icon: <TfiLocationPin />, path: "/areadeportiva" },
      { label: "Canchas", icon: <TfiBasketball />, path: "/canchas" },
      { label: "Equipamientos", icon: <TfiLayersAlt />, path: "/equipamientos" },
      { label: "Calendario", icon: <TfiCalendar />, path: "/reservas/calendario" }
    );
  }

  if (isClient) {
    menuItems.push({ label: "Canchas", icon: <TfiBasketball />, path: "/canchas" });
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`sidebar ${open ? "expanded" : "collapsed"}`}>
      <nav>
        <ul>
          {menuItems.map((item) => {
            if (item.isDropdown) {
              return (
                <li key={item.label} className="dropdown-container">
                  <div
                    className={`dropdown-header ${item.isActive ? "active-dropdown" : ""}`}
                    onClick={open ? item.toggle : undefined}
                  >
                    <span className="icon">{item.icon}</span>
                    {open && <span className="label">{item.label}</span>}
                    {open && (
                      <span className="arrow">
                        {item.isOpen ? <TfiAngleDown /> : <TfiAngleRight />}
                      </span>
                    )}
                  </div>

                  {open && item.isOpen && (
                    <ul className="dropdown-menu">
                      {item.items.map((subItem) => (
                        <li key={subItem.path}>
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active-link" : ""}`
                            }
                          >
                            {subItem.icon && (
                              <span className="icon sub-icon">{subItem.icon}</span>
                            )}
                            <span className="label">{subItem.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}

                  {!open && (
                    <div className="floating-menu">
                      <div className="floating-menu-title">{item.label}</div>
                      {item.items.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          className={({ isActive }) =>
                            `floating-menu-item ${isActive ? "active" : ""}`
                          }
                        >
                          {subItem.icon && <span className="icon">{subItem.icon}</span>}
                          <span className="label">{subItem.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </li>
              );
            } else {
              return (
                <li key={item.label}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? "active-link" : ""}`
                    }
                  >
                    <span className="icon">{item.icon}</span>
                    {open && <span className="label">{item.label}</span>}
                  </NavLink>
                </li>
              );
            }
          })}

          {/* Botón de Cerrar sesión */}
          <li>
            <button onClick={handleLogout} className="sidebar-link logout-button">
              <span className="icon"><TfiPowerOff /></span>
              {open && <span className="label">Cerrar sesión</span>}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;