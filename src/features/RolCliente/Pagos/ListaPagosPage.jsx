// src/features/pagos/ListPagosPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useTheme } from "../../../context/ThemeContext";
import { getPagosByReserva, createPago, confirmarPago } from "../../../api/PagosApi";
import { getReservaPorId } from "../../../api/ReservaApi";
import { obtenerMontoTotal } from "../../../api/IncluyeApi";
import { FaQrcode, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

function generarCodigoTransaccion(idReserva, clienteId) {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PAY-${idReserva}-${clienteId}-${timestamp}${random}`;
}

export default function ListPagosPage() {
  const { idReserva } = useParams();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [reserva, setReserva] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [montoTotalIncluye, setMontoTotalIncluye] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        console.log("ListPagosPage - cargando reserva y pagos para idReserva:", idReserva);
        const r = await getReservaPorId(idReserva);
        console.log("reserva recibida:", r);

        if (!mounted) return;

        if (r.clienteId !== user?.idPersona) {
          console.warn("El usuario no es dueño de esta reserva");
          setMensaje({ type: "error", text: "No autorizado para ver esta reserva." });
          setLoading(false);
          return;
        }

        setReserva(r);

        const pagosResp = await getPagosByReserva(idReserva);
        console.log("pagos por reserva:", pagosResp);
        setPagos(pagosResp || r.pagos || []);

        const monto = await obtenerMontoTotal(r.idReserva, r.cancha?.idCancha, r.disciplina?.idDisciplina);
        console.log("monto total incluye:", monto);
        // monto puede venir como { montoTotal: 100 } o number
        setMontoTotalIncluye(monto?.montoTotal ?? monto?.total ?? monto ?? 0);
      } catch (err) {
        console.error("error cargando datos de pagos:", err);
        setMensaje({ type: "error", text: "No se pudo cargar la información." });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [idReserva, user]);

  // cálculos
  const totalPagado = Number(reserva?.totalPagado ?? pagos.reduce((s, p) => s + Number(p.monto || 0), 0));
  const totalIncluye = Number(montoTotalIncluye ?? 0);
  const saldoPendiente = Number(reserva?.saldoPendiente ?? Math.max(0, totalIncluye - totalPagado));
  const pagadaCompleta = Boolean(reserva?.pagadaCompleta === true || saldoPendiente <= 0);

  // Botón "Realizar pago" habilitado solo si falta saldo y usuario es dueño
  const puedeRealizarPago = !pagadaCompleta && reserva && reserva.clienteId === user?.idPersona;

  // Tipo elegido congelado (si hay pagos, tomar el tipo del primer pago)
  // Nota: lo pasamos a la pantalla de pago para que ese flujo lo respete
  const tipoPagoCongelado = pagos.length > 0 ? pagos[0].tipoPago : null;
  const primeraVez = pagos.length === 0;

  if (loading) return <div className="p-6">Cargando pagos...</div>;
  if (!reserva) return <div className="p-6">Reserva no encontrada o no autorizada.</div>;

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-[#0f1213] text-white' : 'bg-white text-[#0b0d0e]'}`}>
      <div className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h2 className="text-2xl font-bold">Pagos - Reserva #{reserva.idReserva}</h2>
          <p className="text-sm opacity-80">Cancha: {reserva.cancha?.nombre} · Fecha: {reserva.fechaReserva}</p>
        </header>

        {/* Totales */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 rounded-xl p-4 shadow" style={{ background: isDarkMode ? '#111' : '#fff' }}>
            <div className="text-xs">Total</div>
            <div className="text-xl font-semibold">{(totalIncluye).toFixed(2)}</div>
          </div>
          <div className="flex-1 rounded-xl p-4 shadow" style={{ background: isDarkMode ? '#111' : '#fff' }}>
            <div className="text-xs">Pagado</div>
            <div className="text-xl font-semibold">{totalPagado.toFixed(2)}</div>
          </div>
          <div className="flex-1 rounded-xl p-4 shadow" style={{ background: isDarkMode ? '#111' : '#fff' }}>
            <div className="text-xs">Saldo</div>
            <div className="text-xl font-semibold">{saldoPendiente.toFixed(2)}</div>
          </div>
        </div>

        {/* Lista de pagos */}
        <div className="space-y-3 mb-6">
          {pagos.length === 0 && <div className="text-center py-6">No se encontraron pagos para esta reserva.</div>}
          {pagos.map((p) => (
            <div key={p.idPago} className="flex items-center gap-4 rounded-xl p-4 shadow transition" style={{ background: isDarkMode ? '#080a0b' : '#fff' }}>
              <img src={p.cliente?.urlImagen || '/img/avatar-placeholder.png'} alt="cliente" className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{p.cliente?.nombre} {p.cliente?.apellidoPaterno}</div>
                    <div className="text-xs opacity-80">{p.tipoPago} · {p.metodoPago} · {p.fecha}</div>
                  </div>
                  <div className="text-lg font-bold">{Number(p.monto).toFixed(2)}</div>
                </div>
                {p.descripcion && <div className="text-sm opacity-80 mt-2">{p.descripcion}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Acciones: Ver historial SIEMPRE; Realizar pago solo si falta saldo */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md font-medium"
            style={{ background: '#f2f2f2', color: '#0b0d0e' }}
          >
            Salir
          </button>

          {puedeRealizarPago ? (
            <button
              onClick={() => {
                console.log("Ir a PaymentPage - reserva:", reserva, { primeraVez, tipoPagoCongelado });
                navigate(`/reservas/pagos/${reserva.idReserva}/pagar`, {
                  state: {
                    reserva,
                    montoTotalIncluye: totalIncluye,
                    primeraVez,
                    tipoPagoElegido: tipoPagoCongelado
                  }
                });
              }}
              className="px-4 py-2 rounded-md font-medium"
              style={{ background: '#46c4b7', color: '#fff' }}
            >
              Realizar pago
            </button>
          ) : (
            <button disabled className="px-4 py-2 rounded-md font-medium opacity-40 cursor-not-allowed" style={{ background: '#46c4b7', color: '#fff' }}>
              Realizar pago
            </button>
          )}
        </div>

        {/* Mensajes de ayuda / debug */}
        <div className="mt-6 text-sm">
          {mensaje && <div className={`p-3 rounded ${mensaje.type === 'error' ? 'bg-red-600 text-white' : mensaje.type === 'success' ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black'}`}>{mensaje.text}</div>}

          <div className="mt-3 p-3 bg-gray-50 text-xs rounded text-gray-600">
            <strong>Debug console:</strong>
            <ul className="list-disc pl-5">
              <li>Revisa la consola (console.log) para ver los objetos completos de reserva, pagos y respuestas del backend.</li>
              <li>Si realizas un pago en tarjeta/QR, el backend suele devolver el pago creado; después confirmamos con confirmarPago(idPago, codigo).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
