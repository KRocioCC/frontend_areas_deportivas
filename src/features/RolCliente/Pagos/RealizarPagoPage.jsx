// src/features/pagos/RealizarPagoPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { createPago, confirmarPago } from "../../../api/PagosApi";
import QRCode from "react-qr-code";
import { FaArrowLeft, FaCreditCard, FaMoneyBillWave, FaQrcode } from "react-icons/fa";

/**
 * RealizarPagoPage:
 * - recibe por location.state: { reserva, montoTotalIncluye, primeraVez, tipoPagoElegido }
 * - tiene lógica de: TOTAL / ANTICIPO / PARCIAL (con cuotas opcionales o monto libre)
 * - congela el tipo elegido en la primera transacción (se mantiene en memoria)
 * - genera QR simulado con react-qr-code
 * - efectivo aparece solo si faltan < 12 horas
 * - checkbox de términos obligatorio
 * - botones volver / consola debug (console.log en puntos clave)
 */

function generarCodigoTransaccion(idReserva, clienteId) {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PAY-${idReserva}-${clienteId}-${timestamp}${random}`;
}

function horasRestantesParaReserva(reserva) {
  try {
    // reserva.fechaReserva: 'YYYY-MM-DD', reserva.horaInicio: 'HH:MM' o 'HH:MM:SS'
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
  // tipoCongelado: si existe (pagos previos) lo usamos; si no, se asigna en la primera transacción
  const [tipoCongelado, setTipoCongelado] = useState(tipoPagoElegidoFromState ?? null);

  // UI states
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null); // visible solo si primeraVez
  const [metodo, setMetodo] = useState(null);
  const [monto, setMonto] = useState("");
  const [cuotasElegidas, setCuotasElegidas] = useState(null);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [pagoCreado, setPagoCreado] = useState(null);
  const [qrEscaneado, setQrEscaneado] = useState(false);

  const primeraVezRef = useRef(primeraVez);

  // si no recibiste reserva via state, intentar obtener (opcional)
  useEffect(() => {
    if (!reserva) {
      console.warn("No se proporcionó reserva desde state. Debes obtenerla via API o navegar correctamente.");
    }
  }, [reserva]);

  // calcular saldo (si backend no envía montoTotalIncluye, se asume reserva.saldoPendiente)
  const totalIncluye = Number(montoTotalIncluye ?? reserva?.total ?? 0);
  const saldoPendiente = Number(reserva?.saldoPendiente ?? Math.max(0, totalIncluye - Number(reserva?.totalPagado ?? 0)));

  // horas restantes para validar efectivo
  const horasRestantes = reserva ? horasRestantesParaReserva(reserva) : 9999;
  const puedeEfectivo = horasRestantes <= 12;

  // si ya existe un tipoCongelado (viene de pagos previos), usamos eso y ocultamos selección de tipo
  useEffect(() => {
    if (tipoCongelado) {
      setTipoSeleccionado(tipoCongelado);
      console.log("Tipo congelado (venía de pagos previos):", tipoCongelado);
    } else if (!primeraVez) {
      // si no es la primera vez pero tampoco hay tipo congelado, intentar inferirlo de payments (otra opción)
      console.log("No es primera vez pero no hay tipoCongelado. Si esto ocurre, backend debería devolver tipo.");
    }
    // si primeraVez entones dejamos visible las opciones
  }, [tipoCongelado, primeraVez]);

  // cuando el usuario selecciona tipo (solo en primera vez), aplicamos valores por defecto
  function seleccionarTipo(t) {
    setTipoSeleccionado(t);
    setTipoCongelado(t); // precongelar en frontend (persistir en primer POST)
    setMensaje(null);

    if (t === "TOTAL") {
      setMonto(saldoPendiente.toFixed(2));
      setCuotasElegidas(null);
    } else if (t === "ANTICIPO") {
      const mitad = Number((totalIncluye / 2).toFixed(2));
      
      setMonto(mitad.toFixed(2));
      setCuotasElegidas(null);
    } else if (t === "PARCIAL") {
      // dejar monto vacío y permitir ingreso o elegir cuotas
      setMonto("");
      setCuotasElegidas(null);
    }
  }

  // si elige cuotas (solo válido cuando PARCIAL), se fija cuotasElegidas
  function seleccionarCuotas(n) {
    setCuotasElegidas(n);
    const cuotaMonto = Number((totalIncluye / n).toFixed(2));
    setMonto(cuotaMonto.toFixed(2));
  }

  // validar monto
  function validarMonto() {
    const nm = Number(monto);
    if (!nm || nm <= 0) return { ok: false, msg: "Monto debe ser mayor a 0" };
    if (nm > saldoPendiente) return { ok: false, msg: "Monto no puede ser mayor al saldo pendiente" };
    // si tipo TOTAL y primeravez, exigir monto igual a saldoPendiente
    if ((tipoSeleccionado === "TOTAL" || tipoCongelado === "TOTAL") && primeraVezRef.current) {
      if (Math.abs(nm - saldoPendiente) > 0.009) return { ok: false, msg: "Para pago total el monto debe ser igual al saldo pendiente" };
    }
    // si tipo ANTICIPO y primera vez, exigir mitad exacta del totalIncluye
    if ((tipoSeleccionado === "ANTICIPO" || tipoCongelado === "ANTICIPO") && primeraVezRef.current) {
      const mitad = Number((totalIncluye / 2).toFixed(2));
      if (Math.abs(nm - mitad) > 0.009)
        return { ok: false, msg: `Anticipo debe ser la mitad del total: ${mitad}` };
    }
    return { ok: true };
  }

  // construir payload y crear pago
  async function handleCrearPago() {
    setMensaje(null);
    const check = validarMonto();
    if (!check.ok) {
      setMensaje({ type: "error", text: check.msg });
      return;
    }
    if (!metodo) {
      setMensaje({ type: "error", text: "Selecciona un método de pago" });
      return;
    }
    if (!aceptaTerminos) {
      setMensaje({ type: "error", text: "Debes aceptar los términos y condiciones" });
      return;
    }

    try {
      setProcesando(true);
      const codigo = generarCodigoTransaccion(reserva.idReserva, reserva.clienteId);

      const tipoAUsar = primeraVezRef.current ? tipoSeleccionado || tipoCongelado : tipoCongelado || tipoSeleccionado;
      if (!tipoAUsar) {
        setMensaje({ type: "error", text: "Tipo de pago no definido" });
        setProcesando(false);
        return;
      }

      const payload = {
        monto: Number(monto),
        metodoPago: metodo === "TARJETA" ? "TARJETA_CREDITO" : metodo === "QR" ? "QR" : "EFECTIVO",
        tipoPago: tipoAUsar === "TOTAL" ? "TOTAL" : tipoAUsar === "ANTICIPO" ? "ANTICIPO" : "PARCIAL",
        estado: "PENDIENTE",
        fecha: new Date().toISOString().slice(0,10),
        descripcion: `Pago ${tipoAUsar} - Reserva #${reserva.idReserva}`,
        codigoTransaccion: codigo,
        idReserva: reserva.idReserva,
        clienteId: reserva.clienteId,
      };

      console.log("Creando pago - payload:", payload);
      const pago = await createPago(payload);
      console.log("Respuesta createPago:", pago);
      setPagoCreado(pago);

      // si era la primera vez, ya "congelamos" en frontend (tipoCongelado ya se puso) - backend idealmente lo debería registrar
      if (primeraVezRef.current) {
        setTipoCongelado(tipoAUsar);
        // después de crear el primer pago lo consideramos que ya no es primera vez
        primeraVezRef.current = false;
        setPrimeraVez(false);
      }

      // comportamiento por método
      if (metodo === "QR") {
        // mostrar QR y permitir "simular pago" -> luego confirmar
        setMensaje({ type: "info", text: "Escanea el QR con tu app (simulado). Pulsa 'Simular pago' para confirmar." });
        // QR renderizado en UI, esperar que usuario pulse 'Simular pago' o simular auto-escan
      } else if (metodo === "TARJETA") {
        setMensaje({ type: "info", text: "Procesando pago con tarjeta..." });
        // simular confirmación automática
        setTimeout(async () => {
          try {
            console.log("Confirmando pago (tarjeta) id:", pago.idPago, pago.codigoTransaccion);
            await confirmarPago(pago.idPago, pago.codigoTransaccion);
            setMensaje({ type: "success", text: "Pago confirmado." });
            // redirigir al historial
            navigate(`/reservas/pagos/${reserva.idReserva}`);
          } catch (e) {
            console.error("Error confirmando tarjeta:", e);
            setMensaje({ type: "error", text: "No se pudo confirmar el pago" });
          }
        }, 2200);
      } else if (metodo === "EFECTIVO") {
        setMensaje({ type: "success", text: "Pago en efectivo registrado. Preséntate en el local antes de 12 horas para validar." });
        // no confirmamos automáticamente; navegar al historial
        navigate(`/reservas/pagos/${reserva.idReserva}`);
      }
    } catch (err) {
      console.error("Error creando pago:", err);
      setMensaje({ type: "error", text: "Error creando el pago." });
    } finally {
      setProcesando(false);
    }
  }

  // función para simular el escaneo del QR (botón en UI)
  async function handleSimularEscaneoQR() {
    if (!pagoCreado) {
      setMensaje({ type: "error", text: "No hay pago QR creado para confirmar." });
      return;
    }
    try {
      setProcesando(true);
      setQrEscaneado(true);
      setMensaje({ type: "info", text: "Simulando pago vía QR..." });
      setTimeout(async () => {
        try {
          await confirmarPago(pagoCreado.idPago, pagoCreado.codigoTransaccion);
          setMensaje({ type: "success", text: "Pago confirmado via QR." });
          navigate(`/reservas/mihistorial`);
        } catch (e) {
          console.error("Error confirmando pago QR:", e);
          setMensaje({ type: "error", text: "No se pudo confirmar el pago QR." });
        } finally {
          setProcesando(false);
        }
      }, 1800);
    } catch (e) {
      console.error(e);
      setProcesando(false);
    }
  }

  // UI helpers
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

        {/* Tipo de pago: mostrar solo si es PRIMERA VEZ */}
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

        {/* Monto y cuotas */}
        {(tipoSeleccionado || tipoCongelado) && (
          <div className={`p-4 rounded-xl mb-6 ${card}`}>
            <h2 className="font-semibold mb-2">Monto a pagar</h2>

            {/* cuotas (solo para parcial) */}
            {( (primeraVez && tipoSeleccionado === "PARCIAL") || (!primeraVez && tipoCongelado === "PARCIAL") ) && (
              <div className="mb-3">
                <div className="text-xs mb-2">Opcional: elegir cuotas (3,4,5) — si eliges, el monto se calcula automáticamente</div>
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
              onChange={(e) => { setMonto(e.target.value); setCuotasElegidas(null); }}
              className="w-full p-3 rounded-lg border"
              placeholder="Ingresa monto a pagar"
            />
            <div className="text-xs opacity-70 mt-2">Máx: S/ {saldoPendiente.toFixed(2)}</div>
          </div>
        )}

        {/* Métodos */}
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

        {/* Terminos */}
        {metodo && (
          <div className="mb-6">
            <label className="flex items-start gap-3">
              <input type="checkbox" checked={aceptaTerminos} onChange={() => setAceptaTerminos(!aceptaTerminos)} />
              <div className="text-xs">
                <div className="font-semibold">Términos y condiciones</div>
                <div className="opacity-70">Acepto que este pago se procesa según la política de la reserva. Si elijo efectivo debo presentarme en el local antes de 12 horas. Si pago por cuotas, me comprometo a respetar los plazos.</div>
              </div>
            </label>
          </div>
        )}

        {/* Botones */}
        <div className="mb-6">
          {metodo === "QR" && pagoCreado ? (
            <div className={`p-4 rounded-xl ${card} mb-3 text-center`}>
              <div className="inline-block bg-white p-4 rounded-lg">
                <QRCode value={`PAGO:${pagoCreado.codigoTransaccion}|MONTO:${pagoCreado.monto}`} size={180} />
              </div>
              <div className="mt-3">
                <button disabled={procesando} onClick={handleSimularEscaneoQR} className="px-4 py-2 rounded-lg bg-[#46c4b7] text-white">
                  {procesando ? "Procesando..." : "Simular pago (QR)"}
                </button>
              </div>
            </div>
          ) : null}

          {metodo && !(metodo === "QR" && pagoCreado) && (
            <button
              disabled={procesando}
              onClick={async () => {
                // si el método es QR, primero crear pago para luego renderizar QR -> el handleCrearPago crea el pago
                await handleCrearPago();
              }}
              className="w-full py-3 rounded-lg font-bold bg-[#46c4b7] text-white disabled:opacity-50"
            >
              {procesando ? "Procesando..." : "Crear pago / Continuar"}
            </button>
          )}
        </div>

        {mensaje && (
          <div className={`p-3 rounded ${mensaje.type === "error" ? "bg-red-500 text-white" : "bg-green-600 text-white"}`}>
            {mensaje.text}
          </div>
        )}

        <div className="mt-6 text-xs opacity-70">
          <strong>Debug:</strong> revisa la consola para ver payloads y respuestas. (console.log en puntos clave)
        </div>
      </div>
    </div>
  );
}
