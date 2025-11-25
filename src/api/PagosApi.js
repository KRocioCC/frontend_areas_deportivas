// src/api/PagosApi.js
import api from "./api"; // instancia base de Axios (con baseURL y headers configurados)

const URL_BASE = "/pagos";

// --- LECTURA ---
export const getPagos = async () => {
  const response = await api.get(URL_BASE);
  return response.data;
};

// Obtener pago por ID
export const getPagoById = async (id) => {
  const response = await api.get(`${URL_BASE}/${id}`);
  return response.data;
};

// Obtener pagos por cliente
export const getPagosByCliente = async (idCliente) => {
  const response = await api.get(`${URL_BASE}/cliente/${idCliente}`);
  return response.data;
};

// --- ESCRITURA (Nuevo: Con Comprobante) ---
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
export const confirmarPago = async (id, codigoTransaccion) => {
  const response = await api.post(`${URL_BASE}/${id}/confirmar`, { codigoTransaccion });
  return response.data;
};

export const rechazarPago = async (id, razon) => {
  const response = await api.post(`${URL_BASE}/${id}/rechazar`, { razon });
  return response.data;
};

export const anularPago = async (id, razon) => {
  const response = await api.post(`${URL_BASE}/${id}/anular`, { razon });
  return response.data;
};

// --- REPORTES ---
export const getTotalPorFecha = async (fecha) => {
  const response = await api.get(`${URL_BASE}/reporte/total-por-fecha`, {
    params: { fecha },
  });
  return response.data;
};

export const getTotalPorRango = async (inicio, fin) => {
  const response = await api.get(`${URL_BASE}/reporte/total-por-rango`, {
    params: { inicio, fin },
  });
  return response.data;
};

// --- VALIDACIONES ---
export const validarCodigoTransaccion = async (codigo) => {
  const response = await api.get(`${URL_BASE}/validar-transaccion/${codigo}`);
  return response.data;
};

// --- HEALTH CHECK ---
export const healthCheckPago = async () => {
  const response = await api.get(`${URL_BASE}/health`);
  return response.data;
};
