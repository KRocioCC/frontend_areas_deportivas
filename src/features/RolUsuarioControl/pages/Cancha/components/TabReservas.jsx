import React, { useState, useEffect, useCallback } from 'react';
import reservaService from '../../../services/reservaService';
import toast from 'react-hot-toast';
import ReservaModal from './ReservaModal'; // <--- IMPORTAR EL MODAL
import './TabReservas.css';

const TabReservas = ({ canchaId }) => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    // Estado para controlar el modal
    const [selectedReserva, setSelectedReserva] = useState(null); 

    const getStatusBadge = (estado) => {
        // ... (tu código existente de badges) ...
        const statusColors = {
            'PENDIENTE': 'badge-warning',
            'CONFIRMADA': 'badge-success',
            'CANCELADA': 'badge-danger',
            'COMPLETADA': 'badge-info',
            'EN_CURSO': 'badge-primary',
            'NO_SHOW': 'badge-secondary'
        };
        return <span className={`badge ${statusColors[estado] || 'badge-secondary'}`}>{estado}</span>;
    };

    const fetchReservas = useCallback(async () => {
        // ... (tu código existente de fetch) ...
        setLoading(true);
        try {
            const data = await reservaService.getReservasPorCancha(canchaId);
            const ordenadas = data.sort((a, b) => new Date(b.fechaReserva) - new Date(a.fechaReserva));
            setReservas(ordenadas);
        } catch (error) {
            toast.error("No se pudieron cargar las reservas");
        } finally {
            setLoading(false);
        }
    }, [canchaId]);

    useEffect(() => {
        if (canchaId) fetchReservas();
    }, [fetchReservas, canchaId]);

    if (loading) return <div className="loading-state">Cargando agenda...</div>;

    if (reservas.length === 0) {
        return (
            <div className="empty-reservas">
                <p>📅 No hay reservas registradas para esta cancha.</p>
            </div>
        );
    }

    return (
        <div className="tab-reservas-container">
            <div className="table-responsive">
                <table className="reservas-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Horario</th>
                            <th>Cliente</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.map((reserva) => (
                            <tr key={reserva.idReserva}>
                                <td>{reserva.fechaReserva}</td>
                                <td className="font-weight-bold">
                                    {reserva.horaInicio} - {reserva.horaFin}
                                </td>
                                <td>
                                    {reserva.cliente ? (
                                        <div className="cliente-info">
                                            <span>{reserva.cliente.nombre} {reserva.cliente.apellidoPaterno}</span>
                                            <small>{reserva.cliente.telefono}</small>
                                        </div>
                                    ) : 'Anónimo'}
                                </td>
                                <td>{getStatusBadge(reserva.estadoReserva)}</td>
                                <td>
                                    {/* BOTÓN QUE ABRE EL MODAL */}
                                    <button 
        className="btn-action"
        onClick={() => setSelectedReserva(reserva)}
    >
        <i className="fas fa-eye" style={{color: 'var(--primary)'}}></i> 
        Ver Detalle
    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Renderizado condicional del Modal */}
            {selectedReserva && (
                <ReservaModal 
                    reserva={selectedReserva}
                    onClose={() => setSelectedReserva(null)}
                    onUpdate={fetchReservas} // Para que la tabla se actualice sola al cambiar estado
                />
            )}
        </div>
    );
};

export default TabReservas;