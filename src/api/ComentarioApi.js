import api from './api'; // Usa la instancia con interceptor

const API_URL = '/comentario'; 

export async function getComentarios() {
  const res = await api.get(API_URL);
  return res.data;
}

export async function getComentarioById(id) {
  const res = await api.get(`${API_URL}/${id}`);
  return res.data;
}

export async function createComentario(payload) {
  const res = await api.post(API_URL, payload);
  return res.data;
}

export async function updateComentario(id, payload) {
  const res = await api.put(`${API_URL}/${id}`, payload);
  return res.data;
}

export async function deleteComentario(id) {
  const res = await api.put(`${API_URL}/${id}/eliminar`);
  return res.data;
}

export async function lockComentario(id) {
  const res = await api.get(`${API_URL}/${id}/lock`);
  return res.data;
}

export async function deleteComentarioFisico(id) {
  const res = await api.delete(`${API_URL}/${id}`);
  return res.data; // Si el backend devuelve texto plano, se puede usar res.data directamente
}

export async function getComentariosPorCancha(canchaId) {
  const res = await api.get(`${API_URL}/cancha/${canchaId}`);
  return res.data;
}
