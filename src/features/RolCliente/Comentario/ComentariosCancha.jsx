import React, { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { Star, SendHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import {
  getComentariosPorCancha,
  createComentario,
  getComentariosMasRecientes,
  getComentariosPorCliente,
  getComentariosPorCalificacion
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
    // ⚡ Validar usuario primero
    if (!user?.id) {
      showToast("Debes iniciar sesión para dejar un comentario en esta cancha.", "warning");
      return;
    }

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
    } catch (e) {
      showToast("Escribe un comentarios de almenos 5 caracteres", "warning");
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

  //FILTROS Y ORDENAMIENTOS
  // FILTROS
  const [filtro, setFiltro] = useState("todos"); // 'todos', 'recientes', 'usuario', 1-5
  const [clienteComentarios, setClienteComentarios] = useState([]);

  useEffect(() => {
    async function cargarFiltro() {
      try {
        let data = [];
        if (filtro === "todos") {
          data = await getComentariosPorCancha(canchaId);
        } else if (filtro === "recientes") {
          data = await getComentariosMasRecientes(canchaId);
        } else if (filtro === "usuario") {
          if (!user) {
            showToast("Debes iniciar sesión para ver tus comentarios", "warning");
            return;
          }
          data = await getComentariosPorCliente(user.id);
        } else if (typeof filtro === "number") {
          data = await getComentariosPorCalificacion(filtro);
        }
        setComentarios(data);
      } catch (e) {
        showToast("Error al cargar comentarios", "error");
      }
    }

    cargarFiltro();
  }, [filtro, canchaId, user]);


  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFiltro("todos")}
          className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
            filtro === "todos"
              ? "bg-[var(--color-p-2)] text-white"
              : isDarkMode
              ? "bg-[#1c1f20] text-gray-300 hover:bg-[#2a2d2e]"
              : "bg-[var(--color-pb-4)] text-gray-600 hover:bg-[var(--color-pb-5)]"
          }`}
        >
          Todos
        </button>

        <button
          onClick={() => setFiltro("recientes")}
          className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
            filtro === "recientes"
              ? "bg-[var(--color-p-2)] text-white"
              : isDarkMode
              ? "bg-[#1c1f20] text-gray-300 hover:bg-[#2a2d2e]"
              : "bg-[var(--color-pb-4)] text-gray-600 hover:bg-[var(--color-pb-5)]"
          }`}
        >
          Más recientes
        </button>

        <button
          onClick={() => setFiltro("usuario")}
          className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
            filtro === "usuario"
              ? "bg-[var(--color-p-2)] text-white"
              : isDarkMode
              ? "bg-[#1c1f20] text-gray-300 hover:bg-[#2a2d2e]"
              : "bg-[var(--color-pb-4)] text-gray-600 hover:bg-[var(--color-pb-5)]"
          }`}
        >
          Mis comentarios
        </button>

        {[5, 4, 3, 2, 1].map((n) => (
          <button
            key={n}
            onClick={() => setFiltro(n)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all flex items-center justify-center gap-1 ${
              filtro === n
                ? "bg-[var(--color-p-2)] text-white"
                : isDarkMode
                ? "bg-[#1c1f20] text-gray-300 hover:bg-[#2a2d2e]"
                : "bg-[var(--color-pb-4)] text-gray-600 hover:bg-[var(--color-pb-5)]"
            }`}
          >
            {n} ⭐
          </button>
        ))}
      </div>
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
      <div className={`mt-10 p-8 rounded-3xl border ${border} ${bgCard} shadow-lg`}>
        <h3 className={`text-1xl font-bold mb-6 font-[var(--font-Alumni)] ${textPrimary}`}>
          ¿Qué te pareció esta cancha?
        </h3>

        {/* ESTRELLAS - Más grandes y con hover bonito */}
        <div className="flex gap-3 mb-6 justify-center md:justify-start">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Star
                size={26}
                className={`cursor-pointer transition-all duration-200 ${
                  i < nuevo.calificacion
                    ? `${starFill} drop-shadow-lg`
                    : "text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500"
                }`}
                onClick={() => setNuevo({ ...nuevo, calificacion: i + 1 })}
              />
            </motion.div>
          ))}
        </div>

        {/* TEXTAREA - Diseño más moderno */}
        <textarea
          value={nuevo.contenido}
          onChange={(e) => setNuevo({ ...nuevo, contenido: e.target.value })}
          placeholder="Cuéntanos tu experiencia... ¿La cancha estaba en buen estado? ¿El ambiente? ¿Recomendarías este lugar?"
          className={`
            w-full p-5 rounded-2xl font-[var(--font-Balo)] text-base leading-relaxed
            border ${border}
            ${isDarkMode ? "bg-[#0b0d0e] text-white placeholder-gray-500" : "bg-white text-black placeholder-gray-400"}
            focus:outline-none focus:ring-4 
            resize-none transition-all duration-300
          `}
          rows={4}
        />

        {/* Mensaje de privacidad */}
        <p className={`text-xs mt-3 ${textSecondary} flex items-center gap-1`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          Tu opinión será pública y aparecerá con tu nombre
        </p>

        {/* BOTÓN PUBLICAR - Más grande, llamativo y centrado */}
        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={enviar}
            disabled={!nuevo.contenido.trim()} 
            className={`
              px-8 py-4 rounded-2xl font-bold text-lg
              flex items-center gap-3 shadow-xl
              transition-all duration-300
              ${btnBg} ${btnHover} text-white
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              hover:shadow-2xl
            `}
          >
            <SendHorizontal size={18} />
            Publicar opinión
          </motion.button>
        </div>
      </div>
    </div>
  );
}
