import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getQrImage, getQrsByPersona } from "../../../api/QrApi";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../context/ToastContext";

export default function QrModal({ open, onClose, idReserva }) {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();

  const [qrData, setQrData] = useState(null);
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // === LÓGICA INTACTA (no toqué nada aquí) ===
  useEffect(() => {
    if (!open || !idReserva || !user?.idPersona) {
      setQrData(null);
      setQrImageUrl(null);
      setError(null);
      return;
    }

    const fetchQr = async () => {
      try {
        setLoading(true);
        setError(null);
        const qrs = await getQrsByPersona(user.idPersona);
        const encontrado = qrs.find(
          (qr) =>
            qr.idReserva === parseInt(idReserva) &&
            qr.idPersona === user.idPersona &&
            qr.esCliente
        );

        if (!encontrado) {
          setError("No tienes un QR para esta reserva");
          showToast("No tienes un QR para esta reserva", "error");
          setQrData(null);
          return;
        }

        setQrData(encontrado);
        showToast("QR cargado correctamente", "success");
      } catch {
        setError("Error al cargar el QR");
        showToast("Error al cargar información. Intenta recargar la página.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchQr();
  }, [open, idReserva, user?.idPersona, showToast]);

  useEffect(() => {
    if (!qrData?.codigoQr) return;
    const loadImage = async () => {
      try {
        const blob = await getQrImage(qrData.codigoQr);
        const url = URL.createObjectURL(blob);
        setQrImageUrl(url);
      } catch {
        setError("No se pudo cargar la imagen del QR");
        showToast("Error al cargar la imagen del QR", "error");
      }
    };
    loadImage();
  }, [qrData, showToast]);

  if (!open) return null;

  const enlacePublico = qrData
    ? `${window.location.origin}/qr-publico/${qrData.idReserva}/${qrData.codigoQr.replace(".png", "")}`
    : "";

  const copiarEnlace = async () => {
    await navigator.clipboard.writeText(enlacePublico);
    setCopied(true);
    showToast("Enlace copiado al portapapeles", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const descargarQr = () => {
    if (!qrImageUrl) return;
    const a = document.createElement("a");
    a.href = qrImageUrl;
    a.download = `QR_Reserva_${idReserva}.png`;
    a.click();
    showToast("QR descargado correctamente", "success");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.93, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.93, y: 30, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className={`w-full max-w-[380px] rounded-3xl overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.3)] ${
              isDarkMode ? "bg-[#0f1213]" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 text-center">
              <button
                onClick={onClose}
                className={`absolute top-5 right-5 p-2.5 rounded-full transition-all active:scale-95 ${
                  isDarkMode
                    ? "hover:bg-white/10 text-gray-400"
                    : "hover:bg-black/10 text-gray-600"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
              <h2
                className="text-3xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-Oswald)" }}
              >
                Tu Código QR
              </h2>
            </div>

            <div className="px-6 pb-8 space-y-7">
              {/* Loading */}
              {loading && (
                <div className="flex flex-col items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#41bfb2] dark:border-[#2C7366]" />
                  <p className="mt-4 opacity-70" style={{ fontFamily: "var(--font-Balo)" }}>
                    Cargando tu QR...
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="text-center py-12">
                  <AlertCircle
                    className="w-14 h-14 mx-auto mb-4"
                    strokeWidth={1.5}
                    style={{ color: isDarkMode ? "#f35734" : "#d61727" }}
                  />
                  <p className="text-lg" style={{ fontFamily: "var(--font-Alumni)" }}>
                    {error}
                  </p>
                </div>
              )}

              {/* QR + Info */}
              {!loading && !error && qrData && (
                <>
                  {/* QR más pequeño y bien proporcionado */}
                  <div className="flex justify-center">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className={`p-5 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.18)] ${
                        isDarkMode ? "bg-[#181c1d]" : "bg-[#f2efeb]"
                      }`}
                    >
                      <img
                        src={qrImageUrl}
                        alt="QR de ingreso"
                        className="w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] md:w-[240px] md:h-[240px] object-contain"
                      />
                    </motion.div>
                  </div>

                  {/* Información compacta y elegante */}
                  <div className="text-center space-y-1.5">
                    <p className="text-sm opacity-75" style={{ fontFamily: "var(--font-Balo)" }}>
                      Reserva #{qrData.idReserva}
                    </p>
                    <p
                      className="text-xl font-semibold leading-tight"
                      style={{ fontFamily: "var(--font-Alumni)" }}
                    >
                      {qrData.descripcion}
                    </p>
                    <p className="text-xs opacity-60" style={{ fontFamily: "var(--font-Balo)" }}>
                      Válido hasta: {new Date(qrData.fechaExpiracion).toLocaleDateString()} a las{" "}
                      {new Date(qrData.fechaExpiracion).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Acciones */}
                  <div className="space-y-4 pt-4">
                    {/* Descargar */}
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={descargarQr}
                      className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-white font-medium shadow-[0_4px_14px_#00000020] transition-all ${
                        isDarkMode
                          ? "bg-[#2C7366] hover:bg-[#2C7366]/90"
                          : "bg-[#41bfb2] hover:bg-[#41bfb2]/90"
                      }`}
                      style={{ fontFamily: "var(--font-josefin)" }}
                    >
                      <Download className="w-5 h-5" />
                      Descargar QR
                    </motion.button>

                    {/* Enlace */}
                    <div
                      className={`p-4 rounded-2xl border ${
                        isDarkMode
                          ? "border-gray-800 bg-gray-900/40"
                          : "border-gray-200 bg-[#f2efeb]/60"
                      }`}
                    >
                      <p
                        className="text-sm font-medium mb-2 opacity-80"
                        style={{ fontFamily: "var(--font-Alumni)" }}
                      >
                        Enlace para compartir
                      </p>
                      <div className="flex items-center gap-2 bg-black/10 dark:bg-white/10 rounded-xl px-3 py-2.5">
                        <span className="text-xs truncate font-mono flex-1">
                          {enlacePublico}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={copiarEnlace}
                          className={`p-2 rounded-lg transition-all ${
                            copied
                              ? isDarkMode
                                ? "bg-[#2C7366]/30 text-[#2C7366]"
                                : "bg-[#41bfb2]/30 text-[#41bfb2]"
                              : ""
                          }`}
                        >
                          {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}