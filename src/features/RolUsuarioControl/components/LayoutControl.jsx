import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <--- IMPORTAR ESTO
import { ControlProvider } from '../context/ControlProvider';
import NavbarControl from './NavbarControl';
import './LayoutControl.css';

const LayoutControl = () => {
  return (
    <ControlProvider>
      <div className="layout-control-container">
        <NavbarControl />
        
        <main className="layout-content">
          <Outlet />
        </main>

        {/* Agregamos el Toaster aquí para que se vean las notificaciones */}
        <Toaster 
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </ControlProvider>
  );
};

export default LayoutControl;