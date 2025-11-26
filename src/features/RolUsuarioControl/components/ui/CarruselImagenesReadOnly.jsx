import React, { useState, useEffect } from 'react';
import imagenService from '../../services/imagenService';
import './CarruselImagenesReadOnly.css';

// Ajusta el puerto si tu backend es diferente (ej: 8080, 8032)
const API_BASE_URL = 'http://localhost:8032';

const CarruselImagenesReadOnly = ({ entidadTipo, entidadId }) => {
    const [imagenes, setImagenes] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarImagenes = async () => {
            if (!entidadId) return;
            try {
                const data = await imagenService.getImagenes(entidadTipo, entidadId);
                // Ordenamos por 'orden' ascendente para el carrusel
                const ordenadas = data.sort((a, b) => a.orden - b.orden);
                setImagenes(ordenadas);
            } catch (error) {
                console.error("Error cargando imágenes:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarImagenes();
    }, [entidadTipo, entidadId]);

    // Función para construir la URL completa
    const getImageUrl = (img) => {
        if (!img || !img.urlAcceso) return '';
        if (img.urlAcceso.startsWith('http')) {
            return img.urlAcceso;
        }
        return `${API_BASE_URL}${img.urlAcceso}`;
    };

    // Navegación del carrusel
    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? imagenes.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === currentIndex.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    if (loading) return <div className="text-center p-3">Cargando galería...</div>;

    if (imagenes.length === 0) {
        return (
            <div className="carrusel-empty">
                <i className="fas fa-images fa-3x"></i>
                <p>No hay imágenes disponibles en esta galería.</p>
            </div>
        );
    }

    return (
        <div className="carrusel-read-only">
            <div className="carrusel-wrapper">
                
                {/* Flecha Izquierda (solo si hay más de 1 imagen) */}
                {imagenes.length > 1 && (
                    <button onClick={goToPrevious} className="carrusel-arrow left-arrow">
                        <i className="fas fa-chevron-left"></i>
                    </button>
                )}

                {/* Imagen Central */}
                <div className="carrusel-slide">
                    <img 
                        src={getImageUrl(imagenes[currentIndex])} 
                        alt={`Imagen ${currentIndex + 1}`}
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'https://via.placeholder.com/800x400?text=Error+Cargando+Imagen';
                        }}
                    />
                     <div className="carrusel-counter">
                        {currentIndex + 1} / {imagenes.length}
                    </div>
                </div>

                 {/* Flecha Derecha (solo si hay más de 1 imagen) */}
                 {imagenes.length > 1 && (
                    <button onClick={goToNext} className="carrusel-arrow right-arrow">
                        <i className="fas fa-chevron-right"></i>
                    </button>
                )}
            </div>
        </div>
    );
};

export default CarruselImagenesReadOnly;