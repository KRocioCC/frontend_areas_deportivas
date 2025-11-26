import React, { useState, useEffect } from 'react';
import opinionService from '../../../services/opinionService';
import './TabOpiniones.css';

const TabOpiniones = ({ canchaId }) => {
    const [opiniones, setOpiniones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOpiniones = async () => {
            setLoading(true);
            const data = await opinionService.getOpinionesPorCancha(canchaId);
            setOpiniones(data);
            setLoading(false);
        };
        if (canchaId) fetchOpiniones();
    }, [canchaId]);

    const renderEstrellas = (calificacion) => {
        return [...Array(5)].map((_, index) => (
            <span key={index} style={{ color: index < calificacion ? '#ffc107' : '#e4e5e9' }}>★</span>
        ));
    };

    // Función auxiliar para formatear fecha
    const formatearFecha = (fechaString) => {
        if (!fechaString) return '';
        return new Date(fechaString).toLocaleDateString();
    };

    if (loading) return <div className="p-4 text-center">Cargando opiniones...</div>;

    if (opiniones.length === 0) {
        return (
            <div className="empty-opiniones">
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>💬</div>
                <h3>Aún no hay opiniones</h3>
                <p>Los comentarios de los clientes aparecerán aquí.</p>
            </div>
        );
    }

    return (
        <div className="opiniones-container">
            {opiniones.map((op) => (
                <div key={op.idComentario} className="opinion-card">
                    <div className="opinion-header">
                        {/* Imagen del usuario */}
                       <div className="usuario-avatar">
    {op.persona?.urlImagen ? (
        <>
            <img 
                src={op.persona.urlImagen} 
                alt="avatar" 
                style={{
                    width: '100%', 
                    height: '100%', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    display: 'block' // Aseguramos que se muestre por defecto
                }} 
                // TRUCO: Si falla la carga (por el error file:///), ocultamos la img y mostramos el texto
                onError={(e) => {
                    e.target.style.display = 'none'; // Ocultar imagen rota
                    e.target.nextSibling.style.display = 'flex'; // Mostrar inicial
                }}
            />
            {/* Este span está oculto por defecto, se muestra si falla la imagen */}
            <span style={{display: 'none', width:'100%', height:'100%', alignItems:'center', justifyContent:'center'}}>
                {op.persona.nombre ? op.persona.nombre.charAt(0).toUpperCase() : 'U'}
            </span>
        </>
    ) : (
        // Si no hay URL, mostramos la inicial directamente
        (op.persona?.nombre ? op.persona.nombre.charAt(0).toUpperCase() : 'U')
    )}
</div>
                        
                        <div className="usuario-info">
                            {/* Nombre completo desde el objeto anidado persona */}
                            <h4>
                                {op.persona 
                                    ? `${op.persona.nombre} ${op.persona.apellidoPaterno || ''}` 
                                    : 'Usuario Anónimo'}
                            </h4>
                            <div className="estrellas">{renderEstrellas(op.calificacion)}</div>
                        </div>
                        
                        <span className="fecha">{formatearFecha(op.fecha)}</span>
                    </div>
                    <p className="opinion-texto">"{op.contenido}"</p>
                </div>
            ))}
        </div>
    );
};

export default TabOpiniones;