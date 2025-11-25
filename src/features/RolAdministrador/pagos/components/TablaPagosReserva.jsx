import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../../../auth/hooks/useAuth';
import { getReservasByAdmin } from '../../../../api/ReservaApi';
import { 
  Search, 
  Filter, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle,
  Calendar
} from 'lucide-react';
import './TablaPagosReserva.css';

// --- UTILIDADES ---
const calcularFinanzas = (reserva) => {
  const pagado = reserva.totalPagado || 0;
  const saldo = reserva.saldoPendiente || 0;
  const total = reserva.montoTotal || (pagado + saldo);

  let estado = "PENDIENTE";
  if (saldo <= 0.5 && total > 0) {
    estado = "COMPLETADO";
  } else if (pagado > 0) {
    estado = "PARCIAL";
  }

  return { total, pagado, saldo, estado };
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

export default function TablaPagosReserva() {
  const { currentUser } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");

  useEffect(() => {
    cargarDatos();
  }, [currentUser]);

  const cargarDatos = async () => {
    if (!currentUser?.idPersona) return;
    setLoading(true);
    try {
      const reservas = await getReservasByAdmin(currentUser.idPersona);
      const sorted = (Array.isArray(reservas) ? reservas : []).sort((a, b) => {
        const saldoA = a.saldoPendiente || 0;
        const saldoB = b.saldoPendiente || 0;
        return saldoB - saldoA;
      });
      setData(sorted);
    } catch (error) {
      console.error("Error cargando finanzas:", error);
    } finally {
      setLoading(false);
    }
  };

  const dataFiltrada = useMemo(() => {
    return data.filter(item => {
      const { estado } = calcularFinanzas(item);
      const nombreCliente = item.cliente ? `${item.cliente.nombre} ${item.cliente.aPaterno}` : "Anónimo";
      
      const matchTexto = 
        nombreCliente.toLowerCase().includes(busqueda.toLowerCase()) ||
        (item.cancha?.nombre || "").toLowerCase().includes(busqueda.toLowerCase());

      const matchEstado = filtroEstado === "TODOS" ? true : estado === filtroEstado;

      return matchTexto && matchEstado;
    });
  }, [data, busqueda, filtroEstado]);

  const stats = useMemo(() => {
    let totalDeuda = 0;
    let totalRecaudado = 0;
    let cantDeudores = 0;

    dataFiltrada.forEach(r => {
      const { saldo, pagado } = calcularFinanzas(r);
      totalDeuda += saldo;
      totalRecaudado += pagado;
      if (saldo > 0.5) cantDeudores++;
    });

    return { totalDeuda, totalRecaudado, cantDeudores };
  }, [dataFiltrada]);

  if (loading) return <div className="p-10 text-center text-gray-400">Cargando información financiera...</div>;

  return (
    <div className="flex flex-col gap-6">
      {/* 1. TARJETAS DE RESUMEN (DASHBOARD) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Por Cobrar (Deuda)" 
          value={`${stats.totalDeuda.toFixed(2)} Bs`} 
          icon={TrendingDown} 
          color="bg-red-50 text-red-600"
        />
        <StatCard 
          title="Dinero Recaudado" 
          value={`${stats.totalRecaudado.toFixed(2)} Bs`} 
          icon={TrendingUp} 
          color="bg-green-50 text-green-600"
        />
        <StatCard 
          title="Reservas Pendientes" 
          value={stats.cantDeudores} 
          icon={AlertCircle} 
          color="bg-blue-50 text-blue-600"
        />
      </div>

      {/* 2. BARRA DE FILTROS Y BÚSQUEDA */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por cliente o cancha..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none text-gray-700"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-gray-400" />
          <select 
            className="bg-gray-50 text-sm text-gray-600 py-2 px-4 rounded-lg outline-none border-none cursor-pointer hover:bg-gray-100 transition-colors"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="TODOS">Todos los estados</option>
            <option value="PENDIENTE">🔴 Pendientes</option>
            <option value="PARCIAL">🟡 Pago Parcial</option>
            <option value="COMPLETADO">🟢 Completados</option>
          </select>
        </div>
      </div>

      {/* 3. TABLA DE RESERVAS */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-medium">Reserva</th>
                <th className="p-4 font-medium">Cliente</th>
                <th className="p-4 font-medium text-right">Total</th>
                <th className="p-4 font-medium text-right">Acuenta</th>
                <th className="p-4 font-medium text-right">Saldo</th>
                <th className="p-4 font-medium text-center">Estado</th>
                <th className="p-4 font-medium text-right">Último Mov.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dataFiltrada.length > 0 ? (
                dataFiltrada.map((getRow) => {
                  const { total, pagado, saldo, estado } = calcularFinanzas(getRow);
                  const ultimoPago = getRow.pagos && getRow.pagos.length > 0 
                                      ? getRow.pagos[getRow.pagos.length - 1].fecha 
                                      : "-";

                  return (
                    <tr key={getRow.idReserva} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-700 text-sm">
                            {getRow.cancha?.nombre || "Cancha General"}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Calendar size={10}/> {getRow.fechaReserva} • {getRow.horaInicio?.slice(0,5)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xs font-bold">
                              {getRow.cliente?.nombre?.charAt(0) || "A"}
                           </div>
                           <span className="text-sm text-gray-600 font-medium">
                              {getRow.cliente ? `${getRow.cliente.nombre} ${getRow.cliente.aPaterno || ''}` : "Anónimo"}
                           </span>
                        </div>
                      </td>
                      <td className="p-4 text-right text-sm font-bold text-gray-700">{total} Bs</td>
                      <td className="p-4 text-right text-sm text-blue-600 font-medium">{pagado > 0 ? pagado : "-"}</td>
                      <td className="p-4 text-right text-sm">
                        {saldo > 0.5 ? (
                           <span className="text-red-500 font-bold">{saldo.toFixed(2)} Bs</span>
                        ) : (
                           <span className="text-gray-300 text-xs">Cancelado</span>
                        )}
                      </td>
                      <td className="p-4 flex justify-center">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide
                          ${estado === 'COMPLETADO' ? 'bg-green-50 text-green-600' : ''}
                          ${estado === 'PARCIAL' ? 'bg-yellow-50 text-yellow-600' : ''}
                          ${estado === 'PENDIENTE' ? 'bg-red-50 text-red-500' : ''}
                        `}>
                          {estado}
                        </span>
                      </td>
                      <td className="p-4 text-right text-xs text-gray-400">
                        {ultimoPago}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400 text-sm">
                    No se encontraron reservas con esos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
