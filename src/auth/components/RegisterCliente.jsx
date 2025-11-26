import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import PasswordInput from '../components/PasswordInput';

// Componente Toast integrado
const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center`}>
        <span className="mr-2">{type === 'success' ? '✅' : '⚠️'}</span>
        <span className="font-medium">{message}</span>
        <button 
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 text-lg font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
};

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
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });
  const navigate = useNavigate();

  // Función para mostrar toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

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
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Debe contener mayúsculas, minúsculas y números';
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
    const baseClass = "w-full px-4 py-3 bg-white/5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all text-white placeholder-gray-400";
    
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
      showToast('Por favor corrige los errores antes de enviar', 'error');
      return;
    }

    setIsLoading(true);

    try {
      await authService.registerCliente(formData);
      showToast('¡Registro exitoso! Ya puedes iniciar sesión como cliente.');
      
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
      showToast(err.message || 'Error al registrar cliente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      {/* Toast Global */}
      {toast.visible && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast}
        />
      )}

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
                Registro como <span className="text-[#3AAFA9]">Cliente</span>
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Personal */}
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-[#3AAFA9] rounded-full mr-3"></span>
                  Información Personal
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre *
                      {touched.nombre && !errors.nombre && formData.nombre && (
                        <span className="text-green-400 text-xs ml-2">✓ Válido</span>
                      )}
                    </label>
                    {touched.nombre && errors.nombre && (
                      <div className="text-red-400 text-xs mb-2 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.nombre}
                      </div>
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Apellido Paterno *
                      {touched.apellidoPaterno && !errors.apellidoPaterno && formData.apellidoPaterno && (
                        <span className="text-green-400 text-xs ml-2">✓ Válido</span>
                      )}
                    </label>
                    {touched.apellidoPaterno && errors.apellidoPaterno && (
                      <div className="text-red-400 text-xs mb-2 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.apellidoPaterno}
                      </div>
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
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Apellido Materno *
                    {touched.apellidoMaterno && !errors.apellidoMaterno && formData.apellidoMaterno && (
                      <span className="text-green-400 text-xs ml-2">✓ Válido</span>
                    )}
                  </label>
                  {touched.apellidoMaterno && errors.apellidoMaterno && (
                    <div className="text-red-400 text-xs mb-2 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.apellidoMaterno}
                    </div>
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

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Teléfono *
                      {touched.telefono && !errors.telefono && formData.telefono && (
                        <span className="text-green-400 text-xs ml-2">✓ Válido</span>
                      )}
                    </label>
                    {touched.telefono && errors.telefono && (
                      <div className="text-red-400 text-xs mb-2 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.telefono}
                      </div>
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
                    {formData.telefono && (
                      <div className="text-xs text-gray-400 mt-1">
                        {formData.telefono.length}/8 dígitos
                        {formData.telefono.length === 8 && !errors.telefono && (
                          <span className="text-green-400 ml-2">✓ Completo</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Fecha de Nacimiento *
                      {touched.fechaNacimiento && !errors.fechaNacimiento && formData.fechaNacimiento && (
                        <span className="text-green-400 text-xs ml-2">✓ Válido</span>
                      )}
                    </label>
                    {touched.fechaNacimiento && errors.fechaNacimiento && (
                      <div className="text-red-400 text-xs mb-2 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.fechaNacimiento}
                      </div>
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
                </div>
              </div>

              {/* Información de Cuenta */}
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-[#3AAFA9] rounded-full mr-3"></span>
                  Información de Cuenta
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre de Usuario *
                      {touched.username && !errors.username && formData.username && (
                        <span className="text-green-400 text-xs ml-2">✓ Válido</span>
                      )}
                    </label>
                    {touched.username && errors.username && (
                      <div className="text-red-400 text-xs mb-2 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.username}
                      </div>
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
                    {formData.username && (
                      <div className="text-xs text-gray-400 mt-1">
                        {formData.username.length}/3 caracteres mínimos
                        {formData.username.length >= 3 && !errors.username && (
                          <span className="text-green-400 ml-2">✓ Suficiente</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Correo Electrónico *
                      {touched.email && !errors.email && formData.email && (
                        <span className="text-green-400 text-xs ml-2">✓ Válido</span>
                      )}
                    </label>
                    {touched.email && errors.email && (
                      <div className="text-red-400 text-xs mb-2 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.email}
                      </div>
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contraseña *
                      {touched.password && !errors.password && formData.password && (
                        <span className="text-green-400 text-xs ml-2">✓ Válida</span>
                      )}
                    </label>
                    {touched.password && errors.password && (
                      <div className="text-red-400 text-xs mb-2 flex items-center">
                        <span className="mr-1">⚠</span>
                        {errors.password}
                      </div>
                    )}
                    <PasswordInput
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur('password')}
                      required
                      placeholder="Mínimo 6 caracteres con mayúsculas, minúsculas y números"
                      minLength="6"
                      className={getInputClassName('password').replace('py-3', 'py-3')}
                    />
                    {formData.password && (
                      <div className="text-xs text-gray-400 mt-1">
                        <div>Longitud: {formData.password.length}/6 caracteres {formData.password.length >= 6 && '✓'}</div>
                        {formData.password.length >= 6 && (
                          <>
                            <div className={/(?=.*[a-z])/.test(formData.password) ? 'text-green-400' : 'text-red-400'}>
                              • {/(?=.*[a-z])/.test(formData.password) ? '✓' : '✗'} Minúsculas
                            </div>
                            <div className={/(?=.*[A-Z])/.test(formData.password) ? 'text-green-400' : 'text-red-400'}>
                              • {/(?=.*[A-Z])/.test(formData.password) ? '✓' : '✗'} Mayúsculas
                            </div>
                            <div className={/(?=.*\d)/.test(formData.password) ? 'text-green-400' : 'text-red-400'}>
                              • {/(?=.*\d)/.test(formData.password) ? '✓' : '✗'} Números
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      URL de Imagen (Opcional)
                    </label>
                    <input 
                      type="text" 
                      name="urlImagen" 
                      value={formData.urlImagen} 
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] focus:border-transparent transition-all text-white placeholder-gray-400"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                </div>
              </div>

              <input type="hidden" name="categoria" value="NUEVO" />

              <button 
                type="submit" 
                disabled={isLoading || !isFormValid()}
                className={`w-full py-4 px-6 text-white font-semibold rounded-xl transition-all duration-300 ${
                  isLoading || !isFormValid()
                    ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#2B7A78] to-[#3AAFA9] hover:from-[#3AAFA9] hover:to-[#2B7A78] hover:shadow-lg'
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

            <div className="mt-8 text-center space-y-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-[#3AAFA9] hover:text-[#2B7A78] transition-colors font-medium block w-full"
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