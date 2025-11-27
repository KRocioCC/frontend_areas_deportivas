import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Componente PasswordInput para el modal
const PasswordInputModal = ({ value, onChange, placeholder, className = '' }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3AAFA9] pr-10 ${className}`}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors focus:outline-none"
      >
        {showPassword ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        )}
      </button>
    </div>
  );
};

const RegisterTypeSelector = () => {
  const navigate = useNavigate();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const ADMIN_SPECIAL_PASSWORD = 'passwordadmin';

  const handleAdminClick = () => {
    setShowAdminModal(true);
  };

  const handleAdminPasswordSubmit = () => {
    if (adminPassword === ADMIN_SPECIAL_PASSWORD) {
      setShowAdminModal(false);
      setAdminPassword('');
      setPasswordError('');
      // CORREGIDO: Ahora redirige al registro de administrador
      navigate('/register/administrador');
    } else {
      setPasswordError('Contraseña incorrecta');
    }
  };

  const Card = ({ title, description, features, onClick, borderColor, hoverColor }) => (
    <div 
      onClick={onClick}
      className={`p-6 border-2 ${borderColor} rounded-xl cursor-pointer bg-gray-900/40 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group border-white/20 hover:scale-105 transform`}
    >
      <div className="text-center">
        <div className={`w-14 h-14 mx-auto mb-3 rounded-full ${hoverColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-xl">👤</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300 mb-3 text-sm">{description}</p>
        <ul className="text-xs text-gray-400 space-y-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="w-1.5 h-1.5 bg-[#3AAFA9] rounded-full mr-2"></span>
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <button className={`px-4 py-1.5 rounded-full ${hoverColor} text-white font-semibold text-sm transition-all duration-300`}>
            Seleccionar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Modal para contraseña de administrador */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Verificación de Administrador
            </h3>
            <p className="text-gray-300 text-center mb-4">
              Ingresa la contraseña que el Sistema te dio para solicitar ser administrador
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña Especial
                </label>
                <PasswordInputModal
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Ingresa la contraseña especial"
                />
                {passwordError && (
                  <div className="text-red-400 text-xs mt-1">{passwordError}</div>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAdminModal(false);
                    setAdminPassword('');
                    setPasswordError('');
                  }}
                  className="flex-1 py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAdminPasswordSubmit}
                  className="flex-1 py-2 px-4 bg-[#3AAFA9] text-white rounded-lg hover:bg-[#2B7A78] transition-colors"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-black py-6">
        <div className="container mx-auto px-4">
          
          {/* Header compacto */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <img
                src="/logo.svg" 
                alt="Logo" 
                className="h-12 mx-auto mb-3"
              />
              <h1 className="text-2xl font-bold text-white mb-1">
                Únete a Nosotros
              </h1>
              <p className="text-gray-300 text-sm">
                Tu reserva, simple y segura
              </p>
            </div>
          </div>

          {/* Cards más compactas */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card
              title="Cliente"
              description="Acceso rápido para reservar canchas"
              features={[
                "Reserva canchas inmediatamente",
                "Sin necesidad de aprobación",
                "Gestión de reservas personales",
                "Acceso 24/7"
              ]}
              onClick={() => navigate('/register/cliente')}
              borderColor="border-[#2B7A78]"
              hoverColor="bg-[#2B7A78]"
            />

            <Card
              title="Administrador"
              description="Para gestionar áreas deportivas"
              features={[
                "Requiere contraseña especial",
                "Aprobación del superusuario",
                "Gestión de áreas deportivas",
                "Supervisión de canchas"
              ]}
              onClick={handleAdminClick}
              borderColor="border-[#3AAFA9]"
              hoverColor="bg-[#3AAFA9]"
            />
          </div>

          <div className="text-center mt-8">
            <button 
              onClick={() => navigate('/login')}
              className="text-gray-300 hover:text-gray-200 transition-colors text-sm font-semibold flex items-center justify-center mx-auto"
            >
              <span className="mr-2">←</span>
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterTypeSelector;