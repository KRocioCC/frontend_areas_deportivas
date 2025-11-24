import api from './api';

const API_URL = '/imagen';

// ============================
// 🖼️ IMÁGENES - ENDPOINTS PRINCIPALES
// ============================

/**
 * Obtener imagen por su ID
 */
export async function getImagenPorId(idImagen) {
  const res = await api.get(`${API_URL}/${idImagen}`);
  return res.data;
}

/**
 * Obtener todas las imágenes activas
 */
export async function getImagenesActivas() {
  const res = await api.get(`${API_URL}/activas`);
  return res.data;
}

/**
 * Buscar imágenes por nombre
 */
export async function buscarImagenesPorNombre(nombre) {
  const res = await api.get(`${API_URL}/buscar/nombre?nombre=${encodeURIComponent(nombre)}`);
  return res.data;
}

/**
 * Buscar imágenes por tipo MIME
 */
export async function buscarImagenesPorTipoMime(tipoMime) {
  const res = await api.get(`${API_URL}/buscar/tipo-mime?tipoMime=${encodeURIComponent(tipoMime)}`);
  return res.data;
}

// ============================
// 🏷️ IMÁGENES POR ENTIDAD
// ============================

/**
 * Obtener imágenes de una entidad específica (cancha, usuario, etc.)
 */
export async function getImagenesPorEntidad(entidadTipo, entidadId) {
  const res = await api.get(`${API_URL}/entidad/${entidadTipo}/${entidadId}`);
  return res.data;
}

/**
 * Subir imágenes para una entidad
 */
export async function subirImagenes(entidadTipo, entidadId, archivos) {
  const formData = new FormData();
  archivos.forEach((file) => formData.append('archivos', file));
  
  const res = await api.post(`${API_URL}/subir/${entidadTipo}/${entidadId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

/**
 * Eliminar todas las imágenes de una entidad
 */
export async function eliminarTodasImagenesDeEntidad(entidadTipo, entidadId) {
  const res = await api.delete(`${API_URL}/entidad/${entidadTipo}/${entidadId}`);
  return res.data;
}

// ============================
// 🗑️ ELIMINACIÓN DE IMÁGENES
// ============================

/**
 * Eliminar imagen (lógico - desactiva pero mantiene archivo)
 */
export async function eliminarImagenLogicamente(idImagenRelacion) {
  const res = await api.delete(`${API_URL}/logico/${idImagenRelacion}`);
  return res.data;
}

/**
 * Eliminar imagen (físico - elimina archivo y registros)
 */
export async function eliminarImagenFisicamente(idImagenRelacion) {
  const res = await api.delete(`${API_URL}/fisico/${idImagenRelacion}`);
  return res.data;
}

// ============================
// 🔄 OPERACIONES AVANZADAS
// ============================

/**
 * Actualizar información de imagen
 */
export async function actualizarImagen(idImagen, imagenDTO) {
  const res = await api.put(`${API_URL}/${idImagen}`, imagenDTO);
  return res.data;
}

/**
 * Reordenar imágenes de una entidad
 */
export async function reordenarImagenes(entidadTipo, entidadId, idsImagenesRelacionEnOrden) {
  const res = await api.put(`${API_URL}/reordenar/${entidadTipo}/${entidadId}`, idsImagenesRelacionEnOrden);
  return res.data;
}

/**
 * Migrar imagen entre entidades
 */
export async function migrarImagenEntreEntidades(idImagenRelacion, nuevaEntidadTipo, nuevaEntidadId) {
  const res = await api.put(`${API_URL}/migrar/${idImagenRelacion}?nuevaEntidadTipo=${nuevaEntidadTipo}&nuevaEntidadId=${nuevaEntidadId}`);
  return res.data;
}

/**
 * Limpiar imágenes no utilizadas
 */
export async function limpiarImagenesNoUtilizadas() {
  const res = await api.post(`${API_URL}/limpiar/no-utilizadas`);
  return res.data;
}

// ============================
// 📊 ESTADÍSTICAS Y DIAGNÓSTICO
// ============================

/**
 * Obtener estadísticas de uso de imágenes
 */
export async function getEstadisticasUsoImagenes() {
  const res = await api.get(`${API_URL}/estadisticas`);
  return res.data;
}

/**
 * Obtener imágenes con problemas
 */
export async function getImagenesConProblemas() {
  const res = await api.get(`${API_URL}/problemas`);
  return res.data;
}

/**
 * Validar archivo antes de subir
 */
export async function validarArchivo(archivo) {
  const formData = new FormData();
  formData.append('archivo', archivo);
  
  const res = await api.post(`${API_URL}/validar-archivo`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// ============================
// 🌐 URLS DE ARCHIVOS
// ============================

/**
 * Generar URL para descargar/ver archivo de imagen
 * NOTA: Este endpoint es público y no requiere autenticación
 */
export function getUrlArchivoImagen(rutaArchivo) {
  return `${api.defaults.baseURL}${API_URL}/archivo/${rutaArchivo}`;
}

/**
 * Verificar si un archivo existe
 */
export async function verificarExistenciaArchivo(rutaArchivo) {
  const res = await api.get(`/archivos/existe/${rutaArchivo}`);
  return res.data;
}

// ============================
// 🎯 FUNCIONES DE UTILIDAD PARA EL FRONTEND
// ============================

/**
 * Función de utilidad para obtener y mostrar imágenes de una cancha
 */
export async function getImagenesDeCancha(canchaId) {
  return await getImagenesPorEntidad('cancha', canchaId);
}

/**
 * Función de utilidad para subir imágenes a una cancha
 */
export async function subirImagenesACancha(canchaId, archivos) {
  return await subirImagenes('cancha', canchaId, archivos);
}

/**
 * Función de utilidad para obtener URL de imagen de cancha
 */
export function getUrlImagenCancha(nombreArchivo) {
  return getUrlArchivoImagen(`img/cancha/${nombreArchivo}`);
}

export default {
  // Básicos
  getImagenPorId,
  getImagenesActivas,
  buscarImagenesPorNombre,
  buscarImagenesPorTipoMime,
  
  // Por entidad
  getImagenesPorEntidad,
  subirImagenes,
  eliminarTodasImagenesDeEntidad,
  
  // Eliminación
  eliminarImagenLogicamente,
  eliminarImagenFisicamente,
  
  // Avanzadas
  actualizarImagen,
  reordenarImagenes,
  migrarImagenEntreEntidades,
  limpiarImagenesNoUtilizadas,
  
  // Diagnóstico
  getEstadisticasUsoImagenes,
  getImagenesConProblemas,
  validarArchivo,
  
  // URLs y utilidades
  getUrlArchivoImagen,
  verificarExistenciaArchivo,
  getImagenesDeCancha,
  subirImagenesACancha,
  getUrlImagenCancha
};