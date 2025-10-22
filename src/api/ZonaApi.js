import api from './api';

const API_URL = '/zona';

export async function getZonas() {
  const res = await api.get(API_URL);
  return res.data;
}

export async function createZona(payload) {
  const res = await api.post(API_URL, payload);
  return res.data;
}

export async function updateZona(id, payload) {
  const res = await api.put(`${API_URL}/${id}`, payload);
  return res.data;
}

export async function deleteZona(id) {
  const res = await api.put(`${API_URL}/${id}/eliminar`);
  return res.data;
}
