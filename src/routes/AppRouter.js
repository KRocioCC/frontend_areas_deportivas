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


// CLIENTE - páginas
import Inicio from "../features/RolCliente/Inicio/InicioCli.jsx";
//import Seccion1 from "../feature/RolCliente/Inicio/Seccion1";
import Areadeportiva from "../features/RolCliente/AreaDeportiva/AreaDeportiva.jsx"
import Cancha from "../features/RolCliente/Canchas/Cancha.jsx"
import CanchaDetalle from "../features/RolCliente/Canchas/CanchaDetalle.jsx"
import HistorialReserva from "../features/RolCliente/HistorialReserva/HistorialReservaCli.jsx";
//import Notificaciones from "../feature/RolCliente/Notificaciones/Notificaciones"; // si existe
//import HistorialReserva from "../feature/RolCliente/Areadeportiva/HistorialReserva/HistorialReserva";
//import Notificaciones from "../feature/RolCliente/Notificaciones/Notificaciones"; // si existe
import ReservaPage from "../features/RolCliente/Reserva/ReservaPage22.jsx";
import ReservaCliente from "../features/RolCliente/Reserva/ReservaCliente.jsx";

import ReservaConfirmacion from "../features/RolCliente/Reserva/ReservaConfirmacion.jsx";
//import { ProtectedRoute } from '../auth/components/ProtectedRoute.jsx';
import Calendar from "../features/RolAdministrador/calendar/Calendar";
import ComoFunciona from "../features/RolCliente/Inicio/ComoFunciona.jsx";
import SistemaQR from "../features/RolCliente/Inicio/SistemaQR.jsx";
//import PaymentPage from "../features/RolCliente/Pagos/PaymentPage.jsx";
import ListPagosPage from "../features/RolCliente/Pagos/ListaPagosPage.jsx";
import RealizarPagoPage from "../features/RolCliente/Pagos/RealizarPagoPage.jsx";
import IngresarTarjetaPage from "../features/RolCliente/Pagos/IngresarTarjetaPage.jsx";
import ConfirmarPagoQRPage from "../features/RolCliente/Pagos/ConfirmarPagoQRPage.jsx";

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
          <Route path="/" element={<Navigate to="/inicio" replace />} />


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

          <Route
            path="/reservar/como-funciona"
            element={
              <LayoutCliente>
                <ComoFunciona />
              </LayoutCliente>
            }
          />
          <Route
            path="/reservar/qr"
            element={
              <LayoutCliente>
                <SistemaQR />
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
              <LayoutCliente>
                <CanchaDetalle />
              </LayoutCliente>
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
            path="/reservas/cliente"
            element={
              <ProtectedRoute requireCliente>
                <LayoutCliente>
                  <ReservaCliente />
                </LayoutCliente>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservas/confirmacion"
            element={
              <ProtectedRoute requireCliente>
                <LayoutCliente>
                  <ReservaConfirmacion />
                </LayoutCliente>
              </ProtectedRoute>
            }
          />        

             <Route
              path="/reservas/mihistorial"
              element={
                <ProtectedRoute requireCliente>
                  <LayoutCliente>
                    <HistorialReserva />
                  </LayoutCliente>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reservas/pagos/:idReserva/listar"
              element={
                <ProtectedRoute requireCliente>
                  <LayoutCliente>
                    <ListPagosPage />
                  </LayoutCliente>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reservas/pagos/:idReserva/pagar"
              element={
                <ProtectedRoute requireCliente>
                  <LayoutCliente>
                    <RealizarPagoPage />
                  </LayoutCliente>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reservas/pagos/tarjeta"
              element={
                <ProtectedRoute requireCliente>
                  <LayoutCliente>
                    <IngresarTarjetaPage />
                  </LayoutCliente>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservas/pagos/qr"
              element={
                <ProtectedRoute requireCliente>
                  <LayoutCliente>
                    <ConfirmarPagoQRPage />
                  </LayoutCliente>
                </ProtectedRoute>
              }
            />

            {/*
            <Route
              path="/notificaciones"
              element={
                <ProtectedRoute>
                  <Notificaciones />
                </ProtectedRoute>
              }
            />*/}

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
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayoutAdmin>
                    <Dashboard />
                </DashboardLayoutAdmin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usuarios/control"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayoutAdmin>
                  <PageUsuariosControl/>
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
            path="/admin/calendario"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayoutAdmin>
                  <Calendar />
                </DashboardLayoutAdmin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notificaciones"
            element={
              <ProtectedRoute requireAdmin>
                <DashboardLayoutAdmin>
                  <div>Notificaciones</div>
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