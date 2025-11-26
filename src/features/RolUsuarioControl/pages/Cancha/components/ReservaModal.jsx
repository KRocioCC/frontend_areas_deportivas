import React, { useState } from 'react';
import reservaService from '../../../services/reservaService';
import toast from 'react-hot-toast';
import './ReservaModal.css'; // Estilos abajo


const ReservaModal = ({ reserva, onClose, onUpdate }) => {
    const [procesando, setProcesando] = useState(false);

    if (!reserva) return null;

    const handleAction = async (actionFn, successMsg, args = []) => {
        if (!window.confirm('¿Estás seguro de realizar esta acción?')) return;
        
        setProcesando(true);
        try {
            await actionFn(reserva.idReserva, ...args);
            toast.success(successMsg);
            onUpdate();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Error al procesar la solicitud");
        } finally {
            setProcesando(false);
        }
    };

    const renderAcciones = () => {
        const estado = reserva.estadoReserva;

        if (estado === 'PENDIENTE' || estado === 'CONFIRMADA') {
            return (
                <>
                    {estado === 'CONFIRMADA' && (
                        <button 
                            className="btn-modal btn-start"
                            onClick={() => handleAction(reservaService.marcarEnCurso, '¡Juego iniciado!')}
                            disabled={procesando}
                        >
                            <i className="fas fa-play"></i> INICIAR JUEGO
                        </button>
                    )}
                    
                    <button 
                        className="btn-modal btn-cancel"
                        onClick={() => {
                            const motivo = prompt("Motivo de cancelación:");
                            if (motivo) handleAction(reservaService.cancelarReserva, 'Reserva cancelada', [motivo]);
                        }}
                        disabled={procesando}
                    >
                        <i className="fas fa-ban"></i> CANCELAR
                    </button>

                    {estado === 'CONFIRMADA' && (
                         <button 
                         className="btn-modal btn-noshow"
                         onClick={() => handleAction(reservaService.marcarNoShow, 'Marcado como No-Show')}
                         disabled={procesando}
                     >
                         <i className="fas fa-user-times"></i> NO SE PRESENTO
                     </button>
                    )}
                </>
            );
        }

        if (estado === 'EN_CURSO') {
            return (
                <button 
                    className="btn-modal btn-complete"
                    onClick={() => handleAction(reservaService.marcarCompletada, 'Reserva finalizada con éxito')}
                    disabled={procesando}
                >
                    <i className="fas fa-flag-checkered"></i> FINALIZAR PARTIDO
                </button>
            );
        }

        return <span className="text-muted" style={{fontStyle:'italic'}}>No hay acciones disponibles.</span>;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Detalle de Reserva #{reserva.idReserva}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="modal-body">
                    <div className="info-grid">
                        <div className="info-group">
                            <label>Cliente</label>
                            <p>{reserva.cliente?.nombre} {reserva.cliente?.apellidoPaterno}</p>
                            <p className="sub-text">{reserva.cliente?.email}</p>
                        </div>
                        <div className="info-group">
                            <label>Horario</label>
                            <p className="highlight">{reserva.horaInicio} - {reserva.horaFin}</p>
                            <p>{reserva.fechaReserva}</p>
                        </div>
                        <div className="info-group">
                            <label>Pago</label>
                            <p>
                                {reserva.pagadaCompleta 
                                    ? <span style={{color:'var(--secondary)'}}><i className="fas fa-check-circle"></i> Pagado</span> 
                                    : <span style={{color:'#f59e0b'}}><i className="fas fa-exclamation-circle"></i> Pendiente ({reserva.saldoPendiente} Bs)</span>
                                }
                            </p>
                        </div>
                        <div className="info-group">
                            <label>Estado Actual</label>
                            <span className={`status-tag ${reserva.estadoReserva.toLowerCase()}`}>
                                {reserva.estadoReserva}
                            </span>
                        </div>
                    </div>
                    
                    {reserva.observaciones && (
                        <div className="observaciones-box">
                            <label><i className="fas fa-comment-alt"></i> Observaciones:</label>
                            <div style={{marginTop:'5px'}}>{reserva.observaciones}</div>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    {renderAcciones()}
                </div>
            </div>
        </div>
    );
};

export default ReservaModal;