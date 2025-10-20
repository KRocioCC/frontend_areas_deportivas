import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { TfiCalendar } from "react-icons/tfi";
import {
  TfiLayoutSidebarLeft,
  TfiMapAlt,
  TfiLocationPin,
  TfiBasketball,
  TfiLayersAlt,
  TfiAngleDown,
  TfiAngleRight
} from "react-icons/tfi";
import { useAuth } from "../../auth/hooks/useAuth";
import "../../styles/Sidebar.css";

function Sidebar({ open }) {
  const location = useLocation();
  const [ubicacionOpen, setUbicacionOpen] = useState(false);
  const { isAuthenticated, isAdmin, isSuperuser, isClient } = useAuth();

  // ⛔ Evita renderizar si el usuario no está autenticado
  if (!isAuthenticated) return null;

  const isUbicacionActive = [
    '/macrodistritos',
    '/zonas'
  ].includes(location.pathname);

  const menuItems = [];

  if (isAdmin || isSuperuser) {
    menuItems.push(
      {
        label: "Ubicación",
        icon: <TfiMapAlt />,
        isDropdown: true,
        items: [
          { label: "Macrodistritos", icon: <TfiLayoutSidebarLeft />, path: "/macrodistritos" },
          { label: "Zonas", icon: <TfiLocationPin />, path: "/zonas" }
        ]
      },
      { label: "Áreas Deportivas", icon: <TfiLocationPin />, path: "/areadeportiva" },
      { label: "Canchas", icon: <TfiBasketball />, path: "/canchas" },
      { label: "Equipamientos", icon: <TfiLayersAlt />, path: "/equipamientos" },
      { label: "Calendario", icon: <TfiCalendar />, path: "/reservas/calendario" }
    );
  }

  if (isClient) {
    menuItems.push(
      { label: "Canchas", icon: <TfiBasketball />, path: "/canchas" }
    );
  }

  const toggleUbicacion = () => {
    setUbicacionOpen(!ubicacionOpen);
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
                    className={`dropdown-header ${isUbicacionActive ? "active-dropdown" : ""}`}
                    onClick={open ? toggleUbicacion : undefined}
                  >
                    <span className="icon">{item.icon}</span>
                    {open && <span className="label">{item.label}</span>}
                    {open && (
                      <span className="arrow">
                        {ubicacionOpen ? <TfiAngleDown /> : <TfiAngleRight />}
                      </span>
                    )}
                  </div>

                  {open && ubicacionOpen && (
                    <ul className="dropdown-menu">
                      {item.items.map((subItem) => (
                        <li key={subItem.path}>
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              `sidebar-link ${isActive ? "active-link" : ""}`
                            }
                          >
                            <span className="icon sub-icon">{subItem.icon}</span>
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
                          <span className="icon">{subItem.icon}</span>
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
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
