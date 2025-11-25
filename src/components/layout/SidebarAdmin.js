import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  TfiDashboard, 
  TfiUser, 
  TfiBarChart,
  TfiPowerOff,
  TfiBasketball,
  TfiCalendar,
  TfiReceipt,
  TfiBell,
  TfiMap
} from "react-icons/tfi";
import { TfiAngleDown, TfiAngleRight } from "react-icons/tfi";
import { useAuth } from "../../auth/hooks/useAuth";
import "../../styles/SidebarAdmin.css";

function SidebarAdmin({ open }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Estados para los dropdowns
  const [reservasOpen, setReservasOpen] = useState(false);
  const [usuariosOpen, setUsuariosOpen] = useState(false);
  const [transaccionesOpen, setTransaccionesOpen] = useState(false);

  // Menú específico para ADMINISTRADOR
  const adminMenuItems = [
    { 
      label: "Dashboard", 
      icon: <TfiDashboard />, 
      path: "/admin/dashboard" 
    },
    { 
      label: "Canchas", 
      icon: <TfiBasketball />, 
      path: "/admin/canchas_admin" 
    },
    {
      label: "Reservas",
      icon: <TfiCalendar />,
      isDropdown: true,
      isOpen: reservasOpen,
      toggle: () => setReservasOpen(!reservasOpen),
      items: [
        { label: "Cancelaciones", path: "/admin/reservas/cancelaciones" },
        { label: "Todas las Reservas", path: "/admin/reservaslist" }
      ]
    },
    {
      label: "Gestión Usuarios",
      icon: <TfiUser />,
      isDropdown: true,
      isOpen: usuariosOpen,
      toggle: () => setUsuariosOpen(!usuariosOpen),
      items: [
        { label: "Usuarios Control", path: "/admin/usuarios/control" },
        { label: "Clientes", path: "/admin/usuarios/clientes" }
      ]
    },
    {
      label: "Transacciones",
      icon: <TfiReceipt />,
      isDropdown: true,
      isOpen: transaccionesOpen,
      toggle: () => setTransaccionesOpen(!transaccionesOpen),
      items: [
        { label: "Control de Pagos", path: "/admin/pagos" }
      ]
    },
    { 
      label: "Notificaciones", 
      icon: <TfiBell />, 
      path: "/admin/notificaciones" 
    },
    { 
      label: "Calendario", 
      icon: <TfiCalendar />, 
      path: "/admin/calendario" 
    },
    { 
      label: "Mi Área", 
      icon: <TfiMap />, 
      path: "/admin/mi_area" 
    }
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
          {adminMenuItems.map((item) => {
            if (item.isDropdown) {
              return (
                <li key={item.label} className="dropdown-container">
                  <div
                    className={`dropdown-header ${location.pathname.includes(item.items.some(subItem => subItem.path) ? "active-dropdown" : "")}`}
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
                              `sidebar-link sub-item ${isActive ? "active-link" : ""}`
                            }
                          >
                            <span className="label">{subItem.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
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

export default SidebarAdmin;