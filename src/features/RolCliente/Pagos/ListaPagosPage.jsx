import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useTheme } from "../../../context/ThemeContext";
import { getPagosByReserva, createPago, confirmarPago } from "../../../api/PagosApi"; // ajusta rutas
import { getReservaPorId } from "../../../api/ReservaApi";
import { obtenerMontoTotal } from "../../../api/IncluyeApi";
import { FaQrcode, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

// Helpers
function generarCodigoTransaccion(idReserva, clienteId) {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `PAY-${idReserva}-${clienteId}-${timestamp}${random}`;
}

const METODOS_PAGO = [
  { id: "QR", nombre: "QR", icon: <FaQrcode /> },
  { id: "TARJETA", nombre: "Tarjeta", icon: <FaCreditCard /> },
  { id: "EFECTIVO", nombre: "Efectivo", icon: <FaMoneyBillWave /> },
];

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
    async function load() {
      try {
        console.log("cargando reserva y pagos para idReserva:", idReserva);
        const r = await getReservaPorId(idReserva);
        console.log("reserva recibida:", r);

        // seguridad: solo mostrar si la reserva pertenece al usuario logueado
        if (r.clienteId !== user?.idPersona) {
          console.warn("El usuario no es dueño de esta reserva");
          setMensaje({ type: "error", text: "No autorizado para ver esta reserva." });
          setLoading(false);
          return;
        }

        setReserva(r);

        // Cargar pagos desde el endpoint dedicado
        const pagosResp = await getPagosByReserva(idReserva);
        console.log("pagos por reserva:", pagosResp);
        setPagos(pagosResp || r.pagos || []);

        // obtener monto total (incluye)
        const monto = await obtenerMontoTotal(r.idReserva, r.cancha?.idCancha, r.disciplina?.idDisciplina);
        console.log("monto total incluye:", monto);
        setMontoTotalIncluye(monto?.total || monto);
      } catch (err) {
        console.error("error cargando datos de pagos:", err);
        setMensaje({ type: "error", text: "No se pudo cargar la información." });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [idReserva, user]);

  // cálculos importantes
  const totalPagado = reserva?.totalPagado ?? pagos.reduce((s, p) => s + Number(p.monto || 0), 0);
  const saldoPendiente = reserva ? Number(reserva.saldoPendiente ?? (montoTotalIncluye - totalPagado || 0)) : 0;
  const pagadaCompleta = reserva?.pagadaCompleta === true;

  // habilitar boton pagar: solo si reserva del usuario, no pagada completamente
  const puedePagar = !pagadaCompleta && reserva && reserva.clienteId === user?.idPersona;

  // crear pago de ejemplo (simula la creación y confirmación automática si corresponde)
  async function handleCrearPago({ tipoPago = "TOTAL", metodo = "QR", monto = null }) {
    if (!reserva) return;
    try {
      setCreating(true);
      const montoNumeric = monto ?? (tipoPago === "TOTAL" ? montoTotalIncluye : tipoPago === "ANTICIPO" ? (montoTotalIncluye / 2) : Math.max(1, montoTotalIncluye / 4));
      const codigo = generarCodigoTransaccion(reserva.idReserva, user.idPersona);

      const nuevoPago = {
        monto: Number(montoNumeric),
        metodoPago: metodo === "TARJETA" ? "TARJETA_CREDITO" : (metodo === "QR" ? "QR" : "EFECTIVO"),
        tipoPago: tipoPago === "ANTICIPO" ? "ANTICIPO" : (tipoPago === "PARCIAL" ? "PARCIAL" : "TOTAL"),
        estado: "PENDIENTE",
        fecha: new Date().toISOString().slice(0, 10),
        descripcion: `Pago ${tipoPago.toLowerCase()} - Reserva #${reserva.idReserva}`,
        codigoTransaccion: codigo,
        idReserva: reserva.idReserva,
        clienteId: user.idPersona,
      };

      console.log("Creando pago con payload:", nuevoPago);
      const pagoCreado = await createPago(nuevoPago);
      console.log("Pago creado (respuesta backend):", pagoCreado);

      // actualizar lista localmente
      setPagos((prev) => [...prev, pagoCreado]);

      // Si quieres confirmar automáticamente (solo para simulación de flujo local)
      try {
        console.log("Intentando confirmar pago automaticamente", pagoCreado);
        await confirmarPago(pagoCreado.idPago, pagoCreado.codigoTransaccion);
        console.log("Pago confirmado");
        setMensaje({ type: "success", text: "Pago creado y confirmado correctamente" });

        // refrescar reserva para obtener nuevos atributos (totalPagado, pagadaCompleta, etc.)
        const rActualizada = await getReservaPorId(reserva.idReserva);
        console.log("Reserva actualizada después del pago:", rActualizada);
        setReserva(rActualizada);
      } catch (err) {
        console.warn("No se pudo confirmar automaticamente el pago (puede requerir verificación externa):", err);
        setMensaje({ type: "info", text: "Pago creado. Es necesario confirmar el pago en el pasarela." });
      }

    } catch (err) {
      console.error("error creando pago:", err);
      setMensaje({ type: "error", text: "No se pudo crear el pago" });
    } finally {
      setCreating(false);
    }
  }

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
          <div className="flex-1 rounded-xl p-4 shadow" style={{background: isDarkMode? '#111':'#fff'}}>
            <div className="text-xs">Total</div>
            <div className="text-xl font-semibold">{(montoTotalIncluye ?? 0).toFixed(2)}</div>
          </div>
          <div className="flex-1 rounded-xl p-4 shadow" style={{background: isDarkMode? '#111':'#fff'}}>
            <div className="text-xs">Pagado</div>
            <div className="text-xl font-semibold">{Number(totalPagado || 0).toFixed(2)}</div>
          </div>
          <div className="flex-1 rounded-xl p-4 shadow" style={{background: isDarkMode? '#111':'#fff'}}>
            <div className="text-xs">Saldo</div>
            <div className="text-xl font-semibold">{Number(saldoPendiente || 0).toFixed(2)}</div>
          </div>
        </div>

        {/* Lista de pagos */}
        <div className="space-y-3 mb-6">
          {pagos.length === 0 && <div className="text-center py-6">No se encontraron pagos para esta reserva.</div>}
          {pagos.map((p) => (
            <div key={p.idPago} className="flex items-center gap-4 rounded-xl p-4 shadow transition" style={{background: isDarkMode? '#080a0b':'#fff'}}>
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

        {/* Acción realizar pago */}
        <div className="flex justify-end gap-3">
          <button
            disabled={!puedePagar || creating}
            onClick={() => {
              // Si quieres abrir una modal local para elegir tipo/metodo, puedes hacerlo aquí.
              // Para mantener simple: navegamos a la PaymentPage pasando estado con flags
              console.log("Ir a PaymentPage - reserva:", reserva);
              navigate(`/reservas/pagos/${reserva.idReserva}/pagar`, { state: { reserva, montoTotalIncluye, primeraVez: pagos.length === 0 } });
            }}
            className={`px-4 py-2 rounded-md font-medium ${puedePagar ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
            style={{ background: '#46c4b7', color: '#fff' }}
          >
            Realizar pago
          </button>
          <button>
            Salir
          </button>
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

/*
  NOTAS DE INTEGRACIÓN (pega estas instrucciones donde corresponda):

  1) En tu listado de reservas, modifica el botón "Pagar" para que esté deshabilitado cuando r.pagadaCompleta === true.
     Ejemplo (snippet):

     <button
       onClick={() => navigate(`/reservas/pagos/${r.idReserva}`)}
       disabled={r.pagadaCompleta}
       className={r.pagadaCompleta ? 'opacity-40 cursor-not-allowed' : ''}
     >Pagar</button>

  2) Asegúrate de filtrar reservas para mostrar solo las del usuario logueado:
     reservas.filter(r => r.clienteId === user.idPersona)

  3) PaymentPage (ruta /reservas/pagos/:idReserva/pagar) debe recibir `location.state.primeraVez` y, si es true, obligar a elegir el tipo de pago (TOTAL / ANTICIPO / PARCIAL) y el método (QR/TARJETA/EFECTIVO).
     - Una vez elegido el tipo de pago en la primera transacción, guarda esa elección en el backend con el pago creado. No permitas cambiar el tipo en pagos posteriores.

  4) Restricción para efectivo: Si el método elegido es EFECTIVO y la reserva está muy próxima a la fecha, sólo permitir efectivo si la diferencia entre hoy y la fechaReserva >= 0 y la hora cumple la regla (por ejemplo 12 horas antes). Implementa esa validación en PaymentPage antes de permitir EFECTIVO.

  5) Para la tarjeta, simula validación mínima (número Luhn, fecha y CVV) en el frontend antes de enviar al backend para que los datos parezcan válidos.

  6) Usa console.log en cada respuesta de API para facilitar debugging (ya añadidos en este componente).

*/
