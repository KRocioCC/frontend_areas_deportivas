// src/components/layout/Sidebar.js
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  TfiLayoutSidebarLeft,
  TfiMapAlt,
  TfiLocationPin,
  TfiBasketball,
  TfiLayersAlt,
  TfiAngleDown,
  TfiAngleRight
} from "react-icons/tfi";
import "../../styles/Sidebar.css";

function Sidebar({ open }) {
  const location = useLocation();
  const [ubicacionOpen, setUbicacionOpen] = useState(false);

  // Verificar si alguna ruta de ubicación está activa
  const isUbicacionActive = [
    '/macrodistritos',
    '/zonas'
  ].includes(location.pathname);

  const menuItems = [
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
  ];

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
                <li 
                  key={item.label} 
                  className="dropdown-container"
                >
                  <div
                    className={`dropdown-header ${isUbicacionActive ? "active-dropdown" : ""}`}
                    onClick={open ? toggleUbicacion : undefined} // solo abre al hacer clic si está expandido
                  >
                    <span className="icon">{item.icon}</span>
                    {open && <span className="label">{item.label}</span>}
                    {open && (
                      <span className="arrow">
                        {ubicacionOpen ? <TfiAngleDown /> : <TfiAngleRight />}
                      </span>
                    )}
                  </div>

                  {/* En modo expandido → menú normal */}
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
                  {/* En modo colapsado → menú flotante */}
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