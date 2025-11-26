import client from '../../../api/api';

const ENDPOINTS = {
    // GET /api/usuario_control/{id}
    BY_ID: (id) => `/usuario_control/${id}`,
};

const usuarioControlService = {
    async getPerfil(id) {
        try {
            const response = await client.get(ENDPOINTS.BY_ID(id));
            return response.data;
        } catch (error) {
            console.error("Error obteniendo perfil:", error);
            throw error;
        }
    },

    async updatePerfil(id, datos) {
        try {
            const response = await client.put(ENDPOINTS.BY_ID(id), datos);
            return response.data;
        } catch (error) {
            console.error("Error actualizando perfil:", error);
            throw error;
        }
    }
};

export default usuarioControlService;