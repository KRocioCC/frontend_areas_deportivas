import api from './api';

export const getSolicitudes = async () => {
  const res = await api.get('/admin/solicitudes');
  return res.data;
};

export const aprobarSolicitud = async (id) => {
  const res = await api.post(`/admin/solicitudes/${id}/aprobar`);
  return res.data;
};

export const rechazarSolicitud = async (id, motivo) => {
  const url = motivo
    ? `/admin/solicitudes/${id}/rechazar?motivo=${encodeURIComponent(motivo)}`
    : `/admin/solicitudes/${id}/rechazar`;
  const res = await api.post(url);
  return res.data;
};
