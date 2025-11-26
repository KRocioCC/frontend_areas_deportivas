import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterTypeSelector = () => {
  const navigate = useNavigate();

  const Card = ({ title, description, features, onClick, borderColor, hoverColor }) => (
    <div 
      onClick={onClick}
      className={`p-8 border-2 ${borderColor} rounded-xl cursor-pointer bg-white/10 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group border-white/20 hover:scale-105 transform`}
    >
      <div className="text-center">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${hoverColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-2xl">👤</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        <ul className="text-sm text-gray-400 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="w-2 h-2 bg-[#3AAFA9] rounded-full mr-3"></span>
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <button className={`px-6 py-2 rounded-full ${hoverColor} text-white font-semibold transition-all duration-300`}>
            Seleccionar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="container mx-auto px-4">
        
        {/* Header con logo y lema */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <img
              src={"/logo.svg"} 
              alt="Logo" 
              className="h-16 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-white mb-2">
              Únete a Nosotros
            </h1>
            <p className="text-gray-300 text-lg">
              Tu reserva, simple y segura
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card
            title="Cliente"
            description="Acceso rápido para reservar canchas deportivas"
            features={[
              "Reserva canchas inmediatamente",
              "Ingresa directamente",
              "Gestión de tus reservas personales",
              "Acceso 24/7"
            ]}
            onClick={() => navigate('/register/cliente')}
            borderColor="border-[#2B7A78]"
            hoverColor="bg-[#2B7A78]"
          />

          <Card
            title="Administrador"
            description="Para gestionar áreas deportivas y canchas"
            features={[
              "Requiere contraseña especial",
              "Solicita la aprobacion al superusuario",
              "Gestiona tu area deportiva",
              "Supervisa tus canchas, reservas y mucho mas"
            ]}
            onClick={() => navigate('/register/administrador')}
            borderColor="border-[#3AAFA9]"
            hoverColor="bg-[#3AAFA9]"
          />
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/login')}
            className="text-gray-400 hover:text-gray-300 transition-colors text-lg font-semibold flex items-center justify-center mx-auto"
          >
            <span className="mr-2">←</span>
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterTypeSelector;