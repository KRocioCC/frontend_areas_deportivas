import React, { useState, useEffect } from 'react';
import { createCancha, agregarImagenesCancha } from '../../../api/CanchaApi';
import { getAreadeportivaPorAdminId } from '../../../api/AreadeportivaApi';
import { useAuth } from '../../../auth/hooks/useAuth';

export default function WizardCrearCancha({ isOpen, onClose, onCanchaCreada }) {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [canchaId, setCanchaId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [idAreaDeportiva, setIdAreaDeportiva] = useState(null);
  const [areaCargando, setAreaCargando] = useState(true);
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
  const [imagenes, setImagenes] = useState([]);

  // Cargar el área deportiva del administrador automáticamente
  useEffect(() => {
    const cargarAreaDeportiva = async () => {
      if (!currentUser?.idPersona) return;
      
      try {
        setAreaCargando(true);
        const area = await getAreadeportivaPorAdminId(currentUser.idPersona);
        if (area?.idAreadeportiva) {
          setIdAreaDeportiva(area.idAreadeportiva);
          console.log("Área deportiva cargada:", area.idAreadeportiva);
        } else {
          console.error(" No se pudo obtener el área deportiva");
        }

      } catch (error) {
        console.error("Error al cargar área deportiva:", error);
      } finally {
        setAreaCargando(false);
      }
    };

    if (isOpen) {
      cargarAreaDeportiva();
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateCancha = async () => {
    if (!formData.nombre || !formData.costoHora || !formData.capacidad) {
      alert(' Por favor completa los campos obligatorios');
      return;
    }

    if (!idAreaDeportiva) {
      alert(' No se pudo identificar el área deportiva. Contacta al administrador.');
      return;
    }

    setLoading(true);
    try {
      const canchaData = {
        ...formData,
        costoHora: parseFloat(formData.costoHora),
        capacidad: parseInt(formData.capacidad),
        idAreadeportiva: idAreaDeportiva // Se agrega automáticamente
      };
      
      console.log("Creando cancha con datos:", canchaData);
      const res = await createCancha(canchaData);
      setCanchaId(res.idCancha);
      setStep(2);
    } catch (err) {
      alert(' Error al crear la cancha: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImages = async () => {
    if (imagenes.length === 0) {
      alert(' Por favor selecciona al menos una imagen');
      return;
    }

    setLoading(true);
    
    try {
      await agregarImagenesCancha(canchaId, imagenes);
      alert(' Cancha creada exitosamente');
      onCanchaCreada?.();
      handleClose();
    } catch (err) {
      alert(' Error al subir imágenes: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setCanchaId(null);
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
    onClose();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    console.log("Archivos seleccionados:", files.length);
    
    // Validar tipos de archivo
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      file.size <= 5 * 1024 * 1024 // 5MB max
    );
    
    if (validFiles.length !== files.length) {
      alert('⚠️ Algunos archivos no son imágenes válidas o son muy grandes (máx 5MB)');
    }
    
    // Agregar nuevas imágenes a las existentes (no reemplazar)
    setImagenes(prev => [...prev, ...validFiles]);
  };

  // Función para eliminar una imagen específica
  const handleRemoveImage = (indexToRemove) => {
    setImagenes(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Función para eliminar todas las imágenes
  const handleRemoveAllImages = () => {
    setImagenes([]);
  };

  // Función para arrastrar y soltar
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      file.size <= 5 * 1024 * 1024
    );
    
    if (validFiles.length > 0) {
      setImagenes(prev => [...prev, ...validFiles]);
    }
    
    if (validFiles.length !== files.length) {
      alert('⚠️ Algunos archivos no son imágenes válidas o son muy grandes (máx 5MB)');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-black p-6 text-white relative">
          <h2 className="text-2xl font-bold text-center">
            Crear Nueva Cancha
          </h2>
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
          >
            ✕
          </button>
          
          {/* Progress Steps */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step >= 1 ? 'bg-white text-blue-600 border-white' : 'border-white text-white'
              } font-semibold`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <div className={`w-16 h-1 ${
                step >= 2 ? 'bg-white' : 'bg-white bg-opacity-30'
              }`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step >= 2 ? 'bg-white text-blue-600 border-white' : 'border-white text-white'
              } font-semibold`}>
                {step > 2 ? '✓' : '2'}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Paso 1: Datos de la Cancha */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Cancha *
                  </label>
                  <input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Cancha Principal Fútbol"
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
                    placeholder="Ej: 50.00"
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
                    placeholder="Ej: 20 personas"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Apertura
                  </label>
                  <input
                    name="horaInicio"
                    type="time"
                    value={formData.horaInicio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Superficie
                  </label>
                  <select
                    name="tipoSuperficie"
                    value={formData.tipoSuperficie}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                    <option value="trimestral">Trimestral</option>
                  </select>
                </div>
              </div>

              {/* Campos obligatorios info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm flex items-center">
                  Por favor llene todos los campos <span className="text-red-500 mx-1"></span> 
                </p>
              </div>
            </div>
          )}

          {/* Paso 2: Subir Imágenes */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl mb-4">📸</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Sube Imágenes de la Cancha
                </h3>
                <p className="text-gray-600">
                  Selecciona múltiples imágenes para mostrar tu cancha (máx. 5MB por imagen)
                </p>
              </div>

              {/* Área de subida mejorada */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-all bg-gray-50"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer block"
                >
                  <div className="text-3xl mb-3">📁</div>
                  <span className="text-blue-600 font-medium text-lg">
                    Haz clic para seleccionar imágenes
                  </span>
                  
                  <p className="text-xs text-gray-400 mt-1">
                    arrastra y suelta las imágenes aquí
                  </p>
                  <div className="mt-4 flex justify-center space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">JPG</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">PNG</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">WEBP</span>
                  </div>
                </label>
              </div>

              

              {/* Preview de imágenes seleccionadas */}
              {imagenes.length > 0 && (
                <div className="border border-gray-200 rounded-xl p-4 bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">
                      Imágenes seleccionadas ({imagenes.length})
                    </h4>
                    <button
                      onClick={handleRemoveAllImages}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Eliminar todas
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {imagenes.map((file, index) => (
                      <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded-full transition-all transform scale-0 group-hover:scale-100"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 text-center">
                          {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Información del upload */}
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-sm text-center">
                    Listo para subir {imagenes.length} imagen{imagenes.length !== 1 ? 'es' : ''}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer con Botones */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between">
            {step === 1 ? (
              <>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateCancha}
                  disabled={loading || areaCargando || !idAreaDeportiva}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continuar</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium flex items-center space-x-2"
                >
                  <span>←</span>
                  <span>Atrás</span>
                </button>
                <button
                  onClick={handleUploadImages}
                  disabled={loading || imagenes.length === 0}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-medium flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Subir</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}