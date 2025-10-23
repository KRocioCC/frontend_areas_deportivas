// src/api/admin.js
const API_URL = "http://localhost:8032/api/admin";

const getSolicitudes = async (token) => {
  const response = await fetch(`${API_URL}/solicitudes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Error al cargar solicitudes");
  return response.json();
};

const aprobarSolicitud = async (id, token) => {
  const response = await fetch(`${API_URL}/solicitudes/${id}/aprobar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Error al aprobar solicitud");
  return response.json();
};

const rechazarSolicitud = async (id, motivo, token) => {
  const url = new URLSearchParams();
  if (motivo) url.append("motivo", motivo);

  const response = await fetch(`${API_URL}/solicitudes/${id}/rechazar?${url}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Error al rechazar solicitud");
  return response.json();
};

export { getSolicitudes, aprobarSolicitud, rechazarSolicitud };