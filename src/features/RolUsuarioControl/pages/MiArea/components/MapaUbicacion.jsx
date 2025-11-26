import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corrección para que los iconos de Leaflet se vean bien en React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapaUbicacion = ({ lat, lng, nombre }) => {
    
    // Depuración en consola
    console.log("🗺️ Mapa recibiendo coordenadas:", { lat, lng });

    // Convertir a números para asegurar validez
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    // Validación estricta: Si no son números válidos, mostramos el placeholder
    if (isNaN(latNum) || isNaN(lngNum)) {
        return (
            <div style={{
                height: '250px', 
                background: '#e9ecef', 
                display:'flex', 
                alignItems:'center', 
                justifyContent:'center', 
                borderRadius:'12px',
                color:'#666', 
                flexDirection:'column', 
                border: '2px dashed #ced4da'
            }}>
                <i className="fas fa-map-marker-slash" style={{fontSize:'2rem', marginBottom:'10px', opacity:0.5}}></i>
                <p style={{fontFamily:'var(--font-josefin)', fontWeight:'600'}}>Ubicación no disponible</p>
                <small style={{fontSize:'0.7rem', opacity:0.7}}>Coordenadas: {lat || 'null'} / {lng || 'null'}</small>
            </div>
        );
    }

    const position = [latNum, lngNum];

    return (
        <div style={{ 
            height: '300px', 
            width: '100%', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            border:'1px solid #ddd', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            position: 'relative', 
            zIndex: 5 
        }}>
            <MapContainer 
                center={position} 
                zoom={16} 
                scrollWheelZoom={false} 
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        <div style={{textAlign:'center', fontFamily:'sans-serif'}}>
                            <b style={{color:'#D92332'}}>{nombre || 'Ubicación'}</b> 
                            <br /> 
                            Complejo Deportivo
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default MapaUbicacion;