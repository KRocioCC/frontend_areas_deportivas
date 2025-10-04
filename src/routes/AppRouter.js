import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

import MacrodistritoPage from "../features/macrodistritos/pages/MacrodistritoPage";
import ZonaPage from "../features/zonas/pages/ZonaPage";
import AreadeportivaPage from "../features/areadeportiva/pages/AreadeportivaPage";
import CanchaPage from "../features/cancha/pages/CanchaPage";
import EquipamientoPage from "../features/equipamiento/pages/EquipamientoPage";

//import EspacioPage from "../features/espacios/pages/EspacioPage";
//import UsuarioPage from "../features/usuarios/pages/UsuarioPage";
//import ReservaPage from "../features/reservas/pages/ReservaPage";
//import ReportePage from "../features/reportes/pages/ReportePage";
//import ConfiguracionPage from "../features/configuracion/pages/ConfiguracionPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/macrodistritos" replace />} />
        
        <Route
          path="/macrodistritos"
          element={
            <DashboardLayout>
              <MacrodistritoPage />
            </DashboardLayout>
          }
        />
        
        {/* Ruta para Zonas */}
        <Route
          path="/zonas"
          element={
            <DashboardLayout>
              <ZonaPage /> 
            </DashboardLayout>
          }
        />

        {/* Ruta para Áreas Deportivas */}
        <Route
          path="/areadeportiva"
          element={
            <DashboardLayout>
              <AreadeportivaPage /> 
            </DashboardLayout>
          }
        />
        {/*Ruta para Canchas */}
        <Route
          path="/canchas"
          element={
            <DashboardLayout>
              <CanchaPage /> 
            </DashboardLayout>
          }
        />
        {/* Ruta para espacios*/}
        <Route
          path="/equipamientos"
          element={
            <DashboardLayout>
              <EquipamientoPage /> 
            </DashboardLayout>
          }
        />*
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
