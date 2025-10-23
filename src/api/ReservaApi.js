import api from './api';

const API_URL = '/reservas';

export async function getReservas() {
  const res = await api.get(API_URL);
  return res.data;
}

export async function createReserva(payload) {
  const res = await api.post(API_URL, payload);
  return res.data;
}

export async function updateReserva(id, payload) {
  const res = await api.put(`${API_URL}/${id}`, payload);
  return res.data;
}

export async function deleteReserva(id) {
  const res = await api.delete(`${API_URL}/${id}`);
  return res.data;
}

export async function getReservaPorId(id) {
  const res = await api.get(`${API_URL}/${id}`);
  return res.data;
}

export async function getReservasPorCliente(idCliente) {
  const res = await api.get(`${API_URL}/cliente/${idCliente}`);
  return res.data;
}

export async function getReservasPorEstado(estado) {
  const res = await api.get(`${API_URL}/estado/${estado}`);
  return res.data;
}

export async function getReservasPorRangoFechas(inicio, fin) {
  const res = await api.get(`${API_URL}/rango-fechas?inicio=${inicio}&fin=${fin}`);
  return res.data;
}

export async function getReservaPorCodigo(codigo) {
  const res = await api.get(`${API_URL}/codigo/${codigo}`);
  return res.data;
}

export async function confirmarReserva(id) {
  const res = await api.post(`${API_URL}/${id}/confirmar`);
  return res.data;
}

export async function cancelarReserva(id, motivo) {
  const res = await api.post(`${API_URL}/${id}/cancelar`, { motivo });
  return res.data;
}

export async function marcarEnCurso(id) {
  const res = await api.post(`${API_URL}/${id}/en-curso`);
  return res.data;
}

export async function completarReserva(id) {
  const res = await api.post(`${API_URL}/${id}/completar`);
  return res.data;
}

export async function marcarNoShow(id) {
  const res = await api.post(`${API_URL}/${id}/no-show`);
  return res.data;
}

export async function validarDisponibilidad(fecha, horaInicio, horaFin) {
  const res = await api.get(`${API_URL}/disponibilidad?fecha=${fecha}&horaInicio=${horaInicio}&horaFin=${horaFin}`);
  return res.data;
}

export async function getReservasActivasPorCliente(idCliente) {
  const res = await api.get(`${API_URL}/cliente/${idCliente}/activas`);
  return res.data;
}

export async function getReservasPorDia(fecha) {
  const res = await api.get(`${API_URL}/dia/${fecha}`);
  return res.data;
}

export async function calcularIngresos(inicio, fin) {
  const res = await api.get(`${API_URL}/reporte/ingresos?inicio=${inicio}&fin=${fin}`);
  return res.data;
}

export async function healthCheck() {
  const res = await api.get(`${API_URL}/health`);
  return res.data;
}
