import client from '../../../api/api';

const ENDPOINTS = {
    SUBIR: (tipo, id) => `/imagenes/subir/${tipo}/${id}`,
    GET_BY_ENTIDAD: (tipo, id) => `/imagenes/entidad/${tipo}/${id}`,
    DELETE_LOGICO: (idRel) => `/imagenes/logico/${idRel}`
};

const imagenService = {
    /**
     * Sube una lista de archivos para una entidad
     * @param {File[]} files - Array de objetos File
     * @param {string} entidadTipo - "CANCHA", "USUARIO", etc.
     * @param {number} entidadId - ID de la entidad
     */
    async subirImagenes(files, entidadTipo, entidadId) {
        const formData = new FormData();
        // El backend espera @RequestParam("archivos")
        files.forEach(file => {
            formData.append('archivos', file);
        });

        try {
            const response = await client.post(ENDPOINTS.SUBIR(entidadTipo, entidadId), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.error("Error subiendo imágenes:", error);
            throw error;
        }
    },

    async getImagenes(entidadTipo, entidadId) {
        try {
            const response = await client.get(ENDPOINTS.GET_BY_ENTIDAD(entidadTipo, entidadId));
            return response.data;
        } catch (error) {
            console.error("Error cargando imágenes:", error);
            return [];
        }
    },

    async eliminarImagen(idImagenRelacion) {
        try {
            await client.delete(ENDPOINTS.DELETE_LOGICO(idImagenRelacion));
        } catch (error) {
            console.error("Error eliminando imagen:", error);
            throw error;
        }
    }
};

export default imagenService;