// components/layout/NavbarAdmin.js
import React from "react";
import { TfiMenu } from "react-icons/tfi";
import { useAuth } from "../../auth/hooks/useAuth";

function NavbarAdmin({ onToggleSidebar, sidebarOpen }) {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <TfiMenu className="h-6 w-6" />
          </button>
          
          <div className="ml-4">
            <h1 className="text-xl font-semibold text-gray-800">
              Panel Administrador
            </h1>
            <p className="text-sm text-gray-600">
              Sistema de Gestión
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">
              {currentUser?.username || 'Administrador'}
            </p>
            <p className="text-xs text-gray-600">Rol: Administrador</p>
          </div>
          
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {currentUser?.username?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavbarAdmin;