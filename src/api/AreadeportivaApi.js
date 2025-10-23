// src/services/areadeportivaService.js
import api from './api'; // importa tu instancia general de axios

const API_URL = '/areasdeportivas'; // ya no pones localhost, el baseURL ya lo maneja api.js

export async function getAreadeportiva() {
  const res = await api.get(API_URL);
  return res.data;
}

export async function createAreadeportiva(payload) {
  const res = await api.post(API_URL, payload);
  return res.data;
}

export async function updateAreadeportiva(id, payload) {
  const res = await api.put(`${API_URL}/${id}`, payload);
  return res.data;
}

export async function deleteAreadeportiva(id) {
  const res = await api.put(`${API_URL}/${id}/eliminar`);
  return res.data;
}
