import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { createCancha, agregarImagenesCancha, getCanchasPorArea } from '../../../api/CanchaApi';
import { getAreadeportivaPorAdminId } from '../../../api/AreadeportivaApi';
import { useAuth } from '../../../auth/hooks/useAuth';
import { 
    X, 
    Upload, 
    ChevronRight, 
    ChevronLeft, 
    Check, 
    Save,
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

export default function WizardCrearCancha({ isOpen, onClose, onCanchaCreada }) {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [step, setStep] = useState(1);
    const [canchaId, setCanchaId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [idAreaDeportiva, setIdAreaDeportiva] = useState(null);
    const [areaCargando, setAreaCargando] = useState(true);
    const [toast, setToast] = useState(null);
    const [errors, setErrors] = useState({});
    const [canchasIniciales, setCanchasIniciales] = useState(null); // cantidad de canchas antes de crear
    const [showFirstCanchaModal, setShowFirstCanchaModal] = useState(false); // modal informativo para la primera cancha
    
    const [formData, setFormData] = useState({
        nombre: '',
        costoHora: '',
        capacidad: '',
        horaInicio: '',
        horaFin: '',
        tipoSuperficie: 'césped natural',
        tamano: '',
        iluminacion: 'Natural',
        cubierta: 'abierta',
        mantenimiento: 'mensual',
        estado: true
    });
    const [imagenes, setImagenes] = useState([]);

    // Sistema de toasts simple
    const showToast = (message, type = 'error') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 4000);
    };

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
                    console.error("No se pudo obtener el área deportiva");
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

    // Cargar cuántas canchas existen actualmente en el área (antes de crear una nueva)
    useEffect(() => {
        const cargarCanchasIniciales = async () => {
            try {
                if (isOpen && idAreaDeportiva) {
                    const lista = await getCanchasPorArea(idAreaDeportiva);
                    setCanchasIniciales(Array.isArray(lista) ? lista.length : 0);
                }
            } catch (error) {
                console.error('Error al obtener canchas por área:', error);
                setCanchasIniciales(0);
            }
        };

        cargarCanchasIniciales();
    }, [isOpen, idAreaDeportiva]);

    // Validaciones según tu DTO
    const validateField = (name, value) => {
        const newErrors = { ...errors };
        
        switch (name) {
            case 'nombre':
                if (!value || value.trim() === '') {
                    newErrors.nombre = 'El nombre de la cancha es obligatorio';
                } else {
                    delete newErrors.nombre;
                }
                break;
                
            case 'costoHora':
                if (!value || value.trim() === '') {
                    newErrors.costoHora = 'El costo por hora es obligatorio';
                } else if (parseFloat(value) <= 0) {
                    newErrors.costoHora = 'El costo por hora debe ser un valor positivo';
                } else {
                    delete newErrors.costoHora;
                }
                break;
                
            case 'capacidad':
                if (!value || value.trim() === '') {
                    newErrors.capacidad = 'La capacidad es obligatoria';
                } else if (parseInt(value) <= 0) {
                    newErrors.capacidad = 'La capacidad debe ser un valor positivo';
                } else {
                    delete newErrors.capacidad;
                }
                break;
                
            case 'tamano':
                if (!value || value.trim() === '') {
                    newErrors.tamano = 'El tamaño es obligatorio';
                } else {
                    delete newErrors.tamano;
                }
                break;
                
            case 'horaInicio':
                if (!value) {
                    newErrors.horaInicio = 'La hora de inicio es obligatoria';
                } else {
                    delete newErrors.horaInicio;
                }
                break;
                
            case 'horaFin':
                if (!value) {
                    newErrors.horaFin = 'La hora de fin es obligatoria';
                } else {
                    delete newErrors.horaFin;
                }
                break;
                
            default:
                break;
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateForm = () => {
        const fieldsToValidate = ['nombre', 'costoHora', 'capacidad', 'tamano', 'horaInicio', 'horaFin'];
        let isValid = true;
        
        fieldsToValidate.forEach(field => {
            if (!validateField(field, formData[field])) {
                isValid = false;
            }
        });
        
        return isValid;
    };

    // Función para verificar si se pueden pasar al paso 2
    const canProceedToStep2 = () => {
        return formData.nombre && 
               formData.costoHora && 
               formData.capacidad && 
               formData.tamano &&
               formData.horaInicio &&
               formData.horaFin &&
               !errors.nombre &&
               !errors.costoHora &&
               !errors.capacidad &&
               !errors.tamano &&
               !errors.horaInicio &&
               !errors.horaFin;
    };

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Validar en tiempo real
        setTimeout(() => validateField(name, value), 300);
    };

    const handleCreateCancha = async () => {
        if (!validateForm()) {
            showToast('Por favor corrige los errores en el formulario', 'warning');
            return;
        }

        if (!idAreaDeportiva) {
            showToast('No se pudo identificar el área deportiva. Contacta al administrador.');
            return;
        }

        setLoading(true);
        try {
            const canchaData = {
                ...formData,
                costoHora: parseFloat(formData.costoHora),
                capacidad: parseInt(formData.capacidad),
                idAreadeportiva: idAreaDeportiva
            };
            
            console.log("Creando cancha con datos:", canchaData);
            const res = await createCancha(canchaData);
            setCanchaId(res.idCancha);
            setStep(2);
            showToast('Cancha creada exitosamente. Ahora puedes agregar imágenes.', 'success');
        } catch (err) {
            showToast('Error al crear la cancha: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleUploadImages = async () => {
        if (imagenes.length === 0) {
            showToast('Por favor selecciona al menos una imagen', 'warning');
            return;
        }

        setLoading(true);
        
        try {
            await agregarImagenesCancha(canchaId, imagenes);
            showToast('Cancha creada exitosamente', 'success');
            onCanchaCreada?.();
            // Si es la primera cancha creada para el área, mostramos el mensaje especial
            if (canchasIniciales === 0) {
                setShowFirstCanchaModal(true);
            } else {
                handleClose();
            }
        } catch (err) {
            showToast('Error al subir imágenes: ' + (err.response?.data?.message || err.message));
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
        setErrors({});
        onClose();
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        console.log("Archivos seleccionados:", files.length);
        
        const validFiles = files.filter(file => 
            file.type.startsWith('image/') && 
            file.size <= 5 * 1024 * 1024
        );
        
        if (validFiles.length !== files.length) {
            showToast('Algunos archivos no son imágenes válidas o son muy grandes (máx 5MB)', 'warning');
        }
        
        if (validFiles.length > 0) {
            setImagenes(prev => [...prev, ...validFiles]);
            showToast(`${validFiles.length} imagen(es) agregada(s) correctamente`, 'success');
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        setImagenes(prev => prev.filter((_, index) => index !== indexToRemove));
        showToast('Imagen removida', 'info');
    };

    const handleRemoveAllImages = () => {
        if (imagenes.length > 0) {
            setImagenes([]);
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
            setImagenes(prev => [...prev, ...validFiles]);
            showToast(`${validFiles.length} imagen(es) agregada(s) correctamente`, 'success');
        }
        
        if (validFiles.length !== files.length) {
            showToast('Algunos archivos no son imágenes válidas o son muy grandes (máx 5MB)', 'warning');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    {/* Modal informativo para la primera cancha creada */}
                    {showFirstCanchaModal && (
                        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 60 }}>
                            <div className="absolute inset-0 bg-black/60" />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative bg-white rounded-3xl shadow-2xl max-w-3xl md:max-w-4xl w-full p-8 md:p-10 border border-gray-100"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-green-100 flex items-center justify-center">
                                            <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 leading-tight" style={{ fontFamily: 'var(--font-Oswald)' }}>
                                            ¡Cancha creada exitosamente!
                                        </h3>
                                        <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-semibold" style={{ fontFamily: 'var(--font-Balo)' }}>
                                            Ahora debes ingresar al módulo de Disciplinas, crear una disciplina y asignarla a tus canchas. Este paso es obligatorio para indicar qué deportes se pueden practicar en cada cancha y garantizar que los clientes reciban la información correcta al momento de reservar.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={() => { setShowFirstCanchaModal(false); handleClose(); navigate('/admin/disciplinas'); }}
                                        className="px-6 md:px-8 py-3 md:py-3.5 rounded-xl text-white font-semibold text-base md:text-lg shadow-md hover:shadow-lg transition"
                                        style={{ backgroundColor: 'var(--color-accent)', fontFamily: 'var(--font-josefin)' }}
                                    >
                                        Ir a Disciplinas
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                    {/* Toast Container */}
                    {toast && !showFirstCanchaModal && (
                        <Toast 
                            message={toast.message} 
                            type={toast.type} 
                            onClose={() => setToast(null)} 
                        />
                    )}
                    
                    {/* CONTENEDOR OPTIMIZADO (se oculta cuando aparece el modal final) */}
                    {!showFirstCanchaModal && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[88vh] overflow-hidden border border-gray-100 relative flex flex-col"
                    >
                        {/* Botón cerrar en esquina superior derecha */}
                        <button
                            onClick={handleClose}
                            className="absolute right-4 top-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-all"
                        >
                            <X className="w-5 h-5 text-gray-600 hover:text-gray-900" />
                        </button>

                        {/* Header compacto sin ícono grande */}
                        <div className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-b-3)] px-6 py-5 text-white flex-shrink-0">
                            <h2 
                                className="text-2xl md:text-3xl font-black tracking-tight mb-1"
                                style={{ fontFamily: "var(--font-Oswald)" }}
                            >
                                CREAR NUEVA CANCHA
                            </h2>
                            
                            <p 
                                className="text-white/90 text-sm"
                                style={{ fontFamily: "var(--font-Alumni)" }}
                            >
                                Completa la información de tu nueva cancha deportiva
                            </p>
                            
                            {/* Progress Steps */}
                            <div className="flex justify-center mt-4">
                                <div className="flex items-center space-x-4">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                                        step >= 1 
                                            ? 'bg-white text-[var(--color-secondary)] border-white shadow-lg' 
                                            : 'border-white/60 text-white/60'
                                    } font-semibold text-sm`}>
                                        {step > 1 ? <Check className="w-5 h-5" /> : '1'}
                                    </div>
                                    <div className={`w-16 h-1 transition-all ${
                                        step >= 2 ? 'bg-white' : 'bg-white/30'
                                    }`}></div>
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                                        step >= 2 
                                            ? 'bg-white text-[var(--color-secondary)] border-white shadow-lg' 
                                            : 'border-white/60 text-white/60'
                                    } font-semibold text-sm`}>
                                        {step > 2 ? <Check className="w-5 h-5" /> : '2'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content con scroll */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {/* Paso 1: Datos de la Cancha */}
                            {step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-4">
                                        <h3 
                                            className="text-xl md:text-2xl font-black tracking-tight text-gray-900 mb-1"
                                            style={{ fontFamily: "var(--font-Oswald)" }}
                                        >
                                            <span className="text-gray-900">INFORMACIÓN</span>{' '}
                                            <span style={{ color: 'var(--color-secondary)' }}>BÁSICA</span>
                                        </h3>
                                        <p 
                                            className="text-gray-600 text-sm"
                                            style={{ fontFamily: "var(--font-Alumni)" }}
                                        >
                                            Ingresa los datos principales de tu cancha
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Campos del formulario con validaciones */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Nombre de la Cancha *
                                            </label>
                                            <input
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                placeholder="Ej: Cancha Principal Fútbol"
                                                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                    errors.nombre ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                style={{ fontFamily: 'var(--font-Balo)' }}
                                            />
                                            {errors.nombre && (
                                                <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                    {errors.nombre}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Costo por Hora (S/) *
                                            </label>
                                            <input
                                                name="costoHora"
                                                type="number"
                                                value={formData.costoHora}
                                                onChange={handleChange}
                                                placeholder="Ej: 50.00"
                                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                    errors.costoHora ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                style={{ fontFamily: 'var(--font-Balo)' }}
                                            />
                                            {errors.costoHora && (
                                                <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                    {errors.costoHora}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Capacidad *
                                            </label>
                                            <input
                                                name="capacidad"
                                                type="number"
                                                value={formData.capacidad}
                                                onChange={handleChange}
                                                placeholder="Ej: 20 personas"
                                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                    errors.capacidad ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                style={{ fontFamily: 'var(--font-Balo)' }}
                                            />
                                            {errors.capacidad && (
                                                <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                    {errors.capacidad}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Tamaño *
                                            </label>
                                            <input
                                                name="tamano"
                                                value={formData.tamano}
                                                onChange={handleChange}
                                                placeholder="Ej: 40x20 metros"
                                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                    errors.tamano ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                style={{ fontFamily: 'var(--font-Balo)' }}
                                            />
                                            {errors.tamano && (
                                                <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                    {errors.tamano}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Hora de Apertura *
                                            </label>
                                            <input
                                                name="horaInicio"
                                                type="time"
                                                value={formData.horaInicio}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                    errors.horaInicio ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.horaInicio && (
                                                <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                    {errors.horaInicio}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Hora de Cierre *
                                            </label>
                                            <input
                                                name="horaFin"
                                                type="time"
                                                value={formData.horaFin}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                    errors.horaFin ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {errors.horaFin && (
                                                <p className="text-red-500 text-sm mt-1" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                    {errors.horaFin}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Tipo de Superficie
                                            </label>
                                            <select
                                                name="tipoSuperficie"
                                                value={formData.tipoSuperficie}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                style={{ fontFamily: 'var(--font-Balo)' }}
                                            >
                                                <option value="césped natural">Césped Natural</option>
                                                <option value="césped sintético">Césped Sintético</option>
                                                <option value="cemento">Cemento</option>
                                                <option value="parquet">Parquet</option>
                                                <option value="arena">Arena</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Tipo de Iluminación
                                            </label>
                                            <select
                                                name="iluminacion"
                                                value={formData.iluminacion}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                style={{ fontFamily: 'var(--font-Balo)' }}
                                            >
                                                <option value="halógena">Halógena</option>
                                                <option value="led">LED</option>
                                                <option value="fluorescente">Fluorescente</option>
                                                <option value="natural">Natural</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Cubierta
                                            </label>
                                            <select
                                                name="cubierta"
                                                value={formData.cubierta}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                style={{ fontFamily: 'var(--font-Balo)' }}
                                            >
                                                <option value="abierta">Abierta</option>
                                                <option value="cubierta">Cubierta</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Mantenimiento
                                            </label>
                                            <select
                                                name="mantenimiento"
                                                value={formData.mantenimiento}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                style={{ fontFamily: 'var(--font-Balo)' }}
                                            >
                                                <option value="diario">Diario</option>
                                                <option value="semanal">Semanal</option>
                                                <option value="mensual">Mensual</option>
                                                <option value="trimestral">Trimestral</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                        <p className="text-yellow-800 text-sm" style={{ fontFamily: 'var(--font-Balo)' }}>
                                          Todos los campos marcados  son obligatorios
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Paso 2: Subir Imágenes */}
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
                                        
                                        <h3 
                                            className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 mb-2"
                                            style={{ fontFamily: "var(--font-Oswald)" }}
                                        >
                                            <span className="text-gray-900">AGREGAR</span>{' '}
                                            <span style={{ color: 'var(--color-secondary)' }}>IMÁGENES</span>
                                        </h3>
                                        
                                        <p 
                                            className="text-gray-600 text-lg"
                                            style={{ fontFamily: "var(--font-Alumni)" }}
                                        >
                                            Selecciona múltiples imágenes para mostrar tu cancha
                                        </p>
                                    </div>

                                    <div 
                                        className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 transition-all bg-gray-50 cursor-pointer"
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onClick={() => document.getElementById('file-upload').click()}
                                    >
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            id="file-upload"
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

                                    {/* Preview de imágenes seleccionadas */}
                                    {imagenes.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="border border-gray-200 rounded-xl p-6 bg-white"
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-medium text-gray-700 text-lg" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                    Imágenes seleccionadas ({imagenes.length})
                                                </h4>
                                                <button
                                                    onClick={handleRemoveAllImages}
                                                    className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center space-x-2"
                                                    style={{ fontFamily: 'var(--font-Balo)' }}
                                                >
                                                    <X className="w-5 h-5" />
                                                    <span>Eliminar todas</span>
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {imagenes.map((file, index) => (
                                                    <div key={index} className="relative group border border-gray-200 rounded-xl overflow-hidden">
                                                        <img
                                                            src={URL.createObjectURL(file)}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-32 object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                                                            <button
                                                                onClick={() => handleRemoveImage(index)}
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
                                                    Listo para subir {imagenes.length} imagen{imagenes.length !== 1 ? 'es' : ''}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        {/* Footer con Botones - Compacto */}
                        <div className="border-t border-gray-200 p-4 bg-gray-50 flex-shrink-0">
                            <div className="flex justify-between">
                                {step === 1 ? (
                                    <>
                                        <button
                                            onClick={handleClose}
                                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all font-medium flex items-center space-x-2 text-sm"
                                            style={{ fontFamily: 'var(--font-josefin)' }}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            <span>Cancelar</span>
                                        </button>
                                        <button
                                            onClick={handleCreateCancha}
                                            disabled={loading || areaCargando || !idAreaDeportiva || !canProceedToStep2()}
                                            className="px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                            style={{ 
                                                fontFamily: 'var(--font-josefin)',
                                                backgroundColor: '#000000',
                                                color: 'white'
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    <span>Creando...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Siguiente</span>
                                                    <ChevronRight className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setStep(1)}
                                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all font-medium flex items-center space-x-2 text-sm"
                                            style={{ fontFamily: 'var(--font-josefin)' }}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            <span>Atrás</span>
                                        </button>
                                        <button
                                            onClick={handleUploadImages}
                                            disabled={loading || imagenes.length === 0}
                                            className="px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                            style={{ 
                                                fontFamily: 'var(--font-josefin)',
                                                backgroundColor: 'var(--color-accent)',
                                                color: 'white'
                                            }}
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    <span>Subiendo...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    <span>Finalizar</span>
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                    )}
                </div>
            )}
        </AnimatePresence>
    );
}