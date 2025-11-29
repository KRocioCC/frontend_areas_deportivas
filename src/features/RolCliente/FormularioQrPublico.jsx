// src/pages/FormularioQrPublico.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Users,
  Clock,
  MapPin,
  Download,
  PartyPopper,
} from "lucide-react";
import { getReservaPorId } from "../../api/ReservaApi";
import { createInvitado } from "../../api/invitadoApi";
import { confirmarInvitacion ,crearParticipacion} from "../../api/participaApi";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";
import { getQrImage, getQrsByPersona } from "../../api/QrApi";

export default function FormularioQrPublico() {
  const { idReserva, codigoQr } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isDarkMode } = useTheme();
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [qrCodigo, setQrCodigo] = useState(null); 

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

        const participacion = {
        idReserva: idReserva,
        idInvitado: invitado.id,
        observaciones: "Participación creada",
        confirmado: false,
        asistio: false
        };
        await crearParticipacion(participacion);

        showToast("Invitado registrado ", "success");

    } catch (err) {
        showToast("Revise que toda su informacion sea correcta", "warning");
    } finally {
        setLoading(false);
    }
    };


  // -------------------- CONFIRMAR ASISTENCIA --------------------
  const handleConfirmarAsistencia = async () => {
  if (!invitadoCreado) return;

  try {
    setLoading(true);


    await confirmarInvitacion(idReserva, invitadoCreado.id);

    const qrs = await getQrsByPersona(invitadoCreado.id);

    const qrEncontrado = qrs.find(
      (qr) => qr.idReserva === parseInt(idReserva)
    );

    if (!qrEncontrado) {
      showToast("No se encontró el QR del invitado.", "error");
      return;
    }

    // Guardamos codigo
    setQrCodigo(qrEncontrado.codigoQr);

    // Cargar imagen
    const blob = await getQrImage(qrEncontrado.codigoQr);
    const urlImagen = URL.createObjectURL(blob);
    setQrImageUrl(urlImagen);

    setConfirmado(true);

    showToast("¡Asistencia confirmada! QR generado.", "success");

  } catch (err) {
    showToast(err.message || "Se rebaso el numero limite de invitados , consulte con el organizador.", "error");
  } finally {
    setLoading(false);
  }
};



  const descargarQr = async () => {
    if (!qrCodigo) return;

    try {
      const blob = await getQrImage(qrCodigo);

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `QR_Invitado_${invitadoCreado.nombre}_${idReserva}.png`;
      link.click();

      showToast("QR descargado correctamente", "success");
    } catch (err) {
      showToast("Error descargando el QR", "error");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        isDarkMode ? "bg-[#0f1213]" : "bg-[#f2efeb]"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden ${
          isDarkMode ? "bg-[#0f1213]" : "bg-white"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* === LADO IZQUIERDO: Bienvenida + Info Reserva === */}
          <div className={`p-8 lg:p-12 ${isDarkMode ? "bg-[#181c1d]" : "bg-[#f2efeb]/50"}`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="text-center lg:text-left">
                <h1
                  className="text-5xl font-bold tracking-tight mb-3"
                  style={{ fontFamily: "var(--font-Oswald)" }}
                >
                  ¡Bienvenido!
                </h1>
                <p className="text-lg opacity-80" style={{ fontFamily: "var(--font-Balo)" }}>
                  Has sido invitado a una reserva. Completa tu registro para generar tu QR de ingreso.
                </p>
              </div>

              {reservaInfo && (
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-6 h-6" style={{ color: isDarkMode ? "#2C7366" : "#41bfb2" }} />
                    <div>
                      <p className="text-sm opacity-70">Fecha y hora</p>
                      <p className="font-medium" style={{ fontFamily: "var(--font-Alumni)" }}>
                        {new Date(reservaInfo.fechaReserva).toLocaleDateString("es-PE")} •{" "}
                        {reservaInfo.horaInicio} - {reservaInfo.horaFin}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <MapPin className="w-6 h-6" style={{ color: isDarkMode ? "#2C7366" : "#41bfb2" }} />
                    <div>
                      <p className="text-sm opacity-70">Cancha</p>
                      <p className="font-medium" style={{ fontFamily: "var(--font-Alumni)" }}>
                        {reservaInfo.cancha.nombre} ({reservaInfo.cancha.capacidad} personas)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Users className="w-6 h-6" style={{ color: isDarkMode ? "#2C7366" : "#41bfb2" }} />
                    <div>
                      <p className="text-sm opacity-70">Organizado por</p>
                      <p className="font-medium" style={{ fontFamily: "var(--font-Alumni)" }}>
                        {reservaInfo.cliente.nombre}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Formulario y QR === */}
          <div className="p-8 lg:p-12 space-y-8">
            {/* Error global */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-3 p-4 rounded-2xl border ${
                  isDarkMode
                    ? "bg-red-900/20 border-red-800 text-red-400"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {/* Formulario */}
            {!invitadoCreado && !confirmado && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <h2
                  className="text-3xl font-bold text-center mb-6"
                  style={{ fontFamily: "var(--font-Oswald)" }}
                >
                  Completa tus datos
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="nombre"
                    required
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`px-5 py-4 rounded-2xl border ${
                      isDarkMode
                        ? "bg-gray-900/50 border-gray-700 focus:border-[#2C7366]"
                        : "bg-white border-gray-300 focus:border-[#41bfb2]"
                    } focus:outline-none transition`}
                    style={{ fontFamily: "var(--font-Balo)" }}
                  />
                  <input
                    type="text"
                    name="apellidoPaterno"
                    required
                    placeholder="Apellido Paterno"
                    value={formData.apellidoPaterno}
                    onChange={handleChange}
                    className={`px-5 py-4 rounded-2xl border ${
                      isDarkMode
                        ? "bg-gray-900/50 border-gray-700 focus:border-[#2C7366]"
                        : "bg-white border-gray-300 focus:border-[#41bfb2]"
                    } focus:outline-none transition`}
                    style={{ fontFamily: "var(--font-Balo)" }}
                  />
                  <input
                    type="text"
                    name="apellidoMaterno"
                    placeholder="Apellido Materno"
                    value={formData.apellidoMaterno}
                    onChange={handleChange}
                    className={`px-5 py-4 rounded-2xl border ${
                      isDarkMode
                        ? "bg-gray-900/50 border-gray-700 focus:border-[#2C7366]"
                        : "bg-white border-gray-300 focus:border-[#41bfb2]"
                    } focus:outline-none transition`}
                    style={{ fontFamily: "var(--font-Balo)" }}
                  />
                  <input
                    type="date"
                    name="fechaNacimiento"
                    required
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className={`px-5 py-4 rounded-2xl border ${
                      isDarkMode
                        ? "bg-gray-900/50 border-gray-700 focus:border-[#2C7366]"
                        : "bg-white border-gray-300 focus:border-[#41bfb2]"
                    } focus:outline-none transition`}
                    style={{ fontFamily: "var(--font-Balo)" }}
                  />
                  <input
                    type="tel"
                    name="telefono"
                    required
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className={`px-5 py-4 rounded-2xl border ${
                      isDarkMode
                        ? "bg-gray-900/50 border-gray-700 focus:border-[#2C7366]"
                        : "bg-white border-gray-300 focus:border-[#41bfb2]"
                    } focus:outline-none transition`}
                    style={{ fontFamily: "var(--font-Balo)" }}
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`px-5 py-4 rounded-2xl border sm:col-span-2 ${
                      isDarkMode
                        ? "bg-gray-900/50 border-gray-700 focus:border-[#2C7366]"
                        : "bg-white border-gray-300 focus:border-[#41bfb2]"
                    } focus:outline-none transition`}
                    style={{ fontFamily: "var(--font-Balo)" }}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl text-white font-medium shadow-[0_4px_14px_#00000020] transition-all ${
                    isDarkMode
                      ? "bg-[#2C7366] hover:bg-[#2C7366]/90"
                      : "bg-[#41bfb2] hover:bg-[#41bfb2]/90"
                  }`}
                  style={{ fontFamily: "var(--font-josefin)" }}
                >
                  {loading ? "Registrando..." : "Registrarme como invitado"}
                </motion.button>
              </motion.form>
            )}

            {/* Confirmar asistencia */}
            {invitadoCreado && !confirmado && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-8"
              >
                <CheckCircle2 className="w-20 h-20 mx-auto" style={{ color: isDarkMode ? "#2C7366" : "#41bfb2" }} />
                <p className="text-2xl font-semibold" style={{ fontFamily: "var(--font-Alumni)" }}>
                  ¡Ya estás registrado, {invitadoCreado.nombre}!
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConfirmarAsistencia}
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl text-white font-medium shadow-[0_4px_14px_#00000020] ${
                    isDarkMode
                      ? "bg-[#f35734] hover:bg-[#f35734]/90"
                      : "bg-[#f28627] hover:bg-[#f28627]/90"
                  }`}
                  style={{ fontFamily: "var(--font-josefin)" }}
                >
                  {loading ? "Generando QR..." : "Confirmar asistencia y generar QR"}
                </motion.button>
              </motion.div>
            )}

            {/* QR Final */}
            {confirmado && qrImageUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8 py-8"
              >
                <PartyPopper className="w-24 h-24 mx-auto" style={{ color: isDarkMode ? "#2C7366" : "#41bfb2" }} />
                <h2 className="text-4xl font-bold" style={{ fontFamily: "var(--font-Oswald)" }}>
                  ¡Listo! Tu QR está aquí
                </h2>

                <div className={`inline-block p-6 rounded-3xl shadow-xl ${isDarkMode ? "bg-[#181c1d]" : "bg-[#f2efeb]"}`}>
                  <img
                    src={qrImageUrl}
                    alt="QR invitado"
                    className="w-64 h-64 object-contain"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={descargarQr}
                  className={`w-full max-w-md mx-auto flex items-center justify-center gap-3 py-5 rounded-2xl text-white font-medium shadow-[0_4px_14px_#00000020] ${
                    isDarkMode ? "bg-[#2C7366] hover:bg-[#2C7366]/90" : "bg-[#41bfb2] hover:bg-[#41bfb2]/90"
                  }`}
                  style={{ fontFamily: "var(--font-josefin)" }}
                >
                  <Download className="w-6 h-6" />
                  Descargar mi QR
                </motion.button>
              </motion.div>
            )}


          </div>
        </div>
      </motion.div>
    </div>
  );
}