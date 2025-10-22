import axios from 'axios';

// ✅ USAR RUTAS RELATIVAS - El proxy se encargará del redireccionamiento
const API_URL = '/api/auth/';

// Crear instancia de axios para la API
const api = axios.create({
  baseURL: '/api/', // Ruta relativa
  headers: {
    'Content-Type': 'application/json',
  }
});

const authService = {
  login: async (username, password) => {
    try {
      console.log('🔄 Iniciando login...');
      
      const response = await axios.post(API_URL + 'login', {
        username,
        password
      });

      console.log('✅ Login exitoso!');
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('token', response.data.token);
        authService.setupAxiosInterceptors(response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw new Error(error.response?.data?.message || 'Error en el inicio de sesión');
    }
  },

  setupAxiosInterceptors: (token) => {
    console.log('🔧 Configurando interceptors con token');
    
    api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log(`✅ Token agregado a: ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axios.interceptors.request.use(
      (config) => {
        if (token && config.url && config.url.includes('/api/')) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    api.interceptors.request.clear();
    axios.interceptors.request.clear();
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => localStorage.getItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token'),
  getApi: () => api
};

const existingToken = authService.getToken();
if (existingToken) {
  authService.setupAxiosInterceptors(existingToken);
}

export default authService;