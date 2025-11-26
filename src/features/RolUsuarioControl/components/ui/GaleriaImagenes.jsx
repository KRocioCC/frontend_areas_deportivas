import React, { useState, useEffect } from 'react';
import imagenService from '../../services/imagenService';
import toast from 'react-hot-toast';
import './GaleriaImagenes.css';

// ⚠️ IMPORTANTE: Ajusta este puerto si tu backend corre en otro (ej: 8080)
// Según tus logs anteriores, es 8032
const API_BASE_URL = 'http://localhost:8032'; 

const GaleriaImagenes = ({ entidadTipo, entidadId, onImageChange }) => {
    const [imagenes, setImagenes] = useState([]);
    const [subiendo, setSubiendo] = useState(false);

    useEffect(() => {
        cargarImagenes();
    }, [entidadTipo, entidadId]);

    const cargarImagenes = async () => {
        if (!entidadId) return;
        try {
            const data = await imagenService.getImagenes(entidadTipo, entidadId);
            const ordenadas = data.sort((a, b) => a.orden - b.orden);
            setImagenes(ordenadas);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setSubiendo(true);
        try {
            await imagenService.subirImagenes(files, entidadTipo, entidadId);
            toast.success('Imágenes subidas correctamente');
            await cargarImagenes();
            if (onImageChange) onImageChange();
        } catch (error) {
            toast.error('Error al subir imágenes');
        } finally {
            setSubiendo(false);
        }
    };

    const handleEliminar = async (idRelacion) => {
        if (!window.confirm('¿Eliminar esta imagen?')) return;
        try {
            await imagenService.eliminarImagen(idRelacion);
            toast.success('Imagen eliminada');
            cargarImagenes();
            if (onImageChange) onImageChange(); // Actualizar portada si se borra
        } catch (error) {
            toast.error('No se pudo eliminar');
        }
    };

    // Función para construir la URL completa
    const getImageUrl = (img) => {
        if (!img) return '';
        // Si la URL ya viene completa (http...), la usamos. Si no, le pegamos el host.
        if (img.urlAcceso && img.urlAcceso.startsWith('http')) {
            return img.urlAcceso;
        }
        return `${API_BASE_URL}${img.urlAcceso}`;
    };

    return (
        <div className="galeria-container">
            <div className="upload-area">
                <input 
                    type="file" 
                    id={`file-upload-${entidadId}`} 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileSelect} 
                    style={{display: 'none'}}
                    disabled={subiendo}
                />
                <label htmlFor={`file-upload-${entidadId}`} className={`btn-upload ${subiendo ? 'disabled' : ''}`}>
                    {subiendo ? (
                        <span><i className="fas fa-spinner fa-spin"></i> Subiendo...</span>
                    ) : (
                        <span><i className="fas fa-cloud-upload-alt"></i> Subir Fotos</span>
                    )}
                </label>
            </div>

            <div className="imagenes-grid">
                {imagenes.length === 0 ? (
                    <div className="no-images">
                        <i className="fas fa-images" style={{fontSize:'2rem', marginBottom:'10px', display:'block'}}></i>
                        No hay imágenes en la galería.
                    </div>
                ) : (
                    imagenes.map((img) => (
                        <div key={img.idImagenRelacion} className="img-card">
                            {/* --- AQUÍ ESTÁ EL ARREGLO --- */}
                            <img 
                                src={getImageUrl(img)} 
                                alt={img.nombreArchivo} 
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/150?text=Error'; // Fallback visual
                                }}
                            />
                            
                            <button 
                                className="btn-delete-img"
                                onClick={() => handleEliminar(img.idImagenRelacion)}
                                title="Eliminar imagen"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GaleriaImagenes;