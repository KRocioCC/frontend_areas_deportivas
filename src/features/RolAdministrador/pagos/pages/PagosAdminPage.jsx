import React from 'react';
import { DollarSign } from 'lucide-react'; // Asegúrate de importar el ícono
import TablaPagosReserva from '../components/TablaPagosReserva';
import './PagosAdminPage.css';

export default function PagosAdminPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="pagos-page-container">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title flex items-center gap-2">
              <DollarSign size={24} className="text-blue-600" /> {/* Ícono al lado del título */}
              Control de Pagos y Deudas
            </h1>
            <p className="page-subtitle">Visualiza el estado financiero de las reservas en tus canchas.</p>
          </div>

          {/* Tabla de Reporte */}
          <TablaPagosReserva />
        </div>
      </div>
    </div>
  );
}
