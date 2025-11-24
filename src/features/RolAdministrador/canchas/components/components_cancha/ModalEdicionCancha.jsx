import React, { useState, useEffect } from 'react';
import { updateCancha, deleteCancha, agregarImagenesCancha, eliminarImagenCancha, cambiarEstadoCancha } from '../../../../../api/CanchaApi';

export default function ModalEdicionCancha({ isOpen, onClose, cancha, onCanchaActualizada }) {
  const [loading, setLoading] = useState(false);
  const [imagenes, setImagenes] = useState([]);
  const [nuevasImagenes, setNuevasImagenes] = useState([]);
  const [imagenesAEliminar, setImagenesAEliminar] = useState([]);
  const [imagenesAMantener, setImagenesAMantener] = useState([]);
  
  const [formData, setFormData] = useState({
    nombre: '',
    costoHora: '',
    capacidad: '',
    horaInicio: '',
    horaFin: '',
    tipoSuperficie: 'césped natural',
    tamano: '',
    iluminacion: 'halógena',
    cubierta: 'abierta',
    mantenimiento: 'mensual',
    estado: true
  });

  // Función para construir URL completa de imagen
  const getUrlImagenCompleta = (urlAcceso) => {
    if (!urlAcceso) return "https://placehold.co/600x400?text=Sin+Imagen";
    
    if (urlAcceso.startsWith('http')) {
      return urlAcceso;
    }
    
    const baseUrl = 'http://localhost:8032';
    return `${baseUrl}${urlAcceso.startsWith('/') ? urlAcceso : `/${urlAcceso}`}`;
  };

  // Cargar datos de la cancha cuando se abre el modal
  useEffect(() => {
    if (isOpen && cancha) {
      console.log("📥 Cancha recibida:", cancha);
      console.log("🖼️ Imágenes de la cancha:", cancha.imagenes);
      
      setFormData({
        nombre: cancha.nombre || '',
        costoHora: cancha.costoHora || '',
        capacidad: cancha.capacidad || '',
        horaInicio: cancha.horaInicio || '',
        horaFin: cancha.horaFin || '',
        tipoSuperficie: cancha.tipoSuperficie || 'césped natural',
        tamano: cancha.tamano || '',
        iluminacion: cancha.iluminacion || 'halógena',
        cubierta: cancha.cubierta || 'abierta',
        mantenimiento: cancha.mantenimiento || 'mensual',
        estado: cancha.estado !== false
      });
      
      // Cargar imágenes existentes con URLs completas
      if (cancha.imagenes && cancha.imagenes.length > 0) {
        const imagenesProcesadas = cancha.imagenes.map(imagen => {
          // Asegurarnos de que tenemos un ID válido
          const imagenId = imagen.idImagenRelacion || imagen.id;
          if (!imagenId) {
            console.warn("⚠️ Imagen sin ID válido:", imagen);
          }
          
          return {
            ...imagen,
            urlCompleta: getUrlImagenCompleta(imagen.urlAcceso),
            id: imagenId,
            mantener: true
          };
        }).filter(imagen => imagen.id != null); // Filtrar imágenes sin ID
          
        console.log("🖼️ Imágenes procesadas:", imagenesProcesadas);
        setImagenes(imagenesProcesadas);
        setImagenesAMantener(imagenesProcesadas.map(img => img.id));
      } else {
        console.warn("⚠️ No hay imágenes en la cancha");
        setImagenes([]);
        setImagenesAMantener([]);
      }
      
      setNuevasImagenes([]);
      setImagenesAEliminar([]);
    }
  }, [isOpen, cancha]);

  if (!isOpen || !cancha) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      file.size <= 5 * 1024 * 1024
    );
    
    if (validFiles.length !== files.length) {
      alert('⚠️ Algunos archivos no son imágenes válidas o son muy grandes (máx 5MB)');
    }
    
    setNuevasImagenes(prev => [...prev, ...validFiles]);
  };

  const handleToggleMantenerImagen = (imagenId) => {
    // Validar que el ID no sea undefined
    if (!imagenId || imagenId === 'undefined') {
      console.error("❌ ID de imagen inválido:", imagenId);
      return;
    }

    setImagenes(prev => 
      prev.map(img => 
        img.id === imagenId ? { ...img, mantener: !img.mantener } : img
      )
    );

    setImagenesAMantener(prev => {
      if (prev.includes(imagenId)) {
        return prev.filter(id => id !== imagenId);
      } else {
        return [...prev, imagenId];
      }
    });
  };

  const handleRemoveExistingImage = (index) => {
    const imagen = imagenes[index];
    
    // Validar que la imagen tenga ID
    if (!imagen.id || imagen.id === 'undefined') {
      console.error("❌ No se puede eliminar imagen sin ID válido:", imagen);
      alert('Error: Esta imagen no tiene un ID válido y no puede ser eliminada');
      return;
    }
    
    console.log("🗑️ Marcando imagen para eliminar:", imagen);
    handleToggleMantenerImagen(imagen.id);
  };

  const handleRemoveNewImage = (index) => {
    setNuevasImagenes(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      file.size <= 5 * 1024 * 1024
    );
    
    if (validFiles.length > 0) {
      setNuevasImagenes(prev => [...prev, ...validFiles]);
    }
    
    if (validFiles.length !== files.length) {
      alert('⚠️ Algunos archivos no son imágenes válidas o son muy grandes (máx 5MB)');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const eliminarImagenSegura = async (imagenId) => {
    // Validar que el ID sea válido antes de eliminar
    if (!imagenId || imagenId === 'undefined') {
      console.error("❌ ID de imagen inválido para eliminar:", imagenId);
      return;
    }

    try {
      console.log("🗑️ Eliminando imagen con ID:", imagenId);
      await eliminarImagenCancha(imagenId);
      console.log("✅ Imagen eliminada exitosamente");
    } catch (error) {
      console.error("❌ Error eliminando imagen:", error);
      throw error; // Re-lanzar el error para manejarlo en el nivel superior
    }
  };

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.costoHora || !formData.capacidad) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    setLoading(true);
    
    try {
      // Verificar que tenemos todos los datos necesarios
      if (!cancha.idAreadeportiva && !cancha.areaDeportiva?.idAreadeportiva) {
        alert("Error: No se pudo obtener el ID del área deportiva. La cancha no tiene área asociada.");
        return;
      }

      const idAreadeportiva = cancha.idAreadeportiva || cancha.areaDeportiva?.idAreadeportiva;

      // 1. Actualizar datos de la cancha
      const canchaData = {
        nombre: formData.nombre,
        costoHora: parseFloat(formData.costoHora),
        capacidad: parseInt(formData.capacidad),
        horaInicio: formData.horaInicio || null,
        horaFin: formData.horaFin || null,
        tipoSuperficie: formData.tipoSuperficie,
        tamano: formData.tamano || null,
        iluminacion: formData.iluminacion,
        cubierta: formData.cubierta,
        mantenimiento: formData.mantenimiento,
        estado: formData.estado !== false,
        idAreadeportiva: parseInt(idAreadeportiva)
      };
      
      console.log("Enviando datos al servidor:", canchaData);
      await updateCancha(cancha.idCancha, canchaData);
      
      // 2. Eliminar imágenes que NO están en la lista de mantener
      const imagenesParaEliminar = imagenes
        .filter(imagen => !imagenesAMantener.includes(imagen.id))
        .map(imagen => imagen.id)
        .filter(id => id && id !== 'undefined'); // Filtrar IDs inválidos

      console.log("🗑️ Imágenes a eliminar (filtradas):", imagenesParaEliminar);
      
      if (imagenesParaEliminar.length > 0) {
        for (const imagenId of imagenesParaEliminar) {
          await eliminarImagenSegura(imagenId);
        }
      }
      
      // 3. Agregar nuevas imágenes
      if (nuevasImagenes.length > 0) {
        console.log("🖼️ Agregando nuevas imágenes:", nuevasImagenes.length);
        await agregarImagenesCancha(cancha.idCancha, nuevasImagenes);
      }
      
      alert('✅ Cancha actualizada exitosamente');
      onCanchaActualizada?.();
      handleClose();
      
    } catch (err) {
      console.error("Error completo:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          err.message ||
                          "Error desconocido al actualizar la cancha";
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDesactivar = async () => {
    const accion = formData.estado ? 'desactivar' : 'activar';
      
    const confirmed = window.confirm(`¿Estás seguro de que deseas ${accion} esta cancha?`);
    if (!confirmed) {
      return;
    }
  
    setLoading(true);
    try {
      const nuevoEstado = !formData.estado;
      await cambiarEstadoCancha(cancha.idCancha, nuevoEstado);
      
      const mensaje = nuevoEstado ? 'activada' : 'desactivada';
      alert(`✅ Cancha ${mensaje} exitosamente`);
      onCanchaActualizada?.();
      handleClose();
      
    } catch (err) {
      console.error("Error completo:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          err.message ||
                          "Error desconocido al cambiar el estado de la cancha";
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      costoHora: '',
      capacidad: '',
      horaInicio: '',
      horaFin: '',
      tipoSuperficie: 'césped natural',
      tamano: '',
      iluminacion: 'halógena',
      cubierta: 'abierta',
      mantenimiento: 'mensual',
      estado: true
    });
    setImagenes([]);
    setNuevasImagenes([]);
    setImagenesAEliminar([]);
    setImagenesAMantener([]);
    onClose();
  };

  // Contador de imágenes que se mantendrán
  const imagenesMantenidasCount = imagenes.filter(img => img.mantener).length;
  const imagenesEliminadasCount = imagenes.length - imagenesMantenidasCount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-black p-6 text-white relative">
          <h2 className="text-2xl font-bold text-center">
            Editar Cancha: {cancha.nombre}
          </h2>
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-all"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            {/* Información General */}
            <div className="bg-yellow-40 border border-green-400 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-black-800 mb-3 flex items-center">
                <i className="fas fa-info-circle mr-2"></i>
                Información General
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Cancha *
                  </label>
                  <input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo por Hora (S/) *
                  </label>
                  <input
                    name="costoHora"
                    type="number"
                    value={formData.costoHora}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacidad *
                  </label>
                  <input
                    name="capacidad"
                    type="number"
                    value={formData.capacidad}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamaño
                  </label>
                  <input
                    name="tamano"
                    value={formData.tamano}
                    onChange={handleChange}
                    placeholder="Ej: 40x20 metros"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Horarios */}
            <div className="bg-yellow-40 border border-green-400 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-black-800 mb-3 flex items-center">
                <i className="fas fa-clock mr-2"></i>
                Horarios de Operación
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Apertura
                  </label>
                  <input
                    name="horaInicio"
                    type="time"
                    value={formData.horaInicio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Cierre
                  </label>
                  <input
                    name="horaFin"
                    type="time"
                    value={formData.horaFin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Características */}
            <div className="bg-yellow-40 border border-green-400 rounded-xl p-4">
              <h3 className="text-lg font-semibold  border-yellow-50 mb-3 flex items-center">
                <i className="fas fa-cogs mr-2"></i>
                Características
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Superficie
                  </label>
                  <select
                    name="tipoSuperficie"
                    value={formData.tipoSuperficie}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="césped natural">Césped Natural</option>
                    <option value="césped sintético">Césped Sintético</option>
                    <option value="cemento">Cemento</option>
                    <option value="parquet">Parquet</option>
                    <option value="arena">Arena</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Iluminación
                  </label>
                  <select
                    name="iluminacion"
                    value={formData.iluminacion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="halógena">Halógena</option>
                    <option value="led">LED</option>
                    <option value="fluorescente">Fluorescente</option>
                    <option value="natural">Natural</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cubierta
                  </label>
                  <select
                    name="cubierta"
                    value={formData.cubierta}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="abierta">Abierta</option>
                    <option value="cubierta">Cubierta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mantenimiento
                  </label>
                  <select
                    name="mantenimiento"
                    value={formData.mantenimiento}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                    <option value="trimestral">Trimestral</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Gestión de Imágenes */}
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                <i className="fas fa-images mr-2"></i>
                Gestión de Imágenes
              </h3>

              {/* Resumen de imágenes */}
              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Resumen de imágenes:</span>
                  <div className="flex gap-4">
                    <span className="text-green-600">
                      <i className="fas fa-check-circle mr-1"></i>
                      Mantener: {imagenesMantenidasCount}
                    </span>
                    <span className="text-red-600">
                      <i className="fas fa-times-circle mr-1"></i>
                      Quitar: {imagenesEliminadasCount}
                    </span>
                    <span className="text-blue-600">
                      <i className="fas fa-plus-circle mr-1"></i>
                      Nuevas: {nuevasImagenes.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Área de subida */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-all bg-gray-50 mb-4"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload-edit"
                />
                <label
                  htmlFor="file-upload-edit"
                  className="cursor-pointer block"
                >
                  <div className="text-3xl mb-3">📁</div>
                  <span className="text-blue-600 font-medium text-lg">
                    Haz clic para agregar nuevas imágenes
                  </span>
                  <p className="text-sm text-gray-500 mt-2">
                    Puedes seleccionar múltiples imágenes
                  </p>
                </label>
              </div>

              {/* Imágenes existentes */}
              {imagenes.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Imágenes Actuales ({imagenes.length})
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      (Haz clic en una imagen para quitarla)
                    </span>
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {imagenes.map((imagen, index) => (
                      <div 
                        key={imagen.id || index} 
                        className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                          imagen.mantener 
                            ? 'border-green-400 hover:border-green-600' 
                            : 'border-red-400 hover:border-red-600 opacity-60'
                        }`}
                        onClick={() => {
                          // Validar que la imagen tenga ID antes de intentar cambiarla
                          if (!imagen.id || imagen.id === 'undefined') {
                            console.error("❌ Imagen sin ID válido:", imagen);
                            alert('Esta imagen no tiene un ID válido y no puede ser modificada');
                            return;
                          }
                          handleToggleMantenerImagen(imagen.id);
                        }}
                        title={imagen.mantener ? "Clic para quitar imagen" : "Clic para mantener imagen"}
                      >
                        <img
                          src={imagen.urlCompleta || imagen.url || `https://via.placeholder.com/150?text=Imagen+${index+1}`}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-24 object-cover"
                          onError={(e) => {
                            console.error("❌ Error cargando imagen:", imagen);
                            e.target.src = "https://placehold.co/150x100?text=Error+Cargando";
                          }}
                        />
                        
                        {/* Indicador de estado */}
                        <div className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                          imagen.mantener ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {imagen.mantener ? '✓' : '✕'}
                        </div>
                        
                        {/* Overlay con información */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                          <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-all">
                            <div className="text-lg font-bold">
                              {imagen.mantener ? 'MANTENER' : 'QUITAR'}
                            </div>
                            <div className="text-xs mt-1">
                              {imagen.mantener ? 'Clic para quitar' : 'Clic para mantener'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 text-center">
                          Imagen {index + 1}
                          {(!imagen.id || imagen.id === 'undefined') && (
                            <div className="text-red-300">(Sin ID válido)</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Leyenda */}
                  <div className="flex gap-4 mt-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-400 rounded"></div>
                      <span>Imagen que se mantendrá</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-400 rounded"></div>
                      <span>Imagen que se eliminará</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Nuevas imágenes */}
              {nuevasImagenes.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">
                    Nuevas Imágenes a Agregar ({nuevasImagenes.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {nuevasImagenes.map((file, index) => (
                      <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Nueva imagen ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                          <button
                            onClick={() => handleRemoveNewImage(index)}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded-full transition-all transform scale-0 group-hover:scale-100"
                            title="Quitar imagen"
                          >
                            <i className="fas fa-times text-xs"></i>
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 text-center">
                          {file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {imagenes.length === 0 && nuevasImagenes.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  <i className="fas fa-image text-2xl mb-2 block"></i>
                  No hay imágenes para esta cancha
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer con Botones */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <button
                onClick={handleDesactivar}
                className={`px-6 py-3 rounded-xl transition-all font-medium flex items-center space-x-2 ${
                  formData.estado 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <i className={`fas ${formData.estado ? 'fa-ban' : 'fa-check'}`}></i>
                <span>{formData.estado ? 'Desactivar Cancha' : 'Activar Cancha'}</span>
              </button>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}