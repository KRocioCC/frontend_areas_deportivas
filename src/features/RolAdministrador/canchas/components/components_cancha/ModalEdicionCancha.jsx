import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { updateCancha, agregarImagenesCancha, eliminarImagenCancha, cambiarEstadoCancha } from '../../../../../api/CanchaApi';
import { 
    X, 
    Upload, 
    Save,
    AlertCircle,
    CheckCircle,
    Info,
    Trash2,
    Eye
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

export default function ModalEdicionCancha({ isOpen, onClose, cancha, onCanchaActualizada }) {
    const [loading, setLoading] = useState(false);
    const [imagenes, setImagenes] = useState([]);
    const [nuevasImagenes, setNuevasImagenes] = useState([]);
    const [imagenesAEliminar, setImagenesAEliminar] = useState([]);
    const [toast, setToast] = useState(null);
    
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

    // Sistema de toasts simple
    const showToast = (message, type = 'error') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 4000);
    };

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
                const imagenesProcesadas = cancha.imagenes.map(imagen => ({
                    ...imagen,
                    urlCompleta: getUrlImagenCompleta(imagen.urlAcceso),
                    id: imagen.idImagenRelacion || imagen.id,
                    mantener: true
                })).filter(imagen => imagen.id != null);
                    
                console.log("🖼️ Imágenes procesadas:", imagenesProcesadas);
                setImagenes(imagenesProcesadas);
            } else {
                console.warn("⚠️ No hay imágenes en la cancha");
                setImagenes([]);
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

    // Funciones para manejo de imágenes - USANDO LA MISMA LÓGICA QUE MiAreaPage.jsx
    const handleRemoveExistingImage = (imagenId) => {
        if (imagenesAEliminar.includes(imagenId)) {
            // Si ya está marcada, la quitamos de la lista de eliminación
            setImagenesAEliminar(prev => prev.filter(id => id !== imagenId));
            // También actualizamos el estado visual de las imágenes
            setImagenes(prev => prev.map(img => 
                img.id === imagenId ? { ...img, mantener: true } : img
            ));
        } else {
            // Si no está marcada, la agregamos a la lista de eliminación
            setImagenesAEliminar(prev => [...prev, imagenId]);
            // Actualizamos el estado visual
            setImagenes(prev => prev.map(img => 
                img.id === imagenId ? { ...img, mantener: false } : img
            ));
        }
    };

    const handleAddImagesInEdit = (e) => {
        const files = Array.from(e.target.files);
        
        const validFiles = files.filter(file => 
            file.type.startsWith('image/') && 
            file.size <= 5 * 1024 * 1024
        );
        
        if (validFiles.length !== files.length) {
            showToast('⚠️ Algunos archivos no son imágenes válidas o son muy grandes (máx 5MB)', 'warning');
        }
        
        setNuevasImagenes(prev => [...prev, ...validFiles]);
        if (validFiles.length > 0) {
            showToast(`${validFiles.length} nueva(s) imagen(es) agregada(s)`, 'success');
        }
    };

    const handleRemoveNewImage = (indexToRemove) => {
        setNuevasImagenes(prev => prev.filter((_, index) => index !== indexToRemove));
        showToast('Imagen removida', 'info');
    };

    const handleRemoveAllNewImages = () => {
        if (nuevasImagenes.length > 0) {
            setNuevasImagenes([]);
            showToast('Todas las nuevas imágenes han sido removidas', 'info');
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
            showToast(`${validFiles.length} nueva(s) imagen(es) agregada(s)`, 'success');
        }
        
        if (validFiles.length !== files.length) {
            showToast('⚠️ Algunos archivos no son imágenes válidas o son muy grandes (máx 5MB)', 'warning');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // CORREGIDO: Función para eliminar imagen con ambos parámetros requeridos
    const eliminarImagenSegura = async (imagenId) => {
        if (!imagenId || imagenId === 'undefined') {
            console.error("❌ ID de imagen inválido para eliminar:", imagenId);
            return;
        }

        try {
            console.log("🗑️ Eliminando imagen con ID:", imagenId, "de cancha:", cancha.idCancha);
            // CORREGIDO: Pasar ambos parámetros requeridos - id de cancha e id de imagen
            await eliminarImagenCancha(cancha.idCancha, imagenId);
            console.log(" Imagen eliminada exitosamente");
        } catch (error) {
            console.error("❌ Error eliminando imagen:", error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        if (!formData.nombre || !formData.costoHora || !formData.capacidad) {
            showToast('Por favor completa los campos obligatorios', 'warning');
            return;
        }

        setLoading(true);
        
        try {
            // Verificar que tenemos todos los datos necesarios
            if (!cancha.idAreadeportiva && !cancha.areaDeportiva?.idAreadeportiva) {
                showToast("Error: No se pudo obtener el ID del área deportiva", 'error');
                return;
            }

            const idAreadeportiva = cancha.idAreadeportiva || cancha.areaDeportiva?.idAreadeportiva;

            // 1. Preparar datos para enviar - CON MÁS VALIDACIONES
            const canchaData = {
                nombre: formData.nombre.trim(),
                costoHora: parseFloat(formData.costoHora),
                capacidad: parseInt(formData.capacidad),
                horaInicio: formData.horaInicio || null,
                horaFin: formData.horaFin || null,
                tipoSuperficie: formData.tipoSuperficie,
                tamano: formData.tamano?.trim() || null,
                iluminacion: formData.iluminacion,
                cubierta: formData.cubierta,
                mantenimiento: formData.mantenimiento,
                estado: formData.estado !== false,
                idAreadeportiva: parseInt(idAreadeportiva)
            };

            // Validaciones adicionales
            if (isNaN(canchaData.costoHora) || canchaData.costoHora <= 0) {
                showToast('El costo por hora debe ser un número válido y mayor a 0', 'error');
                return;
            }

            if (isNaN(canchaData.capacidad) || canchaData.capacidad <= 0) {
                showToast('La capacidad debe ser un número válido y mayor a 0', 'error');
                return;
            }

            if (isNaN(canchaData.idAreadeportiva)) {
                showToast('ID del área deportiva inválido', 'error');
                return;
            }

            console.log("📤 Enviando datos al servidor:", canchaData);
            console.log("🔧 ID de cancha a actualizar:", cancha.idCancha);
            
            // 2. Actualizar datos de la cancha
            await updateCancha(cancha.idCancha, canchaData);
            
            // 3. Eliminar imágenes marcadas para eliminar
            const imagenesParaEliminar = imagenesAEliminar.filter(id => id && id !== 'undefined');
            console.log("🗑️ Imágenes a eliminar:", imagenesParaEliminar);
            
            if (imagenesParaEliminar.length > 0) {
                for (const imagenId of imagenesParaEliminar) {
                    await eliminarImagenSegura(imagenId);
                }
            }
            
            // 4. Agregar nuevas imágenes
            if (nuevasImagenes.length > 0) {
                console.log("🖼️ Agregando nuevas imágenes:", nuevasImagenes.length);
                await agregarImagenesCancha(cancha.idCancha, nuevasImagenes);
            }
            
            onCanchaActualizada?.();
            handleClose();
            
        } catch (err) {
            console.error("Error completo:", err);
            const errorMessage = err.response?.data?.message || 
                              err.response?.data?.error ||
                              err.message ||
                              "Error desconocido al actualizar la cancha";
            showToast(`❌ Error: ${errorMessage}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDesactivar = async () => {
        const accion = formData.estado ? 'desactivar' : 'activar';
        const confirmed = window.confirm(`¿Estás seguro de que deseas ${accion} esta cancha?`);
        if (!confirmed) return;

        setLoading(true);
        try {
            const nuevoEstado = !formData.estado;
            await cambiarEstadoCancha(cancha.idCancha, nuevoEstado);
            
            const mensaje = nuevoEstado ? 'activada' : 'desactivada';
            showToast(`✅ Cancha ${mensaje} exitosamente`, 'success');
            onCanchaActualizada?.();
            handleClose();
            
        } catch (err) {
            console.error("Error completo:", err);
            const errorMessage = err.response?.data?.message || 
                              err.response?.data?.error ||
                              err.message ||
                              "Error desconocido al cambiar el estado de la cancha";
            showToast(`❌ Error: ${errorMessage}`, 'error');
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

    // Contadores para el resumen
    const imagenesMantenidasCount = imagenes.filter(img => !imagenesAEliminar.includes(img.id)).length;
    const imagenesEliminadasCount = imagenesAEliminar.length;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    {/* Toast Container */}
                    {toast && (
                        <Toast 
                            message={toast.message} 
                            type={toast.type} 
                            onClose={() => setToast(null)} 
                        />
                    )}
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-100 relative flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-b-3)] px-6 py-5 text-white flex-shrink-0">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 
                                        className="text-2xl md:text-3xl font-black tracking-tight mb-1"
                                        style={{ fontFamily: "var(--font-Oswald)" }}
                                    >
                                        EDITAR CANCHA
                                    </h2>
                                    <p 
                                        className="text-white/90 text-sm"
                                        style={{ fontFamily: "var(--font-Alumni)" }}
                                    >
                                        Modifica la información de: {cancha.nombre}
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="space-y-6">
                                {/* Información General */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                                >
                                    <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center">
                                        <span style={{ color: 'var(--color-secondary)' }}>INFORMACIÓN</span>
                                        <span className="text-gray-900 ml-2">GENERAL</span>
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Nombre de la Cancha *
                                            </label>
                                            <input
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                style={{ fontFamily: 'var(--font-Balo)' }}
                                            />
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
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                style={{ fontFamily: 'var(--font-Balo)' }}
                                            />
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
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                style={{ fontFamily: 'var(--font-Balo)' }}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Tamaño
                                            </label>
                                            <input
                                                name="tamano"
                                                value={formData.tamano}
                                                onChange={handleChange}
                                                placeholder="Ej: 40x20 metros"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                style={{ fontFamily: 'var(--font-Balo)' }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Horarios */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                                >
                                    <h3 className="text-xl font-black text-gray-900 mb-4">
                                        <span style={{ color: 'var(--color-secondary)' }}>HORARIOS</span>
                                        <span className="text-gray-900 ml-2">DE OPERACIÓN</span>
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
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
                                </motion.div>

                                {/* Características */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                                >
                                    <h3 className="text-xl font-black text-gray-900 mb-4">
                                        <span style={{ color: 'var(--color-secondary)' }}>CARACTERÍSTICAS</span>
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
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
                                            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
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
                                </motion.div>

                                {/* Gestión de Imágenes */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                                >
                                    <h3 className="text-xl font-black text-gray-900 mb-4">
                                        <span style={{ color: 'var(--color-secondary)' }}>GESTIÓN</span>
                                        <span className="text-gray-900 ml-2">DE IMÁGENES</span>
                                    </h3>

                                    {/* Resumen de imágenes */}
                                    <div className="bg-blue-50 p-4 rounded-xl mb-6">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-medium" style={{ fontFamily: 'var(--font-Balo)' }}>Resumen de imágenes:</span>
                                            <div className="flex gap-4">
                                                <span className="text-green-600 flex items-center gap-1">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Mantener: {imagenesMantenidasCount}
                                                </span>
                                                <span className="text-red-600 flex items-center gap-1">
                                                    <Trash2 className="w-4 h-4" />
                                                    Quitar: {imagenesEliminadasCount}
                                                </span>
                                                <span className="text-blue-600 flex items-center gap-1">
                                                    <Upload className="w-4 h-4" />
                                                    Nuevas: {nuevasImagenes.length}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Área de subida */}
                                    <div 
                                        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-all bg-gray-50 mb-6 cursor-pointer"
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onClick={() => document.getElementById('file-upload-edit').click()}
                                    >
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleAddImagesInEdit}
                                            className="hidden"
                                            id="file-upload-edit"
                                        />
                                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                        <span className="text-blue-600 font-medium text-lg" style={{ fontFamily: 'var(--font-Balo)' }}>
                                            Haz clic para agregar nuevas imágenes
                                        </span>
                                        <p className="text-sm text-gray-500 mt-2" style={{ fontFamily: 'var(--font-Balo)' }}>
                                            Arrastra y suelta las imágenes aquí
                                        </p>
                                    </div>

                                    {/* Imágenes existentes */}
                                    {imagenes.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="font-medium text-gray-700 mb-3 text-lg" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Imágenes Actuales ({imagenes.length})
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {imagenes.map((imagen, index) => {
                                                    const estaMarcadaEliminar = imagenesAEliminar.includes(imagen.id);
                                                    return (
                                                        <div 
                                                            key={imagen.id || index} 
                                                            className={`relative group border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                                                                estaMarcadaEliminar ? 'border-red-500 opacity-60' : 'border-gray-200 hover:border-gray-400'
                                                            }`}
                                                        >
                                                            <img
                                                                src={imagen.urlCompleta}
                                                                alt={`Imagen ${index + 1}`}
                                                                className="w-full h-24 object-cover"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = "https://placehold.co/150x100?text=Error+Cargando";
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                                                                <button
                                                                    onClick={() => handleRemoveExistingImage(imagen.id)}
                                                                    className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-all transform scale-0 group-hover:scale-100"
                                                                    title={estaMarcadaEliminar ? "Desmarcar para mantener" : "Marcar para eliminar"}
                                                                >
                                                                    {estaMarcadaEliminar ? (
                                                                        <Eye className="w-3 h-3" />
                                                                    ) : (
                                                                        <Trash2 className="w-3 h-3" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                            <div className={`absolute bottom-0 left-0 right-0 text-white text-xs p-2 text-center ${
                                                                estaMarcadaEliminar ? 'bg-red-600' : 'bg-black/70'
                                                            }`}>
                                                                {estaMarcadaEliminar ? 'ELIMINAR ✓' : 'Imagen ' + (index + 1)}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Nuevas imágenes */}
                                    {nuevasImagenes.length > 0 && (
                                        <div>
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="font-medium text-gray-700 text-lg" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                    Nuevas Imágenes a Agregar ({nuevasImagenes.length})
                                                </h4>
                                                <button
                                                    onClick={handleRemoveAllNewImages}
                                                    className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center space-x-2"
                                                    style={{ fontFamily: 'var(--font-Balo)' }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Eliminar todas</span>
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {nuevasImagenes.map((file, index) => (
                                                    <div key={index} className="relative group border border-blue-200 rounded-xl overflow-hidden">
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
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                        <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs p-2 text-center">
                                                            {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {imagenes.length === 0 && nuevasImagenes.length === 0 && (
                                        <div className="text-center text-gray-500 py-8">
                                            <Eye className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                            <p style={{ fontFamily: 'var(--font-Balo)' }}>No hay imágenes para esta cancha</p>
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </div>

                        {/* Footer con Botones */}
                        <div className="border-t border-gray-200 p-6 bg-gray-50 flex-shrink-0">
                            <div className="flex justify-between items-center">
                                <button
                                    onClick={handleDesactivar}
                                    className={`px-6 py-3 rounded-xl transition-all font-medium flex items-center space-x-2 ${
                                        formData.estado 
                                            ? 'bg-red-600 text-white hover:bg-red-700' 
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                                    style={{ fontFamily: 'var(--font-Balo)' }}
                                >
                                    {formData.estado ? (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            <span>Desactivar Cancha</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Activar Cancha</span>
                                        </>
                                    )}
                                </button>
                                
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleClose}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium"
                                        style={{ fontFamily: 'var(--font-Balo)' }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-medium flex items-center space-x-2 disabled:opacity-50"
                                        style={{ fontFamily: 'var(--font-Balo)' }}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Guardando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                <span>Guardar Cambios</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}