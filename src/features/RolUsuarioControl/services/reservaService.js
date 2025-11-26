import client from '../../../api/api';

const ENDPOINTS = {
    RESERVAS_POR_CANCHA: (canchaId) => `/reservas/${canchaId}/reservas`,
    // Nuevos endpoints de acciones (basados en tu Controller)
    EN_CURSO: (id) => `/reservas/${id}/en-curso`,
    COMPLETAR: (id) => `/reservas/${id}/completar`,
    NO_SHOW: (id) => `/reservas/${id}/no-show`,
    CANCELAR: (id) => `/reservas/${id}/cancelar`,
};

const reservaService = {
    async getReservasPorCancha(canchaId) {
        const response = await client.get(ENDPOINTS.RESERVAS_POR_CANCHA(canchaId));
        return response.data;
    },

    // --- NUEVOS MÉTODOS DE ACCIÓN ---

    async marcarEnCurso(id) {
        const response = await client.post(ENDPOINTS.EN_CURSO(id));
        return response.data;
    },

    async marcarCompletada(id) {
        const response = await client.post(ENDPOINTS.COMPLETAR(id));
        return response.data;
    },

    async marcarNoShow(id) {
        const response = await client.post(ENDPOINTS.NO_SHOW(id));
        return response.data;
    },

    async cancelarReserva(id, motivo) {
        // El backend espera un Map/JSON: { "motivo": "texto" }
        const response = await client.post(ENDPOINTS.CANCELAR(id), { motivo });
        return response.data;
    }
};

export default reservaService;