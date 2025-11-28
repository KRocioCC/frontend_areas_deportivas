// RESERVA INVITADOS — DISEÑO PROFESIONAL (solo estilos mejorados)

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerConfirmadosPorReserva, eliminarParticipacion } from "../../../api/participaApi";
import { getInvitadoById } from "../../../api/invitadoApi";
import {
  ArrowLeft, Trash2, Info, X, Check, User, Image as ImageIcon,
  Mail, Phone, Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../context/ToastContext";

export default function ReservaInvitados() {
  const { idReserva } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();

  const [invitados, setInvitados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invitadoAConfirmar, setInvitadoAConfirmar] = useState(null);
  const [invitadoModal, setInvitadoModal] = useState(null);

  const cargarInvitados = async () => {
  try {
    setLoading(true);
    const data = await obtenerConfirmadosPorReserva(idReserva);

    // AQUÍ SE COMPLETAN LOS DATOS
    const invitadosCompletos = await Promise.all(
      data.map(async (p) => {
        const info = await getInvitadoById(p.idInvitado);
        return { ...p, ...info };
      })
    );

    setInvitados(invitadosCompletos);
  } catch (err) {
    setError(err.message || "No se pudieron cargar los invitados");
    showToast("Error al cargar los invitados", "error");
  } finally {
    setLoading(false);
  }
};


  const abrirModal = async (idInvitado) => {
    try {
      const info = await getInvitadoById(idInvitado);
      setInvitadoModal(info);
    } catch {
      showToast("Error al obtener la información del invitado", "error");
    }
  };

  const cerrarModal = () => setInvitadoModal(null);

  const iniciarExpulsion = (id) => setInvitadoAConfirmar(id);

  const cancelarExpulsion = () => setInvitadoAConfirmar(null);

  const confirmarExpulsion = async () => {
    if (!invitadoAConfirmar) return;

    try {
      await eliminarParticipacion(idReserva, invitadoAConfirmar);
      showToast("Invitado expulsado correctamente", "success");
      cargarInvitados();
    } catch {
      showToast("Error al expulsar al invitado", "error");
    } finally {
      setInvitadoAConfirmar(null);
    }
  };

  useEffect(() => {
    cargarInvitados();
  }, []);

  const formatearFecha = (fecha) => {
    if (!fecha) return "No registrado";
    const [y, m, d] = fecha.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div
      className="min-h-screen p-12 pt-16"
      style={{
        backgroundColor: isDarkMode ? "#0c0f10" : "#f7faf9",
        color: isDarkMode ? "#f1f5f9" : "#1a1a1a",
        fontFamily: "var(--font-josefin)",
      }}
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full shadow-md transition"
          style={{
            backgroundColor: isDarkMode ? "#1a1d1f" : "#e2e8f0",
          }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2
          className="text-2xl font-bold tracking-wide"
          style={{ fontFamily: "var(--font-Oswald)" }}
        >
          Invitados de la Reserva #{idReserva}
        </h2>
      </div>

      {/* Loaders */}
      {loading && <p className="opacity-70 text-sm">Cargando invitados...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* LISTA */}
      <div className="mt-4 space-y-4">
        {invitados.length === 0 && !loading ? (
          <p className="opacity-70">No hay invitados confirmados.</p>
        ) : (
          invitados.map((inv) => (
            <motion.div
              key={inv.idInvitado}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 rounded-xl shadow-lg"
              style={{
                backgroundColor: isDarkMode ? "#1a1d1f" : "#ffffff",
                border: isDarkMode ? "1px solid #2d3436" : "1px solid #e2e8f0",
              }}
            >
              {/* FOTO + DATOS */}
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-12 h-12 rounded-full overflow-hidden border"
                  style={{
                    borderColor: isDarkMode ? "#374151" : "#d1d5db",
                  }}
                >
                  {inv.urlImagen ? (
                    <img
                      src={inv.urlImagen}
                      alt="img"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col leading-tight">
                  <p className="font-semibold text-sm">
                    {inv.nombre} {inv.apellidoPaterno} {inv.apellidoMaterno}
                  </p>
                  <p className="text-xs opacity-70">
                    {inv.email || "Sin correo"}
                  </p>
                </div>
              </div>

              {/* BOTONES */}
              <div className="flex items-center gap-2">
                {/* INFO */}
                <button
                  onClick={() => abrirModal(inv.idInvitado)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 shadow-md transition"
                  style={{
                    backgroundColor: "#2b6cb0",
                    color: "#fff",
                  }}
                >
                  <Info className="w-4 h-4" />
                  Info
                </button>

                {/* EXPULSAR O CONFIRMAR */}
                {invitadoAConfirmar === inv.idInvitado ? (
                  <div className="flex gap-1">
                    <button
                      onClick={confirmarExpulsion}
                      className="p-1.5 rounded-md shadow"
                      style={{ backgroundColor: "#16a34a", color: "#fff" }}
                    >
                      <Check className="w-4 h-4" />
                    </button>

                    <button
                      onClick={cancelarExpulsion}
                      className="p-1.5 rounded-md shadow"
                      style={{ backgroundColor: "#dc2626", color: "#fff" }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => iniciarExpulsion(inv.idInvitado)}
                    className="px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 shadow-md transition"
                    style={{
                      backgroundColor: "#d9534f",
                      color: "#fff",
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Expulsar
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* MODAL */}
      {invitadoModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
          onClick={cerrarModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl shadow-2xl max-w-md w-full p-6"
            style={{
              backgroundColor: isDarkMode ? "#1a1d1f" : "#ffffff",
              color: isDarkMode ? "#f1f5f9" : "#1a1a1a",
              fontFamily: "var(--font-josefin)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-5">
              <h3 className="text-xl font-bold">Información del Invitado</h3>
              <button
                onClick={cerrarModal}
                className="p-2 rounded-full transition shadow"
                style={{
                  backgroundColor: isDarkMode ? "#2d3748" : "#e2e8f0",
                }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FOTO */}
            <div className="flex justify-center mb-4">
              {invitadoModal.urlImagen ? (
                <img
                  src={invitadoModal.urlImagen}
                  alt="perfil"
                  className="w-20 h-20 rounded-full object-cover border"
                  style={{
                    borderColor: isDarkMode ? "#374151" : "#d1d5db",
                  }}
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
              )}
            </div>

            {/* DATOS */}
            <div className="space-y-4">
              <Item icon={<User />} label="Nombre completo" value={`${invitadoModal.nombre} ${invitadoModal.apellidoPaterno} ${invitadoModal.apellidoMaterno}`} />
              <Item icon={<Mail />} label="Correo" value={invitadoModal.email} />
              <Item icon={<Phone />} label="Teléfono" value={invitadoModal.telefono} />
              <Item icon={<Calendar />} label="Nacimiento" value={formatearFecha(invitadoModal.fechaNacimiento)} />
              <Item icon={<ImageIcon />} label="Imagen" value={invitadoModal.urlImagen || "No registrada"} />

              <Item
                icon={<Check />}
                label="Verificado"
                value={invitadoModal.verificado ? "Sí" : "No"}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={cerrarModal}
                className="px-4 py-2 rounded-md font-medium shadow"
                style={{
                  backgroundColor: isDarkMode ? "#2d3748" : "#e2e8f0",
                }}
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function Item({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-gray-500 dark:text-gray-300">{icon}</div>
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs opacity-80">{value || "No registrado"}</p>
      </div>
    </div>
  );
}
