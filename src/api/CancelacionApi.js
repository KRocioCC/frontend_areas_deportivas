const API_URL = "http://localhost:8032/api/cancelacion";

export async function getCancelaciones() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function getCancelacionById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function createCancelacion(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function updateCancelacion(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteCancelacion(id) {
  const res = await fetch(`${API_URL}/${id}/eliminar`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function lockCancelacion(id) {
  const res = await fetch(`${API_URL}/${id}/lock`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteCancelacionFisica(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.text(); // porque el backend devuelve un String
}
