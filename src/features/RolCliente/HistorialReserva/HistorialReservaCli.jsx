// HistorialReservaCli.jsx
import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  QrCode,
  CreditCard,
  Eye,
  UserPlus,
  CalendarDays,
  XCircle,
  RefreshCw,
  Filter,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useTheme } from "../../../context/ThemeContext";
import {
  getReservasPorCliente,
  getReservasPorRangoFechas,
  getReservasPorEstado
} from "../../../api/ReservaApi";
import { useNavigate } from "react-router-dom";

const ESTADO_COLORES = {
  PENDIENTE: "border-orange-500 bg-orange-50 dark:bg-gray-900",
  CONFIRMADA: "border-blue-500 bg-blue-50 dark:bg-gray-900",
  EN_CURSO: "border-purple-500 bg-purple-50 dark:bg-gray-900",
  COMPLETADA: "border-green-500 bg-green-50 dark:bg-gray-900",
  CANCELADA: "border-red-500 bg-red-50 dark:bg-gray-900",
};

const ESTADO_TEXTO = {
  PENDIENTE: "Pendiente",
  CONFIRMADA: "Confirmada",
  EN_CURSO: "En curso",
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada",
};
//aqui es donde me falta filtro de estado por fecha  es que debe ser de un solo clienyte
export default function HistorialReservaCli() {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const idCliente = user?.idPersona;

  const [reservas, setReservas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();


  useEffect(() => {
    //console.log("➡️ useEffect ejecutado");
    //console.log({ user, idCliente, filtroEstado, fechaInicio, fechaFin });

    if (idCliente) {
      cargarReservas();
    } else {
      //console.warn("⚠️ Usuario no logueado");
      setReservas([]);
      setLoading(false);
    }
  }, [idCliente, filtroEstado, fechaInicio, fechaFin]);

  const cargarReservas = async () => {
    try {
      //console.log("🔄 Cargando reservas...");
      setLoading(true);
      let data = [];

      if (filtroEstado === "TODOS" && !fechaInicio && !fechaFin) {
        data = await getReservasPorCliente(idCliente);
      } else if (fechaInicio || fechaFin) {
        data = await getReservasPorRangoFechas(idCliente, fechaInicio, fechaFin);
      } else {
        data = await getReservasPorEstado(filtroEstado);
      }
     
      if (filtroEstado !== "TODOS") {
        data = data.filter(r => r.estadoReserva === filtroEstado);
      }

      setReservas(data);
    } catch (error) {
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  const getAccionesPorEstado = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return ["QR", "Pagar", "Detalle", "Invitados", "Reprogramar", "Cancelar"];
      case "CONFIRMADA":
        return ["QR", "Detalle", "Invitados", "Cancelar"];
      case "EN_CURSO":
      case "COMPLETADA":
        return ["QR", "Detalle", "Invitados"];
      case "CANCELADA":
        return ["Detalle"];
      default:
        return ["Detalle"];
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <p className="text-gray-700 dark:text-gray-300">Debes iniciar sesión para ver tus reservas.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors pt-20 ${isDarkMode ? "bg-black" : "bg-white"}`}>
      {/* Header */}
      <div
        className={`border-b-2 
          ${isDarkMode ? "bg-pb-10 border-p-3 text-p-6" : "bg-p-6 border-p-1 text-pb-10"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-1">

            {/* Título principal */}
            <h1
              className="text-3xl lg:text-4xl font-bold tracking-tight"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
             Todas Mis Reservas
            </h1>

            {/* Texto descriptivo */}
            <div className="max-w-2xl">
              <p
                className="text-lg sm:text-xl leading-relaxed"
                style={{
                  fontFamily: "'Baloo Tamma 2', sans-serif",
                  color: isDarkMode ? "rgba(255,255,255,0.7)" : "rgba(20,20,20,0.8)"
                }}
              >
                Aquí encontrarás <span className="font-semibold text-p-1">todas tus reservas</span> pasadas,
                presentes y futuras. Podrás ver detalles, pagar, generar QR, invitar amigos,
                reprogramar o cancelar según el estado de cada una.
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className="fixed bottom-6 right-6 z-50 p-4 rounded-full transition-all hover:scale-110"
              style={{
                backgroundColor: isDarkMode ? "#2C7366" : "#d40000",
                color: "#FFFFFF",
              }}
            >
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>


      <div className="max-w-5xl mx-auto px-3 py-8">

        {/* Filtros */}
        <div
          className={`rounded-2xl p-6 mb-8 transition-all`}
          style={{
            backgroundColor: isDarkMode ? "#0f1213" : "#ffffffff",
            boxShadow: isDarkMode
              ? "0 0 25px rgba(0, 0, 0, 0.35)"
              : "0 4px 20px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Filtro estado */}
            <div className="flex-1">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: isDarkMode ? "#7fd8c7" : "#2C7366" }}
              >
                <Filter className="inline w-4 h-4 mr-1" /> Filtrar por estado
              </label>

              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className={`w-full px-4 py-2 rounded-xl text-sm transition-all
                  ${isDarkMode
                    ? "bg-[#141717] text-gray-200"
                    : "bg-white text-gray-900"
                  }
                `}
                style={{
                  border: "1px solid transparent",
                  outline: "none",
                }}
              >
                <option value="TODOS">Todas las reservas</option>
                <option value="PENDIENTE">Pendientes</option>
                <option value="CONFIRMADA">Confirmadas</option>
                <option value="EN_CURSO">En curso</option>
                <option value="COMPLETADA">Completadas</option>
                <option value="CANCELADA">Canceladas</option>
              </select>
            </div>

            {/* Filtro fechas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {/* Desde */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: isDarkMode ? "#7fd8c7" : "#2C7366" }}
                >
                  Desde
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className={`w-full px-4 py-2 rounded-xl text-sm transition-all
                    ${isDarkMode
                      ? "bg-[#141717] text-gray-200"
                      : "bg-white text-gray-900"
                    }
                  `}
                  style={{ border: "1px solid transparent", outline: "none" }}
                />
              </div>

              {/* Hasta */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: isDarkMode ? "#7fd8c7" : "#2C7366" }}
                >
                  Hasta
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className={`w-full px-4 py-2 rounded-xl text-sm transition-all
                    ${isDarkMode
                      ? "bg-[#141717] text-gray-200"
                      : "bg-white text-gray-900"
                    }
                  `}
                  style={{ border: "1px solid transparent", outline: "none" }}
                />
              </div>
            </div>
          </div>
        </div>



        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-sm p-6 animate-pulse`}></div>
            ))}
          </div>
        )}

        {/* No hay reservas */}
        {!loading && reservas.length === 0 && (
          <div className="text-center py-16">
            <CalendarDays className={`w-20 h-20 mx-auto ${isDarkMode ? "text-gray-600" : "text-gray-300"} mb-4`} />
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-lg`}>
              No tienes reservas {filtroEstado !== "TODOS" ? "con este estado" : ""}
            </p>
          </div>
        )}

        {/* Lista de reservas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!loading && reservas.map((r) => (
            <div
              key={r.idReserva}
              className={`
                relative overflow-hidden shadow-lg transition-all hover:scale-[1.02]
                border-l-8 
                ${ESTADO_COLORES[r.estadoReserva] || "border-gray-300"}
              `}
              style={{
                backgroundColor: isDarkMode ? "#0f1213" : "#ffffff",
              }}
            >
              <div className="p-6">
                {/* HEADER */}
                <div className="flex justify-between items-start mb-4">
                  <h3
                    className="text-xl font-bold"
                    style={{
                      color: isDarkMode ? "#e5e5e5" : "#0b0d0e",
                      fontFamily: "'Oswald', sans-serif",
                    }}
                  >
                    {r.cancha?.nombre || "Cancha"}
                  </h3>

                  {/* BADGE DE ESTADO */}
                  <span
                    className="px-3 py-1 rounded-md text-xs font-semibold text-white"
                    style={{
                      backgroundColor:
                        r.estadoReserva === "COMPLETADA"
                          ? "#2C7366"
                          : r.estadoReserva === "PENDIENTE"
                          ? "#d18500"
                          : r.estadoReserva === "CANCELADA"
                          ? "#b60000"
                          : r.estadoReserva === "EN_CURSO"
                          ? "#4e3ac9"
                          : "#2C7366",
                    }}
                  >
                    {ESTADO_TEXTO[r.estadoReserva] || r.estadoReserva}
                  </span>
                </div>

                {/* INFO */}
                <div
                  className="space-y-3 text-sm"
                  style={{ color: isDarkMode ? "#c2c2c2" : "#444" }}
                >
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: "#2C7366" }} />
                    {r.cancha?.zona || "Zona Central"}
                  </p>

                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" style={{ color: "#2C7366" }} />
                    {format(new Date(r.fechaReserva), "dd 'de' MMMM, yyyy")}
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: "#2C7366" }} />
                    {r.horaInicio?.slice(0, 5)} - {r.horaFin?.slice(0, 5)}
                  </p>

                  <p className="flex items-center gap-2">
                    <Users className="w-4 h-4" style={{ color: "#2C7366" }} />
                    Capacidad: {r.cancha?.capacidad || 10}
                  </p>
                </div>

                {/* ACCIONES */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {getAccionesPorEstado(r.estadoReserva).map((accion) => (
                    <button
                      key={accion}
                       onClick={() => {
                        if (accion === "Pagar") {
                          navigate(`/reservas/pagos/${r.idReserva}/listar`);
                        }
                        /*if (accion === "QR") {
                          navigate(`/reserva/${r.idReserva}/qr`);
                        }
                        if (accion === "Detalle") {
                          navigate(`/reserva/${r.idReserva}`);
                        }*/
                        // Puedes agregar más acciones aquí
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all"
                      style={{
                        background:
                          accion === "Cancelar"
                            ? "#b60000"
                            : accion === "Pagar"
                            ? "#46c4b7"
                            : accion === "QR"
                            ? "#f38321"
                            : isDarkMode
                            ? "#171a1b"
                            : "#f2f2f2",
                        color:
                          accion === "Cancelar" || accion === "Pagar"
                            ? "#fff"
                            : isDarkMode
                            ? "#e5e5e5"
                            : "#333",
                      }}
                    >
                      {accion === "QR" && <QrCode className="w-4 h-4" />}
                      {accion === "Pagar" && <CreditCard className="w-4 h-4" />}
                      {accion === "Detalle" && <Eye className="w-4 h-4" />}
                      {accion === "Invitados" && <UserPlus className="w-4 h-4" />}
                      {accion === "Reprogramar" && <RefreshCw className="w-4 h-4" />}
                      {accion === "Cancelar" && <XCircle className="w-4 h-4" />}
                      {accion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      
      
      </div>
    </div>
  );
}
