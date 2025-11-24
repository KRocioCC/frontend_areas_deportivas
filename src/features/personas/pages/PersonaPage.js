import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./personaPage.css"; // Puedes crearlo luego si quieres estilos

const PersonaPage = () => {
    return (
        <div>
        {/*<h2>Gestión de Personas</h2>*/}
        
        <Outlet /> {/* Aquí se renderiza la subpágina correspondiente */}
        </div>
    );
};

export default PersonaPage;
