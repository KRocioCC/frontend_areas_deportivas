import React, { useState, useEffect } from 'react';
import { 
    createAreadeportiva,
    agregarImagenesAreadeportiva
} from '../../../api/AreadeportivaApi';
import { useAuth } from '../../../auth/hooks/useAuth';
import { getZonas } from '../../../api/ZonaApi';

export default function CreateMiAreaPage({ onAreaCreada }) {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [zonas, setZonas] = useState([]);
    const [step, setStep] = useState(1);
    const [areaId, setAreaId] = useState(null);
    const [nuevasImagenes, setNuevasImagenes] = useState([]);
    
    const [formData, setFormData] = useState({
        nombreArea: '',
        descripcionArea: '',
        emailArea: '',
        telefonoArea: '',
        horaInicioArea: '',
        horaFinArea: '',
        latitud: '',
        longitud: '',
        idZona: '',
        id: null
    });

    // Cargar zonas para los selects
    useEffect(() => {
        const cargarZonas = async () => {
            try {
                const zonasData = await getZonas();
                setZonas(zonasData);
            } catch (error) {
                console.error("Error al cargar zonas:", error);
            }
        };

        cargarZonas();
    }, []);

    // Inicializar con ID del administrador
    useEffect(() => {
        if (currentUser?.idPersona) {
            setFormData(prev => ({
                ...prev,
                id: currentUser.idPersona
            }));
        }
    }, [currentUser]);

    const handleCreateArea = async () => {
        if (!formData.nombreArea || !formData.emailArea || !formData.telefonoArea || !formData.idZona) {
            alert('Por favor completa los campos obligatorios');
            return;
        }

        if (!formData.id) {
            alert('Error: No se pudo identificar al administrador');
            return;
        }

        setLoading(true);
        console.log("🔄 [CreateMiAreaPage] Iniciando creación de área...");
        
        try {
            const areaData = {
                ...formData,
                estado: true,
                id: formData.id
            };
            
            console.log("📤 [CreateMiAreaPage] Datos a enviar:", areaData);
            
            // ✅ AGREGAR TIMEOUT para evitar carga infinita
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Timeout: La solicitud está tardando demasiado')), 15000);
            });
            
            const createPromise = createAreadeportiva(areaData);
            
            // Ejecutar con timeout
            const nuevaArea = await Promise.race([createPromise, timeoutPromise]);
            
            console.log("✅ [CreateMiAreaPage] Área creada exitosamente:", nuevaArea);
            
            if (nuevaArea && nuevaArea.idAreadeportiva) {
                setAreaId(nuevaArea.idAreadeportiva);
                setStep(2);
            } else {
                throw new Error('No se recibió un ID de área válido');
            }
            
        } catch (err) {
            console.error("❌ [CreateMiAreaPage] Error al crear área:", err);
            
            let errorMessage = 'Error al crear el área deportiva';
            
            if (err.message.includes('Timeout')) {
                errorMessage = 'La solicitud está tardando demasiado. Verifica tu conexión o intenta nuevamente.';
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
            console.log("🏁 [CreateMiAreaPage] Finalizado creación de área");
        }
    };

    const handleUploadImages = async () => {
        if (!areaId) {
            alert('Error: No se pudo identificar el área creada');
            return;
        }

        setLoading(true);
        console.log("🔄 [CreateMiAreaPage] Subiendo imágenes...");
        
        try {
            if (nuevasImagenes.length > 0) {
                console.log(`📤 [CreateMiAreaPage] Subiendo ${nuevasImagenes.length} imágenes`);
                await agregarImagenesAreadeportiva(areaId, nuevasImagenes);
            }
            
            console.log("✅ [CreateMiAreaPage] Proceso completado exitosamente");
            alert('Área deportiva creada exitosamente');
            
            // Llamar al callback para cerrar el formulario
            if (onAreaCreada) {
                onAreaCreada();
            }
            
        } catch (err) {
            console.error("❌ [CreateMiAreaPage] Error al subir imágenes:", err);
            
            let errorMessage = 'Error al subir imágenes';
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Funciones para manejo de imágenes en creación
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

    const handleRemoveNewImage = (indexToRemove) => {
        setNuevasImagenes(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleRemoveAllNewImages = () => {
        setNuevasImagenes([]);
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

    const handleClose = () => {
        setStep(1);
        setNuevasImagenes([]);
        setFormData({
            nombreArea: '',
            descripcionArea: '',
            emailArea: '',
            telefonoArea: '',
            horaInicioArea: '',
            horaFinArea: '',
            latitud: '',
            longitud: '',
            idZona: '',
            id: currentUser?.idPersona || null
        });
    };

    return (
<div className="min-h-screen bg-gray-50 py-8 w-full">            
<div className="max-w-8xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">                    {/* Header */}
                    <div className="bg-black p-8 text-white text-center">
                        <h1 className="text-3xl font-bold mb-2">
                            Bienvenido a Qjuego Administrador 
                            <h3>Crea tu Área Deportiva</h3>
                        </h1>
                        <p className="text-gray-300">
                            Completa la información para configurar tu área deportiva
                        </p>
                        
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
                    <div className="p-8">
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Información Básica
                                    </h2>
                                    <p className="text-gray-600">
                                        Ingresa los datos principales de tu área deportiva
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre del Área *
                                        </label>
                                        <input
                                            name="nombreArea"
                                            value={formData.nombreArea}
                                            onChange={handleChange}
                                            placeholder="Ej: Polideportivo Central"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Zona *
                                        </label>
                                        <select
                                            name="idZona"
                                            value={formData.idZona}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">Selecciona una zona</option>
                                            {zonas.map(zona => (
                                                <option key={zona.idZona} value={zona.idZona}>
                                                    {zona.nombre} - {zona.macrodistrito?.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Descripción
                                        </label>
                                        <textarea
                                            name="descripcionArea"
                                            value={formData.descripcionArea}
                                            onChange={handleChange}
                                            placeholder="Describe tu área deportiva..."
                                            rows="3"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            name="emailArea"
                                            type="email"
                                            value={formData.emailArea}
                                            onChange={handleChange}
                                            placeholder="ejemplo@dominio.com"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Teléfono *
                                        </label>
                                        <input
                                            name="telefonoArea"
                                            value={formData.telefonoArea}
                                            onChange={handleChange}
                                            placeholder="98765432"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hora de Apertura
                                        </label>
                                        <input
                                            name="horaInicioArea"
                                            type="time"
                                            value={formData.horaInicioArea}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hora de Cierre
                                        </label>
                                        <input
                                            name="horaFinArea"
                                            type="time"
                                            value={formData.horaFinArea}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Latitud
                                        </label>
                                        <input
                                            name="latitud"
                                            type="number"
                                            step="any"
                                            value={formData.latitud}
                                            onChange={handleChange}
                                            placeholder="-12.0464"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Longitud
                                        </label>
                                        <input
                                            name="longitud"
                                            type="number"
                                            step="any"
                                            value={formData.longitud}
                                            onChange={handleChange}
                                            placeholder="-77.0428"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-yellow-800 text-sm">
                                        Los campos marcados con * son obligatorios
                                    </p>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <div className="text-4xl mb-4">📸</div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        Agregar Imágenes
                                    </h2>
                                    <p className="text-gray-600">
                                        Sube imágenes de tu área deportiva (opcional)
                                    </p>
                                </div>

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
                                        id="file-upload-area"
                                    />
                                    <label
                                        htmlFor="file-upload-area"
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

                                {nuevasImagenes.length > 0 && (
                                    <div className="border border-gray-200 rounded-xl p-4 bg-white">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-medium text-gray-700">
                                                Imágenes seleccionadas ({nuevasImagenes.length})
                                            </h4>
                                            <button
                                                onClick={handleRemoveAllNewImages}
                                                className="text-sm text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Eliminar todas
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {nuevasImagenes.map((file, index) => (
                                                <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-24 object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                                                        <button
                                                            onClick={() => handleRemoveNewImage(index)}
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
                                        
                                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <p className="text-green-700 text-sm text-center">
                                                Listo para subir {nuevasImagenes.length} imagen{nuevasImagenes.length !== 1 ? 'es' : ''}
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
                                        onClick={handleCreateArea}
                                        disabled={loading}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center space-x-2 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Creando...</span>
                                            </>
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
                                        disabled={loading}
                                        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-medium flex items-center space-x-2 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Finalizando...</span>
                                            </>
                                        ) : (
                                            <>
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
        </div>
    );
}