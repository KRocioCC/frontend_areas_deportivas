// src/features/pagos/PaymentPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useTheme } from "../../../context/ThemeContext";
import { createPago, confirmarPago } from "../../../api/PagosApi";
import { getReservaPorId } from "../../../api/ReservaApi";
import { FaQrcode, FaCreditCard,FaMoneyBillWave, FaMobileAlt,FaWallet} from "react-icons/fa";
import {obtenerMontoTotal} from "../../../api/IncluyeApi";

// Métodos simplificados
const METODOS_PAGO = [
  { id: "QR", nombre: "QR", icon: <FaQrcode size={24} className="text-blue-600" /> },
  { id: "TARJETA", nombre: "Tarjeta", icon: <FaCreditCard size={24} className="text-indigo-600" /> },
  { id: "EFECTIVO", nombre: "Efectivo", icon: <FaMoneyBillWave size={24} className="text-green-600" /> },
];

function generarCodigoTransaccion(idReserva, clienteId) {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PAY-${idReserva}-${clienteId}-${timestamp}${random}`;
}

export default function PaymentPage() {
  const { idReserva: paramId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [tipoPago, setTipoPago] = useState("COMPLETO");
  const [metodoPago, setMetodoPago] = useState("QR");
  const [monto, setMonto] = useState("");
  const [tarjeta, setTarjeta] = useState({ numero: "", expiracion: "", cvv: "" });
  const [mensaje, setMensaje] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [qrEscaneado, setQrEscaneado] = useState(false);
  const [pagoCreado, setPagoCreado] = useState(null);
  const [cuotas, setCuotas] = useState(3); 

  // Cargar reserva
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const r = await getReservaPorId(paramId);
        if (!mounted) return;
        setReserva(r);

        const saldo = r.saldoPendiente ?? 0;
        setMonto(tipoPago === "COMPLETO" ? saldo : Math.min(20, saldo));
      } catch (err) {
        setMensaje({ type: "error", text: err?.message || "Error cargando reserva" });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false };
  }, [paramId]);

  async function cargarMontoTotal(reserva) {
    if (!reserva?.idReserva || !reserva?.cancha?.idCancha || !reserva?.disciplina?.idDisciplina) {
      console.warn("Faltan datos para obtener el monto total");
      return 0;
    }

    try {
      const total = await obtenerMontoTotal(
        reserva.idReserva,
        reserva.cancha.idCancha,
        reserva.disciplina.idDisciplina
      );
      console.error("obtener el monto total:", total);
      return total?.montoTotal ?? 0;
    } catch (error) {
      console.error("Error al obtener el monto total:", error);
      return 0;
    }
  }
  // Mantener sugerencia de monto al cambiar tipo
  useEffect(() => {
  async function actualizarMonto() {
    if (!reserva) return;
    const total = await cargarMontoTotal(reserva);
    const pendiente = reserva.saldoPendiente ?? total;
    const yaPagado = Number(reserva.totalPagado ?? 0);

    if (tipoPago === "COMPLETO") {
      if (yaPagado === 0) {
        setMonto(total); // solo si no ha pagado nada
      } else {
        setMonto(0); // ya pagó algo, no se permite pago completo
      }
    } else if (tipoPago === "ANTICIPO") {
      const mitad = Math.ceil(total / 2); //si es anticipo deberi apagar la mitad no ?
      setMonto(mitad);
    } else if (
      tipoPago === "PARCIAL"   
    ) {
      const cuotaMonto = Math.ceil(total / cuotas);
      setMonto(cuotaMonto);
    }
  }

  actualizarMonto();
}, [tipoPago, reserva,cuotas]);

//implemntar si decide un pago parcial que elija el plazo es decir si pagara en cuotas de 3 ,4,5 maximo


  const saldoPendiente = Number(reserva?.saldoPendiente ?? 0);
  //const pagadaCompleta = saldoPendiente <= 0;

  async function handlePago() {
    if (!reserva) return;
    const numericMonto = Number(monto);
    if (isNaN(numericMonto) || numericMonto <= 0 || numericMonto > saldoPendiente) {
      return setMensaje({ type: "error", text: "Monto inválido" });
    }

    setProcesando(true);
    setMensaje(null);

    try {
      const codigo = generarCodigoTransaccion(reserva.idReserva, user.idPersona);

      const nuevoPago = {
        monto: numericMonto,
        metodoPago: metodoPago === "TARJETA" ? "TARJETA_CREDITO" : (metodoPago === "QR" ? "QR" : "EFECTIVO"),
        tipoPago: tipoPago === "ANTICIPO" ? "ANTICIPO" : (tipoPago === "PARCIAL" ? "PARCIAL" : "TOTAL"),
        estado: "PENDIENTE",
        fecha: new Date().toISOString().slice(0, 10),
        descripcion: `Pago ${tipoPago.toLowerCase()} - Reserva #${reserva.idReserva}`,
        codigoTransaccion: codigo,
        idReserva: reserva.idReserva,
        clienteId: user.idPersona,
      };
      console.log("aqui sehizo el pago",nuevoPago);
      const pago = await createPago(nuevoPago);
      setPagoCreado(pago);

      if (metodoPago === "QR") {
        setMensaje({ type: "info", text: "Escanea el QR con Yape o Plin" });
        //aquii es donde se debe generar un qr que diga pagar donde elija el monto a pagar  es decir un qr ficticio qu al scanear le apresca pagar tantos tantox para est reserva y asi en su movil un boton pagar que simule que esta pagando
        setStep(4);
        // Simular escaneo
        setTimeout(() => {
          setQrEscaneado(true);
          confirmarPagoAutomatico(pago, codigo);
        }, 4500);

      } else if (metodoPago === "TARJETA") {
        setMensaje({ type: "info", text: "Procesando pago con tarjeta..." });
        setTimeout(() => confirmarPagoAutomatico(pago, codigo), 2800);
      } else if (metodoPago === "EFECTIVO") {
        //aqui se realizara un pago en efectivo es decir al momento de la reserva entonces le genera como un boleto o algo que valide que validara que realizara el pago pero este tipo de efectivo solo aparecera cuando la reserva esta 12hrs antes es decir cuando la rserva sera mañana por que si no se borrara la reserva
        setMensaje({ type: "success", text: "Pago en efectivo registrado. Preséntate en el local antes de 12 horas para validar." });
        setStep(5);
      }

    } catch (err) {
      setMensaje({ type: "error", text: err?.message || "Error al procesar pago" });
    } finally {
      setProcesando(false);
    }
  }

  async function confirmarPagoAutomatico(pago, codigo) {
    try {
      await confirmarPago(pago.idPago, codigo);
      setMensaje({ type: "success", text: "Pago confirmado exitosamente" });
      setStep(5);
    } catch (err) {
      setMensaje({ type: "error", text: "No se pudo confirmar el pago" });
    }
  }

  // Minimal loader
  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`} style={{ ['--color-p-5']: '#46c4b7', ['--color-p-11']: '#2C7366' }}>
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-4 border-solid rounded-full border-gray-300 border-t-transparent mx-auto" />
        <p className="mt-3">Cargando reserva...</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen pt-24 py-8 px-4 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`} style={{ ['--color-p-5']: '#46c4b7', ['--color-p-11']: '#2C7366' }}>
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className={`p-5 rounded-2xl mb-6 border ${isDarkMode ? "border-gray-800" : "border-gray-100"}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Reserva #{reserva.idReserva}</h1>
              <p className="text-sm opacity-80">{reserva.cancha?.nombre} • {reserva.fechaReserva} • {reserva.horaInicio}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70">Saldo</p>
              <p className={`text-lg font-bold ${saldoPendiente > 0 ? "text-red-500" : "text-green-500"}`}>S/ {saldoPendiente.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-6">
          {['Tipo','Método','Pagar','Done'].map((label, i) => (
            <div key={label} className="flex-1 text-center">
              <div className={`mx-auto w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${step-1 >= i ? 'bg-[var(--color-p-5)] text-white' : 'bg-gray-100 text-gray-500'}`}>{i+1}</div>
              <div className="text-xs mt-2 opacity-80">{label}</div>
            </div>
          ))}
        </div>

        {/* Step 1: Tipo */}
        {step === 1 && (
          <motion.div initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} className={`p-6 rounded-2xl border ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <h2 className="text-lg font-semibold mb-4">¿Cuánto deseas pagar?</h2>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => { setTipoPago('COMPLETO'); setStep(2); }} className="p-4 rounded-xl border">
                <div className="text-sm font-semibold">Completo</div>
                <div className="text-xs opacity-70 mt-1">Paga todo</div>
              </button>

              <button onClick={() => { setTipoPago('ANTICIPO'); setMonto(20); setStep(2); }} className="p-4 rounded-xl border">
                <div className="text-sm font-semibold">Anticipo</div>
                <div className="text-xs opacity-70 mt-1">S/20</div>
              </button>

              <button onClick={() => { setTipoPago('PARCIAL'); setStep(2); }} className="p-4 rounded-xl border">
                <div className="text-sm font-semibold">Parcial</div>
                <div className="text-xs opacity-70 mt-1">Elegir monto</div>
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Método */}
        {step === 2 && (
          <motion.div initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} className={`p-6 rounded-2xl border ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <h2 className="text-lg font-semibold mb-4">Elige un método</h2>

            {tipoPago === 'PARCIAL' && (
              <div className="mb-4">
                <label className="block text-xs mb-2">Monto</label>
                <input type="number" value={monto} min="1" max={saldoPendiente} step="0.5" onChange={(e) => setMonto(e.target.value)} className="w-full p-3 rounded-lg border" />
                <p className="text-xs opacity-60 mt-2">Máx: S/ {saldoPendiente.toFixed(2)}</p>
              </div>
            )}

            <div className="space-y-3">
              {METODOS_PAGO.map(m => (
                <button key={m.id} onClick={() => { setMetodoPago(m.id); setStep(3); }} className={`w-full p-4 rounded-xl border flex items-center gap-3 justify-between ${metodoPago===m.id ? 'ring-2 ring-[var(--color-p-11)]' : ''}`}>
                  <div className="flex items-center gap-3"><div className="text-2xl">{m.icon}</div><div className="text-sm font-medium">{m.nombre}</div></div>
                  <div className="text-xs opacity-70">Continuar</div>
                </button>
              ))}
            </div>

          </motion.div>
        )}

        {/* Step 3: Confirmar y pagar */}
        {step === 3 && (
          <motion.div initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} className={`p-6 rounded-2xl border ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <h2 className="text-lg font-semibold mb-4">Confirmar pago</h2>

            <div className="mb-4 text-sm space-y-2">
              <div>Monto: <strong>S/ {Number(monto).toFixed(2)}</strong></div>
              <div>Método: <strong>{METODOS_PAGO.find(x => x.id===metodoPago)?.nombre}</strong></div>
              <div>Tipo: <strong>{tipoPago==='COMPLETO' ? 'Total' : tipoPago==='ANTICIPO' ? 'Anticipo' : 'Parcial'}</strong></div>
            </div>

            {metodoPago === 'TARJETA' && (
              <div className="mb-4">
                <label className="block text-xs mb-2">Número tarjeta</label>
                <input value={tarjeta.numero} onChange={(e) => setTarjeta({...tarjeta, numero: e.target.value})} className="w-full p-3 rounded-lg border" placeholder="1234 5678 9012 3456" />
              </div>
            )}

            <button onClick={handlePago} disabled={procesando} className="w-full py-3 rounded-xl font-semibold" style={{ background: 'var(--color-p-5)', color: '#fff' }}>{procesando ? 'Procesando...' : 'Pagar ahora'}</button>

            {mensaje && <p className={`mt-3 text-sm ${mensaje.type==='error' ? 'text-red-500' : 'text-[var(--color-p-11)]'}`}>{mensaje.text}</p>}
          </motion.div>
        )}

        {/* Step 4: QR */}
        {step === 4 && (
          <motion.div initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} className={`p-6 rounded-2xl border flex flex-col items-center gap-4 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <h2 className="text-lg font-semibold">Escanea para pagar</h2>
            <div className="bg-white p-4 rounded-lg shadow-inner">
              <QRCode value={`PAGO:${pagoCreado?.codigoTransaccion ?? 'SIMULADO'}`} size={180} />
            </div>
            <p className="text-sm opacity-70">Monto: <strong>S/ {Number(monto).toFixed(2)}</strong></p>
            <p className="text-sm opacity-60">{qrEscaneado ? 'Pago recibido' : 'Esperando escaneo...'}</p>
          </motion.div>
        )}

        {/* Step 5: Éxito */}
        {step === 5 && (
          <motion.div initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} className={`p-6 rounded-2xl border text-center ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <div className="text-5xl">🎉</div>
            <h3 className="text-lg font-semibold mt-3">Pago exitoso</h3>
            <p className="text-sm opacity-70 mt-2">Tu reserva está actualizada.</p>

            {reserva?.pagadaCompleta || reserva?.saldoPendiente === 0 ? (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">QR de acceso</p>
                <div className="inline-block bg-white p-4 rounded-lg">
                  <QRCode value={`RESERVA:${reserva.idReserva}|${user.idPersona}`} size={140} />
                </div>
              </div>
            ) : null}

            <button onClick={() => navigate('/mis-reservas')} className="mt-6 px-5 py-2 rounded-lg border">Ver mis reservas</button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
