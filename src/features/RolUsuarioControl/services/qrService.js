/*

import client from '../../../api/api';
//CAMBIO CLAVE: Generar un Código Único (UUID)
const ENDPOINTS = {
    // GET /api/qr/codigo/{codigo}
    BUSCAR_POR_CODIGO: (codigo) => `/qr/codigo/${codigo}`,
    // POST /api/qr/validar?codigo={codigo} (Opcional, si queremos solo true/false)
    VALIDAR: (codigo) => `/qr/validar?codigo=${codigo}`
};

const qrService = {
    async validarYObtenerDetalles(codigoQr) {
        try {
            // Usamos el de buscar detalle para mostrar INFO al supervisor (quién es, qué reserva, etc)
            const response = await client.get(ENDPOINTS.BUSCAR_POR_CODIGO(codigoQr));
            return response.data;
        } catch (error) {
            console.error("Error validando QR:", error);
            throw error;
        }
    }
};

export default qrService;*/
import client from '../../../api/api';

const ENDPOINTS = {
    // Endpoint para buscar QR por código (Fallback)
    BUSCAR_POR_CODIGO: (codigo) => `/qr/codigo/${codigo}`,
    // Endpoint para verificar el estado real de la reserva
    GET_RESERVA: (id) => `/reservas/${id}`
};

const qrService = {
    async validarYObtenerDetalles(textoEscaneado) {
        try {
            // PASO 1: Intentar leerlo como el JSON que genera tu sistema actual
            // Formato esperado: {"reservaId":1, "nombreReservador":...}
            let datosJSON = null;
            try {
                datosJSON = JSON.parse(textoEscaneado);
            } catch (e) {
                // No es JSON, seguimos flujo normal
                datosJSON = null;
            }

            if (datosJSON && datosJSON.reservaId) {
                console.log("📖 QR JSON Detectado. ID Reserva:", datosJSON.reservaId);

                // PASO 2: Verificar en el backend que la reserva EXISTA y esté CONFIRMADA/PAGADA
                // Esto evita que alguien cree un QR falso con un JSON inventado.
                const responseReserva = await client.get(ENDPOINTS.GET_RESERVA(datosJSON.reservaId));
                const reservaReal = responseReserva.data;

                // PASO 3: Construir un objeto de respuesta compatible con tu UI
                // Calculamos si es válido basado en la reserva real de la BD
                const esValida = (
                    reservaReal.estadoReserva === 'CONFIRMADA' || 
                    reservaReal.estadoReserva === 'PAGADA' // Ajusta según tus estados
                );

                // Simulamos la fecha de expiración para el final del día de la reserva
                const fechaExp = new Date(`${reservaReal.fechaReserva}T23:59:59`);

                return {
                    idQr: 'N/A', // No tenemos ID de tabla QR, no importa
                    codigoQr: 'Reserva #' + reservaReal.idReserva,
                    
                    // El estado depende de la reserva real en BD
                    estado: esValida, 
                    
                    fechaExpiracion: fechaExp.toISOString(),
                    idReserva: reservaReal.idReserva,
                    
                    // Datos extra para mostrar en pantalla si quieres
                    esCliente: true 
                };
            }

            // --- FALLBACK (Si no es JSON) ---
            // Si escaneas un código simple (uuid o texto), lo buscamos en la tabla QR como antes
            console.log("🔎 Buscando código en tabla QR:", textoEscaneado);
            const response = await client.get(ENDPOINTS.BUSCAR_POR_CODIGO(textoEscaneado));
            return response.data;

        } catch (error) {
            console.error("Error validando QR:", error);
            throw error; 
        }
    }
};

export default qrService;