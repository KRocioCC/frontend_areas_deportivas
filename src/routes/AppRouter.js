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

// Login
import Login from "../auth/components/Login";

function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirección por defecto → login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRouter;
