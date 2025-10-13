const API_URL = "http://localhost:8032/api/usuario_control";

export async function getUsuariosControl() {
  const res = await fetch(API_URL + "/activos");
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function getUsuarioControlById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function createUsuarioControl(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function updateUsuarioControl(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function deleteUsuarioControl(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function cambiarEstadoUsuarioControl(id, nuevoEstado) {
  const res = await fetch(`${API_URL}/${id}/estado?estado=${nuevoEstado}`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export async function searchUsuarioControl(nombre) {
  const res = await fetch(`${API_URL}/buscar/${nombre}`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
