import api from './api';

const API_URL = '/areasdeportivas';

// Obtener todas las áreas deportivas (activos)
export async function getAreadeportivaActivos() {
  const res = await api.get(`${API_URL}/activos`);
  return res.data;
}

// Obtener todas las áreas deportivas (incluye inactivos)
export async function getAreadeportiva() {
  const res = await api.get(API_URL);
  return res.data;
}

// Obtener área deportiva por ID
export async function getAreadeportivaById(id) {
  const res = await api.get(`${API_URL}/${id}`);
  return res.data;
}

// Crear nueva área deportiva
export async function createAreadeportiva(payload) {
  const res = await api.post(API_URL, payload);
  return res.data;
}

// Actualizar área deportiva por ID
export async function updateAreadeportiva(id, payload) {
  const res = await api.put(`${API_URL}/${id}`, payload);
  return res.data;
}

// Eliminar lógica (cambiar estado)
export async function deleteAreadeportiva(id) {
  const res = await api.put(`${API_URL}/${id}/eliminar`);
  return res.data;
}

// Eliminar física
export async function deleteAreadeportivaFisica(id) {
  const res = await api.delete(`${API_URL}/${id}`);
  return res.data;
}

// Cambiar estado (activo/inactivo)
export async function patchEstadoAreadeportiva(id, nuevoEstado) {
  const res = await api.patch(`${API_URL}/${id}/estado?nuevoEstado=${nuevoEstado}`);
  return res.data;
}

// Buscar por nombre
export async function buscarAreadeportivaPorNombre(nombre) {
  const res = await api.get(`${API_URL}/buscar/${nombre}`);
  return res.data;
}

// Obtener con bloqueo
export async function getAreadeportivaConBloqueo(id) {
  const res = await api.get(`${API_URL}/${id}/lock`);
  return res.data;
}

// Obtener área deportiva por adminId
export async function getAreadeportivaPorAdminId(adminId) {
  const res = await api.get(`${API_URL}/admin/${adminId}`);
  return res.data;
}

// Actualizar área deportiva por adminId
export async function updateAreadeportivaPorAdminId(adminId, payload) {
  const res = await api.put(`${API_URL}/admin/${adminId}`, payload);
  return res.data;
}

// Subir imágenes
export async function agregarImagenesAreadeportiva(id, archivosImagenes) {
  const formData = new FormData();
  archivosImagenes.forEach((file) => formData.append('archivosImagenes', file));

  const res = await api.post(`${API_URL}/${id}/imagenes`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

// Eliminar imagen específica
export async function eliminarImagenAreadeportiva(id, idImagenRelacion) {
  const res = await api.delete(`${API_URL}/${id}/imagenes/${idImagenRelacion}`);
  return res.data;
}

// Reordenar imágenes
export async function reordenarImagenesAreadeportiva(id, idsImagenesOrden) {
  const res = await api.put(`${API_URL}/${id}/imagenes/reordenar`, idsImagenesOrden);
  return res.data;
}
