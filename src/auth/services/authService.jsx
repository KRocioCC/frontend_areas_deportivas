import axios from 'axios';

const API_URL = 'http://localhost:8032/api/auth/';
axios.defaults.withCredentials = true;

const authService = {
  // Registrar nuevo administrador - MEJORADO
  registerAdministrador: async (adminData) => {
    try {
      console.log('Enviando datos al backend:', adminData);
      
      const response = await axios.post(API_URL + 'registro/administrador', adminData);
      
      console.log('Respuesta del backend:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('Error completo en authService:', error);
      
      // Manejo detallado de errores
      if (error.response) {
        // El servidor respondió con un código de error
        const errorMessage = error.response.data?.message || 
                           error.response.data || 
                           `Error ${error.response.status}: ${error.response.statusText}`;
        
        console.error('Detalles del error:', {
          status: error.response.status,
          data: error.response.data,
          message: errorMessage
        });
        
        throw new Error(errorMessage);
        
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor:', error.request);
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
        
      } else {
        // Algo pasó al configurar la petición
        console.error('Error configurando la petición:', error.message);
        throw new Error('Error de configuración: ' + error.message);
      }
    }
  },

  // Registrar nuevo cliente
  registerCliente: async (clienteData) => {
    try {
      const response = await axios.post(API_URL + 'registro/cliente', clienteData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || "Error al registrar cliente";
      throw new Error(errorMessage);
    }
  },

  // Iniciar sesión
  login: async (username, password) => {
    try {
      console.log("Enviando solicitud de login:", { username, password });

      const response = await axios.post(API_URL + 'login', { username, password });

      console.log("Respuesta de login:", response.data);

      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        authService.setupAxiosInterceptors(response.data.token);
      }

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data || "Error en el inicio de sesión";
      throw new Error(errorMessage);
    }
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('user');
  },

  // Obtener usuario actual desde localStorage
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  // Configurar token en encabezado para futuras peticiones
  setupAxiosInterceptors: (token) => {
    axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }
};

export default authService;