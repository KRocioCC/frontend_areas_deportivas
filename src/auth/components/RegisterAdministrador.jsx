import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import PasswordInput from '../components/PasswordInput';
import '../../styles/authStyles.css';

const RegisterAdministrador = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    adminPassword: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefono: '',
    fechaNacimiento: '',
    urlImagen: '',
    cargo: '',
    direccion: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validación frontend básica
      if (!formData.adminPassword.trim()) {
        throw new Error('La contraseña de administrador es requerida');
      }

      // Intentar registrar
      const resultado = await authService.registerAdministrador(formData);
      
      // Si llegamos aquí, el registro fue exitoso
      setSuccess('Solicitud de administrador registrada correctamente. Pendiente de aprobación por el superusuario.');
      
      // Limpiar formulario
      setFormData({
        username: '',
        password: '',
        email: '',
        adminPassword: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        telefono: '',
        fechaNacimiento: '',
        urlImagen: '',
        cargo: '',
        direccion: ''
      });

    } catch (err) {
      // Mostrar error específico del backend
      console.error('Error en registro administrador:', err);
      setError(err.message || 'Error: Contraseña de administrador incorrecta o error en el registro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-[#17252A] mb-2">Registro como Administrador</h1>
          <p className="text-gray-600">Solicita acceso para gestionar áreas deportivas</p>
        </div>

        {error && (
          <div className="auth-error">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠</span>
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              {success}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos del formulario... (mantén tus campos existentes) */}
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
              <input 
                type="text" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                required 
                className="auth-input"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Apellido Paterno *</label>
              <input 
                type="text" 
                name="apellidoPaterno" 
                value={formData.apellidoPaterno} 
                onChange={handleChange} 
                required 
                className="auth-input"
                placeholder="Apellido paterno"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Apellido Materno *</label>
            <input 
              type="text" 
              name="apellidoMaterno" 
              value={formData.apellidoMaterno} 
              onChange={handleChange} 
              required 
              className="auth-input"
              placeholder="Apellido materno"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
              <input 
                type="text" 
                name="telefono" 
                value={formData.telefono} 
                onChange={handleChange} 
                required 
                pattern="[0-9]{8}"
                className="auth-input"
                placeholder="12345678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Nacimiento *</label>
              <input 
                type="date" 
                name="fechaNacimiento" 
                value={formData.fechaNacimiento} 
                onChange={handleChange} 
                required 
                className="auth-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cargo *</label>
            <input 
              type="text" 
              name="cargo" 
              value={formData.cargo} 
              onChange={handleChange} 
              required 
              className="auth-input"
              placeholder="Ej: Gerente de Área"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección *</label>
            <input 
              type="text" 
              name="direccion" 
              value={formData.direccion} 
              onChange={handleChange} 
              required 
              className="auth-input"
              placeholder="Dirección completa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Usuario *</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              required 
              className="auth-input"
              placeholder="usuario123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="auth-input"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña *</label>
            <PasswordInput
              value={formData.password}
              onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
              required
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL Imagen (Opcional)</label>
            <input 
              type="text" 
              name="urlImagen" 
              value={formData.urlImagen} 
              onChange={handleChange} 
              className="auth-input"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          {/* Campo de contraseña de administrador */}
          <div className="border border-yellow-300 rounded-lg p-4 bg-yellow-50">
            <label className="block text-sm font-medium text-yellow-800 mb-2">
              Contraseña de Administrador *
            </label>
            <PasswordInput
              value={formData.adminPassword}
              onChange={(e) => setFormData(prev => ({...prev, adminPassword: e.target.value}))}
              required
              placeholder="Contraseña especial requerida"
            />
            <p className="text-yellow-700 text-xs mt-2">
              🔒 Esta contraseña es proporcionada por el superusuario para validar tu solicitud.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`auth-button ${isLoading ? 'auth-button-disabled' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner"></div>
                Verificando...
              </div>
            ) : (
              'Solicitar Registro como Administrador'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/register')}
            className="auth-link"
          >
            ← Volver a selección de registro
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdministrador;