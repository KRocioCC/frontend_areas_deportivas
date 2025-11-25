// src/api/PagoApi.js
import api from "./api"; // instancia base de Axios (con baseURL y headers configurados)

const URL_BASE = "/pagos";

// --- LECTURA ---
// Obtener todos los pagos
export const getPagos = async () => {
  const response = await api.get(URL_BASE);
  return response.data;
};

// Obtener todos los pagos (alias de getPagos)
export const getAllPagos = async () => {
  const response = await api.get(URL_BASE);
  return response.data;
};

// Obtener un pago por ID
export const getPagoById = async (id) => {
  const response = await api.get(`${URL_BASE}/${id}`);
  return response.data;
};

// Obtener pagos por cliente
export const getPagosByCliente = async (idCliente) => {
  const response = await api.get(`${URL_BASE}/cliente/${idCliente}`);
  return response.data;
};

// Obtener pagos por estado
export const getPagosByEstado = async (estado) => {
  const response = await api.get(`${URL_BASE}/estado/${estado}`);
  return response.data;
};

// Obtener pagos por método de pago
export const getPagosByMetodo = async (metodoPago) => {
  const response = await api.get(`${URL_BASE}/metodo/${metodoPago}`);
  return response.data;
};

// Obtener pagos por tipo de pago
export const getPagosByTipo = async (tipoPago) => {
  const response = await api.get(`${URL_BASE}/tipo/${tipoPago}`);
  return response.data;
};

// Obtener pagos por fecha
export const getPagosByFecha = async (fecha) => {
  const response = await api.get(`${URL_BASE}/fecha/${fecha}`);
  return response.data;
};

// Obtener pagos por rango de fechas
export const getPagosByRangoFechas = async (inicio, fin) => {
  const response = await api.get(`${URL_BASE}/rango-fechas`, {
    params: { inicio, fin },
  });
  return response.data;
};

// Obtener pago por código de transacción
export const getPagoByCodigoTransaccion = async (codigo) => {
  const response = await api.get(`${URL_BASE}/transaccion/${codigo}`);
  return response.data;
};

// Obtener pagos por reserva
export const getPagosByReserva = async (idReserva) => {
  const response = await api.get(`${URL_BASE}/reserva/${idReserva}`);
  return response.data;
};

// Obtener pagos por reserva y estado
export const getPagosByReservaYEstado = async (idReserva, estado) => {
  const response = await api.get(`${URL_BASE}/reserva/${idReserva}/estado/${estado}`);
  return response.data;
};

// --- ESCRITURA (NUEVO: Con Comprobante) ---
// Registrar un nuevo pago
export const registrarPago = async (pagoData, archivo) => {
  const formData = new FormData();
  formData.append('pago', new Blob([JSON.stringify(pagoData)], { type: 'application/json' }));
  if (archivo) {
    formData.append('comprobante', archivo);
  }

  const response = await api.post(URL_BASE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// --- ACCIONES ADMIN ---
// Confirmar pago
export const confirmarPago = async (id, codigoTransaccion) => {
  const response = await api.post(`${URL_BASE}/${id}/confirmar`, null, {
    params: { codigoTransaccion }
  });
  return response.data;
};

// Rechazar pago
export const rechazarPago = async (id, razon) => {
  const response = await api.post(`${URL_BASE}/${id}/rechazar`, null, {
    params: { razon }
  });
  return response.data;
};

// Anular pago
export const anularPago = async (id, razon) => {
  const response = await api.post(`${URL_BASE}/${id}/anular`, { razon });
  return response.data;
};

// --- REPORTES ---
// Obtener total por fecha
export const getTotalPorFecha = async (fecha) => {
  const response = await api.get(`${URL_BASE}/reporte/total-por-fecha`, {
    params: { fecha },
  });
  return response.data;
};

// Obtener total por rango de fechas
export const getTotalPorRango = async (inicio, fin) => {
  const response = await api.get(`${URL_BASE}/reporte/total-por-rango`, {
    params: { inicio, fin },
  });
  return response.data;
};

// Obtener pagos confirmados en un rango
export const getPagosConfirmadosEnRango = async (inicio, fin) => {
  const response = await api.get(`${URL_BASE}/reporte/pagos-confirmados`, {
    params: { inicio, fin },
  });
  return response.data;
};

// Obtener saldo pendiente de una reserva
export const getSaldoPendienteReserva = async (idReserva) => {
  const response = await api.get(`${URL_BASE}/reserva/${idReserva}/saldo-pendiente`);
  return response.data;
};

// --- VALIDACIONES ---
// Validar código de transacción
export const validarCodigoTransaccion = async (codigo) => {
  const response = await api.get(`${URL_BASE}/validar-transaccion/${codigo}`);
  return response.data;
};

// Validar monto y reserva
export const validarMontoYReserva = async (monto, idReserva) => {
  const response = await api.get(`${URL_BASE}/validar-monto-reserva`, {
    params: { monto, idReserva },
  });
  return response.data;
};

// --- HEALTH CHECK ---
// Verificar el estado del servicio de pagos
export const healthCheckPago = async () => {
  const response = await api.get(`${URL_BASE}/health`);
  return response.data;
};
