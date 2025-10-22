import authService from '../auth/services/authService';

// ✅ USAR RUTAS RELATIVAS
const API_BASE = '/api';

const macrodistritoApi = {
  obtenerTodos: async () => {
    try {
      console.log('📤 Obteniendo macrodistritos...');
      const response = await authService.getApi().get('/macrodistritos');
      console.log('✅ Macrodistritos obtenidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo macrodistritos:', error);
      throw error;
    }
  },

  createMacrodistrito: async (payload) => {
    try {
      console.log('📤 Creando macrodistrito...', payload);
      const response = await authService.getApi().post('/macrodistrito', payload);
      console.log('✅ Macrodistrito creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando macrodistrito:', error);
      throw error;
    }
  },

  updateMacrodistrito: async (id, payload) => {
    try {
      console.log(`📤 Actualizando macrodistrito ${id}...`, payload);
      const response = await authService.getApi().put(`/macrodistrito/${id}`, payload);
      console.log('✅ Macrodistrito actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error actualizando macrodistrito:', error);
      throw error;
    }
  },

  deleteMacrodistrito: async (id) => {
    try {
      console.log(`📤 Desactivando macrodistrito ${id}...`);
      const response = await authService.getApi().put(`/macrodistrito/${id}/eliminar`);
      console.log('✅ Macrodistrito desactivado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error desactivando macrodistrito:', error);
      throw error;
    }
  }
};

export default macrodistritoApi;

export const getMacrodistritos = macrodistritoApi.obtenerTodos;
export const createMacrodistrito = macrodistritoApi.createMacrodistrito;
export const updateMacrodistrito = macrodistritoApi.updateMacrodistrito;
export const deleteMacrodistrito = macrodistritoApi.deleteMacrodistrito;