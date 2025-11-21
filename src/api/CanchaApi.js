import api from './api'; 

const API_URL = '/cancha'; 

//  Obtener todas las canchas
export async function getCanchas() {
  const res = await api.get(API_URL);
  return res.data;
}

//  Obtener una cancha por ID
export async function getCancha(id) {
  const res = await api.get(`${API_URL}/porid/${id}`);
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

// ============================
// ⚙️ ESTADO Y FILTROS
// ============================
export async function cambiarEstadoCancha(id, nuevoEstado) {
  const res = await api.patch(`${API_URL}/${id}/estado?nuevoEstado=${nuevoEstado}`);
  return res.data;
}

export async function buscarCanchasPorNombre(nombre) {
  const res = await api.get(`${API_URL}/buscar/${nombre}`);
  return res.data;
}

export async function buscarCanchasPorFiltros(params) {
  // params: { horaInicio, horaFin, costo, capacidad, tamano, iluminacion, cubierta }
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`${API_URL}/buscar?${query}`);
  return res.data;
}

// ============================
// 🧱 RELACIONES
// ============================
export async function getCanchasActivas() {
  const res = await api.get(`${API_URL}/activos`);
  return res.data;
}


export async function getEquipamientosPorCancha(id) {
  const res = await api.get(`${API_URL}/${id}/equipamientos`);
  return res.data;
}

export async function getDisciplinasPorCancha(id) {
  const res = await api.get(`${API_URL}/${id}/disciplinas`);
  return res.data;
}

// ============================
// 🧩 IMÁGENES
// ============================
export async function agregarImagenesCancha(id, archivosImagenes) {
  const formData = new FormData();
  archivosImagenes.forEach((file) => formData.append('archivosImagenes', file));
  const res = await api.post(`${API_URL}/${id}/imagenes`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function eliminarImagenCancha(id, idImagenRelacion) {
  const res = await api.delete(`${API_URL}/${id}/imagenes/${idImagenRelacion}`);
  return res.data;
}

export async function reordenarImagenesCancha(id, idsImagenesOrden) {
  const res = await api.put(`${API_URL}/${id}/imagenes/reordenar`, idsImagenesOrden);
  return res.data;
}

// ============================
// 🔒 BLOQUEO / CONTROL CONCURRENCIA
// ============================
export async function obtenerCanchaConBloqueo(id) {
  const res = await api.get(`${API_URL}/${id}/lock`);
  return res.data;
}