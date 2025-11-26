
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../src/auth/hooks/useAuth'; // Ajusta la ruta a tu hook de Auth global
import './NavbarControl.css';

const NavbarControl = () => {
  const { logout, auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estados para menús
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userRef = useRef(null);

  const userInitial = auth?.user?.nombre ? auth.user.nombre.charAt(0).toUpperCase() : 'U';

  const isActive = (path) => location.pathname.includes(path) ? 'active' : '';

  const handleNavigate = (path) => {
      navigate(path);
      setMobileMenuOpen(false); // Cerrar menú móvil al navegar
      setUserMenuOpen(false);
  };

  // Cerrar dropdown de usuario al hacer clic fuera
  useEffect(() => {
      const handleClickOutside = (event) => {
          if (userRef.current && !userRef.current.contains(event.target)) {
              setUserMenuOpen(false);
          }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Overlay para cerrar menú móvil al hacer clic afuera */}
      <div 
        className={`menu-overlay ${mobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      <nav className="navbar-control">
        
        {/* LOGO */}
        <div className="navbar-brand" onClick={() => handleNavigate('/control/dashboard')}>
           <img src="/logo.svg" alt="Q-Juego" className="brand-logo" />
        </div>

        {/* LINKS DE NAVEGACIÓN (Se convierten en Sidebar en móvil) */}
        <div className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            
            {/* Título en móvil */}
            {mobileMenuOpen && (
                <div style={{color:'white', fontFamily:'Oswald', fontSize:'1.5rem', marginBottom:'2rem', opacity:0.5}}>
                    MENÚ
                </div>
            )}

            <div 
              className={`nav-item ${isActive('/dashboard')}`} 
              onClick={() => handleNavigate('/control/dashboard')}
            >
               <i className="fas fa-home"></i> INICIO
            </div>

            <div 
              className={`nav-item ${isActive('/mi-area')}`} 
              onClick={() => handleNavigate('/control/mi-area')}
            >
               <i className="fas fa-map-marker-alt"></i> MI ÁREA
            </div>

            <div 
              className={`nav-item ${isActive('/perfil')}`} 
              onClick={() => handleNavigate('/control/perfil')}
            >
               <i className="fas fa-user"></i> MI PERFIL
            </div>

            {/* Opción Salir (Solo visible en menú móvil) */}
            {mobileMenuOpen && (
                <div 
                    className="nav-item" 
                    onClick={logout} 
                    style={{marginTop:'auto', color:'#ff6b6b', borderTop:'1px solid #333', paddingTop:'20px'}}
                >
                   <i className="fas fa-sign-out-alt"></i> CERRAR SESIÓN
                </div>
            )}
        </div>

        {/* ACCIONES DERECHA */}
        <div className="navbar-actions">
          
          {/* Botón Escáner */}
          <button className="btn-scanner" onClick={() => navigate('/control/escaner')}>
              <i className="fas fa-qrcode"></i> 
              <span className="hide-mobile">ESCANEAR</span>
          </button>

          {/* Botón Usuario (Dropdown) */}
          <div className="dropdown-container" ref={userRef}>
              <div className="user-trigger" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                  {userInitial}
              </div>

              {/* Menú Desplegable Usuario (Desktop) */}
              {userMenuOpen && (
                  <div className="dropdown-menu">
                      <div className="dropdown-item" onClick={() => handleNavigate('/control/perfil')}>
                          <i className="fas fa-user-cog"></i> Mi Perfil
                      </div>
                      <div className="dropdown-item" onClick={() => handleNavigate('/control/mi-area')}>
                          <i className="fas fa-building"></i> Mi Área
                      </div>
                      <div style={{height:'1px', background:'#eee', margin:'5px 0'}}></div>
                      <div className="dropdown-item" style={{color:'#dc3545'}} onClick={logout}>
                          <i className="fas fa-sign-out-alt"></i> Salir
                      </div>
                  </div>
              )}
          </div>

          {/* Botón Hamburguesa (Solo Móvil) */}
          <button className="hamburger-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>

        </div>
      </nav>
    </>
  );
};

export default NavbarControl;