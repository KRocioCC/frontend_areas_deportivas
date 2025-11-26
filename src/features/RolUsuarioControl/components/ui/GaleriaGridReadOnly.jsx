import React, { useState, useEffect } from 'react';
import imagenService from '../../services/imagenService';
import './GaleriaGridReadOnly.css'; // Estilos abajo

// Ajusta tu puerto
const API_BASE_URL = 'http://localhost:8032';

const GaleriaGridReadOnly = ({ entidadTipo, entidadId }) => {
    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true);
    // Estado para el "Lightbox" (ver foto en grande al hacer click)
    const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

    useEffect(() => {
        const cargarImagenes = async () => {
            if (!entidadId) return;
            try {
                const data = await imagenService.getImagenes(entidadTipo, entidadId);
                
                // Ordenamos: Las más recientes (mayor ID o fecha) primero
                // Asumiendo que idImagen es incremental
                const ordenadas = data.sort((a, b) => b.idImagen - a.idImagen);
                
                setImagenes(ordenadas);
            } catch (error) {
                console.error("Error cargando galería:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarImagenes();
    }, [entidadTipo, entidadId]);

    const getImageUrl = (img) => {
        if (!img || !img.urlAcceso) return '';
        if (img.urlAcceso.startsWith('http')) return img.urlAcceso;
        return `${API_BASE_URL}${img.urlAcceso}`;
    };

    if (loading) return <div className="text-center p-5">Cargando fotos...</div>;

    if (imagenes.length === 0) {
        return (
            <div className="galeria-vacia">
                <i className="fas fa-camera"></i>
                <p>Esta cancha aún no tiene fotos en la galería.</p>
            </div>
        );
    }

    return (
        <>
            <div className="galeria-muro">
                {imagenes.map((img, index) => (
                    <div 
                        key={img.idImagenRelacion} 
                        // La primera imagen (índice 0) tendrá la clase 'destacada' para ser más grande
                        className={`muro-item ${index === 0 ? 'destacada' : ''}`}
                        onClick={() => setImagenSeleccionada(getImageUrl(img))}
                    >
                        <img 
                            src={getImageUrl(img)} 
                            alt={`Foto ${index}`} 
                            loading="lazy"
                        />
                        <div className="muro-overlay">
                            <i className="fas fa-search-plus"></i>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Lightbox (para ver en grande al hacer clic) */}
            {imagenSeleccionada && (
                <div className="lightbox" onClick={() => setImagenSeleccionada(null)}>
                    <span className="lightbox-close">&times;</span>
                    <img src={imagenSeleccionada} alt="Vista completa" />
                </div>
            )}
        </>
    );
};

export default GaleriaGridReadOnly;