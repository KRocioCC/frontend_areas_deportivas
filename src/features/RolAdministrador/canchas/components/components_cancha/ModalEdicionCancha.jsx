import React, { useState, useEffect } from 'react';
import { updateCancha, deleteCancha, agregarImagenesCancha, eliminarImagenCancha } from '../../../../../api/CanchaApi';

export default function ModalEdicionCancha({ isOpen, onClose, cancha, onCanchaActualizada }) {
  const [loading, setLoading] = useState(false);
  const [imagenes, setImagenes] = useState([]);
  const [nuevasImagenes, setNuevasImagenes] = useState([]);
  const [imagenesAEliminar, setImagenesAEliminar] = useState([]);
  
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

  // Cargar datos de la cancha cuando se abre el modal
  useEffect(() => {
    if (isOpen && cancha) {
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
      
      // Cargar imágenes existentes (simulado)
      setImagenes(cancha.imagenes || []);
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
    
    // Validar tipos de archivo
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      file.size <= 5 * 1024 * 1024 // 5MB max
    );
    
    if (validFiles.length !== files.length) {
      alert('⚠️ Algunos archivos no son imágenes válidas o son muy grandes (máx 5MB)');
    }
    
    setNuevasImagenes(prev => [...prev, ...validFiles]);
  };

  const handleRemoveExistingImage = (index) => {
    const imagen = imagenes[index];
    setImagenes(prev => prev.filter((_, i) => i !== index));
    setImagenesAEliminar(prev => [...prev, imagen.id]);
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

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.costoHora || !formData.capacidad) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    setLoading(true);
    
    try {
      // 1. Actualizar datos de la cancha
      const canchaData = {
        ...formData,
        costoHora: parseFloat(formData.costoHora),
        capacidad: parseInt(formData.capacidad)
      };
      
      await updateCancha(cancha.idCancha, canchaData);
      
      // 2. Eliminar imágenes marcadas para eliminar
      for (const imagenId of imagenesAEliminar) {
        await eliminarImagenCancha(imagenId);
      }
      
      // 3. Agregar nuevas imágenes
      if (nuevasImagenes.length > 0) {
        await agregarImagenesCancha(cancha.idCancha, nuevasImagenes);
      }
      
      alert('✅ Cancha actualizada exitosamente');
      onCanchaActualizada?.();
      handleClose();
      
    } catch (err) {
      alert('Error al actualizar la cancha: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDesactivar = async () => {
    /* eslint-disable-next-line no-restricted-globals */
    if (!confirm('¿Estás seguro de que deseas desactivar esta cancha? Los usuarios ya no podrán reservarla.')) {
      return;
    }

    setLoading(true);
    try {
      await deleteCancha(cancha.idCancha);
      alert('Cancha desactivada exitosamente');
      onCanchaActualizada?.();
      handleClose();
    } catch (err) {
      alert('Error al desactivar la cancha: ' + (err.response?.data?.message || err.message));
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
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
          <h2 className="text-2xl font-bold text-center">
            Editar Cancha: {cancha.nombre}
          </h2>
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6">
            {/* Información General */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
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
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
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
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                <i className="fas fa-images mr-2"></i>
                Gestión de Imágenes
              </h3>

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
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {imagenes.map((imagen, index) => (
                      <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={imagen.url || `https://via.placeholder.com/150?text=Imagen+${index+1}`}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                          <button
                            onClick={() => handleRemoveExistingImage(index)}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded-full transition-all transform scale-0 group-hover:scale-100"
                            title="Eliminar imagen"
                          >
                            <i className="fas fa-trash text-xs"></i>
                          </button>
                        </div>
                      </div>
                    ))}
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
            </div>

            {/* Estado de la Cancha */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                <i className="fas fa-power-off mr-2"></i>
                Estado de la Cancha
              </h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700">
                    Estado actual: <span className={`font-semibold ${formData.estado ? 'text-green-600' : 'text-red-600'}`}>
                      {formData.estado ? 'Activa' : 'Inactiva'}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.estado 
                      ? 'La cancha está disponible para reservas' 
                      : 'La cancha no está disponible para reservas'
                    }
                  </p>
                </div>
                
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={formData.estado}
                      onChange={(e) => setFormData(prev => ({...prev, estado: e.target.checked}))}
                    />
                    <div className={`block w-14 h-8 rounded-full ${formData.estado ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${formData.estado ? 'translate-x-6' : ''}`}></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con Botones */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <button
                onClick={handleDesactivar}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium flex items-center space-x-2"
              >
                <i className="fas fa-ban"></i>
                <span>Desactivar Cancha</span>
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