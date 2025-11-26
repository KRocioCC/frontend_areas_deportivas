import React, { useState, useEffect } from 'react';
import './AreaBackgroundCarousel.css';

// AJUSTA TU PUERTO SI ES NECESARIO
const API_BASE_URL = 'http://localhost:8032';
// IMAGEN POR DEFECTO (Si el área no tiene fotos)
const DEFAULT_BG = '/assets/Fondos/Deporte7.png'; // Asegúrate que esta ruta exista

const AreaBackgroundCarousel = ({ images = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [bgUrl, setBgUrl] = useState(DEFAULT_BG);

    // --- 1. Lógica para construir la URL de la imagen actual ---
    useEffect(() => {
        if (images.length === 0) {
            setBgUrl(DEFAULT_BG);
            return;
        }

        const img = images[currentIndex];
        if (img && img.urlAcceso) {
            const url = img.urlAcceso.startsWith('http') 
                ? img.urlAcceso 
                : `${API_BASE_URL}${img.urlAcceso}`;
            setBgUrl(url);
        } else {
            setBgUrl(DEFAULT_BG);
        }
    }, [currentIndex, images]);

    // --- 2. Auto-play (Cambia cada 6 segundos) ---
    useEffect(() => {
        if (images.length <= 1) return; // No rotar si hay 0 o 1 foto

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 6000);

        return () => clearInterval(interval); // Limpiar intervalo al desmontar
    }, [images.length]);

    // --- 3. Controles Manuales ---
    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    // Si no hay imágenes, solo mostramos el fondo por defecto sin controles
    if (images.length === 0) {
        return (
            <div 
                className="area-bg-carousel"
                style={{ backgroundImage: `url(${DEFAULT_BG})` }}
            >
                <div className="carousel-overlay"></div>
            </div>
        );
    }

    return (
        <div 
            className="area-bg-carousel"
            style={{ backgroundImage: `url(${bgUrl})` }}
        >
            <div className="carousel-overlay"></div>

            {/* Controles (Solo si hay más de 1 foto) */}
            {images.length > 1 && (
                <>
                    <button className="carousel-control left" onClick={goToPrevious}>
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <button className="carousel-control right" onClick={goToNext}>
                        <i className="fas fa-chevron-right"></i>
                    </button>
                    
                    {/* Indicadores (Puntitos) */}
                    <div className="carousel-indicators">
                        {images.map((_, index) => (
                            <span 
                                key={index} 
                                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default AreaBackgroundCarousel;