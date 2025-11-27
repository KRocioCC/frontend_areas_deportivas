import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { 
    getAreadeportivaPorAdminId, 
    updateAreadeportiva,
    agregarImagenesAreadeportiva,
    eliminarImagenAreadeportiva
} from '../../../api/AreadeportivaApi';
import { useAuth } from '../../../auth/hooks/useAuth';
import { getZonas } from '../../../api/ZonaApi';
import { ChevronLeft, Mail, Phone, MapPin, Clock, Globe, Camera, Trash2, Upload, Save, X } from 'lucide-react';

export default function MiAreaPage() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [areaDeportiva, setAreaDeportiva] = useState(null);
    const [loading, setLoading] = useState(true);
    const [zonas, setZonas] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [nuevasImagenes, setNuevasImagenes] = useState([]);
    const [imagenesAEliminar, setImagenesAEliminar] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
        id: null,
        estado: true
    });

    // Colores y estilos bases
    const primaryColor = '#41bfb2';
    const accentColor = '#f28627';
    const dangerColor = '#d61727';
    // const darkBg = '#0f1213';
    // const lightBg = '#ffffff';
    // const cardDark = '#1a1d1e';
    // const cardLight = '#ffffff';

    // Cargar área deportiva del administrador
    useEffect(() => {
        const cargarAreaDeportiva = async () => {
            if (!currentUser?.idPersona) return;
            
            try {
                setLoading(true);
                const area = await getAreadeportivaPorAdminId(currentUser.idPersona);
                setAreaDeportiva(area);
                
                if (area && area.idAreadeportiva) {
                    setFormData({
                        nombreArea: area.nombreArea || '',
                        descripcionArea: area.descripcionArea || '',
                        emailArea: area.emailArea || '',
                        telefonoArea: area.telefonoArea || '',
                        horaInicioArea: area.horaInicioArea || '',
                        horaFinArea: area.horaFinArea || '',
                        latitud: area.latitud || '',
                        longitud: area.longitud || '',
                        idZona: area.idZona || '',
                        id: currentUser.idPersona,
                        estado: typeof area.estado !== 'undefined' ? area.estado : true
                    });
                }
            } catch (error) {
                console.error("Error al cargar área deportiva:", error);
            } finally {
                setLoading(false);
            }
        };

        cargarAreaDeportiva();
    }, [currentUser]);

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

    const handleSaveChanges = async () => {
        if (!formData.nombreArea || !formData.emailArea || !formData.telefonoArea || !formData.idZona) {
            alert('Por favor completa los campos obligatorios');
            return;
        }

        setLoading(true);
        try {
            const areaData = {
                ...formData,
                estado: typeof formData.estado !== 'undefined' ? formData.estado : (areaDeportiva?.estado ?? true)
            };

            console.log("Actualizando área deportiva con datos:", areaData);
            await updateAreadeportiva(areaDeportiva.idAreadeportiva, areaData);
            
            if (imagenesAEliminar.length > 0) {
                for (const imagenId of imagenesAEliminar) {
                    await eliminarImagenAreadeportiva(areaDeportiva.idAreadeportiva, imagenId);
                }
            }
            
            if (nuevasImagenes.length > 0) {
                await agregarImagenesAreadeportiva(areaDeportiva.idAreadeportiva, nuevasImagenes);
            }
            
            const areaRecargada = await getAreadeportivaPorAdminId(currentUser.idPersona);
            setAreaDeportiva(areaRecargada);
            
            setIsEditing(false);
            setNuevasImagenes([]);
            setImagenesAEliminar([]);
            
            // Verificar si está en el flujo del tour
            const tourStatus = localStorage.getItem('adminTourStatus');
            if (tourStatus) {
                const status = JSON.parse(tourStatus);
                if (status.stage === 'wait-area-creation') {
                    // Actualizar el estado del tour para que continúe en Canchas
                    localStorage.setItem('adminTourStatus', JSON.stringify({
                        ...status,
                        stage: 'canchas',
                        ts: Date.now()
                    }));
                    // Redirigir a Canchas para que el tour continúe automáticamente
                    setTimeout(() => {
                        navigate('/admin/canchas_admin');
                    }, 500);
                }
            }
        } catch (err) {
            alert('Error al actualizar el área deportiva: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        if (areaDeportiva) {
            setFormData({
                nombreArea: areaDeportiva.nombreArea || '',
                descripcionArea: areaDeportiva.descripcionArea || '',
                emailArea: areaDeportiva.emailArea || '',
                telefonoArea: areaDeportiva.telefonoArea || '',
                horaInicioArea: areaDeportiva.horaInicioArea || '',
                horaFinArea: areaDeportiva.horaFinArea || '',
                latitud: areaDeportiva.latitud || '',
                longitud: areaDeportiva.longitud || '',
                idZona: areaDeportiva.idZona || '',
                id: currentUser.idPersona,
                estado: typeof areaDeportiva.estado !== 'undefined' ? areaDeportiva.estado : true
            });
        }
        setIsEditing(false);
        setNuevasImagenes([]);
        setImagenesAEliminar([]);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRemoveExistingImage = (imagenId) => {
        if (imagenesAEliminar.includes(imagenId)) {
            setImagenesAEliminar(prev => prev.filter(id => id !== imagenId));
        } else {
            setImagenesAEliminar(prev => [...prev, imagenId]);
        }
    };

    const handleAddImagesInEdit = (e) => {
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

    const handleNextImage = () => {
        setCurrentImageIndex(prev => 
            prev === areaDeportiva.imagenes.length - 1 ? 0 : prev + 1
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex(prev => 
            prev === 0 ? areaDeportiva.imagenes.length - 1 : prev - 1
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div 
                        className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4"
                        style={{ borderTopColor: accentColor, borderRightColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: 'transparent' }}
                    ></div>
                    <p className="text-gray-600" style={{ fontFamily: 'var(--font-Balo)' }}>Cargando información del área deportiva...</p>
                </div>
            </div>
        );
    }

    if (!areaDeportiva) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🏟️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-Oswald)' }}>
                        No se encontró área deportiva
                    </h2>
                    <p className="text-gray-600" style={{ fontFamily: 'var(--font-Balo)' }}>
                        Contacta al administrador del sistema.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br text-gray-500 from-gray-50 to-blue-50 py-8 w-full">
            <div className="max-w-8xl mx-auto px-6">
                {/* Header con estilo inspirado */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-4"
                        style={{ fontFamily: 'var(--font-Oswald)' }}
                    >
                        <span className="text-gray-900">MI ÁREA</span>{' '}
                        <span style={{ color: primaryColor }}>DEPORTIVA</span>
                    </h1>
                    <p 
                        className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto"
                        style={{ fontFamily: 'var(--font-Alumni)' }}
                    >
                        Gestiona y personaliza la información de tu área deportiva
                    </p>
                </motion.div>

                {/* Tarjeta principal con nuevo diseño */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                >
                    {/* Header con imagen - Carrusel mejorado */}
                    <div className="h-[400px] bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
                        {areaDeportiva.imagenes && areaDeportiva.imagenes.length > 0 ? (
                            <>
                                <img
                                    src={`http://localhost:8032${areaDeportiva.imagenes[currentImageIndex].urlAcceso}`}
                                    alt={areaDeportiva.nombreArea}
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                />
                                
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                
                                {/* Controles del carrusel */}
                                {areaDeportiva.imagenes.length > 1 && (
                                    <>
                                        <button
                                            onClick={handlePrevImage}
                                            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 backdrop-blur-sm"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={handleNextImage}
                                            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 backdrop-blur-sm"
                                        >
                                            <ChevronLeft className="w-6 h-6 transform rotate-180" />
                                        </button>
                                    </>
                                )}
                                
                                {/* Indicadores */}
                                {areaDeportiva.imagenes.length > 1 && (
                                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
                                        {areaDeportiva.imagenes.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                                    index === currentImageIndex 
                                                        ? 'bg-white shadow-lg scale-125' 
                                                        : 'bg-white/50 hover:bg-white/70'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                                
                                {/* Información superior */}
                                <div className="absolute top-6 left-6 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                                    {currentImageIndex + 1} / {areaDeportiva.imagenes.length}
                                </div>
                                
                                {/* Estado */}
                                <div className="absolute top-6 right-6">
                                    <span 
                                        className="px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm"
                                        style={{
                                            backgroundColor: areaDeportiva.estado ? `${primaryColor}20` : `${dangerColor}20`,
                                            color: areaDeportiva.estado ? primaryColor : dangerColor
                                        }}
                                    >
                                        {areaDeportiva.estado ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>

                                {/* Nombre del área en el hero */}
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h1 
                                        className="text-3xl md:text-4xl font-bold tracking-wide"
                                        style={{ fontFamily: 'var(--font-Oswald)' }}
                                    >
                                        {areaDeportiva.nombreArea}
                                    </h1>
                                    <p 
                                        className="text-lg opacity-90 mt-2"
                                        style={{ fontFamily: 'var(--font-Alumni)' }}
                                    >
                                        {areaDeportiva.zona?.nombre} - {areaDeportiva.zona?.macrodistrito?.nombre}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                                <div className="text-center">
                                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-60" />
                                    <p className="text-xl font-semibold" style={{ fontFamily: 'var(--font-Alumni)' }}>Sin imágenes</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contenido */}
                    <div className="p-8">
                        {/* Botones de acción */}
                        {isEditing && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-end space-x-4 mb-8"
                            >
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium flex items-center space-x-2"
                                    style={{ fontFamily: 'var(--font-josefin)' }}
                                >
                                    <X className="w-4 h-4" />
                                    <span>Cancelar</span>
                                </button>
                                <button
                                    onClick={handleSaveChanges}
                                    disabled={loading}
                                    className="px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all disabled:opacity-50"
                                    style={{ 
                                        fontFamily: 'var(--font-josefin)',
                                        backgroundColor: primaryColor,
                                        color: 'white'
                                    }}
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>Guardar Cambios</span>
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        )}

                        {!isEditing && (
                            <div className="flex justify-end mb-8">
                                <button
                                    id="mi-area-edit"
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all hover:scale-105"
                                    style={{ 
                                        fontFamily: 'var(--font-josefin)',
                                        backgroundColor: accentColor,
                                        color: 'white'
                                    }}
                                >
                                    <span>Editar Área</span>
                                </button>
                            </div>
                        )}

                        <div id="mi-area-form" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Información de contacto */}
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-6"
                            >
                                <h3 
                                    className="text-2xl font-semibold pb-3 border-b"
                                    style={{ fontFamily: 'var(--font-Alumni)', color: primaryColor }}
                                >
                                    Información de Contacto
                                </h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
                                            Nombre del Área *
                                        </label>
                                        {isEditing ? (
                                            <input
                                                name="nombreArea"
                                                value={formData.nombreArea}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                style={{ fontFamily: 'var(--font-Balo)' }}
                                            />
                                        ) : (
                                            <p className="font-medium text-lg" style={{ fontFamily: 'var(--font-Balo)' }}>{areaDeportiva.nombreArea}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-Balo)' }}>
                                            Descripción
                                        </label>
                                        {isEditing ? (
                                            <textarea
                                                name="descripcionArea"
                                                value={formData.descripcionArea}
                                                onChange={handleChange}
                                                rows="3"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                style={{ fontFamily: 'var(--font-Balo)' }}
                                            />
                                        ) : (
                                            <p className="text-gray-700 leading-relaxed" style={{ fontFamily: 'var(--font-Balo)' }}>{areaDeportiva.descripcionArea}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                        <Mail className="w-5 h-5" style={{ color: primaryColor }} />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-Balo)' }}>Email *</p>
                                            {isEditing ? (
                                                <input
                                                    name="emailArea"
                                                    type="email"
                                                    value={formData.emailArea}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-1 bg-transparent border-none focus:outline-none focus:ring-0"
                                                    style={{ fontFamily: 'var(--font-Balo)' }}
                                                />
                                            ) : (
                                                <p className="font-medium" style={{ fontFamily: 'var(--font-Balo)' }}>{areaDeportiva.emailArea}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                        <Phone className="w-5 h-5" style={{ color: primaryColor }} />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-Balo)' }}>Teléfono *</p>
                                            {isEditing ? (
                                                <input
                                                    name="telefonoArea"
                                                    value={formData.telefonoArea}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-1 bg-transparent border-none focus:outline-none focus:ring-0"
                                                    style={{ fontFamily: 'var(--font-Balo)' }}
                                                />
                                            ) : (
                                                <p className="font-medium" style={{ fontFamily: 'var(--font-Balo)' }}>{areaDeportiva.telefonoArea}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                        <Clock className="w-5 h-5" style={{ color: accentColor }} />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-Balo)' }}>Horario</p>
                                            {isEditing ? (
                                                <div className="flex space-x-3">
                                                    <input
                                                        name="horaInicioArea"
                                                        type="time"
                                                        value={formData.horaInicioArea}
                                                        onChange={handleChange}
                                                        className="flex-1 px-3 py-1 bg-transparent border-none focus:outline-none focus:ring-0"
                                                    />
                                                    <span className="self-center text-gray-400">-</span>
                                                    <input
                                                        name="horaFinArea"
                                                        type="time"
                                                        value={formData.horaFinArea}
                                                        onChange={handleChange}
                                                        className="flex-1 px-3 py-1 bg-transparent border-none focus:outline-none focus:ring-0"
                                                    />
                                                </div>
                                            ) : (
                                                <p className="font-medium" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                    {areaDeportiva.horaInicioArea} - {areaDeportiva.horaFinArea}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Ubicación */}
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-6"
                            >
                                <h3 
                                    className="text-2xl font-semibold pb-3 border-b"
                                    style={{ fontFamily: 'var(--font-Alumni)', color: primaryColor }}
                                >
                                    Ubicación
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                        <MapPin className="w-5 h-5" style={{ color: dangerColor }} />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-Balo)' }}>Zona *</p>
                                            {isEditing ? (
                                                <select
                                                    name="idZona"
                                                    value={formData.idZona}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-1 bg-transparent border-none focus:outline-none focus:ring-0"
                                                    style={{ fontFamily: 'var(--font-Balo)' }}
                                                >
                                                    <option value="">Selecciona una zona</option>
                                                    {zonas.map(zona => (
                                                        <option key={zona.idZona} value={zona.idZona}>
                                                            {zona.nombre} - {zona.macrodistrito?.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <p className="font-medium" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                    {areaDeportiva.zona?.nombre} - {areaDeportiva.zona?.macrodistrito?.nombre}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <>
                                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                                <Globe className="w-5 h-5" style={{ color: primaryColor }} />
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-Balo)' }}>Latitud</p>
                                                    <input
                                                        name="latitud"
                                                        type="number"
                                                        step="any"
                                                        value={formData.latitud}
                                                        onChange={handleChange}
                                                        placeholder="-12.0464"
                                                        className="w-full px-3 py-1 bg-transparent border-none focus:outline-none focus:ring-0"
                                                        style={{ fontFamily: 'var(--font-Balo)' }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                                <Globe className="w-5 h-5" style={{ color: primaryColor }} />
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-Balo)' }}>Longitud</p>
                                                    <input
                                                        name="longitud"
                                                        type="number"
                                                        step="any"
                                                        value={formData.longitud}
                                                        onChange={handleChange}
                                                        placeholder="-77.0428"
                                                        className="w-full px-3 py-1 bg-transparent border-none focus:outline-none focus:ring-0"
                                                        style={{ fontFamily: 'var(--font-Balo)' }}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {!isEditing && areaDeportiva.latitud && areaDeportiva.longitud && (
                                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                            <Globe className="w-5 h-5" style={{ color: primaryColor }} />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-Balo)' }}>Coordenadas</p>
                                                <p className="font-medium text-sm" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                    {areaDeportiva.latitud}, {areaDeportiva.longitud}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Gestión de Imágenes */}
                        {isEditing && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-12 border-t pt-8"
                            >
                                <h3 
                                    className="text-2xl font-semibold mb-6"
                                    style={{ fontFamily: 'var(--font-Alumni)', color: primaryColor }}
                                >
                                    Gestión de Imágenes
                                </h3>

                                {/* Imágenes existentes */}
                                {areaDeportiva.imagenes && areaDeportiva.imagenes.length > 0 && (
                                    <div className="mb-8">
                                        <h4 className="font-medium text-gray-700 mb-4" style={{ fontFamily: 'var(--font-Balo)' }}>
                                            Imágenes Actuales ({areaDeportiva.imagenes.length})
                                            <span className="text-sm text-gray-500 ml-2">
                                                (Haz clic para marcar/desmarcar eliminación)
                                            </span>
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {areaDeportiva.imagenes.map((imagen, index) => {
                                                const estaMarcadaEliminar = imagenesAEliminar.includes(imagen.idImagenRelacion);
                                                return (
                                                    <div 
                                                        key={imagen.idImagenRelacion} 
                                                        className={`relative group rounded-xl overflow-hidden transition-all duration-300 border-2 ${
                                                            estaMarcadaEliminar ? 'border-red-500 opacity-60' : 'border-gray-200 hover:border-gray-400'
                                                        }`}
                                                    >
                                                        <img
                                                            src={`http://localhost:8032${imagen.urlAcceso}`}
                                                            alt={`Imagen ${index + 1}`}
                                                            className="w-full h-24 object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                                                            <button
                                                                onClick={() => handleRemoveExistingImage(imagen.idImagenRelacion)}
                                                                className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-all transform scale-0 group-hover:scale-100"
                                                                title={estaMarcadaEliminar ? "Desmarcar para mantener" : "Marcar para eliminar"}
                                                            >
                                                                {estaMarcadaEliminar ? (
                                                                    <X className="w-3 h-3" />
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
                                        {imagenesAEliminar.length > 0 && (
                                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                                <p className="text-red-700 text-sm flex items-center" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    {imagenesAEliminar.length} imagen(es) marcada(s) para eliminar
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Agregar nuevas imágenes */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-700 mb-4" style={{ fontFamily: 'var(--font-Balo)' }}>
                                        Agregar Nuevas Imágenes
                                    </h4>
                                    <div 
                                        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-all bg-gray-50 cursor-pointer"
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
                                            Arrastra y suelta o haz clic para seleccionar
                                        </p>
                                    </div>
                                </div>

                                {/* Preview de nuevas imágenes */}
                                {nuevasImagenes.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-medium text-gray-700" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Nuevas Imágenes a Agregar ({nuevasImagenes.length})
                                            </h4>
                                            <button
                                                onClick={handleRemoveAllNewImages}
                                                className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center space-x-1"
                                                style={{ fontFamily: 'var(--font-Balo)' }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span>Eliminar todas</span>
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {nuevasImagenes.map((file, index) => (
                                                <div key={index} className="relative group border-2 border-blue-200 rounded-xl overflow-hidden">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Nueva imagen ${index + 1}`}
                                                        className="w-full h-24 object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                                                        <button
                                                            onClick={() => handleRemoveNewImage(index)}
                                                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-all transform scale-0 group-hover:scale-100"
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
                                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                            <p className="text-blue-700 text-sm text-center" style={{ fontFamily: 'var(--font-Balo)' }}>
                                                Se agregarán {nuevasImagenes.length} nueva(s) imagen(es) 
                                                {imagenesAEliminar.length > 0 ? 
                                                    ` y se eliminarán ${imagenesAEliminar.length} imagen(es)` : 
                                                    ' a las existentes'
                                                }
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* Visualización de imágenes cuando no está editando */}
                        {!isEditing && areaDeportiva.imagenes && areaDeportiva.imagenes.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="mt-12 border-t pt-8"
                            >
                                <h3 
                                    className="text-2xl font-semibold mb-6"
                                    style={{ fontFamily: 'var(--font-Alumni)', color: primaryColor }}
                                >
                                    Galería del Área ({areaDeportiva.imagenes.length})
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {areaDeportiva.imagenes.map((imagen, index) => (
                                        <div key={imagen.idImagenRelacion} className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                                            <img
                                                src={`http://localhost:8032${imagen.urlAcceso}`}
                                                alt={`Imagen ${index + 1}`}
                                                className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all"></div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}