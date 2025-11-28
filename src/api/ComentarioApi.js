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

// ---------- COMENTARIOS POR CLIENTE ----------
export async function getComentariosPorCliente(clienteId) {
  const res = await api.get(`${API_URL}/cliente/${clienteId}`);
  return res.data;
}

// ---------- COMENTARIOS MÁS RECIENTES ----------
export async function getComentariosMasRecientes() {
  const res = await api.get(`${API_URL}/recientes`);
  return res.data;
}

// ---------- COMENTARIOS CON MAYOR CALIFICACIÓN ----------
export async function getComentariosMayorCalificacion() {
  const res = await api.get(`${API_URL}/mayor-calificacion`);
  return res.data;
}

// ---------- COMENTARIOS CON MAYOR CALIFICACIÓN Y MÁS RECIENTES ----------
export async function getComentariosMayorCalificacionRecientes() {
  const res = await api.get(`${API_URL}/mayor-calificacion-recientes`);
  return res.data;
}

// ---------- COMENTARIOS POR CALIFICACIÓN ESPECÍFICA ----------
export async function getComentariosPorCalificacion(calificacion) {
  const res = await api.get(`${API_URL}/calificacion/${calificacion}`);
  return res.data;
}

// ---------- COMENTARIOS POR ÁREA DEPORTIVA ----------
export async function getComentariosPorAreaDeportiva(areaId) {
  const res = await api.get(`${API_URL}/area/${areaId}`);
  return res.data;
}

// ---------- COMENTARIOS CON BLOQUEO (para testing) ----------
export async function obtenerComentarioConBloqueo(id) {
  const res = await api.get(`${API_URL}/${id}/lock`);
  return res.data;
}

export async function getComentariosPorClienteCancha(clienteId, canchaId) {
  const res = await api.get(`${API_URL}/cliente/${clienteId}/cancha`, {
    params: { canchaId }
  });
  return res.data;
}
export async function getComentariosMasRecientesCancha(canchaId, limite = 10) {
  const res = await api.get(`${API_URL}/recientes/cancha`, {
    params: { canchaId, limite }
  });
  return res.data;
}
export async function getComentariosMayorCalificacionCancha(canchaId, limite = 10) {
  const res = await api.get(`${API_URL}/mayor-calificacion/cancha`, {
    params: { canchaId, limite }
  });
  return res.data;
}
export async function getComentariosMayorCalificacionRecientesCancha(canchaId, limite = 10) {
  const res = await api.get(`${API_URL}/mayor-calificacion-recientes/cancha`, {
    params: { canchaId, limite }
  });
  return res.data;
}
export async function getComentariosPorCalificacionCancha(canchaId, calificacion) {
  const res = await api.get(`${API_URL}/calificacion/${calificacion}/cancha`, {
    params: { canchaId }
  });
  return res.data;
}
