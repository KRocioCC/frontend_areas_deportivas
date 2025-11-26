import client from '../../../api/api';

const ENDPOINTS = {
    // CORRECCIÓN: La ruta correcta según tu ComentarioController
    GET_BY_CANCHA: (canchaId) => `/comentario/cancha/${canchaId}`
};

const opinionService = {
    async getOpinionesPorCancha(canchaId) {
        try {
            const response = await client.get(ENDPOINTS.GET_BY_CANCHA(canchaId));
            return response.data;
        } catch (error) {
            console.error("Error cargando opiniones:", error);
            return []; 
        }
    }
};

export default opinionService;