import React, { useState, useEffect } from "react";
import {
  getComentarios,
  deleteComentario
} from "../../../api/ComentarioApi.js";

export default function ComentarioPanel({ canchaId }) {
  const [comentarios, setComentarios] = useState([]);
  const [confirmacionId, setConfirmacionId] = useState(null);

  useEffect(() => {
    async function fetchComentarios() {
      try {
        const data = await getComentarios();
        const filtrados = data.filter(
          (comentario) => comentario.idCancha === canchaId && comentario.estado === true
        );
        setComentarios(filtrados);
      } catch (error) {
        console.error("Error al obtener comentarios:", error);
      }
    }
    fetchComentarios();
  }, [canchaId]);

  const handleEliminarLogico = async (idComentario) => {
    try {
      await deleteComentario(idComentario);
      setComentarios((prev) =>
        prev.filter((comentario) => comentario.idComentario !== idComentario)
      );
      setConfirmacionId(null);
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
    }
  };

  function renderStars(calificacion) {
    const maxStars = 5;
    return (
      <div className="flex gap-1 mt-1">
        {[...Array(maxStars)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < calificacion ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.163c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.371-2.448a1 1 0 00-1.175 0l-3.371 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.173 9.384c-.783-.57-.38-1.81.588-1.81h4.163a1 1 0 00.95-.69l1.286-3.957z" />
          </svg>
        ))}
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Comentarios</h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {comentarios.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No hay comentarios aún.</p>
          ) : (
            comentarios.map((comentario, index) => (
              <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium text-sm">
                      {comentario.persona
                        ? `${comentario.persona.nombre} ${comentario.persona.apellidoPaterno} ${comentario.persona.apellidoMaterno}`
                        : "Anónimo"}
                    </div>
                    {renderStars(comentario.calificacion)}
                  </div>
                  <button
                    onClick={() => setConfirmacionId(comentario.idComentario)}
                    className="text-red-500 hover:text-red-700"
                    title="Eliminar comentario"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M4 5a1 1 0 011-1h10a1 1 0 011 1v1H4V5zm1 2h10v9a2 2 0 01-2 2H7a2 2 0 01-2-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-600">{comentario.contenido}</p>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(comentario.fecha).toLocaleDateString("es-BO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </div>
                {confirmacionId === comentario.idComentario && (
                  <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm text-gray-800">
                    ¿Seguro que quiere desactivar el comentario?
                    <button
                      onClick={() => handleEliminarLogico(comentario.idComentario)}
                      className="ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                    >
                      Sí
                    </button>
                    <button
                      onClick={() => setConfirmacionId(null)}
                      className="ml-2 px-2 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-xs"
                    >
                      No
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
