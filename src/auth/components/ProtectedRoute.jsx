import React from 'react';
import { Navigate } from 'react-router-dom';
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

  if (!isAuthenticated) {
    console.warn("⛔ Usuario no autenticado. Redirigiendo al login.");
    return <Navigate to="/login" replace />;
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

  if (requireClient && !isClient) {
    console.warn("🔒 Ruta requiere CLIENTE. Redirigiendo.");
    return <Navigate to="/solicitud" replace />;
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
