// src/components/layout/Sidebar.js
import React, { useState } from "react";  // Asegúrate de importar useState
import { NavLink } from "react-router-dom"; // <- usa NavLink para active
import {
  TfiLayoutSidebarLeft,
  TfiMapAlt,
  TfiLocationPin,
  TfiBasketball,
  TfiLayersAlt,
  TfiUser,  // Asegúrate de importar TfiUser aquí
} from "react-icons/tfi";
import "../../styles/Sidebar.css";

function Sidebar({ open }) {
  // Definir el estado para manejar la visibilidad del submenú "Persona"
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);  // Estado de "Persona"

  const menuItems = [
    { label: "Macrodistritos", icon: <TfiLayoutSidebarLeft />, path: "/macrodistritos" },
    { label: "Zonas", icon: <TfiMapAlt />, path: "/zonas" },
    { label: "Áreas Deportivas", icon: <TfiLocationPin />, path: "/areadeportiva" },
    { label: "Canchas", icon: <TfiBasketball />, path: "/canchas" },
    { label: "Equipamientos", icon: <TfiLayersAlt />, path: "/equipamientos" },
    { label: "Reservas", icon: <TfiLayersAlt />, path: "/reservas" },
  ];

  return (
    <aside className={`sidebar ${open ? "expanded" : "collapsed"}`}>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </NavLink>
            </li>
          ))}

          <li className="submenu">
            <div
              className="submenu-title"
              onClick={() => setIsPersonaOpen(!isPersonaOpen)}  // Actualiza el estado
            >
              <span className="icon"><TfiUser /></span>
              <span className="label">Persona</span>
              <span className="arrow">{isPersonaOpen ? "▾" : "▸"}</span>
            </div>
            {isPersonaOpen && (
              <ul className="submenu-list">
                <li><NavLink to="/personas/clientes">Cliente</NavLink></li>
                <li><NavLink to="/personas/administradores">Administrador</NavLink></li>
                <li><NavLink to="/personas/usuarios-control">Usuario de Control</NavLink></li>
                <li><NavLink to="/personas/invitados">Invitado</NavLink></li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
