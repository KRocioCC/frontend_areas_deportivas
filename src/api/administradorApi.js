import api from './api';

const API_URL = '/administradores';

export async function getAdministradores(activos = false) {
  const url = activos ? `${API_URL}/activos` : API_URL;
  const res = await api.get(url);
  return res.data;
}

export async function getAdministradorById(id) {
  const res = await api.get(`${API_URL}/${id}`);
  return res.data;
}

export async function searchAdministradores(nombre) {
  const res = await api.get(`${API_URL}/buscar/${encodeURIComponent(nombre)}`);
  return res.data;
}

export async function createAdministrador(payload) {
  const res = await api.post(API_URL, payload);
  return res.data;
}

export async function updateAdministrador(id, payload) {
  const res = await api.put(`${API_URL}/${id}`, payload);
  return res.data;
}

export async function deleteAdministrador(id) {
  const res = await api.delete(`${API_URL}/${id}`);
  return res.data;
}

export async function cambiarEstadoAdministrador(id, estado) {
  if (typeof estado !== "boolean") {
    throw new Error("El valor de 'estado' debe ser booleano.");
  }

  const url = `${API_URL}/${id}/estado?estado=${encodeURIComponent(estado)}`;
  const res = await api.patch(url);
  return res.data;
}
