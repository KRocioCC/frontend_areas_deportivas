// src/components/layout/Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom"; // <- usa NavLink para active
import {
  TfiLayoutSidebarLeft,
  TfiMapAlt,
  TfiLocationPin,
  TfiBasketball,
  TfiLayersAlt//,
  //TfiAngleRight,
  //TfiAngleLeft
} from "react-icons/tfi";
import "../../styles/Sidebar.css";

function Sidebar({ open/*,toggleSidebar*/}) {
  const menuItems = [
    { label: "Macrodistritos", icon: <TfiLayoutSidebarLeft />, path: "/macrodistritos" },
    { label: "Zonas", icon: <TfiMapAlt />, path: "/zonas" },
    { label: "Áreas Deportivas", icon: <TfiLocationPin />, path: "/areadeportiva" },
    { label: "Canchas", icon: <TfiBasketball />, path: "/canchas" },
    { label: "Equipamientos", icon: <TfiLayersAlt />, path: "/equipamientos" },
  ];

  return (
    <aside className={`sidebar ${open ? "expanded" : "collapsed"}`}>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? "active-link" : ""}`}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
