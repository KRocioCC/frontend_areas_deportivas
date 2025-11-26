import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './ui/table';
import Badge from './ui/badge/Badge';
import { getReservasPorAdministradorEnRango } from '../../../../api/ReservaApi';

export default function TablaPedidosRecientes({ idAdministrador }) {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReservasDelMes() {
      try {
 

        if (!idAdministrador) {
          console.warn('No se recibió idAdministrador. No se puede cargar reservas.');
          setLoading(false);
          return;
        }

        const hoy = new Date();
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

        const formato = (fecha) => fecha.toISOString().split('T')[0];
        const inicio = formato(inicioMes);
        const fin = formato(finMes);


        const data = await getReservasPorAdministradorEnRango(idAdministrador, inicio, fin);

        console.log(' Reservas recibidas:', data);
        setReservas(data);
      } catch (error) {
        console.error('Error al cargar reservas del mes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReservasDelMes();
  }, [idAdministrador]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Reservas del Mes
          </h3>
        </div>
        
      </div>

      <div className="max-w-full overflow-x-auto">
        {loading ? (
          <p className="text-gray-500">⏳ Cargando reservas...</p>
        ) : reservas.length === 0 ? (
          <p className="text-gray-500">📭 No hay reservas este mes.</p>
        ) : (
          <Table>
            <TableHeader className="border-gray-100 border-y">
              <TableRow>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs">
                  Cliente
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs">
                  Cancha
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs">
                  Fecha
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs">
                  Estado
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100">
              {reservas.map((reserva) => (
                <TableRow key={reserva.idReserva}>
                  <TableCell className="py-3 text-gray-800 text-theme-sm">
                    {reserva.cliente?.nombre || 'Cliente N/A'}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm">
                    {reserva.cancha?.nombre || 'Cancha N/A'}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm">
                    {reserva.fechaReserva}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm">
                    <Badge
                      size="sm"
                      color={
                        reserva.estadoReserva === 'COMPLETADA'
                          ? 'success'
                          : reserva.estadoReserva === 'PENDIENTE'
                          ? 'warning'
                          : 'error'
                      }
                    >
                      {reserva.estadoReserva}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
