import api from './api';

const API_URL = '/macrodistrito';

export async function getMacrodistritos() {
  const res = await api.get(API_URL);
  return res.data;
}

export async function createMacrodistrito(payload) {
  const res = await api.post(API_URL, payload);
  return res.data;
}

export async function updateMacrodistrito(id, payload) {
  const res = await api.put(`${API_URL}/${id}`, payload);
  return res.data;
}

export async function deleteMacrodistrito(id) {
  const res = await api.put(`${API_URL}/${id}/eliminar`);
  return res.data;
}
