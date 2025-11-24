import api from './api';

// Definir la URL base
const BASE_URL = '/areasdeportivas';

// =====================
// ÁREA DEPORTIVA
// =====================

// Obtener todas las áreas deportivas (activos)
export async function getAreadeportivaActivos() {
  const res = await api.get(`${BASE_URL}/activos`);
  return res.data;
}

// Obtener todas las áreas deportivas (incluye inactivos)
export async function getAreadeportiva() {
  const res = await api.get(BASE_URL);
  return res.data;
}

// Obtener área deportiva por ID
export async function getAreadeportivaById(id) {
  const res = await api.get(`${BASE_URL}/${id}`);
  return res.data;
}

// Crear nueva área deportiva
export const createAreadeportiva = async (data) => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

// Actualizar área deportiva por ID
export async function updateAreadeportiva(id, payload) {
  const res = await api.put(`${BASE_URL}/${id}`, payload);
  return res.data;
}

// Eliminar física
export async function deleteAreadeportivaFisica(id) {
  const res = await api.delete(`${BASE_URL}/${id}`);
  return res.data;
}

// Cambiar estado (activo/inactivo)
export async function patchEstadoAreadeportiva(id, nuevoEstado) {
  const res = await api.patch(`${BASE_URL}/${id}/estado?nuevoEstado=${nuevoEstado}`);
  return res.data;
}

// Buscar por nombre
export async function buscarAreadeportivaPorNombre(nombre) {
  const res = await api.get(`${BASE_URL}/buscar/${nombre}`);
  return res.data;
}

// Obtener con bloqueo
export async function getAreadeportivaConBloqueo(id) {
  const res = await api.get(`${BASE_URL}/${id}/lock`);
  return res.data;
}

// Obtener área deportiva por adminId
export async function getAreadeportivaPorAdminId(adminId) {
  const res = await api.get(`${BASE_URL}/admin/${adminId}`);
  return res.data;
}

// Actualizar área deportiva por adminId
export async function updateAreadeportivaPorAdminId(adminId, payload) {
  const res = await api.put(`${BASE_URL}/admin/${adminId}`, payload);
  return res.data;
}

// =====================
// DISCIPLINAS (por administrador)
// =====================

// Crear disciplina (idsCanchas opcional)
export async function createDisciplinaPorAdmin(adminId, disciplina, idsCanchas = []) {
  const res = await api.post(`${BASE_URL}/admin/${adminId}/disciplinas`, disciplina, {
    params: { idsCanchas }
  });
  return res.data;
}

// Listar disciplinas de un administrador
export async function getDisciplinasPorAdmin(adminId) {
  const res = await api.get(`${BASE_URL}/admin/${adminId}/disciplinas`);
  return res.data;
}

// Actualizar disciplina por administrador
export async function updateDisciplinaPorAdmin(adminId, idDisciplina, payload) {
  const res = await api.put(`${BASE_URL}/admin/${adminId}/disciplinas/${idDisciplina}`, payload);
  return res.data;
}

// Eliminar disciplina por administrador
export async function deleteDisciplinaPorAdmin(adminId, idDisciplina) {
  await api.delete(`${BASE_URL}/admin/${adminId}/disciplinas/${idDisciplina}`);
}

// =====================
// IMÁGENES DE ÁREA DEPORTIVA
// =====================

// Subir imágenes
export async function agregarImagenesAreadeportiva(id, archivosImagenes) {
  const formData = new FormData();
  archivosImagenes.forEach((file) => formData.append('archivosImagenes', file));

  const res = await api.post(`${BASE_URL}/${id}/imagenes`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

// Eliminar imagen específica
export async function eliminarImagenAreadeportiva(id, idImagenRelacion) {
  const res = await api.delete(`${BASE_URL}/${id}/imagenes/${idImagenRelacion}`);
  return res.data;
}

// Reordenar imágenes
export async function reordenarImagenesAreadeportiva(id, idsImagenesOrden) {
  const res = await api.put(`${BASE_URL}/${id}/imagenes/reordenar`, idsImagenesOrden);
  return res.data;
}

// --- Función agregada para subir imágenes (versión consolidada) ---
export const agregarImagenesArea = async (id, archivos) => {
  const formData = new FormData();
  if (archivos && archivos.length > 0) {
    archivos.forEach((file) => formData.append('archivosImagenes', file));
  }
  const response = await api.post(`${BASE_URL}/${id}/imagenes`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Variante con progreso
export const agregarImagenesAreaConProgreso = async (id, archivos, onUploadProgress) => {
  const formData = new FormData();
  if (archivos && archivos.length > 0) {
    archivos.forEach((file) => formData.append('archivosImagenes', file));
  }
  const response = await api.post(`${BASE_URL}/${id}/imagenes`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
  return response.data;
};
