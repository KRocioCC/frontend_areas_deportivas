import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

// Contexto y protección
import { AuthProvider } from "../auth/context/AuthContext";
import ProtectedRoute from "../auth/components/ProtectedRoute";

// Páginas
import MacrodistritoPage from "../features/macrodistritos/pages/MacrodistritoPage";
import ZonaPage from "../features/zonas/pages/ZonaPage";
import AreadeportivaPage from "../features/areadeportiva/pages/AreadeportivaPage";
import CanchaPage from "../features/cancha/pages/CanchaPage";
import EquipamientoPage from "../features/equipamiento/pages/EquipamientoPage";
import CalendarioPage from "../features/calendario/pages/CalendarioPage";
import CalendarioReservasPage from "../features/calendario/pages/CalendarioReservaPage";
import SolicitudesPage from "../features/AsignacionRoles/pages/SolicitudesPage";
import Register from "../auth/components/Register";
// Login
import Login from "../auth/components/Login";

// Persona
import PersonaPage from "../features/personas/pages/PersonaPage";
import ClientePage from "../features/personas/pages/ClientePage";
import AdministradorPage from "../features/personas/pages/AdministradorPage";
import UsuarioControlPage from "../features/personas/pages/UsuarioControlPage";
import InvitadoPage from "../features/personas/pages/InvitadoPage";

function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Redirección por defecto → login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="/register"
            element={<Register />
            }
          />

          {/* Login público */}
          <Route path="/login" element={<Login />} />

          {/* Ruta accesible para cualquier usuario autenticado */}
          <Route
            path="/canchas"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CanchaPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/solicitudes"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayout>
                  <SolicitudesPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          
          {/* Rutas solo para admin o superusuario */}
          <Route
            path="/macrodistritos"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayout>
                  <MacrodistritoPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/zonas"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayout>
                  <ZonaPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/areadeportiva"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayout>
                  <AreadeportivaPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/equipamientos"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayout>
                  <EquipamientoPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservas/calendario"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayout>
                  <CalendarioPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservas/:fecha"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayout>
                  <CalendarioReservasPage />
                </DashboardLayout>
              </ProtectedRoute>
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
    </AuthProvider>
  );
}

export default AppRouter;
