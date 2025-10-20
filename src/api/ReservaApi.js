const API_URL = "http://localhost:8032/api/reservas";

export async function getReservas() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function createReserva(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function updateReserva(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteReserva(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res;
}

export async function getReservaPorId(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function getReservasPorCliente(idCliente) {
  const res = await fetch(`${API_URL}/cliente/${idCliente}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function getReservasPorEstado(estado) {
  const res = await fetch(`${API_URL}/estado/${estado}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function getReservasPorRangoFechas(inicio, fin) {
  const res = await fetch(`${API_URL}/rango-fechas?inicio=${inicio}&fin=${fin}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function getReservaPorCodigo(codigo) {
  const res = await fetch(`${API_URL}/codigo/${codigo}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function confirmarReserva(id) {
  const res = await fetch(`${API_URL}/${id}/confirmar`, { method: "POST" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function cancelarReserva(id, motivo) {
  const res = await fetch(`${API_URL}/${id}/cancelar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ motivo }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function marcarEnCurso(id) {
  const res = await fetch(`${API_URL}/${id}/en-curso`, { method: "POST" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function completarReserva(id) {
  const res = await fetch(`${API_URL}/${id}/completar`, { method: "POST" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function marcarNoShow(id) {
  const res = await fetch(`${API_URL}/${id}/no-show`, { method: "POST" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function validarDisponibilidad(fecha, horaInicio, horaFin) {
  const res = await fetch(`${API_URL}/disponibilidad?fecha=${fecha}&horaInicio=${horaInicio}&horaFin=${horaFin}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function getReservasActivasPorCliente(idCliente) {
  const res = await fetch(`${API_URL}/cliente/${idCliente}/activas`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function getReservasPorDia(fecha) {
  const res = await fetch(`${API_URL}/dia/${fecha}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function calcularIngresos(inicio, fin) {
  const res = await fetch(`${API_URL}/reporte/ingresos?inicio=${inicio}&fin=${fin}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function healthCheck() {
  const res = await fetch(`${API_URL}/health`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}