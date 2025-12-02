import api from './api';

const API_URL = '/administradores';

// Obtener todos los administradores (activos o todos)
export async function getAdministradores(activos = false) {
  const url = activos ? `${API_URL}/activos` : API_URL;
  const res = await api.get(url);
  return res.data;
}

// Obtener administrador por ID
export async function getAdministradorById(id) {
  const res = await api.get(`${API_URL}/${id}`);
  return res.data;
}

// Buscar administradores por nombre
export async function searchAdministradores(nombre) {
  const res = await api.get(`${API_URL}/buscar/${encodeURIComponent(nombre)}`);
  return res.data;
}

// Buscar administradores por nombre y apellidos
export async function buscarAdministradoresPorNombreApellidos(nombre, aPaterno, aMaterno) {
  const params = new URLSearchParams();
  if (nombre) params.append("nombre", nombre);
  if (aPaterno) params.append("aPaterno", aPaterno);
  if (aMaterno) params.append("aMaterno", aMaterno);
  const res = await api.get(`${API_URL}/buscar?${params.toString()}`);
  return res.data;
}

// Buscar administradores por rango de fechas
export async function buscarAdministradoresPorFechas(inicio, fin) {
  const res = await api.get(`${API_URL}/buscar/fechas?inicio=${inicio}&fin=${fin}`);
  return res.data;
}

// Crear administrador
export async function createAdministrador(payload) {
  const res = await api.post(API_URL, payload);
  return res.data;
}

// Actualizar administrador
export async function updateAdministrador(id, payload) {
  const res = await api.put(`${API_URL}/${id}`, payload);
  return res.data;
}

// Eliminar administrador
export async function deleteAdministrador(id) {
  const res = await api.delete(`${API_URL}/${id}`);
  return res.data;
}

// Cambiar estado de administrador
export async function cambiarEstadoAdministrador(id, estado) {
  if (typeof estado !== "boolean") {
    throw new Error("El valor de 'estado' debe ser booleano.");
  }
  const url = `${API_URL}/${id}/estado?estado=${encodeURIComponent(estado)}`;
  const res = await api.patch(url);
  return res.data;
}

// Obtener clientes que hicieron reserva en una de las canchas de un administrador
export async function getClientesPorAdministrador(id) {
  const res = await api.get(`${API_URL}/${id}/clientes`);
  return res.data;
}

// Obtener usuarios de control asociados a un administrador
export async function getUsuariosControlPorAdministrador(idAdmin) {
  const res = await api.get(`${API_URL}/${idAdmin}/usuarios-control`);
  return res.data;
}

// Crear usuario de control asociado a un administrador
export async function crearUsuarioControlDesdeAdministrador(idAdmin, payload) {
  const res = await api.post(`${API_URL}/${idAdmin}/usuarios-control`, payload);
  return res.data;
}


export const crearUsuarioControlRegistro = async (userData) => {
  try {
    const response = await api.post('/auth/registro/usuario-control', userData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar usuario de control:', error);
    throw error;
  }
};