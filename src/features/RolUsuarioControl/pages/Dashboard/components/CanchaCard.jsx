import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import imagenService from '../../../services/imagenService'; // Importamos el servicio de imágenes
import './CanchaCard.css';

const API_BASE_URL = 'http://localhost:8032';

const CanchaCard = ({ cancha }) => {
  const navigate = useNavigate();
  const estadoClass = cancha.estado ? 'active' : 'inactive';

  // 1. Generar la imagen de respaldo (Ilustración) por defecto
  const getFallbackImage = (id) => {
      const availableImages = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11]; 
      const index = id % availableImages.length;
      return `/Fondos/Deporte${availableImages[index]}.png`;
  };

  // Estado local para la imagen. Iniciamos con el fallback (ilustración)
  const [imageSrc, setImageSrc] = useState(getFallbackImage(cancha.idCancha));

  // 2. EFECTO: Buscar la imagen real al montar la tarjeta
  useEffect(() => {
    const fetchRealImage = async () => {
        try {
            // Pedimos las imágenes polimórficas para ESTA cancha específica
            const imagenes = await imagenService.getImagenes('CANCHA', cancha.idCancha);
            
            if (imagenes && imagenes.length > 0) {
                // Ordenamos para tomar la última o la primera (según prefieras)
                // Aquí tomamos la que tenga el orden más alto (la última subida) o la primera
                const img = imagenes.sort((a, b) => a.orden - b.orden)[0]; 
                
                if (img && img.urlAcceso) {
                    const urlFinal = img.urlAcceso.startsWith('http') 
                        ? img.urlAcceso 
                        : `${API_BASE_URL}${img.urlAcceso}`;
                    
                    setImageSrc(urlFinal); // ¡Actualizamos a la foto real!
                }
            }
        } catch (error) {
            // Si falla, no hacemos nada, se queda la ilustración
            console.log("Sin foto para cancha", cancha.idCancha);
        }
    };

    fetchRealImage();
  }, [cancha.idCancha]);


  return (
    <div className="cancha-card" onClick={() => navigate(`/control/cancha/${cancha.idCancha}`)}>
      <div className="card-image-container">
        
        <img 
            src={imageSrc} 
            alt={cancha.nombre} 
            className="card-img"
            loading="lazy"
            onError={(e) => { 
                // Si la URL real falla (404), volvemos a la ilustración
                e.target.onerror = null; 
                e.target.src = getFallbackImage(cancha.idCancha); 
            }} 
        />

        <span className={`card-badge ${estadoClass}`}>
          {cancha.estado ? 'DISPONIBLE' : 'MANTENIMIENTO'}
        </span>
      </div>

      <div className="card-body">
        <div className="card-header-flex">
            <h3 className="card-title">{cancha.nombre}</h3>
            <span className="price-tag">{cancha.costoHora} Bs.</span>
        </div>
        
        <div className="specs-grid">
            <div className="spec-item">
                <span className="spec-label">Capacidad</span>
                <span className="spec-value">{cancha.capacidad}</span>
            </div>
            <div className="spec-item">
                <span className="spec-label">Suelo</span>
                <span className="spec-value">{cancha.tipoSuperficie}</span>
            </div>
        </div>

        <button className="card-btn">
          GESTIONAR PANEL
        </button>
      </div>
    </div>
  );
};

export default CanchaCard;