import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import PasswordInput from '../components/PasswordInput';

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
    direccion: '',
    cargo: 'Administrador general'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Contraseña especial definida en el backend
  const ADMIN_SPECIAL_PASSWORD = 'passwordadmin';

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.adminPassword.trim()) {
      throw new Error('La contraseña de administrador es requerida');
    }

    if (formData.adminPassword !== ADMIN_SPECIAL_PASSWORD) {
      throw new Error('Contraseña de administrador incorrecta. Verifica la contraseña especial proporcionada por el superusuario.');
    }

    if (formData.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    if (formData.telefono && !/^\d{8}$/.test(formData.telefono)) {
      throw new Error('El teléfono debe tener exactamente 8 dígitos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validación frontend de la contraseña especial
      validateForm();

      console.log('Enviando solicitud de administrador:', {
        ...formData,
        password: '***',
        adminPassword: '***'
      });

      const resultado = await authService.registerAdministrador(formData);
      
      setSuccess('Solicitud de administrador registrada correctamente. Pendiente de aprobación por el superusuario.');
      
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
        direccion: '',
        cargo: 'Administrador general'
      });

    } catch (err) {
      console.error('Error en registro administrador:', err);
      setError(err.message || 'Error al registrar administrador. Verifica los datos e intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header con logo */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <img 
                src="/logo.svg" 
                alt="Logo" 
                className="h-24 lg:h-32 mx-auto mb-4 object-contain"
              />
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Registro como <span className="text-[#3AAFA9]">Administrador</span>
              </h1>
              <p className="text-gray-300 text-lg">
                Tu reserva, simple y segura
              </p>
            </div>
            <button 
              onClick={() => navigate('/register')}
              className="inline-flex items-center text-gray-400 hover:text-gray-300 transition-colors"
            >
              <span className="mr-2">←</span>
              Volver a selección
            </button>
          </div>

          {/* Form Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-6 lg:p-8 border border-white/20">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-6 py-4 rounded-xl mb-6">
                <div className="flex items-center">
                  <span className="text-red-400 mr-3">⚠</span>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-500/20 border border-green-500/30 text-green-200 px-6 py-4 rounded-xl mb-6">
                <div className="flex items-center">
                  <span className="text-green-400 mr-3"></span>
                  <span className="font-medium">{success}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-[#3AAFA9] rounded-full mr-3"></span>
                  Información Personal
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nombre *</label>
                    <input 
                      type="text" 
                      name="nombre" 
                      value={formData.nombre} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all text-white placeholder-gray-400"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Apellido Paterno *</label>
                    <input 
                      type="text" 
                      name="apellidoPaterno" 
                      value={formData.apellidoPaterno} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all text-white placeholder-gray-400"
                      placeholder="Apellido paterno"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Apellido Materno *</label>
                  <input 
                    type="text" 
                    name="apellidoMaterno" 
                    value={formData.apellidoMaterno} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all text-white placeholder-gray-400"
                    placeholder="Apellido materno"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono *</label>
                    <input 
                      type="tel" 
                      name="telefono" 
                      value={formData.telefono} 
                      onChange={handleChange} 
                      required 
                      pattern="[0-9]{8}"
                      title="El teléfono debe tener 8 dígitos"
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all text-white placeholder-gray-400"
                      placeholder="12345678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Fecha de Nacimiento *</label>
                    <input 
                      type="date" 
                      name="fechaNacimiento" 
                      value={formData.fechaNacimiento} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Dirección *</label>
                  <input 
                    type="text" 
                    name="direccion" 
                    value={formData.direccion} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all text-white placeholder-gray-400"
                    placeholder="Dirección completa"
                  />
                </div>

                <input type="hidden" name="cargo" value="Administrador general" />
              </div>

              {/* Información de Cuenta */}
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-[#3AAFA9] rounded-full mr-3"></span>
                  Información de Cuenta
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nombre de Usuario *</label>
                    <input 
                      type="text" 
                      name="username" 
                      value={formData.username} 
                      onChange={handleChange} 
                      required 
                      minLength="3"
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all text-white placeholder-gray-400"
                      placeholder="usuario123"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all text-white placeholder-gray-400"
                      placeholder="tu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña *</label>
                    <PasswordInput
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Mínimo 6 caracteres"
                      minLength="6"
                      className="bg-white/5 border border-gray-600 focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">URL de Imagen (Opcional)</label>
                    <input 
                      type="url" 
                      name="urlImagen" 
                      value={formData.urlImagen} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all text-white placeholder-gray-400"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Contraseña de Administrador */}
              <div className="bg-yellow-500/10 border-2 border-yellow-500/30 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center">
                  <span className="text-yellow-400 mr-2">🔐</span>
                  Verificación de Administrador
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-yellow-300 mb-2">
                    Contraseña Especial de Administrador *
                  </label>
                  <PasswordInput
                    name="adminPassword"
                    value={formData.adminPassword}
                    onChange={handleChange}
                    required
                    placeholder="Ingresa la contraseña especial para administradores"
                    minLength="6"
                    className="bg-yellow-500/10 border border-yellow-500/30 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-yellow-300"
                  />
                  <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-yellow-300 text-sm font-medium flex items-center">
                      <span className="mr-2">💡</span>
                      Información importante:
                    </p>
                    <ul className="text-yellow-300/80 text-xs mt-2 space-y-1">
                      <li>• Esta contraseña es proporcionada exclusivamente por el superusuario</li>
                      <li>• Sin esta contraseña no podrás solicitar el registro como administrador</li>
                      <li>• Contacta con el superusuario del sistema para obtenerla</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full py-4 px-6 text-white font-semibold rounded-xl bg-gradient-to-r from-[#2B7A78] to-[#3AAFA9] hover:from-[#3AAFA9] hover:to-[#2B7A78] transition-all duration-300 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Verificando y Enviando...
                  </div>
                ) : (
                  'Solicitar Registro como Administrador'
                )}
              </button>
            </form>

            <div className="mt-8 text-center space-y-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-[#3AAFA9] hover:text-[#2B7A78] transition-colors font-medium block w-full"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="text-gray-400 hover:text-gray-300 transition-colors text-sm block w-full"
              >
                ← Volver a selección de tipo de registro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterAdministrador;