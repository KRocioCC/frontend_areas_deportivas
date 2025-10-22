const API_URL = "http://localhost:8032/api/cancha";

export async function getCanchas() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
export async function getCancha(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
export async function createCancha(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function updateCancha(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteCancha(id) {
  const res = await fetch(`${API_URL}/${id}/eliminar`, { method: "PUT" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
