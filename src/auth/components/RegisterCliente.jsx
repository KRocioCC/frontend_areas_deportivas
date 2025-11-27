import React, { useState, useEffect } from 'react';
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
    categoria: 'NUEVO'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  // Validaciones en tiempo real
  useEffect(() => {
    const newErrors = {};

    // Validar nombre
    if (touched.nombre && !formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (touched.nombre && formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar apellidos
    if (touched.apellidoPaterno && !formData.apellidoPaterno.trim()) {
      newErrors.apellidoPaterno = 'El apellido paterno es requerido';
    }

    if (touched.apellidoMaterno && !formData.apellidoMaterno.trim()) {
      newErrors.apellidoMaterno = 'El apellido materno es requerido';
    }

    // Validar teléfono
    if (touched.telefono) {
      if (!formData.telefono.trim()) {
        newErrors.telefono = 'El teléfono es requerido';
      } else if (!/^\d{8}$/.test(formData.telefono)) {
        newErrors.telefono = 'El teléfono debe tener exactamente 8 dígitos';
      }
    }

    // Validar fecha de nacimiento
    if (touched.fechaNacimiento) {
      if (!formData.fechaNacimiento) {
        newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';
      } else {
        const birthDate = new Date(formData.fechaNacimiento);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13) {
          newErrors.fechaNacimiento = 'Debes tener al menos 13 años';
        }
      }
    }

    // Validar username
    if (touched.username) {
      if (!formData.username.trim()) {
        newErrors.username = 'El nombre de usuario es requerido';
      } else if (formData.username.length < 3) {
        newErrors.username = 'El usuario debe tener al menos 3 caracteres';
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username = 'Solo se permiten letras, números y guiones bajos';
      }
    }

    // Validar email
    if (touched.email) {
      if (!formData.email.trim()) {
        newErrors.email = 'El email es requerido';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'El formato del email no es válido';
      }
    }

    // Validar contraseña
    if (touched.password) {
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Debe contener letras y números';
      }
    }

    setErrors(newErrors);
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isFormValid = () => {
    return Object.keys(errors).length === 0 && 
           formData.nombre && 
           formData.apellidoPaterno && 
           formData.apellidoMaterno && 
           formData.telefono && 
           formData.fechaNacimiento && 
           formData.username && 
           formData.email && 
           formData.password;
  };

  const getInputClassName = (fieldName) => {
    const baseClass = "w-full px-3 py-2 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all text-white placeholder-gray-400 text-sm";
    
    if (touched[fieldName] && errors[fieldName]) {
      return `${baseClass} border-red-500`;
    } else if (touched[fieldName] && !errors[fieldName] && formData[fieldName]) {
      return `${baseClass} border-green-500`;
    }
    return `${baseClass} border-gray-600`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'urlImagen' && key !== 'categoria') {
        allTouched[key] = true;
      }
    });
    setTouched(allTouched);

    if (!isFormValid()) {
      return;
    }

    setIsLoading(true);

    try {
      await authService.registerCliente(formData);
      setShowSuccessModal(true);
      
    } catch (err) {
      alert(err.message || 'Error al registrar cliente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black py-6">
      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">✓</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">¡Registro Exitoso!</h3>
            <p className="text-gray-300 mb-6">
              Ya puedes iniciar sesión como cliente.
            </p>
            <button
              onClick={handleSuccessConfirm}
              className="w-full py-2 px-4 bg-[#3AAFA9] text-white rounded-lg hover:bg-[#2B7A78] transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          
          <div className="text-center mb-6">
            <div className="mb-4">
              <img 
                src="/logo.svg" 
                alt="Logo" 
                className="h-16 mx-auto mb-3"
              />
              <h1 className="text-2xl font-bold text-white mb-1">
                Registro como <span className="text-[#3AAFA9]">Cliente</span>
              </h1>
              <p className="text-gray-400 text-sm">
                Completa tus datos para registrarte
              </p>
            </div>
            <button 
              onClick={() => navigate('/register')}
              className="inline-flex items-center text-gray-400 hover:text-gray-300 transition-colors text-sm"
            >
              <span className="mr-1">←</span>
              Volver a selección
            </button>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-xl p-4 border border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre *
                  </label>
                  {touched.nombre && errors.nombre && (
                    <div className="text-red-400 text-xs mb-1">{errors.nombre}</div>
                  )}
                  <input 
                    type="text" 
                    name="nombre" 
                    value={formData.nombre} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('nombre')}
                    className={getInputClassName('nombre')}
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Apellido Paterno *
                  </label>
                  {touched.apellidoPaterno && errors.apellidoPaterno && (
                    <div className="text-red-400 text-xs mb-1">{errors.apellidoPaterno}</div>
                  )}
                  <input 
                    type="text" 
                    name="apellidoPaterno" 
                    value={formData.apellidoPaterno} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('apellidoPaterno')}
                    className={getInputClassName('apellidoPaterno')}
                    placeholder="Apellido paterno"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Apellido Materno *
                  </label>
                  {touched.apellidoMaterno && errors.apellidoMaterno && (
                    <div className="text-red-400 text-xs mb-1">{errors.apellidoMaterno}</div>
                  )}
                  <input 
                    type="text" 
                    name="apellidoMaterno" 
                    value={formData.apellidoMaterno} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('apellidoMaterno')}
                    className={getInputClassName('apellidoMaterno')}
                    placeholder="Apellido materno"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Teléfono *
                  </label>
                  {touched.telefono && errors.telefono && (
                    <div className="text-red-400 text-xs mb-1">{errors.telefono}</div>
                  )}
                  <input 
                    type="text" 
                    name="telefono" 
                    value={formData.telefono} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('telefono')}
                    className={getInputClassName('telefono')}
                    placeholder="12345678"
                    maxLength="8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Fecha de Nacimiento *
                  </label>
                  {touched.fechaNacimiento && errors.fechaNacimiento && (
                    <div className="text-red-400 text-xs mb-1">{errors.fechaNacimiento}</div>
                  )}
                  <input 
                    type="date" 
                    name="fechaNacimiento" 
                    value={formData.fechaNacimiento} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('fechaNacimiento')}
                    className={getInputClassName('fechaNacimiento')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre de Usuario *
                  </label>
                  {touched.username && errors.username && (
                    <div className="text-red-400 text-xs mb-1">{errors.username}</div>
                  )}
                  <input 
                    type="text" 
                    name="username" 
                    value={formData.username} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('username')}
                    className={getInputClassName('username')}
                    placeholder="usuario123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Correo Electrónico *
                  </label>
                  {touched.email && errors.email && (
                    <div className="text-red-400 text-xs mb-1">{errors.email}</div>
                  )}
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    className={getInputClassName('email')}
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Contraseña *
                  </label>
                  {touched.password && errors.password && (
                    <div className="text-red-400 text-xs mb-1">{errors.password}</div>
                  )}
                  <PasswordInput
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('password')}
                    required
                    placeholder="Mínimo 6 caracteres"
                    minLength="6"
                    className={getInputClassName('password').replace('py-2', 'py-2')}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    URL de Imagen (Opcional)
                  </label>
                  <input 
                    type="text" 
                    name="urlImagen" 
                    value={formData.urlImagen} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all text-white placeholder-gray-400 text-sm"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
              </div>

              <input type="hidden" name="categoria" value="NUEVO" />

              <button 
                type="submit" 
                disabled={isLoading || !isFormValid()}
                className={`w-full py-2 px-4 text-white font-semibold rounded-lg transition-all duration-300 text-sm ${
                  isLoading || !isFormValid()
                    ? 'bg-gray-700 opacity-50 cursor-not-allowed'
                    : 'bg-[#3AAFA9] hover:bg-[#2B7A78] hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Registrando...
                  </div>
                ) : (
                  'Crear Cuenta de Cliente'
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button 
                onClick={() => navigate('/login')}
                className="text-[#3AAFA9] hover:text-[#2B7A78] transition-colors font-medium text-sm"
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