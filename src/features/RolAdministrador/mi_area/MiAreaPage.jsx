import React, { useState, useEffect } from 'react';
import { 
    getAreadeportivaPorAdminId, 
    updateAreadeportiva,
    agregarImagenesAreadeportiva,
    eliminarImagenAreadeportiva
} from '../../../api/AreadeportivaApi';
import { useAuth } from '../../../auth/hooks/useAuth';
import { getZonas } from '../../../api/ZonaApi';

export default function MiAreaPage() {
    const { currentUser } = useAuth();
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
            // Aseguramos que 'estado' se incluya y no sea null para pasar la validación del backend
            const areaData = {
                ...formData,
                estado: typeof formData.estado !== 'undefined' ? formData.estado : (areaDeportiva?.estado ?? true)
            };

            console.log("Actualizando área deportiva con datos:", areaData);
            await updateAreadeportiva(areaDeportiva.idAreadeportiva, areaData);
            
            // Eliminar imágenes marcadas para eliminar
            if (imagenesAEliminar.length > 0) {
                for (const imagenId of imagenesAEliminar) {
                    await eliminarImagenAreadeportiva(areaDeportiva.idAreadeportiva, imagenId);
                }
            }
            
            // Agregar nuevas imágenes
            if (nuevasImagenes.length > 0) {
                await agregarImagenesAreadeportiva(areaDeportiva.idAreadeportiva, nuevasImagenes);
            }
            
            // Recargar datos actualizados
            const areaRecargada = await getAreadeportivaPorAdminId(currentUser.idPersona);
            setAreaDeportiva(areaRecargada);
            
            setIsEditing(false);
            setNuevasImagenes([]);
            setImagenesAEliminar([]);
            alert('Área deportiva actualizada exitosamente');
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

    // Funciones para manejo de imágenes en edición
    const handleRemoveExistingImage = (imagenId) => {
        if (imagenesAEliminar.includes(imagenId)) {
            // Si ya está marcada, la quitamos de la lista de eliminación
            setImagenesAEliminar(prev => prev.filter(id => id !== imagenId));
        } else {
            // Si no está marcada, la agregamos a la lista de eliminación
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
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando información del área deportiva...</p>
                </div>
            </div>
        );
    }

    if (!areaDeportiva) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🏟️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        No se encontró área deportiva
                    </h2>
                    <p className="text-gray-600">
                        Contacta al administrador del sistema.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 w-full">            
<div className="max-w-8xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Mi Área Deportiva</h1>
                        <p className="text-gray-600 mt-2">
                            Gestiona la información de tu área deportiva
                        </p>
                    </div>
                    
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center space-x-2"
                        >
                            <i className="fas fa-edit"></i>
                            <span>Editar Área</span>
                        </button>
                    )}
                </div>

                {/* Tarjeta del Área Deportiva */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header con imagen - Carrusel */}
                    <div className="h-[500px] bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
                        {areaDeportiva.imagenes && areaDeportiva.imagenes.length > 0 ? (
                            <>
                                {/* Imagen principal */}
                                <img
                                    src={`http://localhost:8032${areaDeportiva.imagenes[currentImageIndex].urlAcceso}`}
                                    alt={areaDeportiva.nombreArea}
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                />
                                
                                {/* Flecha izquierda */}
                                {areaDeportiva.imagenes.length > 1 && (
                                    <button
                                        onClick={handlePrevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
                                    >
                                        <i className="fas fa-chevron-left text-lg"></i>
                                    </button>
                                )}
                                
                                {/* Flecha derecha */}
                                {areaDeportiva.imagenes.length > 1 && (
                                    <button
                                        onClick={handleNextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110"
                                    >
                                        <i className="fas fa-chevron-right text-lg"></i>
                                    </button>
                                )}
                                
                                {/* Indicadores de posición (puntos) */}
                                {areaDeportiva.imagenes.length > 1 && (
                                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
                                        {areaDeportiva.imagenes.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                                    index === currentImageIndex 
                                                        ? 'bg-white shadow-lg' 
                                                        : 'bg-white/50 hover:bg-white/70'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                                
                                {/* Contador de imágenes */}
                                <div className="absolute top-6 left-6 bg-black/70 text-white px-3 py-2 rounded-full text-sm font-medium">
                                    {currentImageIndex + 1} / {areaDeportiva.imagenes.length}
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                                <div className="text-center">
                                    <div className="text-7xl mb-4">🏟️</div>
                                    <p className="text-xl font-semibold">Sin imágenes</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Badge de estado */}
                        <div className="absolute top-6 right-6">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                                areaDeportiva.estado 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {areaDeportiva.estado ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>
                    </div>

                    {/* Contenido - EDITABLE DIRECTAMENTE */}
                    <div className="p-6">
                        {/* Botones de acción cuando está editando */}
                        {isEditing && (
                            <div className="flex justify-end space-x-3 mb-6">
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSaveChanges}
                                    disabled={loading}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium flex items-center space-x-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <i className="fas fa-save"></i>
                                            <span>Guardar</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Información de contacto */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                    Información de Contacto
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre del Área *
                                        </label>
                                        {isEditing ? (
                                            <input
                                                name="nombreArea"
                                                value={formData.nombreArea}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="font-medium text-lg">{areaDeportiva.nombreArea}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Descripción
                                        </label>
                                        {isEditing ? (
                                            <textarea
                                                name="descripcionArea"
                                                value={formData.descripcionArea}
                                                onChange={handleChange}
                                                rows="3"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <p className="text-gray-700">{areaDeportiva.descripcionArea}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <i className="fas fa-envelope text-blue-600 w-5"></i>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Email *</p>
                                            {isEditing ? (
                                                <input
                                                    name="emailArea"
                                                    type="email"
                                                    value={formData.emailArea}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                            ) : (
                                                <p className="font-medium">{areaDeportiva.emailArea}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <i className="fas fa-phone text-blue-600 w-5"></i>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Teléfono *</p>
                                            {isEditing ? (
                                                <input
                                                    name="telefonoArea"
                                                    value={formData.telefonoArea}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                />
                                            ) : (
                                                <p className="font-medium">{areaDeportiva.telefonoArea}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <i className="fas fa-clock text-blue-600 w-5"></i>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Horario</p>
                                            {isEditing ? (
                                                <div className="flex space-x-2">
                                                    <input
                                                        name="horaInicioArea"
                                                        type="time"
                                                        value={formData.horaInicioArea}
                                                        onChange={handleChange}
                                                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                    />
                                                    <span className="self-center">-</span>
                                                    <input
                                                        name="horaFinArea"
                                                        type="time"
                                                        value={formData.horaFinArea}
                                                        onChange={handleChange}
                                                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                    />
                                                </div>
                                            ) : (
                                                <p className="font-medium">
                                                    {areaDeportiva.horaInicioArea} - {areaDeportiva.horaFinArea}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ubicación */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                    Ubicación
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <i className="fas fa-map-marker-alt text-red-600 w-5"></i>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Zona *</p>
                                            {isEditing ? (
                                                <select
                                                    name="idZona"
                                                    value={formData.idZona}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                >
                                                    <option value="">Selecciona una zona</option>
                                                    {zonas.map(zona => (
                                                        <option key={zona.idZona} value={zona.idZona}>
                                                            {zona.nombre} - {zona.macrodistrito?.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <p className="font-medium">
                                                    {areaDeportiva.zona?.nombre} - {areaDeportiva.zona?.macrodistrito?.nombre}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <>
                                            <div className="flex items-center space-x-3">
                                                <i className="fas fa-globe text-green-600 w-5"></i>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-500">Latitud</p>
                                                    <input
                                                        name="latitud"
                                                        type="number"
                                                        step="any"
                                                        value={formData.latitud}
                                                        onChange={handleChange}
                                                        placeholder="-12.0464"
                                                        className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <i className="fas fa-globe text-green-600 w-5"></i>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-500">Longitud</p>
                                                    <input
                                                        name="longitud"
                                                        type="number"
                                                        step="any"
                                                        value={formData.longitud}
                                                        onChange={handleChange}
                                                        placeholder="-77.0428"
                                                        className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {!isEditing && areaDeportiva.latitud && areaDeportiva.longitud && (
                                        <div className="flex items-center space-x-3">
                                            <i className="fas fa-globe text-green-600 w-5"></i>
                                            <div>
                                                <p className="text-sm text-gray-500">Coordenadas</p>
                                                <p className="font-medium text-sm">
                                                    {areaDeportiva.latitud}, {areaDeportiva.longitud}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Gestión de Imágenes en Edición - QUITAR EXISTENTES Y AGREGAR NUEVAS */}
                        {isEditing && (
                            <div className="mt-8 border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Gestión de Imágenes
                                </h3>

                                {/* Imágenes existentes - CON OPCIÓN DE ELIMINAR */}
                                {areaDeportiva.imagenes && areaDeportiva.imagenes.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="font-medium text-gray-700 mb-3">
                                            Imágenes Actuales ({areaDeportiva.imagenes.length})
                                            <span className="text-sm text-gray-500 ml-2">
                                                (Haz clic en el ícono para marcar/desmarcar para eliminar)
                                            </span>
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {areaDeportiva.imagenes.map((imagen, index) => {
                                                const estaMarcadaEliminar = imagenesAEliminar.includes(imagen.idImagenRelacion);
                                                return (
                                                    <div key={imagen.idImagenRelacion} className={`relative group border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                                                        estaMarcadaEliminar ? 'border-red-500 opacity-60' : 'border-gray-200 hover:border-gray-400'
                                                    }`}>
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
                                                                    <i className="fas fa-undo text-sm"></i>
                                                                ) : (
                                                                    <i className="fas fa-trash text-sm"></i>
                                                                )}
                                                            </button>
                                                        </div>
                                                        <div className={`absolute bottom-0 left-0 right-0 text-white text-xs p-1 text-center ${
                                                            estaMarcadaEliminar ? 'bg-red-600' : 'bg-black/70'
                                                        }`}>
                                                            {estaMarcadaEliminar ? 'ELIMINAR ✓' : 'Imagen ' + (index + 1)}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {imagenesAEliminar.length > 0 && (
                                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-red-700 text-sm">
                                                    <i className="fas fa-exclamation-triangle mr-2"></i>
                                                    {imagenesAEliminar.length} imagen(es) marcada(s) para eliminar
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Agregar nuevas imágenes */}
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-3">
                                        Agregar Nuevas Imágenes
                                    </h4>
                                    <div 
                                        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-all bg-gray-50"
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                    >
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleAddImagesInEdit}
                                            className="hidden"
                                            id="file-upload-edit"
                                        />
                                        <label
                                            htmlFor="file-upload-edit"
                                            className="cursor-pointer block"
                                        >
                                            <div className="text-2xl mb-2">📁</div>
                                            <span className="text-blue-600 font-medium">
                                                Haz clic para agregar nuevas imágenes
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Puedes seleccionar múltiples imágenes
                                            </p>
                                        </label>
                                    </div>
                                </div>

                                {/* Preview de nuevas imágenes */}
                                {nuevasImagenes.length > 0 && (
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-medium text-gray-700">
                                                Nuevas Imágenes a Agregar ({nuevasImagenes.length})
                                            </h4>
                                            <button
                                                onClick={handleRemoveAllNewImages}
                                                className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center space-x-1"
                                            >
                                                <i className="fas fa-times"></i>
                                                <span>Eliminar todas</span>
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {nuevasImagenes.map((file, index) => (
                                                <div key={index} className="relative group border border-blue-200 rounded-lg overflow-hidden">
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
                                                    <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs p-1 text-center">
                                                        {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-blue-700 text-sm text-center">
                                                Se agregarán {nuevasImagenes.length} nueva(s) imagen(es) 
                                                {imagenesAEliminar.length > 0 ? 
                                                    ` y se eliminarán ${imagenesAEliminar.length} imagen(es)` : 
                                                    ' a las existentes'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Visualización de imágenes cuando no está editando */}
                        {!isEditing && areaDeportiva.imagenes && areaDeportiva.imagenes.length > 0 && (
                            <div className="mt-8 border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Imágenes del Área ({areaDeportiva.imagenes.length})
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {areaDeportiva.imagenes.map((imagen, index) => (
                                        <div key={imagen.idImagenRelacion} className="relative group">
                                            <img
                                                src={`http://localhost:8032${imagen.urlAcceso}`}
                                                alt={`Imagen ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}