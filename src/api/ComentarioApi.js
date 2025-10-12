const API_URL = "http://localhost:8032/api/comentario";

export async function getComentarios() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function getComentarioById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function createComentario(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function updateComentario(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteComentario(id) {
  const res = await fetch(`${API_URL}/${id}/eliminar`, { method: "PUT" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function lockComentario(id) {
  const res = await fetch(`${API_URL}/${id}/lock`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteComentarioFisico(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.text(); // porque el backend devuelve un String
}

const COMENTARIO_URL = "http://localhost:8032/api/comentario";

export async function getComentariosPorCancha(canchaId) {
  const res = await fetch(`${COMENTARIO_URL}/cancha/${canchaId}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

