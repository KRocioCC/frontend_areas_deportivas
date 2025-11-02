import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  TfiDashboard, 
  TfiUser, 
  TfiSettings, 
  TfiBarChart,
  TfiPowerOff
} from "react-icons/tfi";
import { useAuth } from "../../auth/hooks/useAuth";
import "../../styles/SidebarAdmin.css";

function SidebarAdmin({ open }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Menú específico para ADMINISTRADOR
  const adminMenuItems = [
    { label: "Dashboard", icon: <TfiDashboard />, path: "/admin/dashboard" },
    { label: "Gestión Usuarios", icon: <TfiUser />, path: "/admin/usuarios" },
    { label: "Reportes", icon: <TfiBarChart />, path: "/admin/reportes" },
    { label: "Configuración", icon: <TfiSettings />, path: "/admin/configuracion" }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`sidebar admin-sidebar ${open ? "expanded" : "collapsed"}`}>
      <div className="sidebar-header">
        {open && <h3>Panel Administrador</h3>}
      </div>
      
      <nav>
        <ul>
          {adminMenuItems.map((item) => (
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
          ))}

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

export default SidebarAdmin;