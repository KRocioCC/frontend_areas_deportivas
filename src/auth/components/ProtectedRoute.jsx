import React from 'react';
import { Navigate ,useLocation} from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


const ProtectedRoute = ({
  children,
  requireAdmin = false,
  requireClient = false,
  requireSuperuser = false,
  requireControl = false,
}) => {
  const {
    isAuthenticated,
    currentUser,
    isAdmin,
    isSuperuser,
    isClient,
    roles,
    isLoading,
  } = useAuth();
   const location = useLocation();

  // 🐞 Consola para debuguear estado de autenticación
  console.log("🔐 ProtectedRoute Debug:");
  console.log("isAuthenticated:", isAuthenticated);
  console.log("isLoading:", isLoading);
  console.log("currentUser:", currentUser);
  console.log("roles:", roles);
  console.log("isAdmin:", isAdmin);
  console.log("isSuperuser:", isSuperuser);
  console.log("isClient:", isClient);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }
/*
  if (!isAuthenticated) {
    console.warn("⛔ Usuario no autenticado. Redirigiendo al login.");
    return <Navigate to="/inicio" replace />;
  }*/

  if (!isAuthenticated) {
    console.warn("⛔ Usuario no autenticado. Redirigiendo al login.");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!currentUser) {
    // guarda la ruta completa (objeto) para que Login pueda redirigir correctamente
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  //Si no tiene rol de admin o superusuario, lo manda a /inicio
  if (requireAdmin && !roles.some(r => r.includes("ADMIN") || r.includes("SUPERUSUARIO"))) {
    return <Navigate to="/inicio" replace />;
  }
  //Si no tiene rol de cliente, también lo manda a /inicio.
  if (requireClient && !roles.includes("ROLE_CLIENTE")) {
    return <Navigate to="/inicio" replace />;
  }

  if (currentUser?.estado === 'PENDIENTE') {
    console.warn("⏳ Usuario pendiente de aprobación. Redirigiendo.");
    return <Navigate to="/pendiente-aprobacion" replace />;
  }

  if (requireSuperuser && !isSuperuser) {
    console.warn("🔒 Ruta requiere SUPERUSUARIO. Redirigiendo.");
    return <Navigate to="/canchas" replace />;
  }

  if (requireAdmin && !(isAdmin || isSuperuser)) {
    console.warn("🔒 Ruta requiere ADMIN o SUPERUSUARIO. Redirigiendo.");
    return <Navigate to="/canchas" replace />;
  }
  //vuelvesara
  if (requireClient && !isClient) {
    console.warn("Ruta requiere CLIENTE. Redirigiendo.");
    return <Navigate to="/inicio" replace />;
  }

  if (requireControl && !roles.includes('ROL_CONTROL')) {
    console.warn("🔒 Ruta requiere ROL_CONTROL. Redirigiendo.");
    return <Navigate to="/login" replace />;
  }

  // ✅ Usuario autorizado
  console.log("✅ Usuario autorizado. Renderizando contenido.");
  return children;
};

export default ProtectedRoute;
