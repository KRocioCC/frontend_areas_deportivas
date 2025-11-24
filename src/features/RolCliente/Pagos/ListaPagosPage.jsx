// src/features/pagos/ListPagosPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useTheme } from "../../../context/ThemeContext";
import { getPagosByReserva, createPago, confirmarPago } from "../../../api/PagosApi";
import { getReservaPorId } from "../../../api/ReservaApi";
import { obtenerMontoTotal } from "../../../api/IncluyeApi";
import {FaArrowLeft } from "react-icons/fa";

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
  const puedeRealizarPago = !pagadaCompleta && reserva && user?.idPersona;

  // Nota: lo pasamos a la pantalla de pago para que ese flujo lo respete
  const tipoPagoCongelado = pagos.length > 0 ? pagos[0].tipoPago : null;
  const primeraVez = pagos.length === 0;

  if (loading) return <div className="p-6">Cargando pagos...</div>;
  if (!reserva) return <div className="p-6">Reserva no encontrada o no autorizada.</div>;

  return (
    <div 
      className={`min-h-screen pt-16 p-6 font-sans transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-[#0f1213] text-[#e6e6e6]' 
          : 'bg-[#ffffff] text-[#0b0d0e]'
      }`}
    >
      <div className="max-w-3xl mx-auto">
        {/* ——— ENCABEZADO ——— */}
        <header className="mb-8">
          <h2 
            className="text-2xl font-bold tracking-tight mb-1"
            style={{ fontFamily: 'var(--font-Oswald)' }}
          >
            Pagos Realizados
          </h2>
          <p 
            className="text-sm opacity-90"
            style={{ fontFamily: 'var(--font-Balo)' }}
          >
            Reserva <span className="font-medium">{reserva.idReserva}</span> · Cancha: {reserva.cancha?.nombre} · Fecha: {reserva.fechaReserva}
          </p>
        </header>

        {/* ——— TOTALES (3 cards en fila) ——— */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: totalIncluye.toFixed(2), color: isDarkMode ? '#2C7366' : '#46c4b7', bold: true },
            { label: 'Pagado', value: totalPagado.toFixed(2), color: isDarkMode ? '#8a262866' : '#d40000', bold: false },
            { label: 'Saldo', value: saldoPendiente.toFixed(2), color: saldoPendiente > 0 ? (isDarkMode ? '#f35734' : '#f38321') : (isDarkMode ? '#2C7366' : '#46c4b7'), bold: saldoPendiente > 0 }
          ].map(({ label, value, color, bold }, i) => (
            <div 
              key={label}
              className={`rounded-xl p-5 shadow-sm border transition-all duration-200 hover:shadow-md ${
                isDarkMode ? 'border-[#1e2224]' : 'border-[#e0e0e0]'
              }`}
              style={{
                background: isDarkMode ? '#080a0b' : '#FFFFFF',
                boxShadow: `0 2px 6px rgba(0,0,0,${isDarkMode ? '0.2' : '0.05'})`,
              }}
            >
              <div 
                className="text-xs font-medium uppercase tracking-wide opacity-90 mb-1"
                style={{ fontFamily: 'var(--font-Alumni)' }}
              >
                {label}
              </div>
              <div 
                className={`${bold ? 'font-bold' : 'font-semibold'} text-xl tracking-tight`}
                style={{ 
                  fontFamily: 'var(--font-Oswald)',
                  color: color
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* ——— LISTA DE PAGOS ——— */}
        <div className="space-y-4 mb-10">
          {pagos.length === 0 ? (
            <div 
              className="py-10 text-center rounded-xl"
              style={{ 
                background: isDarkMode ? '#080a0b' : '#FFFFFF',
                border: isDarkMode ? '1px solid #1e2224' : '1px solid #e0e0e0',
                fontFamily: 'var(--font-Balo)'
              }}
            >
              <p className="text-sm opacity-70">No se registran pagos para esta reserva.</p>
            </div>
          ) : (
            pagos.map((p) => (
              <div
                key={p.idPago}
                className={`flex items-start gap-4 p-5 rounded-xl transition-all duration-200 hover:shadow-md border ${
                  isDarkMode ? 'border-[#1e2224] hover:border-[#2C7366]' : 'border-[#e0e0e0] hover:border-[#41bfb29f]'
                }`}
                style={{
                  background: isDarkMode ? '#080a0b' : '#FFFFFF',
                  boxShadow: `0 2px 5px rgba(0,0,0,${isDarkMode ? '0.15' : '0.03'})`,
                }}
              >
                <img 
                  src={p.cliente?.urlImagen || '/img/avatar-placeholder.png'} 
                  alt="cliente" 
                  className="w-12 h-12 rounded-full object-cover mt-1 flex-shrink-0 ring-2 ring-opacity-20"
                  style={{ 
                    borderColor: isDarkMode ? '#2C736644' : '#41bfb29f44' 
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div 
                        className="font-semibold tracking-tight mb-0.5"
                        style={{ fontFamily: 'var(--font-Alumni)', fontSize: '1.05rem' }}
                      >
                        {p.cliente?.nombre} {p.cliente?.apellidoPaterno}
                      </div>
                      <div 
                        className="text-xs opacity-80 flex flex-wrap gap-2"
                        style={{ fontFamily: 'var(--font-Balo)' }}
                      >
                        <span>{p.tipoPago}</span>
                        <span>•</span>
                        <span>{p.metodoPago}</span>
                        <span>•</span>
                        <span>{p.fecha}</span>
                      </div>
                    </div>
                    <div 
                      className="font-bold text-lg tracking-tight whitespace-nowrap"
                      style={{ 
                        fontFamily: 'var(--font-Oswald)',
                        color: isDarkMode ? '#f35734' : '#f38321'
                      }}
                    >
                      {Number(p.monto).toFixed(2)}
                    </div>
                  </div>
                  {p.descripcion && (
                    <div 
                      className="text-sm opacity-85 mt-2 leading-relaxed"
                      style={{ fontFamily: 'var(--font-Balo)' }}
                    >
                      {p.descripcion}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ——— BOTONES (acciones) ——— */}
        <div className="flex flex items-center justify-between mt-10-end gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-sm"
            style={{
              fontFamily: 'var(--font-josefin)',
              background: isDarkMode ? '#8a2628' : '#d61727',
              color: '#FFFFFF',
              boxShadow: isDarkMode 
                ? '0 2px 6px rgba(180, 91, 93, 0.3)' 
                : '0 2px 6px rgba(214, 23, 39, 0.25)',
            }}
          >
            <FaArrowLeft /> Salir
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
              className="px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
              style={{
                fontFamily: 'var(--font-josefin)',
                background: isDarkMode ? '#f35734' : '#46c4b7',
                color: '#FFFFFF',
                boxShadow: isDarkMode 
                  ? '0 4px 12px rgba(243, 87, 52, 0.3)' 
                  : '0 4px 12px rgba(65, 191, 178, 0.25)',
              }}
            >
              Realizar pago
            </button>
          ) : (
            <button 
              disabled 
              className="px-6 py-3 rounded-lg font-medium opacity-60 cursor-not-allowed"
              style={{
                fontFamily: 'var(--font-josefin)',
                background: isDarkMode ? '#1e2224' : '#f0f0f0',
                color: isDarkMode ? '#555' : '#888',
              }}
            >
              Realizar pago
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
