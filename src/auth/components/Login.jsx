import React, { useState } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';
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
  //la ubicaion de la url
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await login(username, password);

      localStorage.setItem('user', JSON.stringify(response));
      localStorage.setItem('id', response.id); // guarda el ID 

      // Configura Axios con el token JWT
      authService.setupAxiosInterceptors(response.token);

      const roles = response.roles || [];
      console.log('Roles recibidos:', roles);
      let redirectTo = '/inicio';

      // SI VENÍA DE UNA RUTA PROTEGIDA → REDIRIGIR AHÍ
      if (location.state?.from) {
        redirectTo = location.state.from;
      } else if (roles.includes('ROLE_ADMINISTRADOR')) {
        redirectTo = '/admin/dashboard';
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

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#17252A] mb-2">Iniciar Sesión</h1>
          <p className="text-gray-600">Accede a tu cuenta</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="auth-input"
              placeholder="Ingresa tu usuario"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`auth-button ${isLoading ? 'auth-button-disabled' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner"></div>
                Iniciando sesión...
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/register" className="auth-link">
            ¿No tienes cuenta? Regístrate
          </Link>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/inicio")}
            className="text-[var(--accent1)] hover:underline text-sm"
          >
            ← Volver al inicio
          </button>
        </div>

        <div className="auth-debug">
          <details>
            <summary className="debug-summary">Información de roles</summary>
            <div className="debug-content">
              <p><strong>Superusuario:</strong> /solicitudes</p>
              <p><strong>Administrador:</strong> /admin/dashboard</p>
              <p><strong>Cliente:</strong> /inicio</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default Login;