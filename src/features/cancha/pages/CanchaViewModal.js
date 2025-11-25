// src/features/Canchas/pages/CanchaViewModal.jsx
import React, { useState } from "react";
import { X, MessageCircle, Users, Clock } from "lucide-react";
import Button from "../../../components/ui/Button";
import ComentarioPanel from "../../comentario/pages/ComentarioPanel";

export default function CanchaViewModal({ initialData, onCancel }) {
  const [showComments, setShowComments] = useState(false);

  if (!initialData) return null;

  // Función para obtener la primera imagen del vector de imágenes de la cancha
  const getCanchaImageUrl = () => {
    if (initialData.imagenes && initialData.imagenes.length > 0) {
      const primeraImagen = initialData.imagenes[0];
      if (primeraImagen.urlAcceso.startsWith('http')) {
        return primeraImagen.urlAcceso;
      } else {
        return `http://localhost:8032${primeraImagen.urlAcceso}`;
      }
    }
    return initialData.urlImagen || "https://placehold.co/300x300/2563eb/white?text=Sin+Imagen";
  };

  // Función para manejar errores de carga de imagen
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/300x300/2563eb/white?text=Sin+Imagen";
  };

  // Mapear los nombres de propiedades para coincidir con tu estructura de datos
  const canchaData = {
    nombre: initialData.nombre,
    costohora: `$${initialData.costoHora}/hora`,
    capacidad: initialData.capacidad,
    horaApertura: initialData.horaInicio,
    horaCierre: initialData.horaFin,
    tamano: initialData.tamano,
    estado: initialData.estado,
    mantenimiento: initialData.mantenimiento,
    tipoSuperficie: initialData.tipoSuperficie,
    iluminacion: initialData.iluminacion === "true" || initialData.iluminacion === true ? "Sí" : "No",
    cubierta: initialData.cubierta === "true" || initialData.cubierta === true ? "Sí" : "No",
    imageUrl: getCanchaImageUrl()
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Aqui ta el efecto desenfoque */}
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      
      <div className="relative bg-white rounded-xl shadow-2xl w-[70vw] h-[88vh] overflow-hidden flex">
        {/* contenidp principal */}
        <div className="flex-1 p-6 overflow-y-auto">{/*sara */}
          {/* Header with close button and comments toggle */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800 font-['Alumni_Sans',_sans-serif]">
              Información De La Cancha
            </h2>
            <div className="flex gap-2">

              <button
                onClick={() => setShowComments(!showComments)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={onCancel}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              {/*sara */}
            </div>
          </div>

          {/* Image and Basic Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Image */}
            <div className="w-55 h-60 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              <img 
                src={canchaData.imageUrl} 
                alt={canchaData.nombre}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 font-['Alumni_Sans',_sans-serif]">
                {canchaData.nombre}
              </h3>
              
              {/* Cost per hour - emphasized */}
              <div className="rounded-lg p-3 text-white"
                style={{ backgroundColor: "var(--primary)" }}
              >
                <div className="text-sm opacity-80">Costo por hora</div>
                <div className="text-3xl font-bold">{canchaData.costohora}</div>
              </div>

              {/* Capacity */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Capacidad: {canchaData.capacidad} personas</span>
              </div>

              {/* Hora*/}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="font-medium">
                  Horario: {canchaData.horaApertura} - {canchaData.horaCierre}
                </span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Estado: {canchaData.estado}</span>
              </div>
              {/* Mantenimiento*/}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Mantenimiento : {canchaData.mantenimiento}</span>
              </div>
            </div>
          </div>

          {/* Detailed Info Section */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Detalles de la Cancha</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-sm text-gray-600 mb-1">Tamaño</div>
                <div className="font-medium">{canchaData.tamano}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-sm text-gray-600 mb-1">Superficie</div>
                <div className="font-medium">{canchaData.tipoSuperficie}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-sm text-gray-600 mb-1">Iluminación</div>
                <div className="font-medium">{canchaData.iluminacion}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-sm text-gray-600 mb-1">Cubierta</div>
                <div className="font-medium">{canchaData.cubierta}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3">
            <Button variant="primary" size="sm"  >
              Ver Equipamiento
            </Button>
            <Button variant="primary" size="sm"  >
              Ver Disciplinas
            </Button>
            <Button variant="primary" size="sm"  >
              Ver Reservas
            </Button>
          </div>
        </div>

        {/* Comentarios */}
        {showComments && (  
        <ComentarioPanel canchaId={initialData.idCancha} />
        )}
      </div>
    </div>
  );
}