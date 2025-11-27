// src/features/Perfil/pages/PerfilCliente.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../context/ToastContext";
import { updateCliente, getClienteById } from "../../../api/clienteApi";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Check, X, Trash } from "lucide-react";
import AnimacionTransicion from "../../../features/RolCliente/Reserva/components/AnimacionTransicion";

export default function PerfilCliente() {
  const { currentUser, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [cliente, setCliente] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openPhotoModal, setOpenPhotoModal] = useState(false);

  // === IMÁGENES POR DEFECTO ===
  const defaultPhotos = [
    "/defaults/user-default1.jpg",
    "/defaults/user-default2.jpg",
    "/defaults/user-default3.jpg",
    "/defaults/user-default4.jpg",
  ];

  useEffect(() => {
    if (!currentUser?.idPersona) return;
    const fetchCliente = async () => {
      try {
        const data = await getClienteById(currentUser.idPersona);
        setCliente(data);
      } catch {
        showToast("Error al cargar tu perfil", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchCliente();
  }, [currentUser?.idPersona]);

  const handleInput = (field, value) => {
    setCliente((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateCliente(cliente.id, cliente);
      showToast("Perfil actualizado correctamente", "success");
      setEditMode(false);
    } catch {
      showToast("Error al actualizar tus datos", "error");
    }
  };

  const handleDelete = async () => {
    showToast("Función de eliminar cuenta próximamente", "warning");
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen 
        ${isDarkMode ? "bg-[#0f1213]" : "bg-[#f2efeb]"}`}>
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-transparent rounded-full animate-spin mx-auto"
            style={{ borderTopColor: isDarkMode ? "#2C7366" : "#41bfb2" }}>
          </div>
          <p className="mt-3 text-gray-400">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className={`flex justify-center items-center min-h-screen 
        ${isDarkMode ? "bg-[#0f1213]" : "bg-[#f2efeb]"}`}>
        <p className="text-red-400">No se encontró tu perfil.</p>
      </div>
    );
  }

  // === CLASES DINÁMICAS ===
  const pageBg = isDarkMode ? "bg-[#0f1213]" : "bg-[#f2efeb]";
  const cardBg = isDarkMode ? "bg-[#1a1d1e]" : "bg-white";
  const textColor = isDarkMode ? "text-gray-100" : "text-gray-900";
  const labelColor = isDarkMode ? "text-gray-300" : "text-gray-500";
  const borderColor = isDarkMode ? "border-[#2d3748]" : "border-gray-200";
  const accentColor = isDarkMode ? "#2C7366" : "#41bfb2";

  return (
    <AnimacionTransicion direction="right">
      <div className={`min-h-screen px-4 pt-20 pb-10 transition-colors ${pageBg}`}>
        <div className="max-w-xl mx-auto">
          <h1 className={`text-center text-3xl font-bold mb-6 ${textColor}`}
            style={{ fontFamily: "var(--font-Alumni)" }}>
            Mi perfil
          </h1>

          {/* === TARJETA PRINCIPAL === */}
          <div className={`rounded-2xl p-6 border shadow-sm ${cardBg} ${borderColor}`}>

            {/* FOTO */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img
                  src={cliente.urlImagen || "/defaults/user-default.jpg"}
                  alt="Foto de perfil"
                  className="w-32 h-32 rounded-full object-cover border-4"
                  style={{ borderColor: accentColor }}
                />
                <button
                  onClick={() => setOpenPhotoModal(true)}
                  className="absolute bottom-1 right-1 bg-gray-700 text-white p-1.5 rounded-full hover:scale-110 transition">
                  <Camera size={16} />
                </button>
              </div>
              <p className={`mt-3 text-sm ${labelColor}`}>Cambiar foto</p>
            </div>

            {/* === CAMPOS === */}
            <div className="space-y-4">
              {[
                { label: "Nombre completo", field: "nombre" },
                { label: "Apellido paterno", field: "apellidoPaterno" },
                { label: "Apellido materno", field: "apellidoMaterno" },
                { label: "Correo", field: "email" },
                { label: "Teléfono", field: "telefono" },
                { label: "Fecha de nacimiento", field: "fechaNacimiento" },
              ].map(({ label, field }) => (
                <div key={field}>
                  <p className={`text-sm mb-1 ${labelColor}`}>{label}</p>
                  <input
                    type="text"
                    value={cliente[field] || ""}
                    disabled={!editMode}
                    onChange={(e) => handleInput(field, e.target.value)}
                    className={`
                      w-full px-3 py-2 rounded-lg border bg-transparent
                      ${borderColor} ${textColor} 
                      focus:ring-2 focus:ring-[${accentColor}] 
                      disabled:opacity-60 disabled:cursor-not-allowed
                    `}
                  />
                </div>
              ))}
            </div>

            {/* === BOTONES === */}
            <div className="flex justify-between mt-7 pt-5 border-t" style={{ borderColor }}>
              {!editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 rounded-lg text-white font-semibold"
                    style={{ backgroundColor: accentColor }}>
                    Editar perfil
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 rounded-lg font-semibold border"
                    style={{ color: accentColor, borderColor: accentColor }}>
                    <X size={16} /> Cancelar
                  </button>

                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg text-white font-semibold"
                    style={{ backgroundColor: accentColor }}>
                    <Check size={16} /> Guardar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* === MODAL PARA CAMBIAR FOTO === */}
        <AnimatePresence>
          {openPhotoModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex justify-center items-center p-6 z-50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className={`rounded-2xl p-6 max-w-sm w-full border ${cardBg} ${borderColor}`}
              >
                <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>
                  Seleccionar foto
                </h3>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {defaultPhotos.map((img) => (
                    <img
                      key={img}
                      src={img}
                      onClick={() => {
                        handleInput("urlImagen", img);
                        setOpenPhotoModal(false);
                      }}
                      className="w-20 h-20 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
                    />
                  ))}
                </div>

                <button
                  onClick={() => setOpenPhotoModal(false)}
                  className="w-full py-2 rounded-lg text-white font-semibold"
                  style={{ backgroundColor: accentColor }}>
                  Cerrar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimacionTransicion>
  );
}
