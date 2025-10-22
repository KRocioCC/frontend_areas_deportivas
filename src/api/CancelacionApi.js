import api from './api';

const API_URL = '/cancelacion';

export async function getCancelaciones() {
  const res = await api.get(API_URL);
  return res.data;
}

export async function getCancelacionById(id) {
  const res = await api.get(`${API_URL}/${id}`);
  return res.data;
}

export async function createCancelacion(payload) {
  const res = await api.post(API_URL, payload);
  return res.data;
}

export async function updateCancelacion(id, payload) {
  const res = await api.put(`${API_URL}/${id}`, payload);
  return res.data;
}

export async function deleteCancelacion(id) {
  const res = await api.put(`${API_URL}/${id}/eliminar`);
  return res.data;
}

export async function lockCancelacion(id) {
  const res = await api.get(`${API_URL}/${id}/lock`);
  return res.data;
}

export async function deleteCancelacionFisica(id) {
  const res = await api.delete(`${API_URL}/${id}`);
  return res.data;
}
