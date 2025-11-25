// src/api/PagoApi.js
import api from "./api"; // instancia base de Axios (con baseURL y headers configurados)

const URL_BASE = "/pagos";

// --- LECTURA ---
// Función getPagos añadida
export const getPagos = async () => {
  const response = await api.get(URL_BASE);
  return response.data;
};

export const getAllPagos = async () => {
  const response = await api.get(URL_BASE);
  return response.data;
};

export const getPagosByCliente = async (idCliente) => {
  const response = await api.get(`${URL_BASE}/cliente/${idCliente}`);
  return response.data;
};

// --- ESCRITURA (NUEVO: Con Comprobante) ---
export const registrarPago = async (pagoData, archivo) => {
  const formData = new FormData();
  
  // Convertimos el objeto pagoData a un string JSON para enviarlo como "parte"
  // O enviamos campo por campo si tu backend lo prefiere. 
  // Asumiré el estándar de Spring Boot @RequestPart("pago") y @RequestPart("file")
  
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
  const response = await api.post(`${URL_BASE}/${id}/confirmar`, null, {
    params: { codigoTransaccion } 
  });
  return response.data;
};

export const rechazarPago = async (id, razon) => {
  const response = await api.post(`${URL_BASE}/${id}/rechazar`, null, {
    params: { razon }
  });
  return response.data;
};
