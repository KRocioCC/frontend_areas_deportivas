import api from './api';

const API_URL = '/cancha-disciplina';

//  Asignar disciplina a una cancha
export async function asociarDisciplinaACancha(payload) {
  const res = await api.post(API_URL, payload);
  return res.data;
}

//  Obtener una disciplina específica de una cancha
export async function obtenerDisciplinaDeCancha(idCancha, idDisciplina) {
  const res = await api.get(`${API_URL}/${idCancha}/${idDisciplina}`);
  return res.data;
}

//  Desasociar disciplina de una cancha
export async function desasociarDisciplinaDeCancha(idCancha, idDisciplina) {
  const res = await api.delete(`${API_URL}/${idCancha}/${idDisciplina}`);
  return res.data;
}

//  Listar todas las disciplinas de una cancha
export async function obtenerDisciplinasPorCancha(idCancha) {
  const res = await api.get(`${API_URL}/${idCancha}/disciplinas`);
  return res.data;
}

//  Listar todas las relaciones por cancha
export async function listarPorIdCancha(idCancha) {
  const res = await api.get(`${API_URL}/por-cancha/${idCancha}`);
  return res.data;
}

//  Listar todas las relaciones por disciplina
export async function listarPorIdDisciplina(idDisciplina) {
  const res = await api.get(`${API_URL}/por-disciplina/${idDisciplina}`);
  return res.data;
}
