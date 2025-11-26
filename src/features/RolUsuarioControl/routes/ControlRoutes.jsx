import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LayoutControl from '../components/LayoutControl';



// IMPORTAREMOS LAS PAGINAS REALES EN EL SIGUIENTE PASO
import DashboardPage from '../pages/Dashboard/DashboardPage';
import EscanerPage from '../pages/Escaner/EscanerPage';
import CanchaPage from '../pages/Cancha/CanchaPage';


import PerfilPage from '../pages/Perfil/PerfilPage';
import MiAreaPage from '../pages/MiArea/MiAreaPage';
const ControlRoutes = () => {
  return (
    <Routes>
      {/* Todas las rutas de este rol usan el LayoutControl */}
      <Route element={<LayoutControl />}>
        
        {/* Ruta por defecto: redirigir al dashboard */}
        <Route path="/" element={<Navigate to="dashboard" replace />} />

        {/* Dashboard Principal */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* NUEVA RUTA: El * permite sub-rutas si las necesitamos luego */}
        <Route path="cancha/:id/*" element={<CanchaPage />} />

        {/* Escáner QR */}
        <Route path="escaner" element={<EscanerPage />} />

        {/* NUEVAS RUTAS */}
        <Route path="perfil" element={<PerfilPage />} />
        <Route path="mi-area" element={<MiAreaPage />} />

        {/* Ruta 404 interna del rol */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
        
      </Route>
    </Routes>
  );
};

export default ControlRoutes;