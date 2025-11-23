import React, { useState } from 'react';
import { createCancha, agregarImagenesCancha } from '../../../api/ReservaApi';
import { X, Upload, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function WizardCrearCancha({ isOpen, onClose, onCanchaCreada }) {
  const [step, setStep] = useState(1);
  const [canchaId, setCanchaId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    costoHora: '',
    capacidad: '',
    idAreadeportiva: '',
    horaInicio: '',
    horaFin: '',
    tipoSuperficie: 'césped natural',
    tamano: '',
    iluminacion: 'halógena',
    cubierta: 'abierta',
    mantenimiento: 'mensual'
  });
  const [imagenes, setImagenes] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateCancha = async () => {
    if (!formData.nombre || !formData.costoHora || !formData.capacidad) {
      alert('⚠️ Por favor completa los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const canchaData = {
        ...formData,
        costoHora: parseFloat(formData.costoHora),
        capacidad: parseInt(formData.capacidad),
        estado: true
      };
      
      const res = await createCancha(canchaData);
      setCanchaId(res.idCancha);
      setStep(2);
    } catch (err) {
      alert('❌ Error al crear la cancha: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImages = async () => {
    if (imagenes.length === 0) {
      alert('⚠️ Por favor selecciona al menos una imagen');
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    
    try {
      // Simular progreso de upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await agregarImagenesCancha(canchaId, imagenes);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        alert('🎉 Cancha creada exitosamente con imágenes');
        onCanchaCreada?.();
        handleClose();
      }, 500);
      
    } catch (err) {
      alert('❌ Error al subir imágenes: ' + (err.response?.data?.message || err.message));
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
      idAreadeportiva: '',
      horaInicio: '',
      horaFin: '',
      tipoSuperficie: 'césped natural',
      tamano: '',
      iluminacion: 'halógena',
      cubierta: 'abierta',
      mantenimiento: 'mensual'
    });
    setImagenes([]);
    setUploadProgress(0);
    onClose();
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
    
    setImagenes(validFiles);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
          <h2 className="text-2xl font-bold text-center">
            Crear Nueva Cancha
          </h2>
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
          >
            <X size={24} />
          </button>
          
          {/* Progress Steps */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step >= 1 ? 'bg-white text-blue-600 border-white' : 'border-white text-white'
              } font-semibold`}>
                {step > 1 ? <CheckCircle size={20} /> : '1'}
              </div>
              <div className={`w-16 h-1 ${
                step >= 2 ? 'bg-white' : 'bg-white bg-opacity-30'
              }`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step >= 2 ? 'bg-white text-blue-600 border-white' : 'border-white text-white'
              } font-semibold`}>
                {step > 2 ? <CheckCircle size={20} /> : '2'}
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
                    placeholder="Ej: 20"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Área Deportiva
                  </label>
                  <input
                    name="idAreadeportiva"
                    value={formData.idAreadeportiva}
                    onChange={handleChange}
                    placeholder="Ej: 1"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </div>
          )}

          {/* Paso 2: Subir Imágenes */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Subir Imágenes de la Cancha
                </h3>
                <p className="text-gray-600">
                  Selecciona las imágenes que mostrarán tu cancha (máx. 5MB por imagen)
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-all">
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
                  <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                  <span className="text-blue-600 font-medium">
                    Haz clic para seleccionar imágenes
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    o arrastra y suelta aquí
                  </p>
                </label>
              </div>

              {/* Preview de imágenes seleccionadas */}
              {imagenes.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">
                    Imágenes seleccionadas ({imagenes.length})
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {imagenes.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Barra de progreso */}
              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subiendo imágenes...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
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
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continuar</span>
                      <ArrowRight size={20} />
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
                  <ArrowLeft size={20} />
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
                      <Upload size={20} />
                      <span>Finalizar</span>
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