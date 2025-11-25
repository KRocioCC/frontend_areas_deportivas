import React, { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { Star, SendHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import {
  getComentariosPorCancha,
  createComentario,
} from "../../../api/ComentarioApi";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useTheme } from "../../../context/ThemeContext";

export default function ComentariosCancha({ canchaId }) {
  const { showToast } = useToast();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  const [comentarios, setComentarios] = useState([]);
  const [nuevo, setNuevo] = useState({ calificacion: 5, contenido: "" });

  // ======================
  // CARGAR COMENTARIOS
  // ======================
  async function cargar() {
    try {
      const data = await getComentariosPorCancha(canchaId);
      setComentarios(data);
    } catch (e) {
      showToast("Error al cargar comentarios", "error");
    }
  }

  // ======================
  // ENVIAR COMENTARIO
  // ======================
  async function enviar() {
    if (!nuevo.contenido.trim()) {
      showToast("Escribe un comentario antes de enviar", "warning");
      return;
    }

    try {
      await createComentario({
        ...nuevo,
        idCancha: canchaId,
        idPersona: user.id,
      });

      showToast("Comentario enviado", "success");
      setNuevo({ calificacion: 5, contenido: "" });
      cargar();
    } catch {
      showToast("Error al enviar comentario", "error");
    }
  }

  // ======================
  // FORMATEAR FECHA
  // ======================
  function formatFecha(fecha) {
    const d = new Date(fecha);
    return (
      d.toLocaleDateString("es-BO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) +
      " " +
      d.toLocaleTimeString("es-BO", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }

  useEffect(() => {
    cargar();
  }, [canchaId]);

  const promedio =
    comentarios.length > 0
      ? (
          comentarios.reduce((acc, c) => acc + c.calificacion, 0) /
          comentarios.length
        ).toFixed(1)
      : 0;

  // ======================
  // PALETA SEGÚN MODO
  // ======================
  const bgCard = isDarkMode ? "bg-[#0f1213]" : "bg-[var(--color-pb-6)]";
  const border = isDarkMode ? "border-[#1c1f20]" : "border-gray-200";
  const textPrimary = isDarkMode ? "text-white" : "text-black";
  const textSecondary = isDarkMode ? "text-gray-300" : "text-gray-600";
  const starFill = isDarkMode ? "text-[var(--color-p-11)] fill-[var(--color-p-11)]" : "text-[var(--color-pb-5)] fill-[var(--color-pb-5)]";

  // Btn principal
  const btnBg = isDarkMode ? "bg-[var(--color-p-2)]" : "bg-[var(--color-pb-3)]";
  const btnHover = isDarkMode ? "hover:bg-[#d94a28]" : "hover:bg-[#d9741f]";

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      {/* =====================
          HEADER PROMEDIO
      ====================== */}
      <div
        className={`
          flex flex-col md:flex-row justify-between gap-6 p-6 
          rounded-2xl shadow-[0_4px_14px_#00000015]
          ${bgCard} ${border} border
        `}
      >
        <div className="flex flex-col items-start">
          <h2
            className={`text-5xl font-bold font-[var(--font-Oswald)] ${textPrimary}`}
          >
            {promedio}
          </h2>

          <p
            className={`text-sm mt-1 font-[var(--font-Balo)] ${textSecondary}`}
          >
            {comentarios.length} opiniones
          </p>

          <div className="flex mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={22}
                className={`${
                  i < Math.round(promedio)
                    ? starFill
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* BARRAS DE CALIFICACIÓN */}
        <div className="grid grid-cols-1 gap-2 w-full font-[var(--font-Balo)]">
          {[5, 4, 3, 2, 1].map((n) => {
            const count = comentarios.filter((c) => c.calificacion === n).length;
            const pct = comentarios.length ? (count / comentarios.length) * 100 : 0;

            return (
              <div key={n} className="flex items-center gap-2">
                <span className={`w-10 text-sm ${textPrimary}`}>{n} ⭐</span>

                <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isDarkMode
                        ? "bg-[var(--color-p-11)]"
                        : "bg-[var(--color-pb-5)]"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <span className={`w-8 text-sm text-right ${textSecondary}`}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================
          LISTA DE COMENTARIOS
      ====================== */}
      <div className="mt-10 space-y-4">
        {comentarios.map((c) => (
          <motion.div
            key={c.idComentario}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              p-5 rounded-2xl shadow-[0_4px_14px_#00000010]
              border ${border} ${bgCard}
            `}
          >
            {/* HEADER DEL COMENTARIO */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={c.persona?.urlImagen ?? "https://via.placeholder.com/40"}
                  alt="perfil"
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div>
                  <p
                    className={`font-semibold font-[var(--font-Alumni)] text-lg ${textPrimary}`}
                  >
                    {c.persona
                      ? `${c.persona.nombre} ${c.persona.apellidoPaterno} ${c.persona.apellidoMaterno}`
                      : "Usuario"}
                  </p>

                  <p
                    className={`text-xs font-[var(--font-Balo)] ${textSecondary}`}
                  >
                    {formatFecha(c.fecha)}
                  </p>
                </div>
              </div>

              {/* ESTRELLAS */}
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < c.calificacion
                        ? starFill
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* CONTENIDO */}
            <p
              className={`text-sm font-[var(--font-Balo)] leading-relaxed ${textPrimary}`}
            >
              {c.contenido}
            </p>
          </motion.div>
        ))}
      </div>

      {/* =====================
          FORMULARIO NUEVO
      ====================== */}
      <div
        className={`mt-10 p-6 rounded-2xl shadow-[0_4px_14px_#00000015] border ${border} ${bgCard}`}
      >
        <h3
          className={`text-xl mb-4 font-[var(--font-Alumni)] ${textPrimary}`}
        >
          Escribe una opinión
        </h3>

        {/* SELECCIÓN DE ESTRELLAS */}
        <div className="flex gap-2 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={26}
              className={`cursor-pointer transition-all ${
                i < nuevo.calificacion
                  ? starFill
                  : "text-gray-300 dark:text-gray-600"
              }`}
              onClick={() => setNuevo({ ...nuevo, calificacion: i + 1 })}
            />
          ))}
        </div>

        {/* TEXTAREA */}
        <textarea
          value={nuevo.contenido}
          onChange={(e) => setNuevo({ ...nuevo, contenido: e.target.value })}
          placeholder="Comparte tu experiencia..."
          className={`
            w-full p-3 rounded-xl font-[var(--font-Balo)]
            border ${border}
            ${isDarkMode ? "bg-[#0b0d0e] text-white" : "bg-white text-black"}
          `}
          rows={3}
        />

        {/* BOTÓN ENVIAR */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={enviar}
          className={`
            mt-4 px-6 py-3 flex items-center gap-2 
            rounded-xl shadow-[0_4px_14px_#00000020]
            font-[var(--font-josefin)] text-white
            transition-all ${btnBg} ${btnHover}
          `}
        >
          <SendHorizontal size={18} />
          Enviar opinión
        </motion.button>
      </div>
    </div>
  );
}
