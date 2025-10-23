import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requireAdmin = false, requireClient = false,requireSuperuser = false,requireControl = false, }) => {
  const {
    isAuthenticated,
    currentUser,
    isAdmin,
    isSuperuser,
    isClient,
    roles,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

    // No autenticado
  if (!isAuthenticated) {
    // 🔐 Usuario no autenticado → redirigir al login
    return <Navigate to="/login" replace />;
    
  }

  if (currentUser?.estado === 'PENDIENTE') {
    return <Navigate to="/pendiente-aprobacion" replace />;
  }

  // 🔒 Restricciones por rol
  if (requireSuperuser && !isSuperuser) {
    return <Navigate to="/canchas" replace />;
  }

  // ✅ Si la ruta requiere admin/superusuario y el usuario no lo es → redirigir
  if (requireAdmin && !(isAdmin || isSuperuser)) {
    return <Navigate to="/canchas" replace />;
  }

  // ✅ Si la ruta requiere cliente y el usuario no lo es → redirigir
  if (requireClient && !isClient) {
    return <Navigate to="/canchas" replace />;
  }

  if (requireControl && !roles.includes('ROL_CONTROL')) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Usuario autorizado → mostrar contenido
  return children;
};

export default ProtectedRoute;
