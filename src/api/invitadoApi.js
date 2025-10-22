import api from './api';

const API_URL = '/invitados';

export async function getInvitados() {
  const res = await api.get(API_URL);
  return res.data;
}

export async function getInvitadoById(id) {
  const res = await api.get(`${API_URL}/${id}`);
  return res.data;
}

export async function searchInvitados(nombre) {
  const res = await api.get(`${API_URL}/buscar/${encodeURIComponent(nombre)}`);
  return res.data;
}

export async function createInvitado(payload) {
  const res = await api.post(API_URL, payload);
  return res.data;
}

export async function updateInvitado(id, payload) {
  const res = await api.put(`${API_URL}/${id}`, payload);
  return res.data;
}

export async function deleteInvitado(id) {
  const res = await api.delete(`${API_URL}/${id}`);
  return res.data;
}
