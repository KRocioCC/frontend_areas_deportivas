import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Realiza el login y recibe los datos del usuario
      const response = await login(username, password);

      // Configura Axios con el token JWT
      authService.setupAxiosInterceptors(response.token);

      // Redirige según el rol del usuario
      const roles = response.roles || [];

      if (roles.includes('ROLE_SUPERUSUARIO')) {
        navigate('/admin/solicitudes'); // Panel de aprobación
      } else if (roles.includes('ROL_ADMINISTRADOR')) {
        navigate('/macrodistritos'); // Admin dashboard
      } else if (roles.includes('ROL_CLIENTE')) {
        navigate('/canchas'); // Cliente solo ve canchas
      } else {
        setError('Tu cuenta no tiene un rol válido');
      }

    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Comprueba tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#17252A] via-[#2B7A78] to-[#3AAFA9]">
      <div className="m-auto w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-4xl font-semibold text-center text-[#17252A] mb-8">Iniciar Sesión</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[#17252A]">
              Nombre de usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-[#2B7A78] rounded-md shadow-sm focus:outline-none focus:ring-[#3AAFA9] focus:border-[#3AAFA9]"
              placeholder="Ingresa tu nombre de usuario"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#17252A]">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-[#2B7A78] rounded-md shadow-sm focus:outline-none focus:ring-[#3AAFA9] focus:border-[#3AAFA9]"
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B7A78] hover:bg-[#3AAFA9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3AAFA9] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link to="/register" className="text-[#17252A] hover:underline">
            ¿No tienes cuenta? Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
