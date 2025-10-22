import api from './api'; //

const API_URL = '/areasdeportivas'; // 

// Obtener todas las áreas deportivas
export async function getAreadeportiva() {
  const res = await api.get(API_URL);
  return res.data;
}

// Crear una nueva área deportiva
export async function createAreadeportiva(payload) {
  const res = await api.post(API_URL, payload);
  return res.data;
}

// Actualizar un área deportiva existente
export async function updateAreadeportiva(id, payload) {
  const res = await api.put(`${API_URL}/${id}`, payload);
  return res.data;
}

// Desactivar (eliminar lógica) un área deportiva
export async function deleteAreadeportiva(id) {
  const res = await api.put(`${API_URL}/${id}/eliminar`);
  return res.data;
}
