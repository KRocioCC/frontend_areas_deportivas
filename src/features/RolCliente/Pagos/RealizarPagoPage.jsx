// src/features/pagos/RealizarPagoPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../context/ToastContext";
import { createPago } from "../../../api/PagosApi";
import { FaArrowLeft, FaCreditCard, FaMoneyBillWave, FaQrcode } from "react-icons/fa";

function generarCodigoTransaccion(idReserva, clienteId) {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PAY-${idReserva}-${clienteId}-${timestamp}${random}`;
}

function horasRestantesParaReserva(reserva) {
  try {
    const fecha = reserva?.fechaReserva;
    const hora = (reserva?.horaInicio || "00:00").slice(0,5);
    const fechaHora = new Date(`${fecha}T${hora}:00`);
    const diffMs = fechaHora - new Date();
    return diffMs / (1000 * 60 * 60);
  } catch (e) {
    console.warn("No se pudo calcular horasRestantes", e);
    return 9999;
  }
}

export default function RealizarPagoPage() {
  const { idReserva } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const { reserva: reservaFromState, montoTotalIncluye: montoIncluyeFromState, primeraVez: primeraVezFromState, tipoPagoElegido: tipoPagoElegidoFromState } = location.state || {};
  const [reserva, setReserva] = useState(reservaFromState || null);
  const [montoTotalIncluye, setMontoTotalIncluye] = useState(Number(montoIncluyeFromState ?? 0));
  const [primeraVez, setPrimeraVez] = useState(Boolean(primeraVezFromState));
  const [tipoCongelado, setTipoCongelado] = useState(tipoPagoElegidoFromState ?? null);

  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const [metodo, setMetodo] = useState(null);
  const [monto, setMonto] = useState("");
  const [cuotasElegidas, setCuotasElegidas] = useState(null);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [pagoCreado, setPagoCreado] = useState(null);

  const primeraVezRef = useRef(primeraVez);

  useEffect(() => {
    if (!reserva) console.warn("No se proporcionó reserva desde state.");
  }, [reserva]);

  const totalIncluye = Number(montoTotalIncluye ?? reserva?.total ?? 0);
  const saldoPendiente = Number(reserva?.saldoPendiente ?? Math.max(0, totalIncluye - Number(reserva?.totalPagado ?? 0)));
  const horasRestantes = reserva ? horasRestantesParaReserva(reserva) : 9999;
  const puedeEfectivo = horasRestantes <= 12;
  const { showToast } = useToast();

  useEffect(() => {
    if (tipoCongelado) {
      setTipoSeleccionado(tipoCongelado);
      if (tipoCongelado === "PARCIAL" && reserva?.cuotas) setCuotasElegidas(reserva.cuotas);
    }
  }, [tipoCongelado, reserva]);

  function seleccionarTipo(t) {
    setTipoSeleccionado(t);
    setTipoCongelado(t);
    setMensaje(null);

    if (t === "TOTAL") setMonto(saldoPendiente.toFixed(2));
    else if (t === "ANTICIPO") setMonto((saldoPendiente >= totalIncluye/2 ? (totalIncluye/2).toFixed(2) : saldoPendiente.toFixed(2)));
    else if (t === "PARCIAL") setMonto("");
  }

  function seleccionarCuotas(n) {
    setCuotasElegidas(n);
    const cuotaMonto = Math.floor((totalIncluye / n) * 100) / 100;
    setMonto(cuotaMonto.toFixed(2));
  }

  function validarMonto() {
    const nm = Number(monto);
    if (!nm || nm <= 0) return { ok: false, msg: "Monto debe ser mayor a 0" };
    if (nm > saldoPendiente) return { ok: false, msg: "Monto no puede ser mayor al saldo pendiente" };

    if ((tipoSeleccionado === "TOTAL" || tipoCongelado === "TOTAL") && primeraVezRef.current) {
      if (Math.abs(nm - saldoPendiente) > 0.009) return { ok: false, msg: "Para pago total el monto debe ser igual al saldo pendiente" };
    }

    if ((tipoSeleccionado === "ANTICIPO" || tipoCongelado === "ANTICIPO") && primeraVezRef.current) {
      const mitad = Number((totalIncluye / 2).toFixed(2));
      if (Math.abs(nm - mitad) > 0.009) return { ok: false, msg: `Anticipo debe ser la mitad del total: ${mitad}` };
    }
    return { ok: true };
  }

  async function handleCrearPago() {
    setMensaje(null);
    const tipoActual = tipoSeleccionado || tipoCongelado;

    if (!tipoActual) {
      showToast("Debes seleccionar un tipo de pago", "warning");
      setProcesando(false);
      return; 
    }
    const check = validarMonto();
    if (!check.ok) { setMensaje({ type: "error", text: check.msg }); return; }
    if (!metodo) { setMensaje({ type: "error", text: "Selecciona un método de pago" }); return; }
    if (!aceptaTerminos) { setMensaje({ type: "error", text: "Debes aceptar los términos y condiciones" }); return; }

    try {
      setProcesando(true);
      const codigo = generarCodigoTransaccion(reserva.idReserva, reserva.clienteId);
      const tipoAUsar = primeraVezRef.current ? tipoSeleccionado || tipoCongelado : tipoCongelado || tipoSeleccionado;

      const payload = {
        monto: Number(monto),
        metodoPago: metodo === "TARJETA" ? "TARJETA_CREDITO" : metodo === "QR" ? "QR" : "EFECTIVO",
        tipoPago: tipoAUsar,
        estado: "PENDIENTE",
        fecha: new Date().toISOString().slice(0,10),
        descripcion: `Pago ${tipoAUsar} - Reserva #${reserva.idReserva}`,
        codigoTransaccion: codigo,
        idReserva: reserva.idReserva,
        clienteId: reserva.clienteId,
        cuotas: cuotasElegidas ?? 1
      };
      console.log("ENVIANDO AL BACKEND:", payload);

      const pago = await createPago(payload);
      setPagoCreado(pago);

      if (primeraVezRef.current) {
        setTipoCongelado(tipoAUsar);
        primeraVezRef.current = false;
        setPrimeraVez(false);
      }

      if (metodo === "QR") navigate(`/reservas/pagos/qr`, { state: { pago } });
      else if (metodo === "TARJETA") navigate(`/reservas/pagos/tarjeta`, { state: { pago } });
      else navigate(`/reservas/mihistorial`);

    } catch (err) {
      console.error(err);
      setMensaje({ type: "error", text: "Error creando el pago." });
    } finally { setProcesando(false); }
  }

  const bg = isDarkMode ? "bg-[#0c0f11] text-white" : "bg-white text-[#0c0f11]";
  const card = isDarkMode ? "bg-[#111416]" : "bg-[#f6f6f6]";

 return (
    <div 
      className={`min-h-screen p-4 pt-16 transition-colors duration-300 ${
        isDarkMode ? 'bg-[#0f1213] text-[#e6e6e6]' : 'bg-[#ffffff] text-[#0b0d0e]'
      }`}
      style={{ fontFamily: 'var(--font-Balo)' }}
    >
      <div className="max-w-2xl mx-auto">

        {/* ——— TÍTULO ——— */}
        <h1 
          className="text-2xl font-bold tracking-tight mb-5"
          style={{ fontFamily: 'var(--font-Oswald)' }}
        >
          Realizar pago
        </h1>
        <p 
          className="text-sm opacity-85 mb-6"
          style={{ fontFamily: 'var(--font-Balo)' }}
        >
          Reserva <span className="font-semibold">#{reserva?.idReserva}</span>
        </p>

        {/* ——— RESUMEN DE SALDOS ——— */}
        <div 
          className="rounded-xl p-5 mb-6 shadow-sm border"
          style={{
            background: isDarkMode ? '#080a0b' : '#FFFFFF',
            border: isDarkMode ? '1px solid #1e2224' : '1px solid #e0e0e0',
            boxShadow: `0 3px 8px rgba(0,0,0,${isDarkMode ? '0.2' : '0.05'})`,
          }}
        >
          <div className="grid grid-cols-3 gap-2 text-center mb-3">
            <div>
              <div className="text-xs opacity-80 uppercase tracking-wide" style={{ fontFamily: 'var(--font-Alumni)' }}>Total</div>
              <div className="font-bold text-lg" style={{ fontFamily: 'var(--font-Oswald)', color: isDarkMode ? '#2C7366' : '#41bfb2' }}>
                {totalIncluye.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs opacity-80 uppercase tracking-wide" style={{ fontFamily: 'var(--font-Alumni)' }}>Pagado</div>
              <div className="font-semibold text-lg" style={{ fontFamily: 'var(--font-Oswald)', color: isDarkMode ? '#8a262888' : '#d61727' }}>
                {Number(reserva?.totalPagado ?? 0).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs opacity-80 uppercase tracking-wide" style={{ fontFamily: 'var(--font-Alumni)' }}>Saldo</div>
              <div 
                className="font-bold text-lg"
                style={{ 
                  fontFamily: 'var(--font-Oswald)',
                  color: saldoPendiente > 0 
                    ? (isDarkMode ? '#f35734' : '#f28627') 
                    : (isDarkMode ? '#2C7366' : '#41bfb2')
                }}
              >
                {saldoPendiente.toFixed(2)}
              </div>
            </div>
          </div>
          <div 
            className="text-xs opacity-70 text-center"
            style={{ fontFamily: 'var(--font-Balo)' }}
          >
            Horas restantes: {horasRestantes.toFixed(1)}
          </div>
        </div>

        {/* ——— TIPO DE PAGO FIJADO ——— */}
        {!primeraVez && tipoCongelado && (
          <div 
            className="rounded-xl p-5 mb-6 border"
            style={{
              background: isDarkMode ? '#080a0b' : '#FFFFFF',
              border: isDarkMode ? '1px solid #1e2224' : '1px solid #e0e0e0',
            }}
          >
            <div 
              className="text-sm opacity-80 uppercase tracking-wide mb-2"
              style={{ fontFamily: 'var(--font-Alumni)' }}
            >
              Tipo de pago fijado
            </div>
            <div 
              className="font-semibold text-lg"
              style={{ fontFamily: 'var(--font-Alumni)', color: isDarkMode ? '#2C7366' : '#41bfb29f' }}
            >
              {tipoCongelado}
            </div>
          </div>
        )}

        {/* ——— SELECCIÓN TIPO (primera vez) ——— */}
        {primeraVez && !tipoCongelado && (
          <div 
            className="rounded-xl p-5 mb-6 border"
            style={{
              background: isDarkMode ? '#080a0b' : '#FFFFFF',
              border: isDarkMode ? '1px solid #1e2224' : '1px solid #e0e0e0',
            }}
          >
            <h2 
              className="font-semibold mb-4 tracking-tight"
              style={{ fontFamily: 'var(--font-Alumni)' }}
            >
              Selecciona el tipo de pago (solo la primera vez)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Total', value: 'TOTAL' },
                { label: 'Anticipo\n(Mitad)', value: 'ANTICIPO' },
                { label: 'Parcial', value: 'PARCIAL' }
              ].map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => seleccionarTipo(value)}
                  className="p-4 rounded-lg border transition-colors duration-200 flex flex-col items-center justify-center gap-1 hover:opacity-90"
                  style={{
                    fontFamily: 'var(--font-josefin)',
                    background: 'transparent',
                    border: `1px solid ${isDarkMode ? '#2a2e30' : '#d1d5db'}`,
                    color: isDarkMode ? '#e6e6e6' : '#0b0d0e',
                  }}
                >
                  <span className="text-sm font-medium whitespace-pre-line">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ——— MONTO A PAGAR ——— */}
        {(tipoSeleccionado || tipoCongelado) && (
          <div 
            className="rounded-xl p-5 mb-6 border"
            style={{
              background: isDarkMode ? '#080a0b' : '#FFFFFF',
              border: isDarkMode ? '1px solid #1e2224' : '1px solid #e0e0e0',
            }}
          >
            <h2 
              className="font-semibold mb-3 tracking-tight"
              style={{ fontFamily: 'var(--font-Alumni)' }}
            >
              Monto a pagar
            </h2>

            {((primeraVez && tipoSeleccionado === "PARCIAL") || (!primeraVez && tipoCongelado === "PARCIAL")) && (
              <div className="mb-4">
                <div 
                  className="text-xs opacity-80 mb-2"
                  style={{ fontFamily: 'var(--font-Balo)' }}
                >
                  Opcional: elige cuotas (3, 4 o 5)
                </div>
                <div className="flex flex-wrap gap-2">
                  {[3, 4, 5].map(c => (
                    <button
                      key={c}
                      onClick={() => seleccionarCuotas(c)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        cuotasElegidas === c 
                          ? 'ring-2 ring-offset-1' 
                          : 'border'
                      }`}
                      style={{
                        fontFamily: 'var(--font-josefin)',
                        background: cuotasElegidas === c 
                          ? (isDarkMode ? '#2C7366' : '#41bfb29f') 
                          : 'transparent',
                        color: cuotasElegidas === c 
                          ? '#FFFFFF' 
                          : (isDarkMode ? '#e6e6e6' : '#0b0d0e'),
                        border: cuotasElegidas === c 
                          ? 'none' 
                          : `1px solid ${isDarkMode ? '#2a2e30' : '#d1d5db'}`,
                      }}
                    >
                      {c} cuotas
                    </button>
                  ))}
                </div>
              </div>
            )}

            <input
              type="number"
              min="0.01"
              step="0.01"
              value={monto}
              onChange={(e) => { 
                setMonto(e.target.value); 
                if (tipoSeleccionado === "PARCIAL") setCuotasElegidas(null); 
              }}
              className="w-full p-4 rounded-lg text-base"
              placeholder="Ingresa el monto"
              style={{
                fontFamily: 'var(--font-Balo)',
                background: isDarkMode ? '#080a0b' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#2a2e30' : '#d1d5db'}`,
                color: isDarkMode ? '#e6e6e6' : '#0b0d0e',
              }}
            />
            <div 
              className="text-xs opacity-70 mt-2"
              style={{ fontFamily: 'var(--font-Balo)' }}
            >
              Máximo: S/ {saldoPendiente.toFixed(2)}
            </div>
          </div>
        )}

        {/* ——— MÉTODO DE PAGO ——— */}
        {(tipoSeleccionado || tipoCongelado) && (
          <div 
            className="rounded-xl p-5 mb-6 border"
            style={{
              background: isDarkMode ? '#080a0b' : '#FFFFFF',
              border: isDarkMode ? '1px solid #1e2224' : '1px solid #e0e0e0',
            }}
          >
            <h2 
              className="font-semibold mb-3 tracking-tight"
              style={{ fontFamily: 'var(--font-Alumni)' }}
            >
              Método de pago
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'QR', icon: <FaQrcode className="text-2xl" />, label: 'QR' },
                { id: 'TARJETA', icon: <FaCreditCard className="text-2xl" />, label: 'Tarjeta' },
                { id: 'EFECTIVO', icon: <FaMoneyBillWave className="text-2xl" />, label: 'Efectivo', disabled: !puedeEfectivo }
              ].map(({ id, icon, label, disabled }) => (
                <button
                  key={id}
                  onClick={() => !disabled && setMetodo(id)}
                  disabled={disabled}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 ${
                    disabled 
                      ? 'opacity-40 cursor-not-allowed' 
                      : metodo === id 
                        ? 'ring-2 ring-offset-1' 
                        : 'hover:opacity-90'
                  }`}
                  style={{
                    fontFamily: 'var(--font-josefin)',
                    background: metodo === id 
                      ? (isDarkMode ? '#2C7366' : '#41bfb2') 
                      : 'transparent',
                    color: metodo === id 
                      ? '#FFFFFF' 
                      : (isDarkMode ? '#e6e6e6' : '#0b0d0e'),
                    border: metodo === id 
                      ? 'none' 
                      : `1px solid ${isDarkMode ? '#2a2e30' : '#d1d5db'}`,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                  }}
                >
                  {icon}
                  <span className="text-xs mt-1">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ——— CHECKBOX TÉRMINOS ——— */}
        {metodo && (
          <div className="mb-6 flex items-start gap-3">
            <input
              type="checkbox"
              checked={aceptaTerminos}
              onChange={() => setAceptaTerminos(!aceptaTerminos)}
              className="mt-1 flex-shrink-0 w-4 h-4 rounded accent-current"
              style={{
                accentColor: isDarkMode ? '#2C7366' : '#41bfb2',
              }}
            />
            <label 
              className="text-xs leading-relaxed"
              style={{ fontFamily: 'var(--font-Balo)' }}
            >
              <span className="font-semibold">Términos y condiciones</span>
              <br />
              <span className="opacity-80">
                Acepto que este pago se procesa según la política de la reserva y es vinculante.
              </span>
            </label>
          </div>
        )}
        <div className="flex items-center justify-between mt-10">
          {/* ——— BOTÓN VOLVER ATRÁS (rojo temático) ——— */}
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
            <FaArrowLeft /> Volver atrás
          </button>

          {/* ——— BOTÓN PRINCIPAL ——— */}
          <button
            disabled={procesando || !aceptaTerminos}
            onClick={handleCrearPago} // ← aquí usarás showToast dentro de handleCrearPago
            className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-sm"
            style={{
              fontFamily: 'var(--font-josefin)',
              background: procesando || !aceptaTerminos
                ? (isDarkMode ? '#2a2e30' : '#d1d5db')
                : (isDarkMode ? '#f35734' : '#41bfb2'),
              color: '#FFFFFF',
              boxShadow: !procesando && aceptaTerminos
                ? (isDarkMode 
                    ? '0 4px 14px rgba(243, 87, 52, 0.35)' 
                    : '0 4px 14px rgba(65, 191, 178, 0.3)')
                : 'none',
            }}
          >
            {procesando ? (
              <>
                <span className="animate-spin mr-2">↻</span> Procesando…
              </>
            ) : (
              "Continuar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}