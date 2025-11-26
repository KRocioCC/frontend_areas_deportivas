import React, { useState } from 'react';
import PasswordInput from '../../../auth/components/PasswordInput';
import './personaForm.css';

const AdministradorFormRegister = ({ onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    nombre: '',
    aPaterno: '',
    aMaterno: '',
    telefono: '',
    fechaNacimiento: '',
    urlImagen: '',
    direccion: '',
    cargo: 'Administrador general',
    estado: true
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validar que todos los campos requeridos estén llenos
      const requiredFields = ['username', 'password', 'email', 'nombre', 'aPaterno', 'aMaterno', 'telefono', 'direccion'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Faltan campos requeridos: ${missingFields.join(', ')}`);
      }

      const savePayload = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        nombre: formData.nombre,
        aPaterno: formData.aPaterno,
        aMaterno: formData.aMaterno,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        urlImagen: formData.urlImagen,
        direccion: formData.direccion,
        cargo: formData.cargo,
        estado: formData.estado
      };

      console.log('Payload completo administrador:', savePayload);
      await onSave(savePayload);
    } catch (err) {
      setError(err.message || 'Error al registrar administrador.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Registrar Nuevo Administrador</h3>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="persona-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-section">
            <h4>Información Personal</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre *</label>
                <input 
                  type="text" 
                  name="nombre" 
                  value={formData.nombre} 
                  onChange={handleChange} 
                  required 
                  placeholder="Tu nombre"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Apellido Paterno *</label>
                <input 
                  type="text" 
                  name="aPaterno" 
                  value={formData.aPaterno} 
                  onChange={handleChange} 
                  required 
                  placeholder="Apellido paterno"
                />
              </div>
              <div className="form-group">
                <label>Apellido Materno *</label>
                <input 
                  type="text" 
                  name="aMaterno" 
                  value={formData.aMaterno} 
                  onChange={handleChange} 
                  required 
                  placeholder="Apellido materno"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Teléfono *</label>
                <input 
                  type="text" 
                  name="telefono" 
                  value={formData.telefono} 
                  onChange={handleChange} 
                  required 
                  pattern="[0-9]{8}"
                  placeholder="12345678"
                  maxLength="8"
                />
              </div>
              <div className="form-group">
                <label>Fecha de Nacimiento *</label>
                <input 
                  type="date" 
                  name="fechaNacimiento" 
                  value={formData.fechaNacimiento} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Dirección *</label>
                <input 
                  type="text" 
                  name="direccion" 
                  value={formData.direccion} 
                  onChange={handleChange} 
                  required 
                  placeholder="Dirección completa"
                />
              </div>
              <div className="form-group">
                <label>Cargo</label>
                <input 
                  type="text" 
                  name="cargo" 
                  value={formData.cargo} 
                  readOnly
                  className="form-select readonly-field"
                  style={{backgroundColor: '#f5f5f5', color: '#666'}}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Información de Cuenta</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre de Usuario *</label>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  required 
                  placeholder="usuario123"
                />
              </div>
              <div className="form-group">
                <label>Correo Electrónico *</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Contraseña *</label>
                <PasswordInput
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Mínimo 6 caracteres"
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>URL de Imagen (Opcional)</label>
                <input 
                  type="text" 
                  name="urlImagen" 
                  value={formData.urlImagen} 
                  onChange={handleChange} 
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Estado</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      name="estado" 
                      checked={formData.estado} 
                      onChange={handleChange} 
                    />
                    <span className="checkmark"></span>
                    Administrador Activo
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Crear Administrador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdministradorFormRegister;