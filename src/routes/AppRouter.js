import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

import MacrodistritoPage from "../features/macrodistritos/pages/MacrodistritoPage";
import ZonaPage from "../features/zonas/pages/ZonaPage";
import AreadeportivaPage from "../features/areadeportiva/pages/AreadeportivaPage";
import ReservaPage from "../features/reservas/pages/js/ReservaPage";
import QrPage from "../features/qrs/pages/js/QrPage";
//import UsuarioPage from "../features/usuarios/pages/UsuarioPage";
//import ReservaPage from "../features/reservas/pages/ReservaPage";
//import ReportePage from "../features/reportes/pages/ReportePage";
//import ConfiguracionPage from "../features/configuracion/pages/ConfiguracionPage";
import PersonaPage from "../features/personas/pages/PersonaPage";
import ClientePage from "../features/personas/pages/ClientePage";
import AdministradorPage from "../features/personas/pages/AdministradorPage";
import UsuarioControlPage from "../features/personas/pages/UsuarioControlPage";
import InvitadoPage from "../features/personas/pages/InvitadoPage";


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

        <Route
          path="/reservas"
          element={
            <DashboardLayout>
              <ReservaPage />
            </DashboardLayout>
          }
        />

        <Route
          path="/reservas/:id/qrs"
          element={
            <DashboardLayout>
              <QrPage />
            </DashboardLayout>
          }
        />
        
        <Route
          path="/personas"
          element={
            <DashboardLayout>
              <PersonaPage />
            </DashboardLayout>
          }
        >
          {/* SUBRUTAS */}
          <Route path="clientes" element={<ClientePage />} />
          <Route path="administradores" element={<AdministradorPage />} />
          <Route path="usuarios-control" element={<UsuarioControlPage />} />
          <Route path="invitados" element={<InvitadoPage />} />
        </Route>
      </Routes>
 
    </BrowserRouter>
  );
}

export default AppRouter;
