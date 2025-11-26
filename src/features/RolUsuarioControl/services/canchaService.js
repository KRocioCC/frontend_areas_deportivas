import client from '../../../api/api';

/**
 * Rutas de los endpoints del backend.
 * NOTA: El cliente axios ya inyecta '/api' al inicio, así que no lo repetimos aquí.
 */
const ENDPOINTS = {
  // Antes: /api/supervisa/usuario/... (MAL, generaba /api/api/...)
  // Ahora: /supervisa/usuario/... (BIEN)
  SUPERVISA_USUARIO: (usuarioId) => `/supervisa/usuario/${usuarioId}/canchas`,
  
  // Revisa también este endpoint según tu CanchaController
  // En tu backend CanchaController tiene @RequestMapping("/api/cancha") y el get es @GetMapping("/porid/{id}")
  CANCHA_DETALLE: (canchaId) => `/cancha/porid/${canchaId}`, 
};

const canchaService = {
  async getMisCanchasSupervisadas(usuarioId) {
    try {
      if (!usuarioId) throw new Error("ID de usuario necesario para cargar canchas supervisadas");
      
      // console.log("Pidiendo a:", ENDPOINTS.SUPERVISA_USUARIO(usuarioId)); // Descomenta si quieres depurar
      const response = await client.get(ENDPOINTS.SUPERVISA_USUARIO(usuarioId));
      return response.data;
    } catch (error) {
      console.error("Error en canchaService.getMisCanchasSupervisadas:", error);
      throw error;
    }
  },

  async getCanchaDetalle(canchaId) {
    try {
      const response = await client.get(ENDPOINTS.CANCHA_DETALLE(canchaId));
      return response.data;
    } catch (error) {
      console.error(`Error en canchaService.getCanchaDetalle (${canchaId}):`, error);
      throw error;
    }
  }
};

export default canchaService;