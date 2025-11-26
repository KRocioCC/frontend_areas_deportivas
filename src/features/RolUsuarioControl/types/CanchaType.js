/**
 * Definiciones de tipo para las Canchas en el contexto del Rol Control.
 * Basado en los DTOs de respuesta del Backend (SupervisaController).
 */

/**
 * Información resumida del Área Deportiva a la que pertenece una cancha.
 * @typedef {Object} AreaResumenDTO
 * @property {number} id - ID único del área.
 * @property {string} nombre - Nombre del área (ej: "Complejo Polideportivo Norte").
 */

/**
 * Estructura principal de una Cancha vista por el supervisor.
 * Debe coincidir con el JSON que devuelve el endpoint GET /api/supervisa/usuario/{id}/canchas
 *
 * @typedef {Object} CanchaControlDTO
 * @property {number} id - Identificador único de la cancha en BDD.
 * @property {string} nombre - Nombre descriptivo (ej: "Cancha Futbol 5 A").
 * @property {string} tipo - Categoría del deporte (ej: "FUTBOL", "BASKET", "TENIS").
 * @property {string} estado - Estado operativo actual (ej: "DISPONIBLE", "OCUPADO", "MANTENIMIENTO").
 * @property {string} [imagenUrl] - (Opcional) URL de la foto principal de la cancha si existe.
 * @property {AreaResumenDTO} area - Objeto con la info del área a la que pertenece.
 */

// Exportación ficticia para que el archivo sea tratado como módulo
export const _CanchaTypes = {};