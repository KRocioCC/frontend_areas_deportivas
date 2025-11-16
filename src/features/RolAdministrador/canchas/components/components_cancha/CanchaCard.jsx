import React from "react";
import { useNavigate } from "react-router-dom";

const CanchaCard = ({
  cancha,
  onEdit,
  isEditing,
  editedData,
  onChangeField,
  onSave,
  onCancel,
  onDesactivar,
}) => {
  const navigate = useNavigate();
  const desactivada = cancha.estado === false;

  const renderField = (label, field, isCurrency = false) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      {isEditing ? (
        <input
          type={isCurrency ? "number" : "text"}
          value={editedData[field] || ""}
          onChange={(e) => onChangeField(field, e.target.value)}
          className="border border-gray-300 px-3 py-1 rounded-lg text-sm w-32 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      ) : (
        <span className={`text-sm font-semibold ${desactivada ? "text-red-700" : "text-gray-800"}`}>
          {isCurrency ? `S/ ${cancha[field] || "—"}` : cancha[field] || "—"}
        </span>
      )}
    </div>
  );

  return (
    <div className={`rounded-2xl shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-[620px] w-full max-w-[420px] mx-auto border ${desactivada ? "bg-red-50 border-red-300" : "bg-white border-gray-100 hover:shadow-2xl"}`}>
      {/* Imagen */}
      <div className="h-[340px] w-full relative overflow-hidden">
        <img
          src={cancha.urlImagen || "https://placehold.co/600x400?text=Cancha"}
          alt={cancha.nombre}
          className={`w-full h-full object-cover transition-transform duration-500 ${desactivada ? "grayscale" : "hover:scale-105"}`}
        />
        {!desactivada && (
          <div className="absolute top-4 right-4">
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 text-sm font-medium shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={onSave}
                >
                  ✓
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 text-sm font-medium shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={onCancel}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white hover:text-blue-600 text-sm font-medium shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => onEdit(cancha.idCancha)}
              >
                Editar
              </button>
            )}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-6 flex flex-col justify-between flex-1">
        {/* Header */}
        <div className="mb-4">
          <h3 className={`text-xl font-bold mb-2 ${desactivada ? "text-red-700" : "text-gray-800"}`}>
            {isEditing ? (
              <input
                type="text"
                value={editedData.nombre || ""}
                onChange={(e) => onChangeField("nombre", e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-xl text-lg font-bold w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombre de la cancha"
              />
            ) : (
              cancha.nombre
            )}
          </h3>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${cancha.cubierta === "cubierta" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
              {cancha.cubierta === "cubierta" ? "🌤️ Cubierta" : "☀️ Abierta"}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {cancha.tipoSuperficie || "Natural"}
            </span>
            {desactivada && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-200 text-red-800">
                Desactivada
              </span>
            )}
          </div>
        </div>

        {/* Detalles */}
        <div className="space-y-1 mb-6">
          {renderField("Costo por Hora", "costoHora", true)}
          {renderField("Capacidad", "capacidad")}
          {renderField("Horario", "horaInicio")}
          {renderField("Tamaño", "tamano")}
          {renderField("Iluminación", "iluminacion")}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-100 space-y-3">
          {!desactivada && (
            <>
              <button
                onClick={() => navigate(`/cliente/cancha/${cancha.idCancha}`)}
className="w-full py-3 bg-[#41BFB3] text-white rounded-xl hover:bg-[#3aa9a0] transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Realizar Reserva
              </button>

{/* NO HAY ELIMINACION LOGICA EN EL BACKEND :=0 
              <button
                onClick={() => onDesactivar(cancha.idCancha)}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Desactivar
              </button> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CanchaCard;
