const API_URL = "http://localhost:8032/api/clientes";

async function request(url, options = {}) {
  const defaultHeaders = {
    "Accept": "application/json",
  };

  const fetchOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const errBody = await res.text();
      if (errBody) msg += ` - ${errBody}`;
    } catch (e) {
      // ignore
    }
    throw new Error(msg);
  }

  if (res.status === 204 || res.headers.get("Content-Length") === "0") {
    return null;
  }

  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {

    return text;
  }
}

export async function getClientes(activos = false) {
  // si queremos solo activos, consultar /activos
  const url = activos ? `${API_URL}/activos` : API_URL;
  return request(url);
}

export async function getClienteById(id) {
  return request(`${API_URL}/${id}`);
}

export async function searchClientes(nombre) {
  return request(`${API_URL}/buscar/${encodeURIComponent(nombre)}`);
}

export async function createCliente(payload) {
  return request(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateCliente(id, payload) {
  return request(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteCliente(id) {

  return request(`${API_URL}/${id}`, { method: "DELETE" });
}

export async function cambiarEstado(id, estado) {
  if (typeof estado !== "boolean") {
    throw new Error("El valor de 'estado' debe ser booleano.");
  }

  const url = `${API_URL}/${id}/estado?estado=${encodeURIComponent(estado)}`;

  return request(url, {
    method: "PATCH",

  });
}
