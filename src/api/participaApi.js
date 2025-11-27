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
