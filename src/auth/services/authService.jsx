import axios from 'axios';

const API_URL = 'http://localhost:8032/api/auth/';
axios.defaults.withCredentials = true;

const authService = {
  // Registrar nuevo cliente
  registerCliente: async (clienteData) => {
    try {
      const response = await axios.post(API_URL + 'registro/cliente', clienteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al registrar cliente" };
    }
  },

  // Registrar nuevo administrador
  registerAdministrador: async (adminData) => {
    try {
      const response = await axios.post(API_URL + 'registro/administrador', adminData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al registrar administrador" };
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
      console.error('Error en login:', error);
      throw error.response?.data || { message: "Error en el inicio de sesión" };
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