// src/pages/FormularioQrPublico.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Calendar, User } from "lucide-react";
import { getReservaPorId } from "../../api/ReservaApi";
import { createInvitado } from "../../api/invitadoApi";
import { confirmarInvitacion ,crearParticipacion} from "../../api/participaApi";
import { useToast } from "../../context/ToastContext";

export default function FormularioQrPublico() {
  const { idReserva, codigoQr } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Estado para el formulario del invitado
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reservaInfo, setReservaInfo] = useState(null);
  const [invitadoCreado, setInvitadoCreado] = useState(null);
  const [confirmado, setConfirmado] = useState(null);

  // -------------------- CARGAR INFO DE LA RESERVA --------------------
  useEffect(() => {
    const cargarInfoReserva = async () => {
      try {
        const data = await getReservaPorId(idReserva);
        setReservaInfo(data);
      } catch (err) {
        showToast("Error cargando info de la reserva, intente más tarde.", "warning");
      }
    };

    if (idReserva) cargarInfoReserva();
  }, [idReserva]);

  // -------------------- MANEJO DE FORMULARIO --------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // -------------------- CREAR INVITADO --------------------
  // -------------------- CREAR INVITADO Y PARTICIPACIÓN --------------------
    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
        // 1️⃣ Crear invitado
        const nuevoInvitado = {
        nombre: formData.nombre,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        fechaNacimiento: formData.fechaNacimiento,
        telefono: formData.telefono,
        email: formData.email,
        urlImagen: "",
        estado: true,
        verificado: true
        };

        const invitado = await createInvitado(nuevoInvitado);
        setInvitadoCreado(invitado);

        // 2️⃣ Crear participación
        const participacion = {
        idReserva: idReserva,
        idInvitado: invitado.id,
        observaciones: "Participación creada",
        confirmado: false,
        asistio: false
        };
        await crearParticipacion(participacion);

        showToast("Invitado registrado y participación creada.", "success");

    } catch (err) {
        setError(err.message || "Error creando invitado/participación.");
    } finally {
        setLoading(false);
    }
    };


  // -------------------- CONFIRMAR ASISTENCIA --------------------
  const handleConfirmarAsistencia = async () => {
    if (!invitadoCreado) return;

    try {
      setLoading(true);
      const dataConfirmacion = await confirmarInvitacion(idReserva, invitadoCreado.id);
      setConfirmado(dataConfirmacion);
      showToast("¡Asistencia confirmada! QR generado.", "success");
    } catch (err) {
      showToast(err.message || "Error confirmando asistencia.", "error");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- RENDERIZADO --------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6"
      >

        {/* -------------------- COLUMNA IZQUIERDA: INFO RESERVA -------------------- */}
        <div className="border-r pr-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="text-blue-600" /> Información de la Reserva
          </h2>

          {!reservaInfo ? (
            <p className="text-gray-500">Cargando información...</p>
          ) : (
            <div className="space-y-4 text-sm text-gray-700">
              {/* Reserva */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <h3 className="font-semibold text-blue-700 mb-1">Reserva #{reservaInfo.idReserva}</h3>
                <p><strong>Fecha:</strong> {reservaInfo.fechaReserva}</p>
                <p><strong>Hora:</strong> {reservaInfo.horaInicio} - {reservaInfo.horaFin}</p>
                <p><strong>Estado:</strong> {reservaInfo.estadoReserva}</p>
              </div>

              {/* Cancha */}
              <div className="bg-purple-50 p-3 rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-1">Cancha</h3>
                <p><strong>Nombre:</strong> {reservaInfo.cancha.nombre}</p>
                <p><strong>Capacidad:</strong> {reservaInfo.cancha.capacidad} personas</p>
                <p><strong>Superficie:</strong> {reservaInfo.cancha.tipoSuperficie}</p>
              </div>

              {/* Disciplina */}
              <div className="bg-green-50 p-3 rounded-lg">
                <h3 className="font-semibold text-green-700 mb-1">Disciplina</h3>
                <p>{reservaInfo.disciplina.nombre}</p>
              </div>

              {/* Cliente principal */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-1">Cliente principal</h3>
                <p><strong>Nombre:</strong> {reservaInfo.cliente.nombre}</p>
                <p><strong>Teléfono:</strong> {reservaInfo.cliente.telefono}</p>
              </div>
            </div>
          )}
        </div>

        {/* -------------------- COLUMNA DERECHA: FORMULARIO -------------------- */}
        <div>
          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <h2 className="text-xl font-bold text-gray-800 mb-4">Registro de Invitado</h2>

          {/* FORMULARIO PARA CREAR INVITADO */}
          {!invitadoCreado && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                required
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="text"
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                placeholder="Apellido Paterno"
                required
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="text"
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleChange}
                placeholder="Apellido Materno"
                required
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                placeholder="Fecha de Nacimiento"
                required
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                required
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full px-4 py-3 border rounded-lg"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
              >
                {loading ? "Registrando..." : "Confirmar Registro"}
              </button>
            </form>
          )}

          {/* -------------------- BOTÓN CONFIRMAR ASISTENCIA -------------------- */}
          {invitadoCreado && !confirmado && (
            <button
              onClick={handleConfirmarAsistencia}
              disabled={loading}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg"
            >
              {loading ? "Confirmando..." : "Confirmar Asistencia"}
            </button>
          )}

          {/* -------------------- QR GENERADO -------------------- */}
          {confirmado && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-blue-700 font-medium">Asistencia confirmada ✅</p>
              <p className="text-sm">Tu QR: {confirmado.codigoQr}</p>
              <img
                src={`http://localhost:8080/uploads/img/qr/${confirmado.codigoQr}`}
                alt="QR"
                className="mx-auto mt-2 w-40 h-40"
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
