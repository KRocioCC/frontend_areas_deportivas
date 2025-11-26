import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useControlContext } from '../../context/ControlProvider';
import qrService from '../../services/qrService';
import toast from 'react-hot-toast';
import './EscanerPage.css';

const EscanerPage = () => {
    const navigate = useNavigate();
    const { canchas, loading } = useControlContext();
    
    const [resultado, setResultado] = useState(null);
    const [procesando, setProcesando] = useState(false);
    const [pausado, setPausado] = useState(false);
    
    // Estado para manejar errores de la cámara (permisos denegados, etc.)
    const [errorCamara, setErrorCamara] = useState(null);

    // 1. Validación de Seguridad: Si no tiene canchas, no puede escanear
    if (loading) return <div className="p-5 text-center" style={{color:'white'}}>Cargando...</div>;

    if (!canchas || canchas.length === 0) {
        return (
            <div className="scanner-container" style={{background: '#f4f6f8'}}>
                <div className="access-denied">
                    <div style={{fontSize:'4rem'}}>🚫</div>
                    <h2>Función No Disponible</h2>
                    <p>No tienes ninguna cancha asignada actualmente.</p>
                    <button className="btn-back-home" onClick={() => navigate('/control/dashboard')}>
                        Volver al Panel
                    </button>
                </div>
            </div>
        );
    }

    // 2. Lógica de Escaneo
    const handleScan = async (text) => {
        if (text && !procesando && !pausado) {
            setProcesando(true);
            setPausado(true);
            
            try {
                const data = await qrService.validarYObtenerDetalles(text);
                
                // Si no hay data es un código inválido
                if(!data) throw new Error("Código vacío");

                // Validación de fecha
                const fechaExp = new Date(data.fechaExpiracion);
                const esVigente = fechaExp > new Date();
                // El estado del QR (que viene de la reserva) debe ser true/válido
                const esValido = data.estado && esVigente;
                
                setResultado({
                    valido: esValido,
                    data: data,
                    mensaje: esValido ? 'ACCESO AUTORIZADO' : 'QR CADUCADO / INACTIVO'
                });
                
                if (esValido) {
                    if (navigator.vibrate) navigator.vibrate(200);
                    toast.success("¡QR Válido!");
                } else {
                    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                    toast.error("QR Inválido");
                }

            } catch (error) {
                console.error(error);
                setResultado({
                    valido: false,
                    data: null,
                    mensaje: 'CÓDIGO NO RECONOCIDO'
                });
                toast.error("No se encuentra en el sistema");
            } finally {
                setProcesando(false);
            }
        }
    };

    const reiniciarScanner = () => {
        setResultado(null);
        setPausado(false);
    };

    // Formato fecha corto
    const formatDate = (dateStr) => {
        if (!dateStr) return '--/--';
        return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="scanner-container">
            
            {/* BOTÓN SALIR */}
            <button 
                className="btn-close-scanner" 
                onClick={() => navigate('/control/dashboard')}
                title="Cerrar Escáner"
            >
                <i className="fas fa-times"></i>
            </button>

            <div className="scanner-header">
                <h1>Validación de Ingreso</h1>
                <p>Apunta la cámara al código QR</p>
            </div>

            {/* VISOR + RESULTADO */}
            <div className={`scanner-viewport ${resultado ? 'has-result' : ''}`}>
                
                {/* MANEJO DE ERROR DE CÁMARA (Evita pantalla roja) */}
                {errorCamara ? (
                    <div className="camera-error-msg" style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', 
                        justifyContent: 'center', height: '100%', color: '#ff6b6b', textAlign: 'center', padding: '2rem'
                    }}>
                        <i className="fas fa-video-slash" style={{fontSize:'3rem', marginBottom:'1rem'}}></i>
                        <h3>Cámara Bloqueada</h3>
                        <p style={{fontSize: '0.9rem', marginTop: '10px'}}>
                           {errorCamara}
                        </p>
                        <button className="btn-scan-again" onClick={() => window.location.reload()} style={{marginTop:'20px'}}>
                            Recargar Página
                        </button>
                    </div>
                ) : !resultado ? (
                    <Scanner 
                        onScan={(result) => {
                            if (result && result[0] && result[0].rawValue) {
                                handleScan(result[0].rawValue);
                            }
                        }}
                        // CAPTURA DE ERRORES PARA EVITAR CRASH
                        onError={(error) => {
                            console.log("Error capturado del scanner:", error);
                            const errString = error?.toString() || "";
                            
                            if (errString.includes("Permission") || errString.includes("dismissed") || errString.includes("denied")) {
                                setErrorCamara("No se otorgaron permisos de cámara o se cerró la solicitud.");
                            } else {
                                // Otros errores no bloqueantes, solo logueamos
                                console.warn("Error menor de cámara:", error);
                            }
                        }}
                        scanDelay={500}
                        allowMultiple={false}
                        components={{ audio: false, onOff: false, torch: true }}
                        styles={{ container: { width: '100%', height: '100%' }, video: { objectFit: 'cover' } }}
                    />
                ) : (
                    // --- TARJETA DE RESULTADO ---
                    <div className={`result-card ${resultado.valido ? 'valid' : 'invalid'}`}>
                        
                        {/* LOGO Q-JUEGO SUPERVISOR */}
                        <div className="result-brand">
                             <span className="result-brand-title">Q-JUEGO</span> 
                             <div className="result-brand-subtitle-box">
                                <span className="result-brand-subtitle">SUPERVISOR</span>
                             </div>
                        </div>

                        <div className="result-icon">
                            {resultado.valido ? (
                                <i className="fas fa-check-circle"></i>
                            ) : (
                                <i className="fas fa-times-circle"></i>
                            )}
                        </div>
                        
                        <h2 className="result-title">{resultado.mensaje}</h2>
                        
                        {resultado.data && (
                            <div className="result-details-box">
                                <div className="detail-row">
                                    <span className="detail-label"><i className="fas fa-ticket-alt"></i> Reserva</span>
                                    <span className="detail-value">#{resultado.data.idReserva}</span>
                                </div>

                                {(resultado.data.nombreReservador || resultado.data.nombreParticipante) && (
                                    <div className="detail-row">
                                        <span className="detail-label"><i className="fas fa-user"></i> Cliente</span>
                                        <span className="detail-value cliente-value">
                                            {resultado.data.nombreReservador || resultado.data.nombreParticipante}
                                        </span>
                                    </div>
                                )}

                                {resultado.data.montoTotal !== undefined && (
                                    <div className="detail-row">
                                        <span className="detail-label"><i className="fas fa-coins"></i> Monto</span>
                                        <span className="detail-value">{resultado.data.montoTotal} BOB</span>
                                    </div>
                                )}
                                
                                <div className="detail-row">
                                    <span className="detail-label"><i className="fas fa-clock"></i> Vence</span>
                                    <span className="detail-value">{formatDate(resultado.data.fechaExpiracion)}</span>
                                </div>
                            </div>
                        )}

                        <button className="btn-scan-again" onClick={reiniciarScanner}>
                            Escanear Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EscanerPage;