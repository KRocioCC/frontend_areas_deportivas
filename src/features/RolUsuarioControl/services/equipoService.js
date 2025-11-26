import client from '../../../api/api';

const ENDPOINTS = {
    // Endpoint: /api/cancha/{id}/equipamientos
    GET_BY_CANCHA: (canchaId) => `/cancha/${canchaId}/equipamientos`
};

const equipoService = {
    async getEquiposPorCancha(canchaId) {
        try {
            const response = await client.get(ENDPOINTS.GET_BY_CANCHA(canchaId));
            return response.data;
        } catch (error) {
            console.error("Error obteniendo equipamiento:", error);
            throw error;
        }
    }
};

export default equipoService;