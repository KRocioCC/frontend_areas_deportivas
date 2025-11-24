// src/features/pagos/RealizarPagoPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
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
    <div className={`min-h-screen p-6 ${bg}`}>
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-sm px-3 py-2 rounded-lg bg-[#46c4b7] text-white">
          <FaArrowLeft /> Volver atrás
        </button>

        <h1 className="text-xl font-bold mb-4">Realizar pago - Reserva #{reserva?.idReserva}</h1>

        <div className={`${card} p-4 rounded-xl shadow mb-6`}>
          <p><strong>Total:</strong> {totalIncluye.toFixed(2)}</p>
          <p><strong>Pagado:</strong> {Number(reserva?.totalPagado ?? 0).toFixed(2)}</p>
          <p><strong>Saldo:</strong> {saldoPendiente.toFixed(2)}</p>
          <p className="text-xs opacity-70 mt-2">Horas restantes: {horasRestantes.toFixed(1)}</p>
        </div>

        {!primeraVez && tipoCongelado && (
          <div className={`${card} p-4 rounded-xl mb-6`}>
            <div className="text-sm opacity-80">Tipo de pago fijado:</div>
            <div className="font-semibold mt-1">{tipoCongelado}</div>
          </div>
        )}

        {primeraVez && !tipoCongelado && (
          <div className={`p-4 rounded-xl mb-6 ${card}`}>
            <h2 className="font-semibold mb-2">Selecciona el tipo de pago (solo la primera vez)</h2>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => seleccionarTipo("TOTAL")} className="p-3 rounded-lg border text-sm">Total</button>
              <button onClick={() => seleccionarTipo("ANTICIPO")} className="p-3 rounded-lg border text-sm">Anticipo (Mitad)</button>
              <button onClick={() => seleccionarTipo("PARCIAL")} className="p-3 rounded-lg border text-sm">Parcial</button>
            </div>
          </div>
        )}

        {(tipoSeleccionado || tipoCongelado) && (
          <div className={`p-4 rounded-xl mb-6 ${card}`}>
            <h2 className="font-semibold mb-2">Monto a pagar</h2>
            {((primeraVez && tipoSeleccionado === "PARCIAL") || (!primeraVez && tipoCongelado === "PARCIAL")) && (
              <div className="mb-3">
                <div className="text-xs mb-2">Opcional: elegir cuotas (3,4,5)</div>
                <div className="flex gap-2">
                  {[3,4,5].map(c => (
                    <button key={c} onClick={() => seleccionarCuotas(c)} className={`px-3 py-2 rounded-lg border ${cuotasElegidas===c ? 'ring-2' : ''}`}>{c} cuotas</button>
                  ))}
                </div>
              </div>
            )}

            <input
              type="number"
              min="0.01"
              step="0.01"
              value={monto}
              onChange={(e) => { setMonto(e.target.value); if(tipoSeleccionado==="PARCIAL") setCuotasElegidas(null); }}
              className="w-full p-3 rounded-lg border"
              placeholder="Ingresa monto a pagar"
            />
            <div className="text-xs opacity-70 mt-2">Máx: S/ {saldoPendiente.toFixed(2)}</div>
          </div>
        )}

        {(tipoSeleccionado || tipoCongelado) && (
          <div className={`p-4 rounded-xl mb-6 ${card}`}>
            <h2 className="font-semibold mb-2">Método de pago</h2>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setMetodo("QR")} className={`p-3 rounded-lg border ${metodo==="QR" ? "ring-2" : ""}`}><FaQrcode className="text-2xl" /></button>
              <button onClick={() => setMetodo("TARJETA")} className={`p-3 rounded-lg border ${metodo==="TARJETA" ? "ring-2" : ""}`}><FaCreditCard className="text-2xl" /></button>
              {puedeEfectivo ? (
                <button onClick={() => setMetodo("EFECTIVO")} className={`p-3 rounded-lg border ${metodo==="EFECTIVO" ? "ring-2" : ""}`}><FaMoneyBillWave className="text-2xl" /></button>
              ) : (
                <div className="p-3 rounded-lg border opacity-40 text-xs flex items-center justify-center">Efectivo (no disponible)</div>
              )}
            </div>
          </div>
        )}

        {metodo && (
          <div className="mb-6">
            <label className="flex items-start gap-3">
              <input type="checkbox" checked={aceptaTerminos} onChange={() => setAceptaTerminos(!aceptaTerminos)} />
              <div className="text-xs">
                <div className="font-semibold">Términos y condiciones</div>
                <div className="opacity-70">Acepto que este pago se procesa según la política de la reserva...</div>
              </div>
            </label>
          </div>
        )}

        <button
          disabled={procesando}
          onClick={handleCrearPago}
          className="w-full py-3 rounded-lg font-bold bg-[#46c4b7] text-white disabled:opacity-50"
        >
          {procesando ? "Procesando..." : "Crear pago / Continuar"}
        </button>

        {mensaje && (
          <div className={`p-3 rounded ${mensaje.type === "error" ? "bg-red-500 text-white" : "bg-green-600 text-white"} mt-3`}>
            {mensaje.text}
          </div>
        )}

      </div>
    </div>
  );
}
