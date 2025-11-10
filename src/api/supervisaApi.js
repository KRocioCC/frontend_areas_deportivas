import api from './api';

const API_URL = '/supervisa';

// Asignar una cancha a un usuario de control
export async function asignarCanchaASupervisor(idUsuarioControl, idCancha) {
  const res = await api.post(`${API_URL}?idUsuarioControl=${idUsuarioControl}&idCancha=${idCancha}`);
  return res.status === 200;
}

// Quitar una cancha de un usuario de control
export async function quitarCanchaDeSupervisor(idUsuarioControl, idCancha) {
  const res = await api.delete(`${API_URL}?idUsuarioControl=${idUsuarioControl}&idCancha=${idCancha}`);
  return res.status === 204;
}

// Obtener todas las canchas que supervisa un usuario
export async function obtenerCanchasSupervisadasPorUsuario(idUsuarioControl) {
  const res = await api.get(`${API_URL}/usuario/${idUsuarioControl}/canchas`);
  return res.data;
}

// Obtener todos los usuarios que supervisan una cancha
export async function obtenerSupervisoresDeCancha(idCancha) {
  const res = await api.get(`${API_URL}/cancha/${idCancha}/usuarios`);
  return res.data;
}
