import axios from 'axios';

// URL base de tu backend
const API_URL = 'http://localhost:8032/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para inyectar el Token
api.interceptors.request.use(
    (config) => {
        // Intentamos leer el usuario del localStorage
        const userStr = localStorage.getItem('user');
        let token = null;

        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                // A veces el token viene como 'token' o 'accessToken'
                token = user.token || user.accessToken;
            } catch (e) {
                console.error("Error parseando usuario del localStorage", e);
            }
        }

        // Si encontramos token, lo inyectamos
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            // console.log("🔑 Token inyectado en petición a:", config.url); // Descomenta para depurar
        } else {
            console.warn("⚠️ Petición saliendo SIN TOKEN a:", config.url);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;