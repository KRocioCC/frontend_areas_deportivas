// src/features/RolAdministrador/canchas/CanchaReservasPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as reservaService from '../../../api/ReservaApi';
import * as canchaService from '../../../api/CanchaApi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MapPin, Clock, Users, Star, Calendar, Search, X, ArrowLeft, Download, Trash2, Ban } from 'lucide-react';

const CanchaReservasPage = () => {
    const { idCancha } = useParams();
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ abierto: false, tipo: '', reserva: null });
    const [cancha, setCancha] = useState(null);

    // Buscador: por nombre de cliente y por fecha
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState(''); // formato YYYY-MM-DD

    const abrirModal = (tipo, reserva) => setModal({ abierto: true, tipo, reserva });
    const cerrarModal = () => setModal({ abierto: false, tipo: '', reserva: null });

    // Función para confirmar acciones (eliminar/cancelar)
    const confirmarAccion = async () => {
        if (!modal.reserva) return;
        
        try {
            if (modal.tipo === 'eliminar') {
                // Lógica para eliminar reserva (API export: deleteReserva)
                await reservaService.deleteReserva(modal.reserva.idReserva);
            } else if (modal.tipo === 'cancelar') {
                // Lógica para cancelar reserva
                await reservaService.cancelarReserva(modal.reserva.idReserva);
            }
            
            // Recargar las reservas después de la acción
            const reservasData = await reservaService.getReservasPorCancha(idCancha);
            setReservas(reservasData);
            
            cerrarModal();
        } catch (err) {
            console.error('Error al realizar la acción:', err);
            setError('Ocurrió un error al realizar la acción. Por favor, intenta de nuevo.');
            cerrarModal();
        }
    };

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
    

    // Cargar reservas
    useEffect(() => {
        const fetchReservas = async () => {
            if (!idCancha) {
                navigate('/admin/canchas');
                return;
            }
            
            setLoading(true);
            try {
                const [reservasData, canchaData] = await Promise.all([
                    reservaService.getReservasPorCancha(idCancha),
                    canchaService.getCancha(idCancha).catch(err => {
                        console.warn('No se pudo obtener datos de la cancha:', err);
                        return null;
                    })
                ]);
                console.log('Reservas obtenidas:', reservasData, 'Cancha:', canchaData);
                setReservas(reservasData || []);
                setCancha(canchaData || null);
            } catch (err) {
                console.error('Error al obtener reservas:', err);
                setError('Ocurrió un error al cargar las reservas. Por favor, intenta de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        fetchReservas();
    }, [idCancha, navigate]);

    // Filtrado memoizado por nombre de cliente y por fecha - CORREGIDO
    const reservasFiltradas = useMemo(() => {
        const term = (searchTerm || '').trim().toLowerCase();
        const date = filterDate || '';
        
        console.log('Filtrando con:', { term, date, totalReservas: reservas.length });
        
        return reservas.filter(r => {
            // Filtrar por fecha si se proporcionó
            if (date) {
                try {
                    if (!r.fechaReserva) return false;
                    
                    // Convertir ambas fechas a formato YYYY-MM-DD para comparar
                    const fechaReserva = new Date(r.fechaReserva);
                    const fechaFiltro = new Date(date);
                    
                    // Normalizar a medianoche para comparar solo la fecha
                    const reservaNormalizada = new Date(fechaReserva.getFullYear(), fechaReserva.getMonth(), fechaReserva.getDate());
                    const filtroNormalizada = new Date(fechaFiltro.getFullYear(), fechaFiltro.getMonth(), fechaFiltro.getDate());
                    
                    console.log('Comparando fechas:', {
                        reserva: reservaNormalizada.toISOString(),
                        filtro: filtroNormalizada.toISOString(),
                        iguales: reservaNormalizada.getTime() === filtroNormalizada.getTime()
                    });
                    
                    if (reservaNormalizada.getTime() !== filtroNormalizada.getTime()) {
                        return false;
                    }
                } catch (error) {
                    console.error('Error comparando fechas:', error);
                    return false;
                }
            }

            // Si no hay término de búsqueda, mostrar todas las que pasaron el filtro de fecha
            if (!term) return true;

            // Construir cadena de búsqueda con campos del cliente
            const cliente = r.cliente || {};
            const textoBusqueda = [
                cliente.nombre || '',
                cliente.apellidoPaterno || '',
                cliente.apellidoMaterno || '',
                cliente.email || ''
            ].join(' ').toLowerCase();

            const coincide = textoBusqueda.includes(term);
            console.log('Buscando cliente:', { textoBusqueda, term, coincide });
            
            return coincide;
        });
    }, [reservas, searchTerm, filterDate]);

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
            // Comparar solo fecha (sin tiempo)
            fechaReserva.setHours(0,0,0,0);
            hoy.setHours(0,0,0,0);
            return fechaReserva < hoy;
        } catch (error) {
            return false;
        }
    };

    // Función para limpiar filtros
    const handleClearFilters = () => {
        setSearchTerm('');
        setFilterDate('');
        console.log('Filtros limpiados');
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
                    <h2 className="text-red-600 text-xl font-bold mb-4" style={{fontFamily: "var(--font-Alumni)"}}>Error</h2>
                    <p className="text-gray-700" style={{fontFamily: "var(--font-Balo)"}}>{error}</p>
                    <button
                        onClick={handleVolver}
                        className="mt-6 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-semibold"
                        style={{fontFamily: "var(--font-josefin)"}}
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
                        <h2 className="text-lg font-bold mb-4 text-gray-800" style={{fontFamily: "var(--font-Alumni)"}}>
                            {modal.tipo === 'eliminar' ? '¿Eliminar reserva?' : '¿Cancelar reserva?'}
                        </h2>
                        <p className="mb-6 text-gray-600" style={{fontFamily: "var(--font-Balo)"}}>
                            {modal.tipo === 'eliminar'
                                ? '¿Seguro que deseas eliminar esta reserva? Esta acción no se puede deshacer.'
                                : '¿Seguro que deseas cancelar esta reserva?'}
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 font-semibold"
                                style={{fontFamily: "var(--font-josefin)"}}
                                onClick={cerrarModal}
                            >
                                No
                            </button>
                            <button
                                className={`px-4 py-2 rounded text-white font-semibold ${modal.tipo === 'eliminar' ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-gray-800'}`}
                                style={{fontFamily: "var(--font-josefin)"}}
                                onClick={confirmarAccion}
                            >
                                Sí
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Contenido principal */}
            <div className="min-h-screen bg-gray-100 p-6 max-w-screen-2xl mt-28 mx-auto w-full">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full mx-auto max-w-screen-2xl">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <button
                            onClick={handleVolver}
                            className="flex items-center text-black hover:text-gray-800 font-semibold"
                            style={{fontFamily: "var(--font-josefin)"}}
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Volver a Canchas
                        </button>
                        
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-black mb-2" style={{fontFamily: "var(--font-Oswald)"}}>
                                RESERVAS DE LA CANCHA
                            </h1>
                            <p className="text-2xl mt-2 text-gray-700" style={{fontFamily: "var(--font-Alumni)"}}>
                                {cancha?.nombre ?? 'Nombre no disponible'}
                            </p>
                        </div>
                        
                        <div className="w-20"></div> {/* Espacio para balance */}
                    </div>

                    {/* Buscador - MEJORADO con botón de búsqueda */}
                    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-2 w-full md:w-1/2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar por nombre, apellido o email del cliente..."
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    style={{fontFamily: "var(--font-Balo)"}}
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <Search className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap" style={{fontFamily: "var(--font-Balo)"}}>Filtrar por fecha:</label>
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{fontFamily: "var(--font-Balo)"}}
                            />
                            <button
                                onClick={handleClearFilters}
                                className="ml-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center font-semibold"
                                style={{fontFamily: "var(--font-josefin)"}}
                            >
                                <X className="h-4 w-4 mr-1" />
                                Limpiar
                            </button>
                        </div>
                    </div>

                    {/* Información de filtros activos */}
                    {(searchTerm || filterDate) && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800" style={{fontFamily: "var(--font-Balo)"}}>
                                Reservas encontradas para: 
                                {searchTerm && ` Cliente: "${searchTerm}"`}
                                {filterDate && ` Fecha: ${filterDate}`}
                                {` (Mostrando ${reservasFiltradas.length} de ${reservas.length} reservas)`}
                            </p>
                        </div>
                    )}

                    {/* Estadísticas */}
                    <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                        <h2 className="text-lg font-semibold text-black mb-2" style={{fontFamily: "var(--font-Alumni)"}}>Resumen:</h2>
                        <div className="flex flex-wrap gap-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm" style={{fontFamily: "var(--font-Balo)"}}>
                                <Users className="h-4 w-4 inline mr-1" />
                                Total: {reservasFiltradas.length} reservas
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm" style={{fontFamily: "var(--font-Balo)"}}>
                                <Star className="h-4 w-4 inline mr-1" />
                                Confirmadas: {reservasFiltradas.filter(r => r.estadoReserva === 'CONFIRMADA').length}
                            </span>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm" style={{fontFamily: "var(--font-Balo)"}}>
                                <Clock className="h-4 w-4 inline mr-1" />
                                Pendientes: {reservasFiltradas.filter(r => r.estadoReserva === 'PENDIENTE').length}
                            </span>
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm" style={{fontFamily: "var(--font-Balo)"}}>
                                <Ban className="h-4 w-4 inline mr-1" />
                                Canceladas: {reservasFiltradas.filter(r => r.estadoReserva === 'CANCELADA').length}
                            </span>
                        </div>
                    </div>

                    {/* Lista de reservas */}
                    {reservasFiltradas.length > 0 ? (
                        <div className="space-y-3">
                            {reservasFiltradas.map((reserva, idx) => (
                                <div key={reserva.idReserva} className="p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                    {/* Header de la reserva */}
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="mb-8">
                                            <h2
                                                className="text-xl font-semibold text-black mb-1"
                                                style={{fontFamily: "var(--font-Alumni)", fontSize: '18px'}}
                                            >
                                                Reserva #{idx + 1}
                                            </h2>

                                            <div className="flex items-center text-blue-600 text-sm">
                                                <Clock className="h-4 w-4 mr-1" />
                                                <span className="font-medium" style={{fontFamily: "var(--font-Balo)"}}>{reserva.horaInicio} - {reserva.horaFin}</span>
                                                <span className="mx-1">•</span>
                                                <Calendar className="h-4 w-4 mr-1" />
                                                <span className="text-gray-600 text-xs" style={{fontFamily: "var(--font-Balo)"}}>{formatearFecha(reserva.fechaReserva)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            (reserva.eliminado || reserva.activo === false) ? 'bg-red-100 text-red-800' :
                                            reserva.estadoReserva === 'CONFIRMADA' ? 'bg-green-100 text-green-800' : 
                                            reserva.estadoReserva === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : 
                                            reserva.estadoReserva === 'CANCELADA' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`} style={{fontFamily: "var(--font-Balo)"}}>
                                            {(reserva.eliminado || reserva.activo === false) ? 'DESACTIVADA' : (reserva.estadoReserva || 'Estado desconocido')}
                                        </div>
                                    </div>

                                    {/* Información en grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                                        {/* Información de la Cancha */}
                                        <div>
                                            <h2 className="font-semibold text-gray-800 mb-1" style={{fontFamily: "var(--font-Alumni)", fontSize: '14px'}}>Información de la Cancha</h2>
                                            {reserva.cancha ? (
                                                <div className="bg-gray-50 p-2 rounded-lg">
                                                    <p className="text-sm" style={{fontFamily: "var(--font-Balo)"}}>
                                                        <MapPin className="h-4 w-4 inline mr-1 text-[#41bfb2]" />
                                                        <span className="font-medium">Nombre:</span> {reserva.cancha.nombre}
                                                    </p>
                                                    <p className="text-sm" style={{fontFamily: "var(--font-Balo)"}}>
                                                        <Users className="h-4 w-4 inline mr-1 text-[#41bfb2]" />
                                                        <span className="font-medium">Capacidad:</span> {reserva.cancha.capacidad} personas
                                                    </p>
                                                    <p className="text-sm" style={{fontFamily: "var(--font-Balo)"}}>
                                                        <span className="font-medium">Costo:</span> {reserva.cancha.costoHora || 'N/A'} Bs/hora
                                                    </p>
                                                    <p className="text-sm" style={{fontFamily: "var(--font-Balo)"}}>
                                                        <span className="font-medium">Superficie:</span> {reserva.cancha.tipoSuperficie || 'N/A'}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-sm" style={{fontFamily: "var(--font-Balo)"}}>Información de cancha no disponible</p>
                                            )}
                                        </div>
                                        
                                        {/* Información del Cliente */}
                                        <div>
                                            <h2 className="font-semibold text-gray-800 mb-1" style={{fontFamily: "var(--font-Alumni)", fontSize: '14px'}}>Información del Cliente</h2>
                                            {reserva.cliente ? (
                                                <div className="bg-gray-50 p-2 rounded-lg">
                                                    <p className="text-sm" style={{fontFamily: "var(--font-Balo)"}}>
                                                        <span className="font-medium">Nombre:</span> {reserva.cliente.nombre} {reserva.cliente.apellidoPaterno || ''} {reserva.cliente.apellidoMaterno || ''}
                                                    </p>
                                                    <p className="text-sm" style={{fontFamily: "var(--font-Balo)"}}>
                                                        <span className="font-medium">Email:</span> {reserva.cliente.email || 'No disponible'}
                                                    </p>
                                                    <p className="text-sm" style={{fontFamily: "var(--font-Balo)"}}>
                                                        <span className="font-medium">Teléfono:</span> {reserva.cliente.telefono || 'No disponible'}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-sm" style={{fontFamily: "var(--font-Balo)"}}>Información del cliente no disponible</p>
                                            )}
                                        </div>
                                        
                                        {/* Información de Pago y Detalles */}
                                        <div>
                                            <h2 className="font-semibold text-gray-800 mb-1" style={{fontFamily: "var(--font-Alumni)", fontSize: '14px'}}>Detalles de Pago</h2>
                                            <div className="bg-gray-50 p-2 rounded-lg">
                                                <p className="text-sm" style={{fontFamily: "var(--font-Balo)"}}>
                                                    <span className="font-medium">Total pagado:</span> {reserva.totalPagado || 0} Bs.
                                                </p>
                                                <p className="text-sm" style={{fontFamily: "var(--font-Balo)"}}>
                                                    <span className="font-medium">Saldo pendiente:</span> {reserva.saldoPendiente || 0} Bs.
                                                </p>
                                                <p className="text-sm" style={{fontFamily: "var(--font-Balo)"}}>
                                                    <span className="font-medium">Completamente pagada:</span> 
                                                    <span className={reserva.pagadaCompleta ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                                                        {reserva.pagadaCompleta ? 'Sí' : 'No'}
                                                    </span>
                                                </p>
                                                {reserva.duracionMinutos && (
                                                    <p className="text-sm" style={{fontFamily: "var(--font-Balo)"}}>
                                                        <Clock className="h-4 w-4 inline mr-1 text-[#f28627]" />
                                                        <span className="font-medium">Duración:</span> {reserva.duracionMinutos} minutos
                                                    </p>
                                                )}
                                                
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="mt-6 flex justify-end space-x-2 flex-wrap gap-2">
                                        {/* Botón Eliminar (solo si no está ya desactivada) 
                                        {!(reserva.eliminado || reserva.activo === false) && (
                                            <button
                                                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-colors flex items-center font-semibold"
                                                style={{fontFamily: "var(--font-josefin)"}}
                                                onClick={() => abrirModal('eliminar', reserva)}
                                            >
                                                <Trash2 className="h-5 w-5 mr-2" />
                                                Eliminar
                                            </button>
                                        )}*/}

                                        {/* Botón Cancelar (solo si no es pasada y está confirmada/pendiente) */}
                                        {!esReservaPasada(reserva) && 
                                         reserva.estadoReserva !== 'CANCELADA' && 
                                         !(reserva.eliminado || reserva.activo === false) && (
                                            <button
                                                className="py-2 px-4 bg-black hover:bg-gray-800 text-white rounded-lg shadow-md transition-colors flex items-center font-semibold"
                                                style={{fontFamily: "var(--font-josefin)"}}
                                                onClick={() => abrirModal('cancelar', reserva)}
                                            >
                                                <Ban className="h-5 w-5 mr-2" />
                                                Cancelar
                                            </button>
                                        )}

                                        {/* Botón PDF */}
                                        <button
                                            className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-colors flex items-center font-semibold"
                                            style={{fontFamily: "var(--font-josefin)"}}
                                            onClick={() => generarPDF(reserva)}
                                        >
                                            <Download className="h-5 w-5 mr-2" />
                                            Generar PDF
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <Calendar className="mx-auto h-16 w-16 text-gray-400" />
                            <h2 className="mt-4 text-xl font-semibold text-gray-600" style={{fontFamily: "var(--font-Alumni)"}}>
                                {reservas.length === 0 
                                    ? "No se encontraron reservas para esta cancha" 
                                    : "No hay reservas que coincidan con los filtros aplicados"}
                            </h2>
                            <p className="mt-2 text-gray-500" style={{fontFamily: "var(--font-Balo)"}}>
                                {reservas.length === 0 
                                    ? "Esta cancha no tiene reservas registradas." 
                                    : "Intenta con otros términos de búsqueda o fecha."}
                            </p>
                            
                            <button
                                onClick={handleVolver}
                                className="mt-6 py-2 px-6 bg-black hover:bg-gray-800 text-white rounded-lg shadow-md transition-colors inline-flex items-center font-semibold"
                                style={{fontFamily: "var(--font-josefin)"}}
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Volver a Canchas
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CanchaReservasPage;