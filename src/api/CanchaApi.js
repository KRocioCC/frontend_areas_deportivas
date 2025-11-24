import api from './api'; 

const API_URL = '/cancha'; 

//  Obtener todas las canchas
export async function getCanchas() {
  const res = await api.get(API_URL);
  return res.data;
}

//  Obtener una cancha por ID
export async function getCancha(id) {
  const res = await api.get(`${API_URL}/porid/${id}`);
  return res.data;
}

// Crear una cancha (Solo datos JSON)
export const createCancha = async (canchaData) => {
    const response = await api.post(BASE_URL, canchaData);
    return response.data;
};

// Actualizar una cancha
export const updateCancha = async (id, canchaData) => {
    const response = await api.put(`${BASE_URL}/${id}`, canchaData);
    return response.data;
};

// Desactivar (eliminar lógica) una cancha
export async function deleteCancha(id) {
  // En lugar de eliminar, cambiamos el estado a false (desactivar) K
  const res = await api.patch(`${API_URL}/${id}/estado?nuevoEstado=false`);
  return res.data;
}

// Obtener canchas por área deportiva
export async function getCanchasPorArea(idArea) {
  const res = await api.get(`${API_URL}/area/${idArea}`);
  return res.data;
}

// ============================
// ⚙️ ESTADO Y FILTROS
// ============================
export async function cambiarEstadoCancha(id, nuevoEstado) {
  const res = await api.patch(`${API_URL}/${id}/estado?nuevoEstado=${nuevoEstado}`);
  return res.data;
}

export async function buscarCanchasPorNombre(nombre) {
  const res = await api.get(`${API_URL}/buscar/${nombre}`);
  return res.data;
}


export async function buscarCanchasPorFiltros(params) {
  // params: { horaInicio, horaFin, costo, capacidad, tamano, iluminacion, cubierta }
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`${API_URL}/buscar?${query}`);
  return res.data;
}

// ============================
// 🧱 RELACIONES
// ============================
export async function getCanchasActivas() {
  const res = await api.get(`${API_URL}/activos`);
  return res.data;
}


export async function getEquipamientosPorCancha(id) {
  const res = await api.get(`${API_URL}/${id}/equipamientos`);
  return res.data;
}

export async function getDisciplinasPorCancha(id) {
  const res = await api.get(`${API_URL}/${id}/disciplinas`);
  return res.data;
}

// --- LA FUNCIÓN NUEVA PARA IMÁGENES ---
export const agregarImagenesCancha = async (idCancha, archivos) => {
    const formData = new FormData();
    
    // "archivosImagenes" es el nombre exacto que espera tu @RequestParam en Java
    if (archivos && archivos.length > 0) {
        archivos.forEach((file) => {
            formData.append('archivosImagenes', file);
        });
    }

    // POST /api/cancha/{id}/imagenes
    const response = await api.post(`${BASE_URL}/${idCancha}/imagenes`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export async function eliminarImagenCancha(id, idImagenRelacion) {
  const res = await api.delete(`${API_URL}/${id}/imagenes/${idImagenRelacion}`);
  return res.data;
}

export async function reordenarImagenesCancha(id, idsImagenesOrden) {
  const res = await api.put(`${API_URL}/${id}/imagenes/reordenar`, idsImagenesOrden);
  return res.data;
}

// ============================
// 🔒 BLOQUEO / CONTROL CONCURRENCIA
// ============================
export async function obtenerCanchaConBloqueo(id) {
  const res = await api.get(`${API_URL}/${id}/lock`);
  return res.data;
}





//-------------------NUEVOS SERVICIOS
// Obtener todas las canchas
export const getAllCanchas = async () => {
    const response = await api.get(BASE_URL);
    return response.data;
};

