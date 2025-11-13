import { useContext } from 'react';
import { AuthContext } from '../../../auth/context/AuthContext';
import ResumenFinanciero from './components/ResumenFinanciero';
import MetaMensual from './components/MetaMensual';
import TablaPedidosRecientes from './components/TablaPedidosRecientes';

export default function DashboardAdministrador() {
  const { currentUser } = useContext(AuthContext); 

  console.log('Usuario en DashboardAdministrador:', currentUser);

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Panel Administrador
      </h1>

      {/* Fila 1: Resumen financiero */}
      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <ResumenFinanciero />
        </div>
      </div>

      {/* Fila 2: Meta mensual */}
      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <MetaMensual />
        </div>
      </div>

      {/* Fila 3: Tabla de pedidos recientes */}
      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <TablaPedidosRecientes idAdministrador={currentUser?.id} />
        </div>
      </div>
    </div>
  );
}
