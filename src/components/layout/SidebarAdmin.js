import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  TfiDashboard, 
  TfiUser, 
  TfiPowerOff,
  TfiBasketball,
  TfiCalendar,
  TfiReceipt,
  TfiMap,
  TfiHelp
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

  // Abrir dropdowns automáticamente según etapa del tour
  useEffect(() => {
    try {
      const raw = localStorage.getItem('adminTourStatus');
      if (!raw) return;
      const status = JSON.parse(raw);
      if (status.stage === 'reservas') {
        setReservasOpen(true);
      }
      if (status.stage === 'usuarios-control' || status.stage === 'clientes') {
        setUsuariosOpen(true);
      }
    } catch { /* noop */ }
  }, [location.pathname]);

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
      path: "/admin/canchas_admin",
      id: "tour-menu-canchas"
    },
    {
      label: "Reservas",
      icon: <TfiCalendar />,
      isDropdown: true,
      isOpen: reservasOpen,
      toggle: () => setReservasOpen(!reservasOpen),
      id: "tour-menu-reservas",
      items: [
        { label: "Cancelaciones", path: "/admin/reservas/cancelaciones", id: "tour-sub-cancelaciones" },
        { label: "Todas las Reservas", path: "/admin/reservaslist", id: "tour-sub-reservas-todas" }
      ]
    },
    {
      label: "Gestión Usuarios",
      icon: <TfiUser />,
      isDropdown: true,
      isOpen: usuariosOpen,
      toggle: () => setUsuariosOpen(!usuariosOpen),
      id: "tour-menu-usuarios",
      items: [
        { label: "Usuarios Control", path: "/admin/usuarios/control", id: "tour-sub-usuarios-control" },
        { label: "Clientes", path: "/admin/usuarios/clientes", id: "tour-sub-clientes" }
      ]
    },
    {
      label: "Transacciones",
      icon: <TfiReceipt />,
      isDropdown: true,
      isOpen: transaccionesOpen,
      toggle: () => setTransaccionesOpen(!transaccionesOpen),
      id: "tour-menu-transacciones",
      items: [
        { label: "Control de Pagos", path: "/admin/pagos", id: "tour-sub-pagos" }
      ]
    },
   
    { 
      label: "Disciplinas", 
      icon: <TfiBasketball />, 
      path: "/admin/disciplinas",
      id: "tour-menu-disciplinas" 
    },
    { 
      label: "Calendario", 
      icon: <TfiCalendar />, 
      path: "/admin/calendario",
      id: "tour-menu-calendario" 
    },
    { 
      label: "Mi Área", 
      icon: <TfiMap />, 
      path: "/admin/mi_area",
      id: "tour-menu-mi-area"
    }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleStartTour = () => {
    // Resetear el estado del tour y disparar inicio inmediato SIN recargar
    try {
      localStorage.setItem('adminTourStatus', JSON.stringify({ done: false, stage: 'start', ts: Date.now() }));
    } catch { /* noop */ }
    // Intentar iniciar el tour directamente si el hook global está disponible
    if (typeof window !== 'undefined' && typeof window.__adminStartTour === 'function') {
      window.__adminStartTour();
    } else {
      // Fallback suave: emitir un evento para que AdminIntroTour lo capture
      window.dispatchEvent(new Event('adminTourForceCheck'));
    }
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
                    id={item.id || undefined}
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
                            id={subItem.id || undefined}
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
                    id={item.id || undefined}
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

          {/* Botón de Guía Usuario */}
          <li>
            <button onClick={handleStartTour} className="sidebar-link tour-button">
              <span className="icon"><TfiHelp /></span>
              {open && <span className="label">Guía Usuario</span>}
            </button>
          </li>

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