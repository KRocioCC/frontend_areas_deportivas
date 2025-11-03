import api from './api'; 

const API_URL = '/cancha'; 

//  Obtener todas las canchas
export async function getCanchas() {
  const res = await api.get(API_URL);
  return res.data;
}

//  Obtener una cancha por ID
export async function getCancha(id) {
  const res = await api.get(`${API_URL}/${id}`);
  return res.data;
}

// rear una nueva cancha
export async function createCancha(payload) {
  const res = await api.post(API_URL, payload);
  return res.data;
}

//  Actualizar una cancha existente
export async function updateCancha(id, payload) {
  const res = await api.put(`${API_URL}/${id}`, payload);
  return res.data;
}

// Desactivar (eliminar lógica) una cancha
export async function deleteCancha(id) {
  const res = await api.put(`${API_URL}/${id}/eliminar`);
  return res.data;
}

// Obtener canchas por área deportiva
export async function getCanchasPorArea(idArea) {
  const res = await api.get(`${API_URL}/area/${idArea}`);
  return res.data;
}
