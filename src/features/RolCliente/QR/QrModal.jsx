import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Download, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getQrImage, getQrsByPersona } from "../../../api/QrApi";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useTheme } from "../../../context/ThemeContext";

export default function QrModal({ open, onClose, idReserva }) {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  // Estados
  const [qrData, setQrData] = useState(null);
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  /* ============================================================
        1) BUSCAR EL QR (solo cuando se abre el modal)
  ============================================================ */
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
          setQrData(null);
          return;
        }

        setQrData(encontrado);
      } catch {
        setError("Error al cargar el QR");
      } finally {
        setLoading(false);
      }
    };

    fetchQr();
  }, [open, idReserva, user?.idPersona]);

  /* ============================================================
        2) CARGAR LA IMAGEN DEL QR UNA VEZ QUE YA TENEMOS qrData
  ============================================================ */
  useEffect(() => {
    if (!qrData?.codigoQr) return;

    const loadImage = async () => {
      try {
        const blob = await getQrImage(qrData.codigoQr);
        const url = URL.createObjectURL(blob);
        setQrImageUrl(url);
      } catch (err) {
        console.error("Error obteniendo imagen:", err);
        setError("No se pudo cargar la imagen del QR");
      }
    };

    loadImage();
  }, [qrData]);

  if (!open) return null;

  const enlacePublico = qrData
    ? `https://miapp.com/qr-publico/${qrData.codigoQr.replace(".png", "")}`
    : "";

  const copiarEnlace = async () => {
    await navigator.clipboard.writeText(enlacePublico);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const descargarQr = () => {
    if (!qrImageUrl) return;
    const a = document.createElement("a");
    a.href = qrImageUrl;
    a.download = `QR_Reserva_${idReserva}.png`;
    a.click();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`w-full max-w-md rounded-2xl shadow-2xl p-6 relative ${
            isDarkMode ? "bg-[#0f1111] text-gray-100" : "bg-white text-gray-900"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* BOTÓN X */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold text-center mb-6">
            Tu Código QR
          </h2>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
              <p className="mt-4 opacity-70">Cargando tu QR...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && qrData && (
            <>
              {/* IMAGEN */}
              <div className="flex justify-center mb-6">
                <div
                  className={`p-6 rounded-2xl shadow-xl ${
                    isDarkMode ? "bg-gray-900" : "bg-white"
                  }`}
                >
                  <img
                    src={qrImageUrl}
                    alt="QR de ingreso"
                    className="w-64 h-64 object-contain"
                  />
                </div>
              </div>

              {/* INFO */}
              <div className="text-center mb-6">
                <p className="text-sm opacity-80">Reserva #{qrData.idReserva}</p>
                <p className="font-bold text-lg">{qrData.descripcion}</p>
                <p className="text-xs opacity-70">
                  Válido hasta:{" "}
                  {new Date(qrData.fechaExpiracion).toLocaleString()}
                </p>
              </div>

              {/* BOTONES */}
              <div className="space-y-4">
                <button
                  onClick={descargarQr}
                  className="w-full flex items-center justify-center gap-3 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
                >
                  <Download className="w-5 h-5" />
                  Descargar QR
                </button>

                <div
                  className={`p-4 rounded-xl border ${
                    isDarkMode
                      ? "border-gray-700 bg-gray-900/40"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <p className="text-sm font-medium mb-2">
                    Enlace para compartir:
                  </p>
                  <div className="flex items-center gap-2 bg-black/10 dark:bg-white/10 rounded-lg px-3 py-2">
                    <span className="text-xs truncate flex-1 font-mono">
                      {enlacePublico}
                    </span>
                    <button
                      onClick={copiarEnlace}
                      className="p-2 hover:bg-white/20 rounded transition"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  {copied && (
                    <p className="text-green-500 text-sm text-center mt-2">
                      ¡Copiado!
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
