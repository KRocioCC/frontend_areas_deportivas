import React from "react";
import { TfiAlignLeft, TfiAlignRight} from "react-icons/tfi";
import { IoPersonCircle } from "react-icons/io5";
import "../../styles/Navbar.css";

function Navbar({ toggleSidebar, sidebarOpen }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Botón que cambia de ícono */}
        <button className="toggle-btn" onClick={toggleSidebar}>
          {sidebarOpen ? <TfiAlignRight /> : <TfiAlignLeft />}
        </button>
        <img src="/logo.svg" alt="Q-JUEGO" className="navbar-logo" />
      </div>
      <div className="navbar-right">
        <div className="user-menu">
          <IoPersonCircle className="user-icon" />
          <span>User Name</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
