// MiAreaApi.js - APIs específicas para MiArea con URLs corregidas
import api from './api';

// ✅ URL corregida específicamente para MiArea
const MI_AREA_BASE_URL = '/api/areasdeportivas';

// Obtener área deportiva por adminId - CON URL CORREGIDA
export const getAreadeportivaPorAdminIdCorregido = async (adminId) => {
    try {
        console.log(`🔄 [MI_AREA_API] Buscando área para admin: ${adminId}`);
        const response = await api.get(`${MI_AREA_BASE_URL}/admin/${adminId}`);
        console.log('✅ [MI_AREA_API] Área encontrada:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ [MI_AREA_API] Error:', {
            status: error.response?.status,
            data: error.response?.data,
            url: `${MI_AREA_BASE_URL}/admin/${adminId}`
        });
        throw error;
    }
};