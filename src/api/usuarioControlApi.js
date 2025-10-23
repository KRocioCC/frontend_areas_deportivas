import api from './api';

const API_URL = '/usuario_control';

export async function getUsuariosControl(activos = false) {
  const url = activos ? `${API_URL}/activos` : API_URL;
  const res = await api.get(url);
  return res.data;
}

export async function getUsuarioControlById(id) {
  const res = await api.get(`${API_URL}/${id}`);
  return res.data;
}

export async function searchUsuariosControl(nombre) {
  const res = await api.get(`${API_URL}/buscar/${encodeURIComponent(nombre)}`);
  return res.data;
}

export async function createUsuarioControl(payload) {
  const res = await api.post(API_URL, payload);
  return res.data;
}

export async function updateUsuarioControl(id, payload) {
  const res = await api.put(`${API_URL}/${id}`, payload);
  return res.data;
}

export async function deleteUsuarioControl(id) {
  const res = await api.delete(`${API_URL}/${id}`);
  return res.data;
}

export async function cambiarEstadoUsuarioControl(id, estado) {
  if (typeof estado !== "boolean") {
    throw new Error("El valor de 'estado' debe ser booleano.");
  }

  const url = `${API_URL}/${id}/estado?estado=${encodeURIComponent(estado)}`;
  const res = await api.patch(url);
  return res.data;
}
