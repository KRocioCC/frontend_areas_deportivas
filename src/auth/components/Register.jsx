import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    rolSolicitado: 'ROL_ADMINISTRADOR',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefono: '',
    fechaNacimiento: '',
    urlImagen: ''
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
      await authService.register(formData);
      setSuccess('Solicitud registrada correctamente. Pendiente de aprobación por un administrador.');
      setFormData({
        username: '',
        password: '',
        email: '',
        rolSolicitado: 'ROL_CLIENTE',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        telefono: '',
        fechaNacimiento: '',
        urlImagen: ''
      });
    } catch (err) {
      setError(err.message || ' Error al registrar usuario.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#17252A] via-[#2B7A78] to-[#3AAFA9]">
      <div className="m-auto w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-semibold text-center text-[#17252A] mb-6">Registro de Usuario</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required placeholder="Nombre" className="w-full px-3 py-2 border rounded-md" />
          <input type="text" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} required placeholder="Apellido Paterno" className="w-full px-3 py-2 border rounded-md" />
          <input type="text" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} required placeholder="Apellido Materno" className="w-full px-3 py-2 border rounded-md" />
          <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required placeholder="Teléfono" className="w-full px-3 py-2 border rounded-md" />
          <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
          <input type="text" name="urlImagen" value={formData.urlImagen} onChange={handleChange} placeholder="URL de imagen de perfil" className="w-full px-3 py-2 border rounded-md" />
          <input type="text" name="username" value={formData.username} onChange={handleChange} required placeholder="Nombre de usuario" className="w-full px-3 py-2 border rounded-md" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Correo electrónico" className="w-full px-3 py-2 border rounded-md" />
          <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Contraseña" className="w-full px-3 py-2 border rounded-md" />

          <select name="rolSolicitado" value={formData.rolSolicitado} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
            <option value="ROL_CLIENTE">Cliente</option>
            <option value="ROL_ADMINISTRADOR">Administrador</option>
            <option value="ROL_SUPERUSUARIO">Superusuario</option>
          </select>

          <button type="submit" disabled={isLoading} className={`w-full py-2 px-4 text-white font-medium rounded-md bg-[#2B7A78] hover:bg-[#3AAFA9] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => navigate('/login')} className="text-[#17252A] hover:underline">
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
