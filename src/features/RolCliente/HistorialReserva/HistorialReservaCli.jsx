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
  ArrowUpDown
} from "lucide-react";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../context/ToastContext";
import {
  getReservasPorClienteYEstado,
  getReservasClienteOrdenDesc,
  getReservasClienteOrdenAsc,
  getReservasPorClienteYNombreCancha, 
  getReservasPorClienteEnRango,      
  getReservasPorCliente,
  cancelarReserva 
} from "../../../api/ReservaApi";
import { useNavigate } from "react-router-dom";
import QrModal from "../QR/QrModal";
import DetalleReservaModal from "./DetalleReservaModal";

const ESTADO_TEXTO = {
  PENDIENTE: "Pendiente",
  CONFIRMADA: "Confirmada",
  CANCELADA: "Cancelada",
};

export default function HistorialReservaCli() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const idCliente = user?.idPersona;

  const [reservas, setReservas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [loading, setLoading] = useState(true);
  const [ordenFecha, setOrdenFecha] = useState("desc");
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const navigate = useNavigate();
  const [openQrModal, setOpenQrModal] = useState(false);
  const [selectedReservaId, setSelectedReservaId] = useState(null);
  const [searchCancha, setSearchCancha] = useState("");
  //detalles
  const [openDetalleModal, setOpenDetalleModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  //para cancelar reserva
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [reservaACancelar, setReservaACancelar] = useState(null);
  const { showToast } = useToast();
  const ESTADO_COLORES = {
    PENDIENTE: isDarkMode ? "border-[#f35734]" : "border-[#f38321]",
    CONFIRMADA: isDarkMode ? "border-[#2C7366]" : "border-[#46c4b7]",
    CANCELADA: isDarkMode ? "border-[#8a2628]" : "border-[#d40000]",
  };

  const toggleOrdenFecha = () => {
    setOrdenFecha(prev => prev === "desc" ? "asc" : "desc");
  };

  useEffect(() => {
    if (idCliente) {
      cargarReservas();
    } else {
      setReservas([]);
      setLoading(false);
    }
  }, [idCliente, filtroEstado, fechaInicio, fechaFin, ordenFecha, searchCancha]);

  // Dentro de tu componente HistorialReservaCli

  const ajustarEstadoReservas = (reservasOriginales) => {
    const ahora = new Date();
    return reservasOriginales.map((r) => {
      // Si la cancha está deshabilitada (estado === false)
      const canchaDeshabilitada = r.cancha?.estado === false;

      // ¿La reserva es futura? (comparar con fechaReserva + horaInicio)
      const fechaReservaCompleta = new Date(`${r.fechaReserva}T${r.horaInicio}`);
      const esFutura = fechaReservaCompleta > ahora;

      // Si la cancha está deshabilitada Y la reserva es futura → marcar como cancelada (solo visualmente)
      if (canchaDeshabilitada && esFutura) {
        return {
          ...r,
          estadoReservaVisual: "CANCELADA_POR_CANCHA", // estado ficticio solo para UI
          _esCanceladaPorCancha: true,
        };
      }

      // Si ya pasó, mantener estado original
      return r;
    });
  };
  const cargarReservas = async () => {
    if (!idCliente) return;

    try {
      setLoading(true);

      let data = [];

      const nombreCancha = searchCancha.trim();
      const tieneEstado = filtroEstado !== "TODOS";
      const tieneFecha = fechaInicio || fechaFin;

      /*
      1️⃣ FILTRO POR NOMBRE DE CANCHA → prioridad máxima
      */
      if (nombreCancha) {
        data = await getReservasPorClienteYNombreCancha(idCliente, nombreCancha); 

        if (tieneEstado) {
          data = data.filter((r) => r.estadoReserva === filtroEstado);
        }

        if (tieneFecha) {
          const inicio = fechaInicio ? new Date(fechaInicio) : null;
          const fin = fechaFin ? new Date(fechaFin) : null;

          data = data.filter((r) => {
            const fr = new Date(r.fechaCreacion);
            if (inicio && fr < inicio) return false;
            if (fin && fr > fin) return false;
            return true;
          });
        }

        setReservas(data);
        return;
      }

      /*
      FILTRO POR FECHAS
      */
      if (tieneFecha) {
        data = await getReservasPorClienteEnRango(idCliente, fechaInicio, fechaFin); // 

        if (tieneEstado) {
          data = data.filter((r) => r.estadoReserva === filtroEstado);
        }

        setReservas(data);
        return;
      }

      /*
      SOLO ESTADO
      */
      if (tieneEstado) {
        data = await getReservasPorClienteYEstado(idCliente, filtroEstado); // 
        setReservas(data);
        return;
      }

      /*
      4️⃣ SOLO ORDEN
      */
      if (ordenFecha !== null) {
        if (ordenFecha === "desc") {
          data = await getReservasClienteOrdenDesc(idCliente);
        } else {
          data = await getReservasClienteOrdenAsc(idCliente);
        }

        setReservas(data);
        return;
      }

      /*
      5️⃣ CASO DEFAULT → TODAS LAS RESERVAS DEL CLIENTE
      */
      data = await getReservasPorCliente(idCliente);
      const dataAjustada = ajustarEstadoReservas(data);
      setReservas(dataAjustada);

    } catch (error) {
      console.error("Error cargando reservas:", error);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  

  const abrirCancelacion = (idReserva) => {
    setReservaACancelar(idReserva);
    setOpenCancelModal(true);
  };
  const confirmarCancelacion = async () => {
    if (!motivoCancelacion.trim()) {
      showToast("Debes ingresar un motivo para cancelar.", "warning");
      //alert("Debes ingresar un motivo para cancelar.");
      return;
    }

    try {
      await cancelarReserva(reservaACancelar, motivoCancelacion);
      setOpenCancelModal(false);
      setMotivoCancelacion("");
      setReservaACancelar(null);

      await cargarReservas(); // 🔄 Recargar lista
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      alert("Hubo un error al cancelar la reserva.");
    }
  };
  useEffect(() => {
    let lista = [...reservas];

    // ✅ Solo si necesitas ordenar por fecha de creación (si el backend no lo hace)
    const parseDate = (str) => {
      if (!str) return NaN;
      if (str.includes('T')) return new Date(str);
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
      if (match) {
        const [_, y, m, d] = match;
        return new Date(Number(y), Number(m) - 1, Number(d));
      }
      const d = new Date(str);
      return isNaN(d) ? NaN : d;
    };

    // ✅ Ordenar por fecha de creación (solo si no viene ordenado desde backend)
    lista.sort((a, b) => {
      const fechaA = parseDate(a.fechaCreacion);
      const fechaB = parseDate(b.fechaCreacion);

      const aInvalid = isNaN(fechaA);
      const bInvalid = isNaN(fechaB);
      if (aInvalid && bInvalid) return 0;
      if (aInvalid) return 1;
      if (bInvalid) return -1;

      return ordenFecha === "desc" ? fechaB - fechaA : fechaA - fechaB;
    });

    setReservasFiltradas(lista);
  }, [reservas, ordenFecha]); 
 
  const abrirDetalle = (reserva) => {
    setReservaSeleccionada(reserva);
    setOpenDetalleModal(true);
  };


  const getAccionesPorEstado = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return ["Ver Pagos","Detalle", "Cancelar"];
      case "CONFIRMADA":
        return ["QR","Invitados", "Detalle", "Ver Pagos"];
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
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-0.5">

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
                presentes y futuras. Podrás ver detalles, Ver Pagos, generar QR, invitar amigos,
                reprogramar o cancelar según el estado de cada una.
              </p>
            </div>
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
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
             {/*buscasor */}
             {/* Buscador por cancha (opcional) */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2" style={{ color: isDarkMode ? "#2C7366" : "#46c4b7" }}>
                Buscar por cancha
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nombre de la cancha"
                  value={searchCancha}
                  onChange={(e) => setSearchCancha(e.target.value)}
                  className={`w-full px-4 py-2 rounded-xl text-sm transition-all
                    ${isDarkMode ? "bg-[#141717] text-gray-200" : "bg-white text-gray-900"}
                  `}
                  style={{ border: "1px solid transparent", outline: "none" }}
                />
                <button
                  onClick={() => cargarReservas()}
                  className="px-4 py-2 rounded-xl font-medium"
                  style={{ background: isDarkMode ? "#171a1b" : "#f2f2f2", color: isDarkMode ? "#e5e5e5" : "#333" }}
                >
                  Buscar
                </button>
              </div>
            </div>


            {/* Filtro por estado */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2" style={{ color: isDarkMode ? "#2C7366" : "#46c4b7" }}>
                <Filter className="inline w-4 h-4 mr-1" /> Filtrar por estado
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className={`w-full px-4 py-2 rounded-xl text-sm transition-all
                  ${isDarkMode ? "bg-[#141717] text-gray-200" : "bg-white text-gray-900"}
                `}
                style={{ border: "1px solid transparent", outline: "none" }}
              >
                <option value="TODOS">Todas las reservas</option>
                <option value="PENDIENTE">Pendientes</option>
                <option value="CONFIRMADA">Confirmadas</option>
                <option value="CANCELADA">Canceladas</option>
              </select>
            </div>

            {/* Filtro por fechas */}
            <div className="flex flex-1 gap-4 flex-col sm:flex-row">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2" style={{ color: isDarkMode ? "#2C7366" : "#46c4b7" }}>
                  Desde
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className={`w-full px-4 py-2 rounded-xl text-sm transition-all
                    ${isDarkMode ? "bg-[#141717] text-gray-200" : "bg-white text-gray-900"}
                  `}
                  style={{ border: "1px solid transparent", outline: "none" }}
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium mb-2" style={{ color: isDarkMode ? "#2C7366" : "#46c4b7" }}>
                  Hasta
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className={`w-full px-4 py-2 rounded-xl text-sm transition-all
                    ${isDarkMode ? "bg-[#141717] text-gray-200" : "bg-white text-gray-900"}
                  `}
                  style={{ border: "1px solid transparent", outline: "none" }}
                />
              </div>
            </div>

            {/* Botón de orden */}
            <div className="flex-none">
              <label className="block text-sm font-medium mb-2 invisible">Orden</label>
              <button
                onClick={toggleOrdenFecha}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl font-medium transition-all
                  ${isDarkMode ? "bg-[#141717] hover:bg-[#1c2021]" : "bg-gray-100 hover:bg-gray-200"}
                `}
                style={{ color: isDarkMode ? "#2C7366" : "#46c4b7" }}
              >
                <ArrowUpDown className="w-4 h-4" />
                {ordenFecha === "desc" ? "Más recientes" : "Más antiguas"}
              </button>
            </div>

          </div>
        </div>

        {/* Loading */}
        {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 animate-pulse transition-all
                ${isDarkMode ? "bg-[#141717]" : "bg-white"}
                ${isDarkMode ? "shadow-md" : "shadow-sm"}
              `}
            >
              <div className={`h-6 w-1/3 rounded bg-gray-400/30 mb-4 ${isDarkMode ? "bg-gray-600/30" : ""}`}></div>

              <div className="flex gap-4 mb-4">
                <div className={`h-4 w-1/4 rounded bg-gray-400/30 ${isDarkMode ? "bg-gray-600/30" : ""}`}></div>
                <div className={`h-4 w-1/3 rounded bg-gray-400/30 ${isDarkMode ? "bg-gray-600/30" : ""}`}></div>
              </div>

              <div className="flex gap-4 mb-4">
                <div className={`h-4 w-1/2 rounded bg-gray-400/30 ${isDarkMode ? "bg-gray-600/30" : ""}`}></div>
              </div>
              <div className={`h-4 w-1/4 rounded bg-gray-400/30 mb-6 ${isDarkMode ? "bg-gray-600/30" : ""}`}></div>
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((b) => (
                  <div
                    key={b}
                    className={`h-8 w-20 rounded-xl bg-gray-400/30 ${isDarkMode ? "bg-gray-600/30" : ""}`}
                  ></div>
                ))}
              </div>
            </div>
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
          {!loading && reservasFiltradas.map((r) => (
            <div
              key={r.idReserva}
              className={`
                relative overflow-hidden shadow-lg transition-all hover:scale-[1.02]
                border-l-8 
                ${ESTADO_COLORES[r.estadoReserva] || "border-gray-300"}
              `}
              style={{
                backgroundColor: isDarkMode ? "#0f1213" : "#ffffff",
                borderLeftWidth: "8px",
                borderLeftColor:
                  r.estadoReserva === "CONFIRMADA"
                    ? (isDarkMode ? "#2C7366" : "#46c4b7")
                    : r.estadoReserva === "PENDIENTE"
                    ? (isDarkMode ? "#f35734" : "#f38321")
                    : r.estadoReserva === "CANCELADA"
                    ? (isDarkMode ? "#8a2628" : "#d40000")
                    : "#ccc",
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
                    className="px-3 py-1 rounded-md text-xs font-semibold"
                    style={{
                      color: "#fff",
                      backgroundColor:
                        r.estadoReserva === "CONFIRMADA"
                          ? (isDarkMode ? "#2C7366" : "#46c4b7")
                          : r.estadoReserva === "PENDIENTE"
                          ? (isDarkMode ? "#f35734" : "#f38321")
                          : r.estadoReserva === "CANCELADA"
                          ? (isDarkMode ? "#8a2628" : "#d40000")
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
                    <MapPin className="w-4 h-4" style={{ color: isDarkMode ? "#2C7366" : "#46c4b7" }} />
                    {r.cancha?.zona || "Zona Central"}
                  </p>

                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" style={{ color: isDarkMode ? "#2C7366" : "#46c4b7" }} />
                    {format(new Date(r.fechaReserva + "T12:00:00" ), "dd 'de' MMMM, yyyy")}
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: isDarkMode ? "#2C7366" : "#46c4b7" }} />
                    {r.horaInicio?.slice(0, 5)} - {r.horaFin?.slice(0, 5)}
                  </p>

                  <p className="flex items-center gap-2">
                    <Users className="w-4 h-4" style={{ color: isDarkMode ? "#2C7366" : "#46c4b7" }} />
                    Capacidad: {r.cancha?.capacidad || 10}
                  </p>
                </div>

                {/* ACCIONES */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {getAccionesPorEstado(r.estadoReserva).map((accion) => (
                    <button
                      key={accion}
                       onClick={() => {
                        if (accion === "Ver Pagos") {
                          navigate(`/reservas/pagos/${r.idReserva}/listar`);
                        }
                        if (accion === "QR") {
                          console.log("ABRIENDO QR PARA:", r.idReserva);
                          setSelectedReservaId(r.idReserva);
                          setOpenQrModal(true);
                        }
                        if (accion === "Detalle") {
                          abrirDetalle(r);
                        }
                        if (accion === "Cancelar") {
                          abrirCancelacion(r.idReserva);
                        }
                        if (accion === "Invitados") {
                          navigate(`/reservas/${r.idReserva}/invitados/listar`);
                        }
                        // Puedes agregar más acciones aquí
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all"
                      style={{
                        background:
                          accion === "Cancelar"
                            ? (isDarkMode ? "#8a2628" : "#d40000")
                            : accion === "Ver Pagos"
                            ? (isDarkMode ? "#2C7366" : "#46c4b7")
                            : accion === "QR"
                            ? (isDarkMode ? "#f35734" : "#f38321")
                            : isDarkMode
                            ? "#171a1b"
                            : "#f2f2f2",
                        color:
                          accion === "Cancelar" || accion === "Ver Pagos" || accion === "QR"
                            ? "#fff"
                            : (isDarkMode ? "#e5e5e5" : "#333"),
                      }}
                    >
                      {accion === "QR" && <QrCode className="w-4 h-4" />}
                      {accion === "Ver Pagos" && <CreditCard className="w-4 h-4" />}
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
      <QrModal
        open={openQrModal}
        onClose={() => setOpenQrModal(false)}
        idReserva={selectedReservaId}
      />

      

      {openCancelModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
        <div className={`p-6 rounded-xl shadow-lg w-full max-w-md
          ${isDarkMode ? "bg-[#111315] text-white" : "bg-white text-gray-900"}`}>
          
          <h2 className="text-xl font-bold mb-4">Cancelar Reserva</h2>

          <label className="block text-sm font-medium mb-2">
            Motivo de cancelación
          </label>

          <textarea
            value={motivoCancelacion}
            onChange={(e) => setMotivoCancelacion(e.target.value)}
            rows="3"
            className={`w-full p-3 rounded-lg border mb-4 resize-none outline-none
              ${isDarkMode 
                ? "bg-[#0f1213] border-gray-700 text-gray-200" 
                : "bg-gray-100 border-gray-300 text-gray-800"}`}
            placeholder="Escribe el motivo..."
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setOpenCancelModal(false)}
              className={`px-4 py-2 rounded-lg font-semibold
                ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-900"}`}
            >
              Cerrar
            </button>

            <button
              onClick={confirmarCancelacion}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    )}

  <DetalleReservaModal
    open={openDetalleModal}
    onClose={() => setOpenDetalleModal(false)}
    reserva={reservaSeleccionada}
    isDarkMode={isDarkMode}
  />



    </div>
  );
}
