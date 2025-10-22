import api from './api';

const API_URL = '/pagos';

export async function getPagos() {
  const res = await api.get(API_URL);
  return res.data;
}
