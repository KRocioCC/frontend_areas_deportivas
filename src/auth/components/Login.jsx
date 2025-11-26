import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';
import PasswordInput from '../components/PasswordInput';
import '../../styles/authStyles.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(username, password);

      localStorage.setItem('user', JSON.stringify(response));
      localStorage.setItem('id', response.id);
      localStorage.setItem("idPersona", response.idPersona);

      authService.setupAxiosInterceptors(response.token);

      const roles = response.roles || [];
      console.log('Roles recibidos:', roles);
      let redirectTo = '/inicio';

      if (location.state?.from) {
        redirectTo = location.state.from;
      } else if (roles.includes('ROLE_ADMINISTRADOR')) {
        redirectTo = '/admin/mi_area';
      } else if (roles.includes('ROLE_CLIENTE')) {
        redirectTo = '/inicio';
      } else if (roles.includes('ROLE_SUPERUSUARIO')) {
        redirectTo = '/solicitudes';
      } else if (roles.includes('ROLE_USUARIO_CONTROL')) {
        redirectTo = '/control/dashboard'; 
      }else {
        setError('Tu cuenta no tiene un rol válido asignado.');
      }
      navigate(redirectTo, { replace: true });

    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Sección izquierda - Logo grande y lema */}
        <div className="text-center lg:text-left flex flex-col justify-center">
          <div className="mb-8">
            <img 
              src="/contenido/logos.png" 
              alt="Logo" 
              className="h-48 lg:h-64 xl:h-80 mx-auto lg:mx-0 mb-6 object-contain transition-all duration-300"
            />
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-3">
              Escanea tu pasion
            </h1>
            <p className="text-lg lg:text-xl text-gray-300">
              Juega sin limites
            </p>
          </div>
        </div>

        {/* Sección derecha - Formulario de login */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-6 lg:p-8 border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Iniciar Sesión</h2>
            <p className="text-gray-300">Accede a tu cuenta para continuar</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <span className="text-red-400 mr-2">⚠</span>
                {error}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Usuario
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all text-white placeholder-gray-400"
                placeholder="Ingresa tu usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ingresa tu contraseña"
                className="bg-white/5 border border-gray-600 focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent text-white placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 text-white font-semibold rounded-xl bg-gradient-to-r from-[#2B7A78] to-[#3AAFA9] hover:from-[#3AAFA9] hover:to-[#2B7A78] transition-all duration-300 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <Link to="/register" className="block text-[#3AAFA9] hover:text-[#2B7A78] transition-colors font-medium text-lg">
              ¿No tienes cuenta? <span className="font-semibold underline">Regístrate</span>
            </Link>
            
            <button
              type="button"
              onClick={() => navigate("/inicio")}
              className="text-gray-400 hover:text-gray-300 transition-colors text-sm flex items-center justify-center mx-auto"
            >
              <span className="mr-2">←</span>
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;