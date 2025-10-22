import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [username, setUsername] = useState('superuser');
  const [password, setPassword] = useState('super123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    console.log('Iniciando login DIRECTO...');
    
    try {
      const response = await fetch('http://localhost:8032/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      console.log('Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Login DIRECTO exitoso:', data);
        
        // Guardar manualmente
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('token', data.token);
        
        // Redirigir según el rol
        if (data.roles && data.roles.includes('ROLE_SUPERUSUARIO')) {
          navigate('/macrodistritos');
          //mas
        } else if (data.roles && data.roles.includes('ROLE_ADMINISTRADOR')) {
          navigate('/macrodistritos');
        } else if (data.roles && data.roles.includes('ROLE_CLIENTE')) {
          navigate('/canchas');
        } else {
          navigate('/canchas');
        }
      } else {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        setError(errorData.message || 'Error del servidor');
      }
      
    } catch (err) {
      console.error('Error en login directo:', err);
      setError('No se puede conectar al servidor: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Fondo con gradiente */}
      <div className="login-background">
        <div className="login-gradient"></div>
      </div>

      {/* Tarjeta del formulario */}
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5V7H9V5.5L3 7V9L9 10.5V12L3 13.5V15.5L9 14V16L3 17.5V19.5L9 18V22H15V18L21 19.5V17.5L15 16V14L21 15.5V13.5L15 12V10.5L21 9Z"/>
              </svg>
            </div>
            <h1 className="login-title">Espacios Deportivos</h1>
            <p className="login-subtitle">Sistema de Gestión</p>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="login-error">
            <div className="error-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <span>{error}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              <svg viewBox="0 0 24 24" fill="currentColor" className="input-icon">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="Ingresa tu usuario"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <svg viewBox="0 0 24 24" fill="currentColor" className="input-icon">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Ingresa tu contraseña"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? (
              <>
                <div className="button-spinner"></div>
                Iniciando sesión...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" className="button-icon">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                Ingresar al Sistema
              </>
            )}
          </button>
        </form>

        {/* Credenciales de prueba */}
        <div className="login-credentials">
          <div className="credentials-header">
            <svg viewBox="0 0 24 24" fill="currentColor" className="credentials-icon">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
            <span>Credenciales de Prueba</span>
          </div>
          <div className="credentials-list">
            <div className="credential-item">
              <strong>Usuario:</strong> superuser
            </div>
            <div className="credential-item">
              <strong>Contraseña:</strong> super123
            </div>
          </div>
        </div>

        {/* Quitar el enlace de registro temporalmente */}
        <div className="login-footer">
          <p>
            Sistema de Gestión de Espacios Deportivos
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;