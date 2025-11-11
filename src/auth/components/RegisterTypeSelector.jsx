import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterTypeSelector = () => {
  const navigate = useNavigate();

  const Card = ({ title, description, features, onClick, borderColor, hoverColor }) => (
    <div 
      onClick={onClick}
      className={`p-8 border-2 ${borderColor} rounded-xl cursor-pointer bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 group`}
    >
      <div className="text-center">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${hoverColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <span className="text-2xl">👤</span>
        </div>
        <h3 className="text-2xl font-bold text-[#17252A] mb-3 group-hover:text-[#2B7A78] transition-colors">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <ul className="text-sm text-gray-500 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="w-2 h-2 bg-[#3AAFA9] rounded-full mr-3"></span>
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <button className={`px-6 py-2 rounded-full ${hoverColor} text-white font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
            Seleccionar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#17252A] via-[#2B7A78] to-[#3AAFA9] py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
            Únete a Nosotros
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Selecciona el tipo de cuenta que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card
            title="Cliente"
            description="Acceso rápido para reservar canchas deportivas"
            features={[
              "Reserva canchas inmediatamente",
              "Sin necesidad de aprobación",
              "Gestión de tus reservas personales",
              "Acceso 24/7"
            ]}
            onClick={() => navigate('/register/cliente')}
            borderColor="border-[#2B7A78]"
            hoverColor="bg-[#2B7A78] hover:bg-[#3AAFA9]"
          />

          <Card
            title="Administrador"
            description="Para gestionar áreas deportivas y canchas"
            features={[
              "Requiere contraseña especial",
              "Aprobación del superusuario",
              "Gestión de áreas deportivas",
              "Supervisión de canchas"
            ]}
            onClick={() => navigate('/register/administrador')}
            borderColor="border-[#3AAFA9]"
            hoverColor="bg-[#3AAFA9] hover:bg-[#2B7A78]"
          />
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/login')}
            className="text-white hover:text-gray-200 transition-colors text-lg font-semibold hover:underline"
          >
            ← ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterTypeSelector;