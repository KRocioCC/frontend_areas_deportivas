import api from "./api";

export const confirmarInvitacion = async (idReserva, idInvitado) => {
  try {
    const res = await api.post(`/participaciones/reserva/${idReserva}/invitado/${idInvitado}/confirmar`);
    return res.data; // aquí viene el QR generado y los datos de la confirmación
  } catch (err) {
    console.error("Error confirmando invitación:", err);
    throw err.response?.data || { message: "Error al confirmar la invitación" };
  }
};

// Crear participación (antes de confirmar asistencia)
export async function crearParticipacion(payload) {
  const res = await api.post('/participaciones', payload);
  return res.data;
}

// 2. Actualizar una participación
export const actualizarParticipacion = async (idReserva, idInvitado, payload) => {
  try {
    const res = await api.put(`/participaciones/reserva/${idReserva}/invitado/${idInvitado}`, payload);
    return res.data;
  } catch (err) {
    console.error("Error actualizando participación:", err);
    throw err.response?.data || { message: "Error al actualizar la participación" };
  }
};


// 4. Registrar asistencia
export const registrarAsistencia = async (idReserva, idInvitado, asistio = true) => {
  try {
    const res = await api.post(`/participaciones/reserva/${idReserva}/invitado/${idInvitado}/asistencia`, {
      asistio,
    });
    return res.data;
  } catch (err) {
    console.error("Error registrando asistencia:", err);
    throw err.response?.data || { message: "Error al registrar la asistencia" };
  }
};

// 5. Marcar como notificado
export const marcarComoNotificado = async (idReserva, idInvitado) => {
  try {
    const res = await api.post(`/participaciones/reserva/${idReserva}/invitado/${idInvitado}/notificar`);
    return res.data;
  } catch (err) {
    console.error("Error marcando como notificado:", err);
    throw err.response?.data || { message: "Error al marcar como notificado" };
  }
};

// 6. Eliminar participación
export const eliminarParticipacion = async (idReserva, idInvitado) => {
  try {
    await api.delete(`/participaciones/reserva/${idReserva}/invitado/${idInvitado}`);
    return { success: true };
  } catch (err) {
    console.error("Error eliminando participación:", err);
    throw err.response?.data || { message: "Error al eliminar la participación" };
  }
};

// 7. Obtener todas las participaciones de una reserva
export const obtenerParticipacionesPorReserva = async (idReserva) => {
  try {
    const res = await api.get(`/participaciones/reserva/${idReserva}`);
    return res.data; // array de ParticipaDTO
  } catch (err) {
    console.error("Error obteniendo participaciones por reserva:", err);
    throw err.response?.data || { message: "Error al obtener las participaciones" };
  }
};

// 8. Obtener solo las confirmadas
export const obtenerConfirmadosPorReserva = async (idReserva) => {
  try {
    const res = await api.get(`/participaciones/reserva/${idReserva}/confirmados`);
    return res.data;
  } catch (err) {
    console.error("Error obteniendo confirmados:", err);
    throw err.response?.data || { message: "Error al obtener los confirmados" };
  }
};

// 9. Obtener participaciones por invitado
export const obtenerParticipacionesPorInvitado = async (idInvitado) => {
  try {
    const res = await api.get(`/participaciones/invitado/${idInvitado}`);
    return res.data;
  } catch (err) {
    console.error("Error obteniendo por invitado:", err);
    throw err.response?.data || { message: "Error al obtener las reservas del invitado" };
  }
};

// 10. Obtener una participación específica
export const obtenerParticipacionPorIds = async (idReserva, idInvitado) => {
  try {
    const res = await api.get(`/participaciones/reserva/${idReserva}/invitado/${idInvitado}`);
    return res.data;
  } catch (err) {
    console.error("Error obteniendo participación específica:", err);
    throw err.response?.data || { message: "Error al obtener la participación" };
  }
};

// 11. Verificar si existe una invitación
export const existeInvitacion = async (idReserva, idInvitado) => {
  try {
    const res = await api.get(`/participaciones/reserva/${idReserva}/invitado/${idInvitado}/existe`);
    return res.data.existe; // true o false
  } catch (err) {
    console.error("Error verificando existencia:", err);
    throw err.response?.data || { message: "Error al verificar la invitación" };
  }
};

// 12. Contar total de invitados en una reserva
export const contarInvitados = async (idReserva) => {
  try {
    const res = await api.get(`/participaciones/reserva/${idReserva}/contador`);
    return res.data.totalInvitados;
  } catch (err) {
    console.error("Error contando invitados:", err);
    throw err.response?.data || { message: "Error al contar los invitados" };
  }
};

// 13. Contar asistentes
export const contarAsistentes = async (idReserva) => {
  try {
    const res = await api.get(`/participaciones/reserva/${idReserva}/asistentes`);
    return res.data.totalAsistentes;
  } catch (err) {
    console.error("Error contando asistentes:", err);
    throw err.response?.data || { message: "Error al contar los asistentes" };
  }
};