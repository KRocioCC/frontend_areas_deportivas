import React from 'react';
import './ReservaCardCalendar.css';

const ReservaCardCalendar = ({ reserva, onClose }) => {
    
    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return 'Fecha no disponible';
        const meses = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];

        try {
            let fecha;
            if (typeof fechaStr === 'string') {
                if (fechaStr.includes('T')) fecha = new Date(fechaStr);
                else {
                    const [anio, mes, dia] = fechaStr.split('-');
                    fecha = new Date(anio, mes - 1, dia);
                }
            } else fecha = new Date(fechaStr);

            return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
        } catch (err) {
            console.error('Error formateando fecha:', err);
            return fechaStr;
        }
    };

    if (!reserva) return null;

    return (
        <div className="reserva-card-modal-overlay text-gray-800" onClick={onClose}>
            <div className="reserva-card-modal-container" onClick={(e) => e.stopPropagation()}>
                
                {/* Header del Modal */}
                <div className="reserva-modal-header">
                    <h2 className="reserva-modal-title">
                        Detalles de la Reserva
                    </h2>
                    <button className="reserva-close-button" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Información Principal */}
                <div className="reserva-info-section">
                    <div className="reserva-info-row">
                        <div className="reserva-info-item">
                            <span className="reserva-info-label">Fecha:</span>
                            <span className="reserva-info-value">{formatearFecha(reserva.fechaReserva)}</span>
                        </div>
                        <div className="reserva-info-item">
                            <span className="reserva-info-label">Horario:</span>
                            <span className="reserva-info-value reserva-hora">{reserva.horaInicio} - {reserva.horaFin}</span>
                        </div>
                    </div>
                    
                    <div className="reserva-estado-badge">
                        <span className={`reserva-badge ${
                            (reserva.eliminado || reserva.activo === false) ? 'reserva-badge-desactivada' :
                            reserva.estadoReserva === 'CONFIRMADA' ? 'reserva-badge-confirmada' : 
                            reserva.estadoReserva === 'PENDIENTE' ? 'reserva-badge-pendiente' : 
                            reserva.estadoReserva === 'CANCELADA' ? 'reserva-badge-cancelada' :
                            'reserva-badge-default'
                        }`}>
                            {(reserva.eliminado || reserva.activo === false) ? 'DESACTIVADA' : (reserva.estadoReserva || 'Estado desconocido')}
                        </span>
                    </div>
                </div>

                {/* Grid de Información */}
                <div className="reserva-info-grid">
                    
                    {/* Información de la Cancha */}
                    <div className="reserva-info-card">
                        <h3 className="reserva-info-card-title">
                            <svg xmlns="http://www.w3.org/2000/svg" className="reserva-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Información de la Cancha
                        </h3>
                        {reserva.cancha ? (
                            <div className="reserva-info-card-content">
                                <div className="reserva-info-line">
                                    <span className="reserva-label">Nombre:</span>
                                    <span className="reserva-value">{reserva.cancha.nombre}</span>
                                </div>
                                <div className="reserva-info-line">
                                    <span className="reserva-label">Capacidad:</span>
                                    <span className="reserva-value">{reserva.cancha.capacidad} personas</span>
                                </div>
                                <div className="reserva-info-line">
                                    <span className="reserva-label">Costo:</span>
                                    <span className="reserva-value">{reserva.cancha.costoHora || 'N/A'} Bs/hora</span>
                                </div>
                                <div className="reserva-info-line">
                                    <span className="reserva-label">Superficie:</span>
                                    <span className="reserva-value">{reserva.cancha.tipoSuperficie || 'N/A'}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="reserva-no-info">Información de cancha no disponible</p>
                        )}
                    </div>

                    {/* Información del Cliente */}
                    <div className="reserva-info-card">
                        <h3 className="reserva-info-card-title">
                            <svg xmlns="http://www.w3.org/2000/svg" className="reserva-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Información del Cliente
                        </h3>
                        {reserva.cliente ? (
                            <div className="reserva-info-card-content">
                                <div className="reserva-info-line">
                                    <span className="reserva-label">Nombre:</span>
                                    <span className="reserva-value">{reserva.cliente.nombre} {reserva.cliente.apellidoPaterno || ''} {reserva.cliente.apellidoMaterno || ''}</span>
                                </div>
                                <div className="reserva-info-line">
                                    <span className="reserva-label">Email:</span>
                                    <span className="reserva-value">{reserva.cliente.email || 'No disponible'}</span>
                                </div>
                                <div className="reserva-info-line">
                                    <span className="reserva-label">Teléfono:</span>
                                    <span className="reserva-value">{reserva.cliente.telefono || 'No disponible'}</span>
                                </div>
                                {reserva.cliente.categoria && (
                                    <div className="reserva-info-line">
                                        <span className="reserva-label">Categoría:</span>
                                        <span className="reserva-value">{reserva.cliente.categoria}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="reserva-no-info">Información del cliente no disponible</p>
                        )}
                    </div>
                </div>

            
            </div>
        </div>
    );
};

export default ReservaCardCalendar;