import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalDisciplinas from "./ModalDisciplinas"; // Asegúrate de que la ruta sea correcta

const CanchaCard = ({
  cancha,
  onEdit,
  isEditing,
  editedData,
  onChangeField,
  onSave,
  onCancel,
  onDesactivar,
  adminId // Asegúrate de que recibas el adminId como prop
}) => {
  const navigate = useNavigate();
  const [imagenPrincipal, setImagenPrincipal] = useState("");
  const [cargando, setCargando] = useState(true);
  const [showModalDisciplinas, setShowModalDisciplinas] = useState(false); // Estado para el modal
  const desactivada = cancha.estado === false;

  // Construir URL base para las imágenes
  const getUrlImagenCompleta = (urlAcceso) => {
    if (!urlAcceso) return "https://placehold.co/600x400?text=Sin+Imagen";
    
    // Si la URL ya es completa, usarla directamente
    if (urlAcceso.startsWith('http')) {
      return urlAcceso;
    }
    
    // Si es una ruta relativa, construir la URL completa
    const baseUrl = 'http://localhost:8032';
    return `${baseUrl}${urlAcceso.startsWith('/') ? urlAcceso : `/${urlAcceso}`}`;
  };

  // Procesar imágenes cuando cambia la cancha
  useEffect(() => {
    const procesarImagenes = () => {
      if (!cancha) {
        setImagenPrincipal("https://placehold.co/600x400?text=Sin+Imagen");
        setCargando(false);
        return;
      }

      console.log(" Imágenes de la cancha:", cancha.imagenes);
      console.log(" Cancha recibida:", cancha.nombre, "ID:", cancha.idCancha);

      // Verificar si hay imágenes en la respuesta de la cancha
      if (cancha.imagenes && cancha.imagenes.length > 0) {
        const primeraImagen = cancha.imagenes[0];
        console.log(" Primera imagen:", primeraImagen);
        
        // Usar urlAcceso para construir la URL completa
        const urlImagen = getUrlImagenCompleta(primeraImagen.urlAcceso);
        console.log("🔗 URL de imagen construida:", urlImagen);
        
        setImagenPrincipal(urlImagen);
        
        // Pre-cargar la imagen para verificar que funciona
        const img = new Image();
        img.onload = () => {
          console.log("✅ Imagen cargada correctamente");
          setCargando(false);
        };
        img.onerror = () => {
          console.error("❌ Error al cargar la imagen, usando placeholder");
          setImagenPrincipal("https://placehold.co/600x400?text=Error+Cargando");
          setCargando(false);
        };
        img.src = urlImagen;
      } else {
        console.warn("⚠️ No hay imágenes en la respuesta de la cancha");
        setImagenPrincipal("https://placehold.co/600x400?text=Sin+Imágenes");
        setCargando(false);
      }
    };

    procesarImagenes();
  }, [cancha]);

  // Función para cambiar la imagen principal
  const cambiarImagenPrincipal = (imagen) => {
    const urlImagen = getUrlImagenCompleta(imagen.urlAcceso);
    console.log("🔄 Cambiando a imagen:", urlImagen);
    setImagenPrincipal(urlImagen);
  };

  // Función para abrir el modal de disciplinas
  const handleVerDisciplinas = () => {
    setShowModalDisciplinas(true);
  };

  // Función para cerrar el modal de disciplinas
  const handleCloseModal = () => {
    setShowModalDisciplinas(false);
  };

  const renderField = (label, field, isCurrency = false) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100">
      <span className="text-sm font-medium text-gray-500" style={{fontFamily: "var(--font-Balo)"}}>{label}</span>
      {isEditing ? (
        <input
          type={isCurrency ? "number" : "text"}
          value={editedData[field] || ""}
          onChange={(e) => onChangeField(field, e.target.value)}
          className="border border-gray-300 px-3 py-1 rounded-lg text-sm w-32 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          style={{fontFamily: "var(--font-Balo)"}}
        />
      ) : (
        <span className={`text-sm font-semibold ${desactivada ? "text-red-700" : "text-gray-800"}`} style={{fontFamily: "var(--font-Balo)"}}>
          {isCurrency ? `S/ ${cancha[field] || "—"}` : cancha[field] || "—"}
        </span>
      )}
    </div>
  );

  return (
    <>
      <div className={`rounded-2xl shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-[680px] w-full max-w-[420px] mx-auto border ${desactivada ? "bg-red-50 border-red-300" : "bg-white border-gray-100 hover:shadow-2xl"}`}>
        
        {/* Debug Info - Solo en desarrollo
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-blue-50 p-2 text-xs border-b">
            <div><strong>Cancha:</strong> {cancha.nombre} (ID: {cancha.idCancha})</div>
            <div><strong>Imágenes encontradas:</strong> {cancha.imagenes ? cancha.imagenes.length : 0}</div>
            <div><strong>Estado:</strong> {cargando ? '🔄 Cargando...' : '✅ Listo'}</div>
          </div>
        )} */}

        {/* Imagen Principal */}
        <div className="h-[460px] w-full relative overflow-hidden">
          {cargando ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
              <div className="text-gray-500 mb-2" style={{fontFamily: "var(--font-Balo)"}}>Cargando imagen...</div>
              <div className="text-xs text-gray-400" style={{fontFamily: "var(--font-Balo)"}}>Cancha: {cancha.nombre}</div>
            </div>
          ) : (
            <>
              <img
                src={imagenPrincipal}
                alt={cancha.nombre}
                className={`w-full h-full object-cover transition-transform duration-500 ${desactivada ? "grayscale" : "hover:scale-105"}`}
                onLoad={() => console.log("✅ Imagen renderizada en el DOM")}
                onError={(e) => {
                  console.error("❌ Error en la etiqueta img, usando placeholder");
                  e.target.src = "https://placehold.co/600x400?text=Error+Mostrando+Imagen";
                }}
              />
              
              {/* Indicador de múltiples imágenes */}
              {cancha.imagenes && cancha.imagenes.length > 1 && (
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm" style={{fontFamily: "var(--font-Balo)"}}>
                    {cancha.imagenes.length} imágenes
                  </span>
                </div>
              )}
            </>
          )}

          {!desactivada && (
            <div className="absolute top-4 right-4">
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 text-sm font-medium shadow-lg transition-all duration-200 hover:scale-105"
                    style={{fontFamily: "var(--font-josefin)"}}
                    onClick={onSave}
                  >
                    ✓
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 text-sm font-medium shadow-lg transition-all duration-200 hover:scale-105"
                    style={{fontFamily: "var(--font-josefin)"}}
                    onClick={onCancel}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white hover:text-blue-600 text-sm font-medium shadow-lg transition-all duration-200 hover:scale-105"
                  style={{fontFamily: "var(--font-josefin)"}}
                  onClick={() => onEdit(cancha.idCancha)}
                >
                  Editar
                </button>
              )}
            </div>
          )}
        </div>

        {/* Miniaturas de imágenes (si hay más de una) */}
        {cancha.imagenes && cancha.imagenes.length > 1 && (
          <div className="p-3 bg-gray-50 border-b border-gray-100">
            <div className="flex gap-2 overflow-x-auto">
              {cancha.imagenes.map((imagen, index) => (
                <button
                  key={imagen.idImagenRelacion || index}
                  className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 ${
                    imagenPrincipal === getUrlImagenCompleta(imagen.urlAcceso) 
                      ? "border-blue-500" 
                      : "border-gray-300"
                  }`}
                  onClick={() => cambiarImagenPrincipal(imagen)}
                  title={`Imagen ${index + 1}`}
                >
                  <img
                    src={getUrlImagenCompleta(imagen.urlAcceso)}
                    alt={`Miniatura ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error("❌ Error en miniatura:", imagen.urlAcceso);
                      e.target.src = "https://placehold.co/100x100?text=Error";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contenido */}
        <div className="p-6 flex flex-col justify-between flex-1">
          {/* Header */}
          <div className="mb-4">
            <h3 className={`text-xl font-bold mb-2 ${desactivada ? "text-red-700" : "text-gray-800"}`} style={{fontFamily: "var(--font-Alumni)"}}>
              {isEditing ? (
                <input
                  type="text"
                  value={editedData.nombre || ""}
                  onChange={(e) => onChangeField("nombre", e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-xl text-lg font-bold w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{fontFamily: "var(--font-Alumni)"}}
                  placeholder="Nombre de la cancha"
                />
              ) : (
                cancha.nombre
              )}
            </h3>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${cancha.cubierta === "cubierta" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`} style={{fontFamily: "var(--font-Balo)"}}>
                {cancha.cubierta === "cubierta" ? " Cubierta" : " Abierta"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800" style={{fontFamily: "var(--font-Balo)"}}>
                {cancha.tipoSuperficie || "Natural"}
              </span>
              {desactivada && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-200 text-red-800" style={{fontFamily: "var(--font-Balo)"}}>
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
          <div className="mt-auto pt-4 border-t border-gray-100 flex justify-end gap-3">
            {!desactivada && (
              <>
                <button
                  onClick={handleVerDisciplinas} // Cambiado para abrir el modal
                  className="w-1/3 py-3 bg-[#45bfb5] text-white rounded-xl hover:bg-[#3aa89f] transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  style={{fontFamily: "var(--font-josefin)"}}
                >
                  Ver Disciplinas
                </button>

                <button
                  className="w-1/3 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 tour-btn-ver-reservas"
                  onClick={() => navigate(`/admin/cancha/ver_reservas/${cancha.idCancha}`)}
                  style={{fontFamily: "var(--font-josefin)"}}
                >
                  Ver Reservas
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Disciplinas */}
      {showModalDisciplinas && (
        <ModalDisciplinas
          canchaId={cancha.idCancha}
          adminId={adminId} //
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default CanchaCard;