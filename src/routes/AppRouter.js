import React, { useState } from "react";
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

import PageClientes from "../features/RolAdministrador/usuarios/clientes/PageClientes";
import PageUsuariosControl from "../features/RolAdministrador/usuarios/usuarios_control/PageUsuariosControl";
import Dashboard from "../features/RolAdministrador/dashboard/index.jsx";

//CLIENTE
// CLIENTE - componentes visuales
import Preloader from "../components/ComponentsCli/Preloader.jsx";
import { AnimatePresence, motion } from "framer-motion";
import LayoutCliente from "../components/ComponentsCli/LayoutCliente.jsx";  
//import Navbar from "../componentsCli/Navbar";
//import Hero from "../componentsCli/Hero";

// CLIENTE - páginas
import Inicio from "../features/RolCliente/Inicio/InicioCli.jsx";
//import Seccion1 from "../feature/RolCliente/Inicio/Seccion1";
import Areadeportiva from "../features/RolCliente/AreaDeportiva/AreaDeportiva.jsx"
import Cancha from "../features/RolCliente/Canchas/Cancha.jsx"
import CanchaDetalle from "../features/RolCliente/Canchas/CanchaDetalle.jsx"
//import HistorialReserva from "../feature/RolCliente/Areadeportiva/HistorialReserva/HistorialReserva";
//import Notificaciones from "../feature/RolCliente/Notificaciones/Notificaciones"; // si existe
//import HistorialReserva from "../feature/RolCliente/Areadeportiva/HistorialReserva/HistorialReserva";
//import Notificaciones from "../feature/RolCliente/Notificaciones/Notificaciones"; // si existe
import ReservaPage from "../features/RolCliente/Reserva/ReservaPage22.jsx";
import ConfirmacionFinalReservaHorario from "../features/RolCliente/Reserva/ConfirmacionFinal.jsx";

//import { ProtectedRoute } from '../auth/components/ProtectedRoute.jsx';

function AppRouter() {

  const pageVariants = {
    initial: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      position: "absolute",
      width: "100%"
    }),
    animate: {
      x: 0,
      opacity: 1,
      position: "relative",
      width: "100%",
      transition: { type: "tween", duration: 0.5 }
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      position: "absolute",
      width: "100%",
      transition: { type: "tween", duration: 0.5 }
    })
  };

  const [loading, setLoading] = useState(true);
  return (
    <AuthProvider>
      <BrowserRouter>
        {/*{loading ? (
            <Preloader onFinish={() => setLoading(false)} />
          ) : (*/}
        <Routes>
          
          {/* Redirección por defecto → inicio */}
          {/* Ruta pública: inicio */}
          <Route path="/" element={<Navigate to="/inicio" replace />} />

          {/* Redirección por defecto → login */}
          {/*<Route path="/" element={<Navigate to="/login" replace />} />*/}

          {/* Rutas de autenticación públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterTypeSelector />} />
          <Route path="/register/cliente" element={<RegisterCliente />} />
          <Route path="/register/administrador" element={<RegisterAdministrador />} />

          {/*paginas publicas */}

          <Route
            path="/inicio"
            element={
              <LayoutCliente>
                <Inicio />
              </LayoutCliente>
            }
          />

          <Route
            path="/areadeportivacli"
            element={
              <LayoutCliente>
                <Areadeportiva />
              </LayoutCliente>
            }
          />

          {/*Pagiinas publicas Canchas */}

          <Route
            path="/canchacli"
            element={
              <LayoutCliente>
                <Cancha />
              </LayoutCliente>
            }
          />

           <Route
            path="canchacli/detalle/:id"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={1}
              >
                <CanchaDetalle />
              </motion.div>
            }
          />
              {/* CLIENTE - Reservas protegidas */}
          <Route
            path="/reservascli"
            element={
              <ProtectedRoute requireCliente>
                <LayoutCliente>
                  <ReservaPage />
                </LayoutCliente>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cliente/reservas/confirmacion/:id"
            element={
              <ProtectedRoute requireCliente>
                <LayoutCliente>
                  <ConfirmacionFinalReservaHorario />
                </LayoutCliente>
              </ProtectedRoute>
            }
          />

            {/*  <Route
              path="/reservas/historial"
              element={
                <ProtectedRoute>
                  <HistorialReserva />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notificaciones"
              element={
                <ProtectedRoute>
                  <Notificaciones />
                </ProtectedRoute>
              }
            />

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
            path="/admin/usuarios/clientes"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayoutAdmin>
                  <PageClientes/>
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
        {/*)}*/}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRouter;