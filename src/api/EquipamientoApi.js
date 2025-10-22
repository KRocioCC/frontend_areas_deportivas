const API_URL = "http://localhost:8032/api/equipamientos";

export async function getEquipamientos() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function createEquipamiento(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function updateEquipamiento(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteEquipamiento(id) {
  const res = await fetch(`${API_URL}/${id}/eliminar`, { method: "PUT" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
