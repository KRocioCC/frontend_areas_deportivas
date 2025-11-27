import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { 
    createAreadeportiva,
    agregarImagenesAreadeportiva
} from '../../../api/AreadeportivaApi';
import { useAuth } from '../../../auth/hooks/useAuth';
import { getZonas } from '../../../api/ZonaApi';
import { 
    MapPin, 
    Mail, 
    Phone, 
    Clock, 
    Globe, 
    Upload, 
    ArrowLeft,
    Save,
    Building,
    X,
    ChevronRight,
    ChevronLeft,
    Check,
    AlertCircle,
    CheckCircle,
    Info
} from 'lucide-react';

// Componente Toast simple
const Toast = ({ message, type, onClose }) => {
    const bgColor = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        warning: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 ${bgColor[type]} text-white px-6 py-4 rounded-xl shadow-lg flex items-center space-x-3 z-50 min-w-80`}
        >
            {icons[type]}
            <span className="flex-1" style={{ fontFamily: 'var(--font-Balo)' }}>{message}</span>
            <button onClick={onClose} className="text-white hover:text-gray-200">
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

export default function CreateMiAreaPage({ onAreaCreada }) {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [zonas, setZonas] = useState([]);
    const [step, setStep] = useState(1);
    const [areaId, setAreaId] = useState(null);
    const [nuevasImagenes, setNuevasImagenes] = useState([]);
    const [toast, setToast] = useState(null);
    
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

    const [errors, setErrors] = useState({});

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

    // Sistema de toasts simple
    const showToast = (message, type = 'error') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 4000);
    };

    // Validaciones según tu DTO
    const validateField = (name, value) => {
        const newErrors = { ...errors };
        
        switch (name) {
            case 'nombreArea':
                if (!value || value.trim() === '') {
                    newErrors.nombreArea = 'El nombre del área es obligatorio';
                } else {
                    delete newErrors.nombreArea;
                }
                break;
                
            case 'emailArea':
                if (!value || value.trim() === '') {
                    newErrors.emailArea = 'El email es obligatorio';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    newErrors.emailArea = 'El email debe ser válido';
                } else {
                    delete newErrors.emailArea;
                }
                break;
                
            case 'telefonoArea':
                if (!value || value.trim() === '') {
                    newErrors.telefonoArea = 'El teléfono es obligatorio';
                } else if (!/^\d{8}$/.test(value)) {
                    newErrors.telefonoArea = 'El teléfono debe tener exactamente 8 dígitos';
                } else {
                    delete newErrors.telefonoArea;
                }
                break;
                
            case 'idZona':
                if (!value) {
                    newErrors.idZona = 'La zona es obligatoria';
                } else {
                    delete newErrors.idZona;
                }
                break;
                
            case 'descripcionArea':
                if (value && value.length > 600) {
                    newErrors.descripcionArea = 'La descripción no puede tener más de 600 caracteres';
                } else {
                    delete newErrors.descripcionArea;
                }
                break;
                
            case 'latitud':
                if (value) {
                    const numValue = parseFloat(value);
                    if (isNaN(numValue) || numValue < -90 || numValue > 90) {
                        newErrors.latitud = 'La latitud debe estar entre -90 y 90';
                    } else {
                        delete newErrors.latitud;
                    }
                } else {
                    delete newErrors.latitud;
                }
                break;
                
            case 'longitud':
                if (value) {
                    const numValue = parseFloat(value);
                    if (isNaN(numValue) || numValue < -180 || numValue > 180) {
                        newErrors.longitud = 'La longitud debe estar entre -180 y 180';
                    } else {
                        delete newErrors.longitud;
                    }
                } else {
                    delete newErrors.longitud;
                }
                break;
                
            default:
                break;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateForm = () => {
        const fieldsToValidate = ['nombreArea', 'emailArea', 'telefonoArea', 'idZona', 'descripcionArea', 'latitud', 'longitud'];
        let isValid = true;
        
        fieldsToValidate.forEach(field => {
            if (!validateField(field, formData[field])) {
                isValid = false;
            }
        });
        
        return isValid;
    };

    const handleCreateArea = async () => {
        // Verificar campos obligatorios vacíos antes de validar
        const camposObligatorios = ['nombreArea', 'emailArea', 'telefonoArea', 'idZona', 'descripcionArea', 'latitud', 'longitud'];
        const camposVacios = camposObligatorios.filter(campo => !formData[campo] || formData[campo].toString().trim() === '');
        
        if (camposVacios.length > 0) {
            showToast('Debes llenar todos los campos', 'warning');
            return;
        }

        if (!validateForm()) {
            showToast('Por favor corrige los errores en el formulario', 'warning');
            return;
        }

        if (!formData.id) {
            showToast('Error: No se pudo identificar al administrador', 'error');
            return;
        }

        setLoading(true);
        console.log("[CreateMiAreaPage] Iniciando creación de área...");
        
        try {
            const areaData = {
                ...formData,
                estado: true,
                id: formData.id
            };
            
            console.log("[CreateMiAreaPage] Datos a enviar:", areaData);
            
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Timeout: La solicitud está tardando demasiado')), 15000);
            });
            
            const createPromise = createAreadeportiva(areaData);
            
            const nuevaArea = await Promise.race([createPromise, timeoutPromise]);
            
            console.log("[CreateMiAreaPage] Área creada exitosamente:", nuevaArea);
            
            if (nuevaArea && nuevaArea.idAreadeportiva) {
                setAreaId(nuevaArea.idAreadeportiva);
                setStep(2);
                showToast('Área creada exitosamente. Ahora puedes agregar imágenes.', 'success');
            } else {
                throw new Error('No se recibió un ID de área válido');
            }
            
        } catch (err) {
            console.error("[CreateMiAreaPage] Error al crear área:", err);
            
            let errorMessage = 'Error al crear el área deportiva';
            
            if (err.message.includes('Timeout')) {
                errorMessage = 'La solicitud está tardando demasiado. Verifica tu conexión o intenta nuevamente.';
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            showToast(errorMessage);
        } finally {
            setLoading(false);
            console.log("[CreateMiAreaPage] Finalizado creación de área");
        }
    };

    const handleUploadImages = async () => {
        if (!areaId) {
            showToast('Error: No se pudo identificar el área creada');
            return;
        }

        setLoading(true);
        console.log("[CreateMiAreaPage] Subiendo imágenes...");
        
        try {
            if (nuevasImagenes.length > 0) {
                console.log(`[CreateMiAreaPage] Subiendo ${nuevasImagenes.length} imágenes`);
                await agregarImagenesAreadeportiva(areaId, nuevasImagenes);
                showToast(`${nuevasImagenes.length} imagen(es) subida(s) correctamente`, 'success');
            }
            
            console.log("[CreateMiAreaPage] Proceso completado exitosamente");
            showToast('Área deportiva creada exitosamente', 'success');
            
            if (onAreaCreada) {
                onAreaCreada();
            }
            
        } catch (err) {
            console.error("[CreateMiAreaPage] Error al subir imágenes:", err);
            
            let errorMessage = 'Error al subir imágenes';
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            showToast(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Validar en tiempo real
        setTimeout(() => validateField(name, value), 300);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        
        const validFiles = files.filter(file => 
            file.type.startsWith('image/') && 
            file.size <= 5 * 1024 * 1024
        );
        
        if (validFiles.length !== files.length) {
            showToast('Algunos archivos no son imágenes válidas o son muy grandes (máx 5MB)', 'warning');
        }
        
        if (validFiles.length > 0) {
            setNuevasImagenes(prev => [...prev, ...validFiles]);
            showToast(`${validFiles.length} imagen(es) agregada(s) correctamente`, 'success');
        }
    };

    const handleRemoveNewImage = (indexToRemove) => {
        setNuevasImagenes(prev => prev.filter((_, index) => index !== indexToRemove));
        showToast('Imagen removida', 'info');
    };

    const handleRemoveAllNewImages = () => {
        if (nuevasImagenes.length > 0) {
            setNuevasImagenes([]);
            showToast('Todas las imágenes han sido removidas', 'info');
        }
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
            showToast(`${validFiles.length} imagen(es) agregada(s) correctamente`, 'success');
        }
        
        if (validFiles.length !== files.length) {
            showToast('Algunos archivos no son imágenes válidas o son muy grandes (máx 5MB)', 'warning');
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
        setErrors({});
        showToast('Formulario cancelado', 'info');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">            
            {/* Toast Container */}
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
            
            {/* CONTENEDOR MUCHO MÁS ANCHO - cambiado a max-w-7xl */}
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-b-3)] p-8 text-white text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Building className="w-8 h-8 text-white" />
                        </div>
                        
                        {/* TÍTULO CON TIPOGRAFÍA COMO TESTIMONIOSCLI */}
                        <h1 
                            className="text-4xl md:text-6xl font-black tracking-tighter mb-2"
                            style={{ fontFamily: "var(--font-Oswald)" }}
                        >
                            <span className="text-white">
                                BIENVENIDO A 
                            </span>{' '}
                            <span className="text-[var(--color-b-5)]">
                                QJUEGO
                            </span>
                        </h1>
                        
                        <h3 
                            className="text-2xl md:text-3xl mb-4 opacity-90"
                            style={{ fontFamily: "var(--font-Alumni)" }}
                        >
                            Crea tu Área Deportiva
                        </h3>
                        
                        <p 
                            className="text-white/80 text-lg"
                            style={{ fontFamily: "var(--font-Balo)" }}
                        >
                            Completa la información para configurar tu área deportiva
                        </p>
                        
                        {/* Progress Steps */}
                        <div className="flex justify-center mt-8">
                            <div className="flex items-center space-x-6">
                                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                                    step >= 1 
                                        ? 'bg-white text-[var(--color-secondary)] border-white shadow-lg' 
                                        : 'border-white/60 text-white/60'
                                } font-semibold`}>
                                    {step > 1 ? <Check className="w-6 h-6" /> : '1'}
                                </div>
                                <div className={`w-20 h-1 transition-all ${
                                    step >= 2 ? 'bg-white' : 'bg-white/30'
                                }`}></div>
                                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                                    step >= 2 
                                        ? 'bg-white text-[var(--color-secondary)] border-white shadow-lg' 
                                        : 'border-white/60 text-white/60'
                                } font-semibold`}>
                                    {step > 2 ? <Check className="w-6 h-6" /> : '2'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content - Resto del código permanece igual */}
                    <div className="p-8">
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-8">
                                    <h2 
                                        className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 mb-4"
                                        style={{ fontFamily: "var(--font-Oswald)" }}
                                    >
                                        <span className="text-gray-900">
                                            INFORMACIÓN
                                        </span>{' '}
                                        <span style={{ color: 'var(--color-secondary)' }}>
                                            BÁSICA
                                        </span>
                                    </h2>
                                    <p 
                                        className="text-xl text-gray-600"
                                        style={{ fontFamily: "var(--font-Alumni)" }}
                                    >
                                        Ingresa los datos principales de tu área deportiva
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Columna 1 */}
                                    <div className="space-y-6">
                                        {/* Nombre del Área */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Nombre del Área *
                                            </label>
                                            <input
                                                name="nombreArea"
                                                value={formData.nombreArea}
                                                onChange={handleChange}
                                                placeholder="Ej: Polideportivo Central"
                                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                    errors.nombreArea ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                style={{ fontFamily: 'var(--font-Balo)' }}
                                            />
                                            {errors.nombreArea && (
                                                <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                    {errors.nombreArea}
                                                </p>
                                            )}
                                        </div>

                                        {/* Zona */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Zona *
                                            </label>
                                            <select
                                                name="idZona"
                                                value={formData.idZona}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                    errors.idZona ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                style={{ fontFamily: 'var(--font-Balo)' }}
                                            >
                                                <option value="">Selecciona una zona</option>
                                                {zonas.map(zona => (
                                                    <option key={zona.idZona} value={zona.idZona}>
                                                        {zona.nombre} - {zona.macrodistrito?.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.idZona && (
                                                <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                    {errors.idZona}
                                                </p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                            <Mail className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
                                            <div className="flex-1">
                                                <label className="block text-sm text-gray-500 mb-1" style={{ fontFamily: 'var(--font-Balo)' }}>Email *</label>
                                                <input
                                                    name="emailArea"
                                                    type="email"
                                                    value={formData.emailArea}
                                                    onChange={handleChange}
                                                    placeholder="ejemplo@dominio.com"
                                                    className={`w-full bg-transparent border-none focus:outline-none focus:ring-0 ${
                                                        errors.emailArea ? 'text-red-500' : ''
                                                    }`}
                                                    style={{ fontFamily: 'var(--font-Balo)' }}
                                                />
                                                {errors.emailArea && (
                                                    <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                        {errors.emailArea}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Teléfono */}
                                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                            <Phone className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
                                            <div className="flex-1">
                                                <label className="block text-sm text-gray-500 mb-1" style={{ fontFamily: 'var(--font-Balo)' }}>Teléfono *</label>
                                                <input
                                                    name="telefonoArea"
                                                    value={formData.telefonoArea}
                                                    onChange={handleChange}
                                                    placeholder="67545678 (8 dígitos)"
                                                    className={`w-full bg-transparent border-none focus:outline-none focus:ring-0 ${
                                                        errors.telefonoArea ? 'text-red-500' : ''
                                                    }`}
                                                    style={{ fontFamily: 'var(--font-Balo)' }}
                                                />
                                                {errors.telefonoArea && (
                                                    <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                        {errors.telefonoArea}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Columna 2 */}
                                    <div className="space-y-6">
                                        {/* Horarios */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                                <Clock className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
                                                <div className="flex-1">
                                                    <label className="block text-sm text-gray-500 mb-1" style={{ fontFamily: 'var(--font-Balo)' }}>Hora de Apertura</label>
                                                    <input
                                                        name="horaInicioArea"
                                                        type="time"
                                                        value={formData.horaInicioArea}
                                                        onChange={handleChange}
                                                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                                <Clock className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
                                                <div className="flex-1">
                                                    <label className="block text-sm text-gray-500 mb-1" style={{ fontFamily: 'var(--font-Balo)' }}>Hora de Cierre</label>
                                                    <input
                                                        name="horaFinArea"
                                                        type="time"
                                                        value={formData.horaFinArea}
                                                        onChange={handleChange}
                                                        className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Coordenadas */}
<div className="space-y-4 p-4 bg-white rounded-xl border border-blue-400">                                            <p className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                BUSCA LAS COORDENADAS DE TU DIRECCIÓN EN 
                                                <a 
                                                    href="https://www.google.com/maps" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-blue-500 underline ml-1"
                                                >
                                                    GOOGLE MAPS
                                                </a>. 
                                                ESTO SIRVE PARA MOSTRAR LA DIRECCIÓN DEL ÁREA DEPORTIVA A LOS CLIENTES.
                                                <br />
                                                <span className="text-gray-500">(Ejemplo: -16.542, -68.172)</span>
                                            </p>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                                    <Globe className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
                                                    <div className="flex-1">
                                                        <label className="block text-sm text-gray-500 mb-1" style={{ fontFamily: 'var(--font-Balo)' }}>Latitud</label>
                                                        <input
                                                            name="latitud"
                                                            type="number"
                                                            step="any"
                                                            value={formData.latitud}
                                                            onChange={handleChange}
                                                            placeholder="-16.542"
                                                            className={`w-full bg-transparent border-none focus:outline-none focus:ring-0 ${
                                                                errors.latitud ? 'text-red-500' : ''
                                                            }`}
                                                            style={{ fontFamily: 'var(--font-Balo)' }}
                                                        />
                                                        {errors.latitud && (
                                                            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                                {errors.latitud}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                                    <Globe className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
                                                    <div className="flex-1">
                                                        <label className="block text-sm text-gray-500 mb-1" style={{ fontFamily: 'var(--font-Balo)' }}>Longitud</label>
                                                        <input
                                                            name="longitud"
                                                            type="number"
                                                            step="any"
                                                            value={formData.longitud}
                                                            onChange={handleChange}
                                                            placeholder="-68.172"
                                                            className={`w-full bg-transparent border-none focus:outline-none focus:ring-0 ${
                                                                errors.longitud ? 'text-red-500' : ''
                                                            }`}
                                                            style={{ fontFamily: 'var(--font-Balo)' }}
                                                        />
                                                        {errors.longitud && (
                                                            <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                                {errors.longitud}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* Descripción - Ocupa todo el ancho */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
                                        Descripción
                                        <span className="text-gray-400 text-xs ml-2">
                                            ({formData.descripcionArea.length}/600 caracteres)
                                        </span>
                                    </label>
                                    <textarea
                                        name="descripcionArea"
                                        value={formData.descripcionArea}
                                        onChange={handleChange}
                                        placeholder="Describe tu área deportiva..."
                                        rows="4"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            errors.descripcionArea ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        style={{ fontFamily: 'var(--font-Balo)' }}
                                    />
                                    {errors.descripcionArea && (
                                        <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-Balo)' }}>
                                            {errors.descripcionArea}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                    <p className="text-yellow-800 text-sm" style={{ fontFamily: 'var(--font-Balo)' }}>
                                        Los campos marcados con * son obligatorios
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2 - Imágenes (código igual que antes) */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-8"
                            >
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-secondary)]/20 flex items-center justify-center">
                                        <Upload className="w-10 h-10 text-[var(--color-secondary)]" />
                                    </div>
                                    
                                    <h2 
                                        className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 mb-4"
                                        style={{ fontFamily: "var(--font-Oswald)" }}
                                    >
                                        <span className="text-gray-900">
                                            AGREGAR
                                        </span>{' '}
                                        <span style={{ color: 'var(--color-secondary)' }}>
                                            IMÁGENES
                                        </span>
                                    </h2>
                                    
                                    <p 
                                        className="text-xl text-gray-600"
                                        style={{ fontFamily: "var(--font-Alumni)" }}
                                    >
                                        Sube imágenes de tu área deportiva (opcional)
                                    </p>
                                </div>

                                <div 
                                    className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 transition-all bg-gray-50 cursor-pointer"
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onClick={() => document.getElementById('file-upload-area').click()}
                                >
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="file-upload-area"
                                    />
                                    <Upload className="w-16 h-16 mx-auto mb-6 text-gray-400" />
                                    <span className="text-blue-600 font-medium text-xl" style={{ fontFamily: 'var(--font-Balo)' }}>
                                        Haz clic para seleccionar imágenes
                                    </span>
                                    <p className="text-sm text-gray-500 mt-3" style={{ fontFamily: 'var(--font-Balo)' }}>
                                        Arrastra y suelta las imágenes aquí
                                    </p>
                                    <div className="mt-6 flex justify-center space-x-3">
                                        <span className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm">JPG</span>
                                        <span className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm">PNG</span>
                                        <span className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm">WEBP</span>
                                        <span className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm">Máx. 5MB</span>
                                    </div>
                                </div>

                                {nuevasImagenes.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="border border-gray-200 rounded-xl p-6 bg-white"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-medium text-gray-700 text-lg" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Imágenes seleccionadas ({nuevasImagenes.length})
                                            </h4>
                                            <button
                                                onClick={handleRemoveAllNewImages}
                                                className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center space-x-2"
                                                style={{ fontFamily: 'var(--font-Balo)' }}
                                            >
                                                <X className="w-5 h-5" />
                                                <span>Eliminar todas</span>
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {nuevasImagenes.map((file, index) => (
                                                <div key={index} className="relative group border border-gray-200 rounded-xl overflow-hidden">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-32 object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                                                        <button
                                                            onClick={() => handleRemoveNewImage(index)}
                                                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-all transform scale-0 group-hover:scale-100"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 text-center">
                                                        {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                                            <p className="text-green-700 text-sm text-center" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Listo para subir {nuevasImagenes.length} imagen{nuevasImagenes.length !== 1 ? 'es' : ''}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Footer con Botones */}
                    <div className="border-t border-gray-200 p-8 bg-gray-50">
                        <div className="flex justify-between">
                            {step === 1 ? (
                                <>
                                    <button
                                        onClick={handleClose}
                                        className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium flex items-center space-x-2"
                                        style={{ fontFamily: 'var(--font-josefin)' }}
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        <span>Cancelar</span>
                                    </button>
                                    <button
                                        onClick={handleCreateArea}
                                        disabled={loading || Object.keys(errors).length > 0}
                                        className="px-8 py-4 rounded-xl font-medium flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                                        style={{ 
                                            fontFamily: 'var(--font-josefin)',
                                            backgroundColor: 'var(--color-secondary)',
                                            color: 'white'
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span className="text-lg">Creando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-lg">Continuar</span>
                                                <ChevronRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium flex items-center space-x-2"
                                        style={{ fontFamily: 'var(--font-josefin)' }}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        <span>Atrás</span>
                                    </button>
                                    <button
                                        onClick={handleUploadImages}
                                        disabled={loading}
                                        className="px-8 py-4 rounded-xl font-medium flex items-center space-x-3 disabled:opacity-50 transition-all hover:scale-105"
                                        style={{ 
                                            fontFamily: 'var(--font-josefin)',
                                            backgroundColor: 'var(--color-accent)',
                                            color: 'white'
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span className="text-lg">Finalizando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                <span className="text-lg">Finalizar</span>
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}