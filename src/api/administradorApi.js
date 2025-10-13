const API_URL = "http://localhost:8032/api/administradores";

export async function getAdministradores() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function getAdministradoresActivos() {
  const res = await fetch(`${API_URL}/activos`);
  return res.json();
}

export async function getAdministradorById(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
}

export async function searchAdministradores(nombre) {
  const res = await fetch(`${API_URL}/buscar/${nombre}`);
  return res.json();
}

export async function createAdministrador(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updateAdministrador(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteAdministrador(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return res.ok;
}

export async function cambiarEstadoAdministrador(id, estado) {
  const res = await fetch(`${API_URL}/${id}/estado?estado=${estado}`, {
    method: "PATCH",
  });
  return res.json();
}
