import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';
import PasswordInput from '../components/PasswordInput';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [touched, setTouched] = useState({
    username: false,
    password: false
  });

  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();

  // Validaciones en tiempo real
  useEffect(() => {
    if (touched.username) {
      if (!username.trim()) {
        setUsernameError('El usuario es requerido');
      } else if (username.length < 3) {
        setUsernameError('El usuario debe tener al menos 3 caracteres');
      } else {
        setUsernameError('');
      }
    }
  }, [username, touched.username]);

  useEffect(() => {
    if (touched.password) {
      if (!password.trim()) {
        setPasswordError('La contraseña es requerida');
      } else if (password.length < 6) {
        setPasswordError('La contraseña debe tener al menos 6 caracteres');
      } else {
        setPasswordError('');
      }
    }
  }, [password, touched.password]);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setTouched({ username: true, password: true });
    
    // Validar antes de enviar
    if (usernameError || passwordError || !username || !password) {
      setError('Por favor corrige los errores antes de continuar');
      return;
    }

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
      } else {
        setError('Tu cuenta no tiene un rol válido asignado.');
      }
      navigate(redirectTo, { replace: true });

    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = isLoading || usernameError || passwordError || !username || !password;

  const getInputClassName = (fieldName) => {
    const baseClass = "w-full px-3 py-2 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all text-white placeholder-gray-400 text-sm";
    
    if (touched[fieldName] && (fieldName === 'username' ? usernameError : passwordError)) {
      return `${baseClass} border-red-500`;
    } else if (touched[fieldName] && !(fieldName === 'username' ? usernameError : passwordError) && (fieldName === 'username' ? username : password)) {
      return `${baseClass} border-green-500`;
    }
    return `${baseClass} border-gray-600`;
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          
          <div className="text-center lg:text-left flex flex-col justify-center">
            <div className="mb-6">
              <img 
                src="/contenido/logos.png" 
                alt="Logo" 
                className="h-48 lg:h-56 mx-auto lg:mx-0 mb-4 object-contain"
              />
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                Escanea tu pasión
              </h1>
              <p className="text-lg text-gray-300">
                Juega sin límites
              </p>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700">
            <div className="text-center mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-1">Iniciar Sesión</h2>
              <p className="text-gray-300 text-sm">Accede a tu cuenta para continuar</p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-3 py-2 rounded-lg mb-4 text-sm">
                <div className="flex items-center">
                  <span className="text-red-400 mr-2">⚠</span>
                  {error}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Usuario
                </label>
                {touched.username && usernameError && (
                  <div className="text-red-400 text-xs mb-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {usernameError}
                  </div>
                )}
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => handleBlur('username')}
                  className={getInputClassName('username')}
                  placeholder="Ingresa tu usuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Contraseña
                </label>
                {touched.password && passwordError && (
                  <div className="text-red-400 text-xs mb-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {passwordError}
                  </div>
                )}
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  required
                  placeholder="Ingresa tu contraseña"
                  className={getInputClassName('password').replace('py-2', 'py-2')}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`w-full py-2 px-4 text-white font-semibold rounded-lg transition-all duration-300 text-sm ${
                  isSubmitDisabled
                    ? 'bg-gray-700 opacity-50 cursor-not-allowed'
                    : 'bg-[#3AAFA9] hover:bg-[#2B7A78] hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            <div className="mt-4 text-center space-y-3">
              <Link to="/register" className="block text-[#3AAFA9] hover:text-[#2B7A78] transition-colors font-medium text-sm">
                ¿No tienes cuenta? <span className="font-semibold underline">Regístrate</span>
              </Link>
              
              <button
                type="button"
                onClick={() => navigate("/inicio")}
                className="text-gray-300 hover:text-gray-200 transition-colors text-xs flex items-center justify-center mx-auto"
              >
                <span className="mr-1">←</span>
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;