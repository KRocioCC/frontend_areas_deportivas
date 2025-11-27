// src/features/Reserva/pages/ReservaConfirmacion.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X, Info } from "lucide-react";
import { calcularMonto, crearAsociacion } from "../../../api/IncluyeApi";
import { getCancha } from "../../../api/CanchaApi";
import { getDisciplinaById } from "../../../api/DisciplinaApi";
import { createReserva } from "../../../api/ReservaApi";
import ModalTerminos from "./components/ModalTerminos";
import AnimacionTransicion from "./components/AnimacionTransicion";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../context/ToastContext";
import Stepper from "./components/Stepper";

export default function ReservaConfirmacion() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { reserva: reservaRaw, cliente } = state || {};

  const { isDarkMode } = useTheme();
  const { showToast } = useToast();

  const [reserva, setReserva] = useState(null);
  const [cancha, setCancha] = useState(null);
  const [disciplina, setDisciplina] = useState(null);
  const [monto, setMonto] = useState(null);
  const [observaciones, setObservaciones] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    console.log("Datos recibidos en Confirmación:", { reservaRaw, cliente });
    if (!reservaRaw || !cliente) {
      console.warn("Faltan datos. Redirigiendo...");
      navigate("/reservascli", { replace: true });
    }
  }, [reservaRaw, cliente, navigate]);

  useEffect(() => {
    if (!reservaRaw) return;

    const procesar = async () => {
      try {
        const horaInicioStr = reservaRaw.horaInicio.split(" - ")[0];
        const horaFinStr = reservaRaw.horaFin.split(" - ")[1];

        const reservaProcesada = {
          ...reservaRaw,
          fecha: reservaRaw.fecha,
          horaInicio: horaInicioStr,
          horaFin: horaFinStr,
        };

        console.log("Reserva procesada:", reservaProcesada);
        setReserva(reservaProcesada);

        const canchaData = await getCancha(reservaRaw.canchaId);
        console.log("Cancha cargada:", canchaData);
        setCancha(canchaData);

        const disciplinaData = await getDisciplinaById(reservaRaw.disciplinaId);
        console.log("Disciplina cargada:", disciplinaData);
        setDisciplina(disciplinaData);

        const montoCalculado = await calcularMonto(
          reservaRaw.canchaId,
          reservaRaw.disciplinaId,
          horaInicioStr,
          horaFinStr
        );

        console.log("Monto calculado:", montoCalculado);
        setMonto(montoCalculado);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        // Reemplazamos alert por toast (según tus reglas)
        showToast("Error al cargar información. Intenta recargar la página.", "error");
      }
    };

    procesar();
  }, [reservaRaw, showToast]);

  // Confirmar reserva (LOGICA mantenida)
  const handleConfirmar = async () => {
    if (cargando) return;
    setCargando(true);

    try {
      const limpiarHora = (h) => h.replace(/:00$/, "").trim();
      const horaInicio = limpiarHora(reserva.horaInicio);
      const horaFin = limpiarHora(reserva.horaFin);

      const payloadReserva = {
        fechaReserva: reserva.fecha,
        horaInicio: reserva.horaInicio,
        horaFin: reserva.horaFin,
        estadoReserva: "PENDIENTE",
        observaciones: observaciones.trim() || "Reserva de nueva",
        clienteId: cliente.id,
      };

      console.log("Creando reserva:", payloadReserva);
      const nuevaReserva = await createReserva(payloadReserva);

      console.log("Reserva creada:", nuevaReserva);

      const incluyePayload = {
        idCancha: Number(reserva.canchaId),
        idDisciplina: Number(reserva.disciplinaId),
        idReserva: nuevaReserva.idReserva,
      };

      console.log("Creando asociación incluye:", incluyePayload);
      await crearAsociacion(incluyePayload);

      // Toast de éxito y navegación
      showToast("¡Reserva confirmada con éxito!", "success");
      navigate("/reservas/mihistorial");
    } catch (err) {
      //console.error("Error al confirmar reserva:", err);
      showToast("Error al procesar la reserva. Intenta más tarde.", "error");
      navigate("/");
    } finally {
      setCargando(false);
      setMostrarModal(false);
    }
  };

  if (!reserva || !cancha || !disciplina || monto === null) {
    return (
      <div className="p-8 flex items-center justify-center" style={{ fontFamily: "var(--font-Balo)" }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={isDarkMode ? "text-gray-200" : "text-gray-700 "}
          style={{ fontSize: "36px" }}
        >
          Cargando detalles...
        </motion.div>
      </div>
    );
  }

  // Estilos de paleta según modo (uso variables y colores permitidos)
  const headerAccent = isDarkMode ? "var(--color-p-11)" : "var(--color-pb-5)"; // acento principal según modo
  const secondaryAccent = isDarkMode ? "var(--color-p-2)" : "var(--color-pb-3)";

  return (
    <AnimacionTransicion direction="right">
      <div
         className="w-full min-h-screen p-10 pt-16"
        style={{ fontFamily: "var(--font-Balo)",background: isDarkMode ? "#0f1213" : "#ffffffff"}}
      >
        <Stepper step={3} isDarkMode={isDarkMode} />
        {/* Encabezado elegante */}
        <div
          className={`rounded-2xl overflow-hidden mb-6 relative`}
          style={{
            background: isDarkMode ? "#0f1213" : "var(--color-pb-6)",
            boxShadow: isDarkMode ? "0 6px 20px rgba(0,0,0,0.6)" : "0 6px 22px rgba(15,15,15,0.06)",
            border: isDarkMode ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(10,10,10,0.04)",
            minHeight: 92,
          }}
        >
          {/* decorative image (referencia) */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `url('/mnt/data/Revamp Your Invoices With AI-Generated Templates.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: isDarkMode ? "brightness(0.4) saturate(0.7)" : "none",
            }}
          />
          <div className="relative flex items-center justify-between gap-4 p-4 sm:p-6">
            <div>
              <h1
                className="text-xl sm:text-2xl font-extrabold"
                style={{ fontFamily: "var(--font-Oswald)", color: headerAccent }}
              >
                Confirmar Reserva
              </h1>
              <p className="mt-1 text-sm" style={{ color: isDarkMode ? "rgba(255,255,255,0.72)" : "#575757", fontFamily: "var(--font-Balo)" }}>
                Revisa los detalles abajo y confirma tu reserva. Los cambios no afectarán la lógica ni las llamadas a la API.
              </p>
            </div>
          </div>
        </div>

        {/* Contenedor principal: izquierda = datos / derecha = tabla y totales */}
        <motion.div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-6`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {/* LEFT: Datos (cliente, cancha, disciplina) */}
          <div className="lg:col-span-5">
            <div
              className={`rounded-2xl p-4 sm:p-6 shadow-[0_6px_18px_rgba(2,6,23,0.06)]`}
              style={{
                background: isDarkMode ? "#0f1213" : "var(--color-pb-6)",
                border: isDarkMode ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(15,15,15,0.03)",
              }}
            >
              {/* Cliente */}
              <section className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm sm:text-base font-semibold" style={{ fontFamily: "var(--font-Alumni)", color: headerAccent }}>
                    Cliente
                  </h3>
                  <Info size={18} className={isDarkMode ? "text-gray-300" : "text-gray-500"} />
                </div>
                <div className="space-y-1 text-sm" style={{ color: isDarkMode ? "rgba(255,255,255,0.9)" : "#111827" }}>
                  <div><strong>Nombre:</strong> {cliente.nombre} {cliente.apellidoPaterno} {cliente.apellidoMaterno}</div>
                  <div><strong>Email:</strong> {cliente.email}</div>
                  {cliente.telefono && <div><strong>Tel:</strong> {cliente.telefono}</div>}
                </div>
              </section>

              <hr className="my-4 border-dashed" style={{ borderColor: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)" }} />

              {/* Cancha */}
              <section className="mb-4">
                <h4 className="text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-Alumni)", color: headerAccent }}>
                  Cancha
                </h4>
                <div className="space-y-1 text-sm" style={{ color: isDarkMode ? "rgba(255,255,255,0.9)" : "#111827" }}>
                  <div><strong>Nombre:</strong> {cancha.nombre}</div>
                  <div><strong>Área:</strong> {cancha.areaDeportiva?.nombreArea || "—"}</div>
                  <div><strong>Ubicación:</strong> {cancha.areaDeportiva?.latitud ?? "—"}, {cancha.areaDeportiva?.longitud ?? "—"}</div>
                  <div><strong>Equipamiento:</strong> {cancha.equipamientos?.map(e => e.nombre).join(", ") || "Ninguno"}</div>
                </div>
              </section>

              <hr className="my-4 border-dashed" style={{ borderColor: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)" }} />

              {/* Disciplina */}
              <section>
                <h4 className="text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-Alumni)", color: headerAccent }}>
                  Disciplina
                </h4>
                <div className="text-sm" style={{ color: isDarkMode ? "rgba(255,255,255,0.9)" : "#111827" }}>
                  <div><strong>Nombre:</strong> {disciplina.nombre}</div>
                  {disciplina.descripcion && <div className="mt-1 text-xs text-gray-500">{disciplina.descripcion}</div>}
                </div>
              </section>
            </div>

            {/* Observaciones */}
            <div
              className="mt-4 rounded-2xl p-4 sm:p-6"
              style={{
                background: isDarkMode ? "#0f1213" : "var(--color-pb-6)",
                border: isDarkMode ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(15,15,15,0.03)",
                boxShadow: isDarkMode ? "0 6px 16px rgba(0,0,0,0.5)" : "0 6px 12px rgba(2,6,23,0.04)",
              }}
            >
              <label className="block text-sm font-semibold mb-2" style={{ fontFamily: "var(--font-Alumni)", color: headerAccent }}>
                Observaciones (opcional)
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Ej: Llevar balones, usar zapatillas de goma..."
                className={`w-full p-3 rounded-md text-sm resize-none transition-shadow focus:outline-none`}
                rows="4"
                maxLength={500}
                style={{
                  fontFamily: "var(--font-Balo)",
                  background: isDarkMode ? "rgba(255,255,255,0.02)" : "#fff",
                  border: isDarkMode ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.06)",
                  color: isDarkMode ? "rgba(255,255,255,0.92)" : "#0b0d0e",
                  boxShadow: "0 2px 8px rgba(2,6,23,0.04)",
                }}
              />
              <div className="mt-2 text-xs" style={{ color: "rgba(107,114,128,1)" }}>{observaciones.length}/500</div>
            </div>
          </div>

          {/* RIGHT: Tabla de detalles + Totales */}
          <div className="lg:col-span-7">
            <div
              className={`rounded-2xl p-4 sm:p-6 shadow-[0_6px_18px_rgba(2,6,23,0.06)]`}
              style={{
                background: isDarkMode ? "rgba(255,255,255,0.02)" : "white",
                border: isDarkMode ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(0,0,0,0.04)",
              }}
            >
              {/* Tabla tipo factura (estructura tipo A) */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm table-auto" style={{ fontFamily: "var(--font-Balo)" }}>
                  <thead>
                    <tr>
                      <th className="text-left py-3 px-2 w-16 text-xs" style={{ color: isDarkMode ? "rgba(255,255,255,0.7)" : "#6b7280" }}>S.N.</th>
                      <th className="text-left py-3 px-2 text-xs" style={{ color: isDarkMode ? "rgba(255,255,255,0.8)" : "#374151" }}>Descripción</th>
                      <th className="text-center py-3 px-2 text-xs" style={{ color: isDarkMode ? "rgba(255,255,255,0.7)" : "#6b7280" }}>QTY</th>
                      <th className="text-right py-3 px-2 text-xs" style={{ color: isDarkMode ? "rgba(255,255,255,0.7)" : "#6b7280" }}>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Aquí sólo mostramos un renglón principal con la disciplina/hora. Si hubiera más, mantén la lógica para mapear elementos */}
                    <tr className="border-t" style={{ borderColor: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)" }}>
                      <td className="py-4 px-2">01</td>
                      <td className="py-4 px-2">
                        <div className="font-semibold" style={{ fontFamily: "var(--font-Alumni)", color: isDarkMode ? "#fff" : "#111827" }}>
                          Reserva: {disciplina.nombre}
                        </div>
                        <div className="text-xs mt-1" style={{ color: isDarkMode ? "rgba(255,255,255,0.7)" : "#6b7280" }}>
                          Fecha: {reserva.fecha} · Horario: {reserva.horaInicio} - {reserva.horaFin}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-center">1</td>
                      <td className="py-4 px-2 text-right font-semibold" style={{ color: headerAccent }}>{monto} Bs</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totales destacados */}
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="text-xs" style={{ color: isDarkMode ? "rgba(255,255,255,0.7)" : "#6b7280" }}>
                    Método de pago: En sitio / Transferencia
                  </div>
                  <div className="text-xs mt-2" style={{ color: isDarkMode ? "rgba(255,255,255,0.6)" : "#6b7280" }}>
                    Al confirmar, se creará la reserva y se asociará automáticamente.
                  </div>
                </div>

                <div className="w-full sm:w-auto">
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: isDarkMode ? "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))" : "linear-gradient(180deg, #fff, #fafafa)",
                      border: isDarkMode ? "1px solid rgba(255,255,255,0.03)" : "1px solid rgba(0,0,0,0.04)",
                      minWidth: 220,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm" style={{ color: isDarkMode ? "rgba(255,255,255,0.75)" : "#6b7280" }}>Subtotal</div>
                      <div style={{ fontFamily: "var(--font-Alumni)", color: isDarkMode ? "rgba(255,255,255,0.95)" : "#111827" }}>{monto} Bs</div>
                    </div>

                    {/* Puedes agregar impuestos/descuentos si aplica */}
                    <div className="flex items-center justify-between text-xs mt-1" style={{ color: isDarkMode ? "rgba(255,255,255,0.6)" : "#6b7280" }}>
                      <div>Descuento</div>
                      <div>- 0 Bs</div>
                    </div>

                    <div className="mt-3 border-t pt-3 flex items-baseline justify-between">
                      <div className="text-sm" style={{ fontFamily: "var(--font-Alumni)", color: secondaryAccent }}>Total</div>
                      <div className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-Oswald)", color: headerAccent }}>{monto} Bs</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTONES */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => {
                    showToast("Volviendo a la pantalla anterior", "info");
                    navigate(-1);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-md border transition-transform active:scale-[0.97]"
                  style={{
                    fontFamily: "var(--font-josefin)",
                    borderColor: headerAccent,
                    color: headerAccent,
                    background: isDarkMode ? "transparent" : "transparent",
                  }}
                >
                  <ArrowLeft size={18} />
                  <span className="text-sm font-medium">Atrás</span>
                </button>
                
                <button
                  onClick={() => {
                    showToast("Has cancelado la operación", "warning");
                    navigate("/");
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border hover:shadow-[0_6px_18px_rgba(2,6,23,0.06)] transition transform active:scale-[0.97]"
                  style={{
                    fontFamily: "var(--font-josefin)",
                    borderColor: isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                    color: isDarkMode ? "rgba(255,255,255,0.9)" : "#111827",
                    background: isDarkMode ? "transparent" : "transparent",
                  }}
                >
                  <X size={18} />
                  Salir
                </button>

                <button
                  onClick={() => setMostrarModal(true)}
                  disabled={cargando}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-white font-medium shadow-[0_4px_14px_#00000020] transition transform active:scale-[0.97]"
                  style={{
                    fontFamily: "var(--font-josefin)",
                    background: headerAccent,
                    boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                    opacity: cargando ? 0.7 : 1,
                  }}
                >
                  <Check size={18} />
                  {cargando ? "Procesando..." : "Confirmar Reserva"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modal Terminos (no modifiqué su lógica, solo lo muestro) */}
        {mostrarModal && (
          <ModalTerminos
            onClose={() => setMostrarModal(false)}
            onAceptar={handleConfirmar}
          />
        )}
      </div>
    </AnimacionTransicion>
  );
}
