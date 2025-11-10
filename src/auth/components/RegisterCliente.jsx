import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import PasswordInput from '../components/PasswordInput';

const RegisterCliente = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefono: '',
    fechaNacimiento: '',
    urlImagen: '',
    categoria: 'NUEVO' // Valor por defecto
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
      await authService.registerCliente(formData);
      setSuccess('¡Registro exitoso! Ya puedes iniciar sesión como cliente.');
      
      setFormData({
        username: '',
        password: '',
        email: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        telefono: '',
        fechaNacimiento: '',
        urlImagen: '',
        categoria: 'NUEVO'
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Error al registrar cliente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#17252A] via-[#2B7A78] to-[#3AAFA9] py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <button 
              onClick={() => navigate('/register')}
              className="inline-flex items-center text-white hover:text-gray-200 transition-colors mb-6"
            >
              <span className="mr-2">←</span>
              Volver
            </button>
            <h1 className="text-4xl font-bold text-white mb-4">
              Registro como <span className="text-[#3AAFA9]">Cliente</span>
            </h1>
            <p className="text-white/80 text-lg">
              Completa tus datos para comenzar a reservar canchas
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-3xl">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 animate-shake">
                <div className="flex items-center">
                  <span className="text-red-500 mr-3">⚠</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6 animate-fade-in">
                <div className="flex items-center">
                  <span className="text-green-500 mr-3">✅</span>
                  <span>{success}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-[#17252A] mb-4 flex items-center">
                  <span className="w-2 h-2 bg-[#3AAFA9] rounded-full mr-3"></span>
                  Información Personal
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                    <input 
                      type="text" 
                      name="nombre" 
                      value={formData.nombre} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all"
                      placeholder="Apellido paterno"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellido Materno *</label>
                  <input 
                    type="text" 
                    name="apellidoMaterno" 
                    value={formData.apellidoMaterno} 
                    onChange={handleChange} 
                    required 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all"
                    placeholder="Apellido materno"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                    <input 
                      type="text" 
                      name="telefono" 
                      value={formData.telefono} 
                      onChange={handleChange} 
                      required 
                      pattern="[0-9]{8}"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all"
                      placeholder="12345678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento *</label>
                    <input 
                      type="date" 
                      name="fechaNacimiento" 
                      value={formData.fechaNacimiento} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Información de Cuenta */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-[#17252A] mb-4 flex items-center">
                  <span className="w-2 h-2 bg-[#3AAFA9] rounded-full mr-3"></span>
                  Información de Cuenta
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de Usuario *</label>
                    <input 
                      type="text" 
                      name="username" 
                      value={formData.username} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all"
                      placeholder="usuario123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña *</label>
                    <PasswordInput
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Mínimo 6 caracteres"
                      minLength="6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL de Imagen (Opcional)</label>
                    <input 
                      type="text" 
                      name="urlImagen" 
                      value={formData.urlImagen} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Campo oculto para categoría */}
              <input type="hidden" name="categoria" value="NUEVO" />

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full py-4 px-6 text-white font-semibold rounded-xl bg-gradient-to-r from-[#2B7A78] to-[#3AAFA9] hover:from-[#3AAFA9] hover:to-[#2B7A78] transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Registrando...
                  </div>
                ) : (
                  'Crear Cuenta de Cliente'
                )}
              </button>
            </form>

            <div className="mt-8 text-center space-y-3">
              <button 
                onClick={() => navigate('/login')}
                className="text-[#2B7A78] hover:text-[#17252A] transition-colors font-medium block w-full"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCliente;