// src/features/Perfil/pages/PerfilCliente.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../context/ToastContext";
import { updateCliente, getClienteById } from "../../../api/clienteApi";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Check, X } from "lucide-react";
import AnimacionTransicion from "../../../features/RolCliente/Reserva/components/AnimacionTransicion";

export default function PerfilCliente() {
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();

  const [cliente, setCliente] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openPhotoModal, setOpenPhotoModal] = useState(false);

  const defaultPhotos = [
    "/defaults/user-default1.jpg",
    "/defaults/user-default2.jpg",
    "/defaults/user-default3.png",
    "/defaults/user-default4.png",
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

  const handleInput = (field, value) => setCliente(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    try {
      await updateCliente(cliente.id, cliente);
      showToast("Perfil actualizado correctamente", "success");
      setEditMode(false);
    } catch {
      showToast("Error al actualizar tus datos", "error");
    }
  };

  const pageBg = isDarkMode ? "#0f1213" : "#FFFFFF";
  const cardBg = isDarkMode ? "#1a1d1e" : "#FFFFFF";
  const textColor = isDarkMode ? "#f2f2f2" : "#1f1f1f";
  const labelColor = isDarkMode ? "#b0b0b0" : "#555";
  const borderColor = isDarkMode ? "#2C7366" : "#e5e5e5";
  const accentColor = isDarkMode ? "#2C7366" : "#41bfb2";

  if (loading)
    return (
      <div className={`flex justify-center items-center min-h-screen`} style={{ background: pageBg }}>
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-transparent rounded-full animate-spin mx-auto" 
            style={{ borderTopColor: accentColor }} />
          <p className="mt-3 text-gray-400">Cargando tu perfil...</p>
        </div>
      </div>
    );

  if (!cliente)
    return (
      <div className={`flex justify-center items-center min-h-screen`} style={{ background: pageBg }}>
        <p className="text-red-500">No se encontró tu perfil.</p>
      </div>
    );

  return (
    <AnimacionTransicion direction="right">
      <div className="min-h-screen px-4 pt-20 pb-10" style={{ background: pageBg }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {/* FOTO */}
          <div className="flex flex-col items-center md:col-span-1">
            <div className="relative w-40 h-40 md:w-48 md:h-48">
              <img
                src={cliente.urlImagen || "/defaults/user-default.jpg"}
                alt="Foto de perfil"
                className="w-full h-full rounded-full object-cover border-4"
                style={{ borderColor: accentColor }}
              />
              <button
                onClick={() => setOpenPhotoModal(true)}
                className="absolute bottom-2 right-2 bg-gray-700 text-white p-2 rounded-full hover:scale-110 transition"
              >
                <Camera size={20} />
              </button>
            </div>
            <p className="mt-2 text-sm" style={{ color: labelColor }}>Cambiar foto</p>
          </div>

          {/* DATOS */}
          <div className="md:col-span-2 flex flex-col justify-center gap-4">
            <h1 className="text-3xl font-Oswald font-bold mb-4" style={{ color: textColor }}>
              Mi perfil
            </h1>

            {[
              { label: "Nombre completo", field: "nombre" },
              { label: "Apellido paterno", field: "apellidoPaterno" },
              { label: "Apellido materno", field: "apellidoMaterno" },
              { label: "Correo", field: "email" },
              { label: "Teléfono", field: "telefono" },
              { label: "Fecha de nacimiento", field: "fechaNacimiento" },
            ].map(({ label, field }) => (
              <div key={field} className="flex flex-col">
                <label className="text-sm font-Alumni mb-1" style={{ color: labelColor }}>
                  {label}
                </label>
                <input
                  type="text"
                  value={cliente[field] || ""}
                  disabled={!editMode}
                  onChange={e => handleInput(field, e.target.value)}
                  className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    borderColor: borderColor,
                    color: textColor,
                    background: isDarkMode ? "#1a1d1e" : "#fff",
                    fontFamily: "var(--font-Balo)",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>
            ))}

            {/* BOTONES */}
            <div className="flex gap-3 mt-4">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 rounded-lg font-josefin font-semibold"
                  style={{ background: accentColor, color: "#fff" }}
                >
                  Editar perfil
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 rounded-lg border font-josefin font-semibold"
                    style={{ borderColor: accentColor, color: accentColor }}
                  >
                    <X size={16} /> Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg font-josefin font-semibold"
                    style={{ background: accentColor, color: "#fff" }}
                  >
                    <Check size={16} /> Guardar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* MODAL FOTO */}
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
                className="rounded-2xl p-6 max-w-sm w-full border"
                style={{ background: cardBg, borderColor: borderColor }}
              >
                <h3 className="text-xl font-Alumni mb-4" style={{ color: textColor }}>Seleccionar foto</h3>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {defaultPhotos.map(img => (
                    <img
                      key={img}
                      src={img}
                      onClick={() => { handleInput("urlImagen", img); setOpenPhotoModal(false); }}
                      className="w-20 h-20 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
                    />
                  ))}
                </div>
                <button
                  onClick={() => setOpenPhotoModal(false)}
                  className="w-full py-2 rounded-lg font-josefin font-semibold"
                  style={{ background: accentColor, color: "#fff" }}
                >
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
