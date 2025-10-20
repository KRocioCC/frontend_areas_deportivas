import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requireAdmin = false, requireClient = false }) => {
  const {
    isAuthenticated,
    isAdmin,
    isSuperuser,
    isClient,
    isLoading
  } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (!isAuthenticated) {
    // 🔐 Usuario no autenticado → redirigir al login
    return <Navigate to="/login" replace />;
  }

  // ✅ Si la ruta requiere admin/superusuario y el usuario no lo es → redirigir
  if (requireAdmin && !(isAdmin || isSuperuser)) {
    return <Navigate to="/canchas" replace />;
  }

  // ✅ Si la ruta requiere cliente y el usuario no lo es → redirigir
  if (requireClient && !isClient) {
    return <Navigate to="/macrodistritos" replace />;
  }

  // ✅ Usuario autorizado → mostrar contenido
  return children;
};

export default ProtectedRoute;
