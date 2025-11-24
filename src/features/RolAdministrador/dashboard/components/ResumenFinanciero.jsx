import { useEffect, useState } from 'react';
import { getClientes } from '../../../../api/clienteApi';
import { getReservasPorAdministradorEnRango } from '../../../../api/ReservaApi';
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from '../icons';
import Badge from './ui/badge/Badge';

const ResumenFinanciero = ({ idAdministrador }) => {
  const [clientes, setClientes] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [reservasPrevias, setReservasPrevias] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Clientes globales (puedes filtrar por admin si tu API lo soporta)
        const clientesData = await getClientes();
        setClientes(clientesData);

        const hoy = new Date();
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

        const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        const finMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

        const formato = (fecha) => fecha.toISOString().split('T')[0];

        // Reservas del mes actual para este administrador
        const reservasData = await getReservasPorAdministradorEnRango(
          idAdministrador,
          formato(inicioMes),
          formato(finMes)
        );
        setReservas(reservasData);

        // Reservas del mes anterior para este administrador
        const reservasPreviasData = await getReservasPorAdministradorEnRango(
          idAdministrador,
          formato(inicioMesAnterior),
          formato(finMesAnterior)
        );
        setReservasPrevias(reservasPreviasData);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      }
    }

    if (idAdministrador) {
      fetchData();
    }
  }, [idAdministrador]);

  const totalClientes = clientes.length;
  const totalReservas = reservas.length;
  const reservasAnteriores = reservasPrevias.length;

  const calcularPorcentaje = (actual, anterior) => {
    if (anterior === 0) return actual > 0 ? 100 : 0;
    return ((actual - anterior) / anterior) * 100;
  };

  const porcentajeReservas = calcularPorcentaje(totalReservas, reservasAnteriores);
  const esPositivo = porcentajeReservas >= 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Tarjeta: Clientes */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 w-6 h-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Clientes</span>
            <h4 className="mt-2 font-bold text-gray-800 text-lg dark:text-white/90">
              {totalClientes}
            </h4>
          </div>
          <Badge color="success" startIcon={<ArrowUpIcon />}>
            +100%
          </Badge>
        </div>
      </div>

      {/* Tarjeta: Reservas */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 w-6 h-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Reservas (Administrador {idAdministrador})</span>
            <h4 className="mt-2 font-bold text-gray-800 text-lg dark:text-white/90">
              {totalReservas}
            </h4>
          </div>
          <Badge
            color={esPositivo ? 'success' : 'error'}
            startIcon={esPositivo ? <ArrowUpIcon /> : <ArrowDownIcon />}
          >
            {esPositivo ? '+' : ''}
            {Math.abs(porcentajeReservas).toFixed(2)}%
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ResumenFinanciero;
