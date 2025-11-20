// src/RolAdministrador/canchas/CanchaReservaPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as reservaService from '../../../api/ReservaApi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const CanchaReservaPage = () => {
    const { idCancha } = useParams();
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ abierto: false, tipo: '', reserva: null });

    const abrirModal = (tipo, reserva) => setModal({ abierto: true, tipo, reserva });
    const cerrarModal = () => setModal({ abierto: false, tipo: '', reserva: null });

    // Confirmar acción (eliminar/cancelar)
    const confirmarAccion = async () => {
        if (!modal.reserva) return;
        
        try {
            if (modal.tipo === 'eliminar') {
                // Usar eliminación lógica en backend (PUT /{id}/eliminar). En UI marcamos la reserva como desactivada
                await reservaService.deleteReserva(modal.reserva.idReserva);
                alert("Reserva desactivada correctamente 🗑️");
                setReservas(prev => prev.map(r =>
                    r.idReserva === modal.reserva.idReserva
                        ? { ...r, eliminado: true, activo: false }
                        : r
                ));
            }
            
            if (modal.tipo === 'cancelar') {
                await reservaService.cancelarReserva(modal.reserva.idReserva, "Cancelado por administrador");
                alert("Reserva cancelada correctamente ✅");
                setReservas(prev => prev.map(r =>
                    r.idReserva === modal.reserva.idReserva
                        ? { ...r, estadoReserva: 'CANCELADA' }
                        : r
                ));
            }
        } catch (error) {
            alert(`Error al ${modal.tipo} la reserva`);
            console.error(`Error al ${modal.tipo} reserva:`, error);
        }
        cerrarModal();
    };

    // Formatear fecha
    const formatearFecha = (fechaStr) => {
        if (!fechaStr) return 'Fecha no disponible';
        const meses = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        
        try {
            // Manejar diferentes formatos de fecha
            let fecha;
            if (typeof fechaStr === 'string') {
                if (fechaStr.includes('T')) {
                    fecha = new Date(fechaStr);
                } else {
                    // Asumir formato YYYY-MM-DD
                    const [anio, mes, dia] = fechaStr.split('-');
                    fecha = new Date(anio, mes - 1, dia);
                }
            } else {
                fecha = new Date(fechaStr);
            }
            
            return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
        } catch (error) {
            console.error('Error formateando fecha:', error);
            return fechaStr;
        }
    };

    // Cargar reservas
    useEffect(() => {
        const fetchReservas = async () => {
            if (!idCancha) {
                navigate('/admin/canchas');
                return;
            }
            
            setLoading(true);
            try {
                const reservasData = await reservaService.getReservasPorCancha(idCancha);
                console.log('Reservas obtenidas:', reservasData);
                setReservas(reservasData);
            } catch (err) {
                console.error('Error al obtener reservas:', err);
                setError('Ocurrió un error al cargar las reservas. Por favor, intenta de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        fetchReservas();
    }, [idCancha, navigate]);

    // Función para generar PDF
    const generarPDF = async (reserva) => {
        try {
            // Crear un elemento temporal para renderizar la información
            const element = document.createElement('div');
            element.style.padding = '20px';
            element.style.fontFamily = 'Arial, sans-serif';
            element.style.width = '700px';
            
            // Estructura HTML para el PDF
            element.innerHTML = `
                <div style="border: 2px solid #1e3a8a; padding: 30px; border-radius: 10px; font-family: Arial, sans-serif; background: white; max-width: 700px; margin: auto;">
                    
                    <!-- Encabezado -->
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #1e3a8a; margin-bottom: 10px;">Comprobante de Reserva</h2>
                        <hr style="border: 1px solid #1e3a8a;">
                        <p style="color: #64748b; font-size: 14px;">Fecha de emisión: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
                    </div>

                    <!-- Detalles de la Reserva -->
                    <div style="margin-bottom: 20px; padding: 15px; background: #f1f5f9; border-radius: 8px;">
                        <h3 style="color: #1e40af; font-size: 18px;">Detalles de la Reserva</h3>
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            <tr><td><strong>ID Reserva:</strong></td><td>${reserva.idReserva}</td></tr>
                            <tr><td><strong>Fecha:</strong></td><td>${formatearFecha(reserva.fechaReserva)}</td></tr>
                            <tr><td><strong>Horario:</strong></td><td>${reserva.horaInicio} - ${reserva.horaFin}</td></tr>
                            <tr><td><strong>Estado:</strong></td><td style="color: ${reserva.estadoReserva === 'CONFIRMADA' ? 'green' : reserva.estadoReserva === 'PENDIENTE' ? 'orange' : 'gray'}">${reserva.estadoReserva || 'Estado desconocido'}</td></tr>
                            ${reserva.observaciones ? `<tr><td><strong>Observaciones:</strong></td><td>${reserva.observaciones}</td></tr>` : ''}
                            ${reserva.duracionMinutos ? `<tr><td><strong>Duración:</strong></td><td>${reserva.duracionMinutos} minutos</td></tr>` : ''}
                        </table>
                    </div>

                    <!-- Información de la Cancha -->
                    ${reserva.cancha ? `
                    <div style="margin-bottom: 20px; padding: 15px; background: #f1f5f9; border-radius: 8px;">
                        <h3 style="color: #1e40af; font-size: 18px;">Información de la Cancha</h3>
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            <tr><td><strong>Nombre:</strong></td><td>${reserva.cancha.nombre}</td></tr>
                            <tr><td><strong>Capacidad:</strong></td><td>${reserva.cancha.capacidad} personas</td></tr>
                            <tr><td><strong>Costo por hora:</strong></td><td>${reserva.cancha.costoHora || 'No disponible'} Bs.</td></tr>
                            <tr><td><strong>Tipo de superficie:</strong></td><td>${reserva.cancha.tipoSuperficie || 'No disponible'}</td></tr>
                        </table>
                    </div>
                    ` : ''}

                    <!-- Información del Cliente -->
                    ${reserva.cliente ? `
                    <div style="margin-bottom: 20px; padding: 15px; background: #f1f5f9; border-radius: 8px;">
                        <h3 style="color: #1e40af; font-size: 18px;">Información del Cliente</h3>
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            <tr><td><strong>Nombre:</strong></td><td>${reserva.cliente.nombre} ${reserva.cliente.apellidoPaterno || ''} ${reserva.cliente.apellidoMaterno || ''}</td></tr>
                            <tr><td><strong>Email:</strong></td><td>${reserva.cliente.email || 'No disponible'}</td></tr>
                            <tr><td><strong>Teléfono:</strong></td><td>${reserva.cliente.telefono || 'No disponible'}</td></tr>
                            ${reserva.cliente.categoria ? `<tr><td><strong>Categoría:</strong></td><td>${reserva.cliente.categoria}</td></tr>` : ''}
                        </table>
                    </div>
                    ` : ''}

                    <!-- Información de Pago -->
                    <div style="margin-bottom: 20px; padding: 15px; background: #f1f5f9; border-radius: 8px;">
                        <h3 style="color: #1e40af; font-size: 18px;">Información de Pago</h3>
                        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                            <tr><td><strong>Total pagado:</strong></td><td>${reserva.totalPagado || 0} Bs.</td></tr>
                            <tr><td><strong>Saldo pendiente:</strong></td><td>${reserva.saldoPendiente || 0} Bs.</td></tr>
                            <tr><td><strong>Pagada completamente:</strong></td><td>${reserva.pagadaCompleta ? 'Sí ✅' : 'No ❌'}</td></tr>
                        </table>
                    </div>

                    <!-- Pie de página -->
                    <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 2px solid #1e3a8a;">
                        <p style="color: #64748b; font-size: 12px;">Este documento es un comprobante de reserva oficial.</p>
                        <p style="color: #64748b; font-size: 12px;">Para cualquier consulta, contacte al administrador del sistema.</p>
                    </div>
                </div>
            `;

            // Añadir a DOM temporalmente para renderizar
            document.body.appendChild(element);
            
            // Convertir a canvas
            const canvas = await html2canvas(element, {
                scale: 1.5,
                useCORS: true,
                logging: false
            });
            
            // Crear PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            
            // Eliminar elemento temporal
            document.body.removeChild(element);
            
            // Descargar PDF
            pdf.save(`Reserva_${reserva.idReserva}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            alert('Hubo un error al generar el PDF. Por favor intente nuevamente.');
        }
    };

    const handleVolver = () => {
        navigate('/admin/canchas_admin');
    };

    // Verificar si la reserva es pasada
    const esReservaPasada = (reserva) => {
        try {
            const fechaReserva = new Date(reserva.fechaReserva);
            const hoy = new Date();
            return fechaReserva < hoy;
        } catch (error) {
            return false;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                    <h2 className="text-red-600 text-xl font-bold mb-4">Error</h2>
                    <p className="text-gray-700">{error}</p>
                    <button
                        onClick={handleVolver}
                        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Volver a Canchas
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Modal de confirmación */}
            {modal.abierto && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">
                            {modal.tipo === 'eliminar' ? '¿Eliminar reserva?' : '¿Cancelar reserva?'}
                        </h2>
                        <p className="mb-6 text-gray-600">
                            {modal.tipo === 'eliminar'
                                ? '¿Seguro que deseas eliminar esta reserva? Esta acción no se puede deshacer.'
                                : '¿Seguro que deseas cancelar esta reserva?'}
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={cerrarModal}
                            >
                                No
                            </button>
                            <button
                                className={`px-4 py-2 rounded text-white ${modal.tipo === 'eliminar' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                                onClick={confirmarAccion}
                            >
                                Sí
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Contenido principal */}
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <button
                            onClick={handleVolver}
                            className="flex items-center text-black hover:text-gray-800"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Volver a Canchas
                        </button>
                        
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-black mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                                Reservas de la Cancha
                            </h1>
                            <p className="text-gray-600" style={{ fontSize: '16px' }}>ID: {idCancha}</p>
                        </div>
                        
                        <div className="w-20"></div> {/* Espacio para balance */}
                    </div>

                    {/* Estadísticas */}
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <h2 className="text-lg font-semibold text-black mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Resumen:</h2>
                        <div className="flex flex-wrap gap-4">
                            <span className="px-3 py-1 bg-blue-100 text-black rounded-full text-sm">
                                Total: {reservas.length} reservas
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                Confirmadas: {reservas.filter(r => r.estadoReserva === 'CONFIRMADA').length}
                            </span>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                Pendientes: {reservas.filter(r => r.estadoReserva === 'PENDIENTE').length}
                            </span>
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                Canceladas: {reservas.filter(r => r.estadoReserva === 'CANCELADA').length}
                            </span>
                        </div>
                    </div>

                    {/* Lista de reservas */}
                    {reservas.length > 0 ? (
                        <div className="space-y-6">
                            {reservas.map(reserva => (
                                <div key={reserva.idReserva} className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    {/* Header de la reserva */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-2xl font-semibold text-black mb-1" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                                                Reserva #{reserva.idReserva}
                                            </h2>
                                            <div className="flex items-center text-yellow-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="font-medium">{reserva.horaInicio} - {reserva.horaFin}</span>
                                                <span className="mx-2">•</span>
                                                <span className="text-gray-600">{formatearFecha(reserva.fechaReserva)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            (reserva.eliminado || reserva.activo === false) ? 'bg-red-100 text-red-800' :
                                            reserva.estadoReserva === 'CONFIRMADA' ? 'bg-green-100 text-green-800' : 
                                            reserva.estadoReserva === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : 
                                            reserva.estadoReserva === 'CANCELADA' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {(reserva.eliminado || reserva.activo === false) ? 'DESACTIVADA' : (reserva.estadoReserva || 'Estado desconocido')}
                                        </div>
                                    </div>

                                    {/* Información en grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                        {/* Información de la Cancha */}
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '16px' }}>Información de la Cancha</h3>
                                            {reserva.cancha ? (
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <p><span className="font-medium">Nombre:</span> {reserva.cancha.nombre}</p>
                                                    <p><span className="font-medium">Capacidad:</span> {reserva.cancha.capacidad} personas</p>
                                                    <p><span className="font-medium">Costo:</span> {reserva.cancha.costoHora || 'N/A'} Bs/hora</p>
                                                    <p><span className="font-medium">Superficie:</span> {reserva.cancha.tipoSuperficie || 'N/A'}</p>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">Información de cancha no disponible</p>
                                            )}
                                        </div>
                                        
                                        {/* Información del Cliente */}
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '16px' }}>Información del Cliente</h3>
                                            {reserva.cliente ? (
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <p><span className="font-medium">Nombre:</span> {reserva.cliente.nombre} {reserva.cliente.apellidoPaterno || ''} {reserva.cliente.apellidoMaterno || ''}</p>
                                                    <p><span className="font-medium">Email:</span> {reserva.cliente.email || 'No disponible'}</p>
                                                    <p><span className="font-medium">Teléfono:</span> {reserva.cliente.telefono || 'No disponible'}</p>
                                                    {reserva.cliente.categoria && (
                                                        <p><span className="font-medium">Categoría:</span> {reserva.cliente.categoria}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">Información del cliente no disponible</p>
                                            )}
                                        </div>
                                        
                                        {/* Información de Pago y Detalles */}
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '16px' }}>Detalles de Pago</h3>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p><span className="font-medium">Total pagado:</span> {reserva.totalPagado || 0} Bs.</p>
                                                <p><span className="font-medium">Saldo pendiente:</span> {reserva.saldoPendiente || 0} Bs.</p>
                                                <p><span className="font-medium">Completamente pagada:</span> 
                                                    <span className={reserva.pagadaCompleta ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                                                        {reserva.pagadaCompleta ? 'Sí ✅' : 'No ❌'}
                                                    </span>
                                                </p>
                                                {reserva.duracionMinutos && (
                                                    <p><span className="font-medium">Duración:</span> {reserva.duracionMinutos} minutos</p>
                                                )}
                                                {reserva.observaciones && (
                                                    <p className="mt-2">
                                                        <span className="font-medium">Observaciones:</span>
                                                        <span className="block mt-1 text-gray-600 text-sm">{reserva.observaciones}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="mt-6 flex justify-end space-x-2 flex-wrap gap-2">
                                        {/* Botón Eliminar (solo si no está ya desactivada) */}
                                        {!(reserva.eliminado || reserva.activo === false) && (
                                          <button
                                              className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-colors flex items-center"
                                              onClick={() => abrirModal('eliminar', reserva)}
                                          >
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                              </svg>
                                              Eliminar
                                          </button>
                                        )}

                                        {/* Botón Cancelar (solo si no es pasada y está confirmada/pendiente) */}
                                        {!esReservaPasada(reserva) && 
                                         reserva.estadoReserva !== 'CANCELADA' && 
                                         !(reserva.eliminado || reserva.activo === false) && (
                                            <button
                                                className="py-2 px-4 bg-[#1E3A8A] hover:bg-[#172554] text-white rounded-lg shadow-md transition-colors flex items-center"
                                                onClick={() => abrirModal('cancelar', reserva)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Cancelar
                                            </button>
                                        )}

                                        {/* Botón PDF */}
                                        <button
                                            className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-colors flex items-center"
                                            onClick={() => generarPDF(reserva)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            Generar PDF
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h2 className="mt-4 text-xl font-semibold text-gray-600">No se encontraron reservas para esta cancha</h2>
                            <p className="mt-2 text-gray-500">Esta cancha no tiene reservas registradas.</p>
                            
                            <button
                                onClick={handleVolver}
                                className="mt-6 py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors inline-flex items-center"
                            >
                                Volver a Canchas
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CanchaReservaPage;