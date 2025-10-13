const API_URL = "http://localhost:8032/api/invitados";

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

export async function getInvitados() {
  return request(API_URL);
}

export async function getInvitadoById(id) {
  return request(`${API_URL}/${id}`);
}

export async function searchInvitados(nombre) {
  return request(`${API_URL}/buscar/${encodeURIComponent(nombre)}`);
}

export async function createInvitado(payload) {
  return request(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateInvitado(id, payload) {
  return request(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteInvitado(id) {
  return request(`${API_URL}/${id}`, { method: "DELETE" });
}