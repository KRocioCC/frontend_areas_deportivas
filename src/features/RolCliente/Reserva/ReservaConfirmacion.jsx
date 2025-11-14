// src/features/Reserva/pages/ReservaConfirmacion.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { calcularMonto } from "../../../api/IncluyeApi";
import { getCancha } from "../../../api/CanchaApi";
import { getDisciplinaById } from "../../../api/DisciplinaApi";
import { createReserva, crearAsociacion } from "../../../api/ReservaApi";
import ModalTerminos from "./components/ModalTerminos";
import AnimacionTransicion from "./components/AnimacionTransicion";

export default function ReservaConfirmacion() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { reserva: reservaRaw, cliente } = state || {};

  const [reserva, setReserva] = useState(null);
  const [cancha, setCancha] = useState(null);
  const [disciplina, setDisciplina] = useState(null);
  const [monto, setMonto] = useState(null);
  const [observaciones, setObservaciones] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Logs iniciales
  useEffect(() => {
    console.log("Datos recibidos en Confirmación:", { reservaRaw, cliente });
    if (!reservaRaw || !cliente) {
      console.warn("Faltan datos. Redirigiendo...");
      navigate("/reservascli", { replace: true });
    }
  }, [reservaRaw, cliente, navigate]);

  // Procesar reserva + cargar cancha y disciplina
  useEffect(() => {
    if (!reservaRaw) return;

    const procesar = async () => {
      try {
        // Extraer hora inicio y fin
        const horaInicioStr = reservaRaw.horaInicio.split(" - ")[0]; // "08:00"
        const horaFinStr = reservaRaw.horaFin.split(" - ")[1];       // "09:00"
        //const Fecha= reservaRaw.fecha;

        const reservaProcesada = {
          ...reservaRaw,
          fecha: reservaRaw.fecha,
          horaInicio: horaInicioStr,
          horaFin: horaFinStr,
        };

        console.log("Reserva procesada:", reservaProcesada);
        setReserva(reservaProcesada);

        // Cargar cancha
        const canchaData = await getCancha(reservaRaw.canchaId);
        console.log("Cancha cargada:", canchaData);
        setCancha(canchaData);

        // Cargar disciplina
        const disciplinaData = await getDisciplinaById(reservaRaw.disciplinaId);
        console.log("Disciplina cargada:", disciplinaData);
        setDisciplina(disciplinaData);
        console.log("los datos realmente se muestran "+reservaRaw.canchaId,
          reservaRaw.disciplinaId,
          horaInicioStr,
          horaFinStr);
        // Calcular monto
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
        alert("Error al cargar información de cancha o monto.");
      }
    };

    procesar();
  }, [reservaRaw]);

  // Confirmar reserva
  const handleConfirmar = async () => {
    if (cargando) return;
    setCargando(true);

    try {

      // FECHA DE CREACIÓN: 2 HORAS ANTES DE AHORA
      const ahora = new Date();
      const dosHorasAntes = new Date(ahora.getTime() - 2 * 60 * 60 * 1000);
      const fechaCreacion = dosHorasAntes.toISOString().slice(0, 19).replace("T", " ");

      // LIMPIAR HORAS (por si vienen con :00)
      const limpiarHora = (h) => h.replace(/:00$/, "").trim();
      const horaInicio = limpiarHora(reserva.horaInicio);
      const horaFin = limpiarHora(reserva.horaFin);

const payloadReserva = {
      fechaCreacion: fechaCreacion,           // "2025-11-13 08:12:40"
      fechaReserva: reserva.fecha,            // "2025-11-17"
      horaInicio: reserva.horaInicio,                 // "14:00"
      horaFin: reserva.horaFin,                       // "16:00"
      estadoReserva: "PENDIENTE",
      observaciones: observaciones.trim() || "Reserva de nueva",
      clienteId: cliente.id
    };

      console.log("Creando reserva  sssssssi:", payloadReserva);
      console.log("Payload que enviaré:", payloadReserva);
      const nuevaReserva = await createReserva(payloadReserva);

      console.log("Reserva creada:", nuevaReserva);

      const incluyePayload = {
        idCancha: Number(reserva.canchaId),
        idDisciplina: Number(reserva.disciplinaId),
        idReserva: nuevaReserva.idReserva,
      };

      console.log("Creando asociación incluye:", incluyePayload);
      //await crearAsociacion(incluyePayload);

      alert("¡Reserva confirmada con éxito!");
      navigate("/");
    } catch (err) {
      console.error("Error al confirmar reserva:", err);
      alert("Error al procesar la reserva. Intenta más tarde.");
      navigate("/");
    } finally {
      setCargando(false);
      setMostrarModal(false);
    }
  };

  if (!reserva || !cancha || !disciplina || monto === null) {
    return <div className="text-center p-8">Cargando detalles...</div>;
  }

  return (
    <AnimacionTransicion direction="right">
      <div className="max-w-5xl mx-auto p-6" style={{ fontFamily: "var(--font-Balo)" }}>
        <h2 className="text-3xl font-bold text-center mb-6" style={{ color: "var(--color-p-1)" }}>
          Confirmar Reserva
        </h2>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Cliente */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--color-p-1)" }}>Cliente</h3>
            <p><strong>Nombre:</strong> {cliente.nombre} {cliente.aPaterno} {cliente.aMaterno}</p>
            <p><strong>Email:</strong> {cliente.email}</p>
          </div>

          {/* Cancha */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--color-p-1)" }}>Cancha</h3>
            <p><strong>Nombre:</strong> {cancha.nombreCancha}</p>
            <p><strong>Área Deportiva:</strong> {cancha.areaDeportiva?.nombreArea}</p>
            <p><strong>Ubicación:</strong> {cancha.latitud}, {cancha.longitud}</p>
            <p><strong>Equipamientos:</strong> {cancha.equipamientos?.map(e => e.nombre).join(", ") || "Ninguno"}</p>
          </div>

          {/* Disciplina */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--color-p-1)" }}>Disciplina</h3>
            <p><strong>Nombre:</strong> {disciplina.nombre}</p>
          </div>

          {/* Reserva */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--color-p-1)" }}>Detalles de Reserva</h3>
            <p><strong>Fecha:</strong> {reserva.fecha}</p>
            <p><strong>Horario:</strong> {reserva.horaInicio} - {reserva.horaFin}</p>
            <p><strong>Monto total:</strong> <span className="text-xl font-bold">{monto} Bs</span></p>
          </div>

          {/* Observaciones */}
          <div>
            <label className="block font-semibold mb-2" style={{ color: "var(--color-p-1)" }}>
              Observaciones (opcional)
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Ej: Llevar balones, usar zapatillas de goma..."
              className="w-full p-3 border rounded-lg"
              rows="3"
              maxLength={500}
            />
            <small className="text-gray-500">{observaciones.length}/500</small>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg border-2 font-semibold flex items-center gap-2"
            style={{ borderColor: "var(--color-p-1)", color: "var(--color-p-1)" }}
          >
            Atrás
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold flex items-center gap-2"
            >
              Salir
            </button>
            <button
              onClick={() => setMostrarModal(true)}
              disabled={cargando}
              className="px-6 py-3 bg-[var(--color-p-1)] text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {cargando ? "Procesando..." : "Confirmar Reserva"}
            </button>
          </div>
        </div>

        {/* Modal */}
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