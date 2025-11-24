import React from "react";
import { TfiAlignLeft, TfiAlignRight } from "react-icons/tfi";
import { IoPersonCircle } from "react-icons/io5";
import "../../styles/Navbar.css";

function Navbar({ toggleSidebar, sidebarOpen }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Botón que cambia de ícono */}
        <button 
          className={`toggle-btn ${sidebarOpen ? 'sidebar-open' : ''}`} 
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <TfiAlignRight /> : <TfiAlignLeft />}
        </button>
        
        {/* Logo - se mostrará blanco por el filter CSS */}
        <img 
          src="/logo.svg" 
          alt="Q-JUEGO" 
          className="navbar-logo" 
        />
      </div>
      
      <div className="navbar-right">
        <div className="user-menu">
          <IoPersonCircle className="user-icon" />
          <span>Usuario</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;