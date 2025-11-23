import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { confirmarPago, createPago } from "../../../api/PagosApi";
import { FaArrowLeft, FaQrcode, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

function generarCodigoTransaccion(idReserva, clienteId) {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PAY-${idReserva}-${clienteId}-${timestamp}${random}`;
}

export default function RealizarPagoPage() {
  const { idReserva } = useParams();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Datos enviados desde ListPagosPage
  const { reserva, montoTotalIncluye, primeraVez } = location.state || {};

  const [tipoPago, setTipoPago] = useState(null);
  const [metodo, setMetodo] = useState(null);
  const [monto, setMonto] = useState("");
  const [cuotas, setCuotas] = useState(null);
  const [confirmando, setConfirmando] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const saldoPendiente = reserva?.saldoPendiente ?? montoTotalIncluye;

  // Calcular anticipo (mitad exacta)
  const mitad = montoTotalIncluye ? montoTotalIncluye / 2 : 0;

  // Modo claro/oscuro
  const bg = isDarkMode ? "bg-[#0c0f11] text-white" : "bg-white text-[#0c0f11]";
  const card = isDarkMode ? "bg-[#111416]" : "bg-[#f6f6f6]";

  useEffect(() => {
    if (cuotas) {
      setMonto((montoTotalIncluye / cuotas).toFixed(2));
    }
  }, [cuotas]);

  // Validaciones
  const montoValido =
    Number(monto) > 0 &&
    Number(monto) <= Number(saldoPendiente);

  async function handlePago() {
    if (!tipoPago || !metodo || !aceptaTerminos) return;

    try {
      setConfirmando(true);

      const codigo = generarCodigoTransaccion(reserva.idReserva, reserva.clienteId);

      const payload = {
        monto: Number(monto),
        metodoPago: metodo === "TARJETA" ? "TARJETA_CREDITO" : metodo,
        tipoPago: tipoPago,
        estado: "PENDIENTE",
        fecha: new Date().toISOString(),
        descripcion: `Pago ${tipoPago} · Reserva #${reserva.idReserva}`,
        codigoTransaccion: codigo,
        idReserva: reserva.idReserva,
        clienteId: reserva.clienteId,
      };

      const nuevoPago = await createPago(payload);

      setMensaje({ type: "success", text: "Pago creado. Confirmando..." });

      // Simular confirmación automática por QR/Tarjeta
      if (metodo === "QR" || metodo === "TARJETA") {
        setTimeout(async () => {
          await confirmarPago(nuevoPago.idPago, nuevoPago.codigoTransaccion);
          navigate(`/reservas/pagos/${reserva.idReserva}`);
        }, 2200);
      } else {
        // efectivo = sin confirmación automática
        navigate(`/reservas/pagos/${reserva.idReserva}`);
      }
    } catch (err) {
      setMensaje({ type: "error", text: "Error al procesar el pago" });
    } finally {
      setConfirmando(false);
    }
  }

  return (
    <div className={`min-h-screen p-6 ${bg}`}>
      <div className="max-w-2xl mx-auto">

        {/* Volver atrás */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-sm px-3 py-2 rounded-lg bg-[#46c4b7] text-white"
        >
          <FaArrowLeft /> Volver atrás
        </button>

        <h1 className="text-xl font-bold mb-4">Realizar Pago</h1>

        {/* Información */}
        <div className={`${card} p-4 rounded-xl shadow mb-6`}>
          <p><strong>Total:</strong> {montoTotalIncluye}</p>
          <p><strong>Pagado:</strong> {reserva.totalPagado}</p>
          <p><strong>Saldo:</strong> {saldoPendiente}</p>
        </div>

        {/* Selección tipo de pago */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Tipo de pago</h2>

          <div className="space-y-3">

            {/* Pago completo solo si no hay pagos */}
            {primeraVez && (
              <button
                onClick={() => { setTipoPago("TOTAL"); setMonto(saldoPendiente); }}
                className={`${card} w-full p-4 rounded-xl text-left shadow`}
              >
                Pago completo ({saldoPendiente})
              </button>
            )}

            {/* Anticipo si aún no se hizo */}
            {!primeraVez && saldoPendiente === montoTotalIncluye && (
              <button
                onClick={() => { setTipoPago("ANTICIPO"); setMonto(mitad.toFixed(2)); }}
                className={`${card} w-full p-4 rounded-xl text-left shadow`}
              >
                Anticipo (Mitad: {mitad.toFixed(2)})
              </button>
            )}

            {/* Pago parcial */}
            <button
              onClick={() => setTipoPago("PARCIAL")}
              className={`${card} w-full p-4 rounded-xl text-left shadow`}
            >
              Pago parcial
            </button>

          </div>
        </div>

        {/* Monto editable */}
        {tipoPago && (
          <div className="mb-6">
            <h2 className="font-semibold mb-3">Monto a pagar</h2>

            {/* Cuotas */}
            <div className="flex gap-3 mb-3">
              {[3, 4, 5].map((c) => (
                <button
                  key={c}
                  onClick={() => setCuotas(c)}
                  className="px-4 py-2 rounded-lg border"
                >
                  {c} cuotas
                </button>
              ))}
            </div>

            <input
              type="number"
              value={monto}
              onChange={(e) => { setMonto(e.target.value); setCuotas(null); }}
              className="w-full px-4 py-2 rounded-lg bg-transparent border"
            />
            {!montoValido && (
              <p className="text-red-500 text-sm mt-2">
                El monto debe ser mayor a 0 y menor o igual al saldo.
              </p>
            )}
          </div>
        )}

        {/* Métodos */}
        {tipoPago && (
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Método de pago</h2>

            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setMetodo("QR")} className={`${card} p-4 rounded-xl`}>
                <FaQrcode className="text-2xl" />
              </button>
              <button onClick={() => setMetodo("TARJETA")} className={`${card} p-4 rounded-xl`}>
                <FaCreditCard className="text-2xl" />
              </button>

              {/* Efectivo solo <12 horas */}
              {reserva.horasRestantes < 12 && (
                <button onClick={() => setMetodo("EFECTIVO")} className={`${card} p-4 rounded-xl`}>
                  <FaMoneyBillWave className="text-2xl" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Términos */}
        {metodo && (
          <div className="mb-6">
            <label className="flex gap-3 items-center">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={() => setAceptaTerminos(!aceptaTerminos)}
              />
              <span>Acepto los términos y condiciones del pago</span>
            </label>
          </div>
        )}

        {/* Botón pagar */}
        {metodo && (
          <button
            disabled={!aceptaTerminos || !montoValido || confirmando}
            onClick={handlePago}
            className="w-full py-3 rounded-lg font-bold bg-[#46c4b7] text-white disabled:opacity-50"
          >
            {confirmando ? "Procesando..." : "Pagar ahora"}
          </button>
        )}

        {mensaje && (
          <div
            className={`mt-4 p-3 rounded ${
              mensaje.type === "error" ? "bg-red-500" : "bg-green-600"
            }`}
          >
            {mensaje.text}
          </div>
        )}
      </div>
    </div>
  );
}
