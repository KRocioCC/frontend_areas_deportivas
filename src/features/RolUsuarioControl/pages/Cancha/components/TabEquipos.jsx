import React, { useState, useEffect } from 'react';
import equipoService from '../../../services/equipoService';
import toast from 'react-hot-toast';
import './TabEquipos.css'; // Estilos abajo

const TabEquipos = ({ canchaId }) => {
    const [equipos, setEquipos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEquipos = async () => {
            if (!canchaId) return;
            setLoading(true);
            try {
                const data = await equipoService.getEquiposPorCancha(canchaId);
                setEquipos(data);
            } catch (error) {
                toast.error("Error cargando inventario");
            } finally {
                setLoading(false);
            }
        };

        fetchEquipos();
    }, [canchaId]);

    if (loading) return <div className="loading-state">Cargando inventario...</div>;

    if (equipos.length === 0) {
        return (
            <div className="empty-state">
                <p>📦 No hay equipamiento registrado para esta cancha.</p>
            </div>
        );
    }

    return (
        <div className="equipos-grid">
            {equipos.map((item) => (
                <div key={item.idEquipamiento} className="equipo-card">
                    <div className="equipo-img-container">
                        {item.urlImagen ? (
                            <img src={item.urlImagen} alt={item.nombreEquipamiento} />
                        ) : (
                            <div className="placeholder-icon">🏀</div>
                        )}
                    </div>
                    <div className="equipo-info">
                        <h4>{item.nombreEquipamiento}</h4>
                        <span className="equipo-tipo">{item.tipoEquipamiento}</span>
                        {item.descripcion && (
                            <p className="equipo-desc">{item.descripcion}</p>
                        )}
                        <div className="equipo-status">
                            <span className={`status-dot ${item.estado ? 'active' : 'inactive'}`}></span>
                            {item.estado ? 'Disponible' : 'No disponible'}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TabEquipos;