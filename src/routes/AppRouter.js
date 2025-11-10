import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardLayoutAdmin from "../components/layout/DashboardLayoutAdmin";

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

// Componentes de autenticación
import Login from "../auth/components/Login";
import RegisterTypeSelector from "../auth/components/RegisterTypeSelector";
import RegisterCliente from "../auth/components/RegisterCliente";
import RegisterAdministrador from "../auth/components/RegisterAdministrador";

// Persona
import PersonaPage from "../features/personas/pages/PersonaPage";
import ClientePage from "../features/personas/pages/ClientePage";
import AdministradorPage from "../features/personas/pages/AdministradorPage";
import UsuarioControlPage from "../features/personas/pages/UsuarioControlPage";
import InvitadoPage from "../features/personas/pages/InvitadoPage";

// ADMINISTRADOR
import MiAreaPage from '../features/RolAdministrador/mi_area/MiAreaPage';
import CanchasAdmin from "../features/RolAdministrador/canchas/CanchasAdmin";

function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Redirección por defecto → login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas de autenticación públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterTypeSelector />} />
          <Route path="/register/cliente" element={<RegisterCliente />} />
          <Route path="/register/administrador" element={<RegisterAdministrador />} />

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

          {/* Rutas solo para admin o superusuario - DashboardLayout original */}
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

          {/* Rutas de gestión de personas - DashboardLayout original */}
          <Route
            path="/personas"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayout>
                  <PersonaPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          >
            <Route path="clientes" element={<ClientePage />} />
            <Route path="administradores" element={<AdministradorPage />} />
            <Route path="usuarios-control" element={<UsuarioControlPage />} />
            <Route path="invitados" element={<InvitadoPage />} />
          </Route>

          {/* RUTAS NUEVAS PARA ADMINISTRADOR - DashboardLayoutAdmin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayoutAdmin>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-[#17252A] mb-4">Dashboard Administrador</h1>
                    <p className="text-gray-600">Bienvenido al panel de administración</p>
                  </div>
                </DashboardLayoutAdmin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/mi_area"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayoutAdmin>
                  <MiAreaPage />
                </DashboardLayoutAdmin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/canchas_admin"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayoutAdmin>
                  <CanchasAdmin />
                </DashboardLayoutAdmin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayoutAdmin>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-[#17252A] mb-4">Gestión de Usuarios</h1>
                    <p className="text-gray-600">Funcionalidad en desarrollo</p>
                  </div>
                </DashboardLayoutAdmin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reportes"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayoutAdmin>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-[#17252A] mb-4">Reportes</h1>
                    <p className="text-gray-600">Funcionalidad en desarrollo</p>
                  </div>
                </DashboardLayoutAdmin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notificaciones"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayoutAdmin>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-[#17252A] mb-4">Notificaciones</h1>
                    <p className="text-gray-600">Funcionalidad en desarrollo</p>
                  </div>
                </DashboardLayoutAdmin>
              </ProtectedRoute>
            }
          />

          {/* Ruta 404 - Redirigir a login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRouter;