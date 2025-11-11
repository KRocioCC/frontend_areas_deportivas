import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from './ui/table';
import Badge from './ui/badge/Badge';
import { getReservasPorRangoFechas } from '../../../../api/ReservaApi';

export default function TablaPedidosRecientes() {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    async function fetchReservasRecientes() {
      try {
        const hoy = new Date();
        const hace7dias = new Date(hoy);
        hace7dias.setDate(hoy.getDate() - 7);

        const formato = (fecha) => fecha.toISOString().split('T')[0];
        const data = await getReservasPorRangoFechas(
          formato(hace7dias),
          formato(hoy)
        );

        setReservas(data);
      } catch (error) {
        console.error('Error al cargar reservas recientes:', error);
      }
    }

    fetchReservasRecientes();
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Reservas Recientes
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Filtrar
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Ver todas
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Cliente
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Cancha
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Fecha
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Estado
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {reservas.map((reserva) => (
              <TableRow key={reserva.id}>
                <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90">
                  {reserva.idCliente || 'Cliente N/A'}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {reserva.canchaNombre || 'Cancha N/A'}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {reserva.fecha}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      reserva.estado === 'Completada'
                        ? 'success'
                        : reserva.estado === 'Pendiente'
                        ? 'warning'
                        : 'error'
                    }
                  >
                    {reserva.estado}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
