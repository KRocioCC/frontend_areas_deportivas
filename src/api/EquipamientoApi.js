import api from './api'; // Usa la instancia con interceptor

const API_URL = '/equipamientos'; 

export async function getEquipamientos() {
  const res = await api.get(API_URL);
  return res.data;
}

export async function createEquipamiento(payload) {
  const res = await api.post(API_URL, payload);
  return res.data;
}

export async function updateEquipamiento(id, payload) {
  const res = await api.put(`${API_URL}/${id}`, payload);
  return res.data;
}

export async function deleteEquipamiento(id) {
  const res = await api.put(`${API_URL}/${id}/eliminar`);
  return res.data;
}
