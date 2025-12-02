import React, { useState, useEffect } from "react";
import PasswordInput from "../../../../auth/components/PasswordInput";
import "./PageUsuariosControlForm.css";

import { crearUsuarioControlRegistro } from "../../../../api/administradorApi";

export default function PageUsuariosControlForm({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    telefono: "",
    fechaNacimiento: "",
    urlImagen: "",
    estadoOperativo: "Activo",
    horaInicioTurno: "",
    horaFinTurno: "",
    direccion: "",
  });

  const [errors, setErrors] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || "",
        password: "",
        email: initialData.email || "",
        nombre: initialData.nombre || "",
        apellidoPaterno: initialData.apellidoPaterno || initialData.apaterno || "",
        apellidoMaterno: initialData.apellidoMaterno || initialData.amaterno || "",
        telefono: initialData.telefono || "",
        fechaNacimiento: initialData.fechaNacimiento || "",
        urlImagen: initialData.urlImagen || "",
        estadoOperativo: initialData.estadoOperativo || "Activo",
        horaInicioTurno: initialData.horaInicioTurno || "",
        horaFinTurno: initialData.horaFinTurno || "",
        direccion: initialData.direccion || "",
      });
    }
  }, [initialData]);

  // Validación en tiempo real
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "username":
        if (!value.trim()) {
          newErrors.username = "El nombre de usuario es obligatorio";
        } else if (value.length < 3 || value.length > 20) {
          newErrors.username = "El nombre debe tener entre 3 y 20 caracteres";
        } else {
          delete newErrors.username;
        }
        break;

      case "email":
        if (!value.trim()) {
          newErrors.email = "El email es obligatorio";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "El formato del email no es válido";
        } else {
          delete newErrors.email;
        }
        break;

      case "password":
        if (!initialData && !value.trim()) {
          newErrors.password = "La contraseña es obligatoria";
        } else if (!initialData && value.length < 6) {
          newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        } else {
          delete newErrors.password;
        }
        break;

      case "nombre":
        if (!value.trim()) {
          newErrors.nombre = "El nombre es obligatorio";
        } else {
          delete newErrors.nombre;
        }
        break;

      case "apellidoPaterno":
        if (!value.trim()) {
          newErrors.apellidoPaterno = "El apellido paterno es obligatorio";
        } else {
          delete newErrors.apellidoPaterno;
        }
        break;

      case "apellidoMaterno":
        if (!value.trim()) {
          newErrors.apellidoMaterno = "El apellido materno es obligatorio";
        } else {
          delete newErrors.apellidoMaterno;
        }
        break;

      case "telefono":
        if (!value.trim()) {
          newErrors.telefono = "El teléfono es obligatorio";
        } else if (!/^[0-9]{8}$/.test(value)) {
          newErrors.telefono = "El teléfono debe tener 8 dígitos";
        } else {
          delete newErrors.telefono;
        }
        break;

      case "fechaNacimiento":
        if (!value) {
          newErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria";
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          if (selectedDate >= today) {
            newErrors.fechaNacimiento = "La fecha debe ser pasada";
          } else {
            delete newErrors.fechaNacimiento;
          }
        }
        break;

      case "estadoOperativo":
        if (!value.trim()) {
          newErrors.estadoOperativo = "El estado operativo es obligatorio";
        } else {
          delete newErrors.estadoOperativo;
        }
        break;

      case "horaInicioTurno":
        if (!value) {
          newErrors.horaInicioTurno = "La hora de inicio es obligatoria";
        } else {
          delete newErrors.horaInicioTurno;
        }
        break;

      case "horaFinTurno":
        if (!value) {
          newErrors.horaFinTurno = "La hora de fin es obligatoria";
        } else if (formData.horaInicioTurno && value <= formData.horaInicioTurno) {
          newErrors.horaFinTurno = "La hora de fin debe ser mayor a la hora de inicio";
        } else {
          delete newErrors.horaFinTurno;
        }
        break;

      case "direccion":
        if (!value.trim()) {
          newErrors.direccion = "La dirección es obligatoria";
        } else {
          delete newErrors.direccion;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validar en tiempo real
    validateField(name, value);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const validationErrors = {};
    
    const requiredFields = ['username', 'email', 'password', 'nombre', 
                           'apellidoPaterno', 'apellidoMaterno', 'telefono',
                           'fechaNacimiento', 'estadoOperativo', 'horaInicioTurno',
                           'horaFinTurno', 'direccion'];
    
    if (initialData) {
      requiredFields.splice(requiredFields.indexOf('password'), 1);
    }
    
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        validationErrors[field] = "Este campo es obligatorio";
      }
    });

    if (!initialData && formData.password && formData.password.length < 6) {
      validationErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (formData.telefono && !/^[0-9]{8}$/.test(formData.telefono)) {
      validationErrors.telefono = "El teléfono debe tener 8 dígitos";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = "El formato del email no es válido";
    }

    if (formData.horaInicioTurno && formData.horaFinTurno && formData.horaFinTurno <= formData.horaInicioTurno) {
      validationErrors.horaFinTurno = "La hora de fin debe ser mayor a la hora de inicio";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        urlImagen: formData.urlImagen || "",
        estadoOperativo: formData.estadoOperativo,
        horaInicioTurno: formData.horaInicioTurno,
        horaFinTurno: formData.horaFinTurno,
        direccion: formData.direccion,
      };

      console.log("📤 Enviando usuario de control:", payload);
      
      if (initialData) {
        await onSave(payload);
      } else {
        const resultado = await crearUsuarioControlRegistro(payload);
        console.log("✅ Usuario creado:", resultado);
        

        setSuccessData({
          username: formData.username,
          password: formData.password
        });
        setShowSuccessPopup(true);
      }
    } catch (error) {
      console.error("Error al guardar usuario de control:", error);
      
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else if (error.message) {
        setErrors({ submit: error.message });
      } else {
        setErrors({ submit: "Error al registrar el usuario de control" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    const text = `Usuario: ${successData.username}\nContraseña: ${successData.password}`;
    navigator.clipboard.writeText(text)
      .then(() => {
        alert("Datos copiados al portapapeles");
      })
      .catch(err => {
        console.error("Error al copiar:", err);
        alert("Error al copiar los datos");
      });
  };

  const closeSuccessPopupAndForm = () => {
    setShowSuccessPopup(false);
    setSuccessData(null);
    onCancel();
  };

  useEffect(() => {
    if (showSuccessPopup) {
      const popupElement = document.createElement('div');
      popupElement.id = 'global-success-popup';
      popupElement.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 99999;
          animation: fadeIn 0.3s ease;
        ">
          <style>
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          </style>
          <div style="
            background-color: white;
            border-radius: 12px;
            width: 90%;
            max-width: 450px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            animation: slideUp 0.3s ease;
            border: 3px solid #4CAF50;
          ">
            <div style="
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <h3 style="margin: 0; font-size: 1.3rem; font-weight: 600;">
                Usuario de Control Registrado
              </h3>
              <button id="popup-close-btn" style="
                background: none;
                border: none;
                color: white;
                fontSize: 28px;
                cursor: pointer;
                lineHeight: 1;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                alignItems: center;
                justifyContent: center;
                borderRadius: 50%;
                transition: background-color 0.2s;
              ">
                ×
              </button>
            </div>
            
            <div style="padding: 25px;">
              <p style="margin-bottom: 20px; font-size: 1rem; color: #333; line-height: 1.5;">
                Usuario creado exitosamente. Envíale estos datos para que pueda iniciar sesión:
              </p>
              
              <div style="
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 25px;
                border: 1px solid #e9ecef;
              ">
                <div style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 15px;
                  padding-bottom: 15px;
                  border-bottom: 2px dashed #dee2e6;
                ">
                  <strong style="font-size: 1rem;">Usuario:</strong>
                  <span style="
                    font-family: monospace, Consolas;
                    background-color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    border: 2px solid #4CAF50;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #333;
                  ">
                    ${successData.username}
                  </span>
                </div>
                <div style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                ">
                  <strong style="font-size: 1rem;">Contraseña:</strong>
                  <span style="
                    font-family: monospace, Consolas;
                    background-color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    border: 2px solid #2196F3;
                    font-size: 1rem;
                    font-weight: 600;
                    color: #333;
                  ">
                    ${successData.password}
                  </span>
                </div>
              </div>

              <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                <button id="popup-copy-btn" style="
                  flex: 1;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 10px;
                  padding: 12px 20px;
                  border: none;
                  border-radius: 8px;
                  cursor: pointer;
                  font-weight: 600;
                  background-color: #2196F3;
                  color: white;
                  font-size: 1rem;
                  transition: all 0.2s;
                ">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copiar Datos
                </button>
              </div>

              <div style="
                padding: 15px;
                background-color: #fff3e0;
                border: 2px solid #ffb74d;
                border-radius: 8px;
                color: #e65100;
                font-size: 0.95rem;
                text-align: center;
                font-weight: 500;
              ">
                ⚠️ <strong>Importante:</strong> Una vez que cierres esta ventana no podrás volver a visualizar estos datos
              </div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(popupElement);
      
      const closeBtn = document.getElementById('popup-close-btn');
      const copyBtn = document.getElementById('popup-copy-btn');
      
      const closePopup = () => {
        const popup = document.getElementById('global-success-popup');
        if (popup) {
          popup.remove();
        }
        closeSuccessPopupAndForm();
      };
      
      closeBtn.onclick = closePopup;
      
      copyBtn.onclick = () => {
        const text = `Usuario: ${successData.username}\nContraseña: ${successData.password}`;
        navigator.clipboard.writeText(text)
          .then(() => {
            alert("Datos copiados al portapapeles");
          })
          .catch(err => {
            console.error("Error al copiar:", err);
            alert("Error al copiar los datos");
          });
      };
      
      const overlay = popupElement.querySelector('div:first-child');
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          closePopup();
        }
      };
    }
    
    return () => {
      const existingPopup = document.getElementById('global-success-popup');
      if (existingPopup) {
        existingPopup.remove();
      }
    };
  }, [showSuccessPopup, successData]);

  return (
    <>
      <form className="UsuarioControl-form" onSubmit={handleSubmit}>
        <h3>{initialData ? "Editar Usuario de Control" : "Nuevo Usuario de Control"}</h3>

        {errors.submit && (
          <div className="form-error" style={{ 
            marginBottom: '1rem', 
            padding: '0.5rem', 
            backgroundColor: '#ffebee', 
            borderRadius: '4px',
            border: '1px solid #f44336'
          }}>
            {errors.submit}
          </div>
        )}

        <div className="form-row">
          <label>Nombre de Usuario *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={errors.username ? 'error-field' : ''}
            placeholder="usuario123"
            disabled={initialData}
          />
          {errors.username && <div className="form-error">{errors.username}</div>}
        </div>

        <div className="form-row">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error-field' : ''}
            placeholder="ejemplo@email.com"
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>

        <div className="form-row">
          <label>Contraseña {!initialData && "*"}</label>
          {initialData ? (
            <input
              type="text"
              value="********"
              readOnly
              placeholder="Dejar en blanco para no cambiar"
              style={{ backgroundColor: '#f5f5f5' }}
            />
          ) : (
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handlePasswordChange}
              placeholder="Mínimo 6 caracteres"
              minLength="6"
              className={errors.password ? 'error-field' : ''}
            />
          )}
          {errors.password && <div className="form-error">{errors.password}</div>}
        </div>

        <div className="form-row">
          <label>URL de Imagen</label>
          <input
            type="text"
            name="urlImagen"
            value={formData.urlImagen}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        {/* Información Personal */}
        <div className="form-row">
          <label>Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={errors.nombre ? 'error-field' : ''}
            placeholder="Tu nombre"
          />
          {errors.nombre && <div className="form-error">{errors.nombre}</div>}
        </div>

        <div className="form-row">
          <label>Apellido Paterno *</label>
          <input
            type="text"
            name="apellidoPaterno"
            value={formData.apellidoPaterno}
            onChange={handleChange}
            className={errors.apellidoPaterno ? 'error-field' : ''}
            placeholder="Apellido paterno"
          />
          {errors.apellidoPaterno && <div className="form-error">{errors.apellidoPaterno}</div>}
        </div>

        <div className="form-row">
          <label>Apellido Materno *</label>
          <input
            type="text"
            name="apellidoMaterno"
            value={formData.apellidoMaterno}
            onChange={handleChange}
            className={errors.apellidoMaterno ? 'error-field' : ''}
            placeholder="Apellido materno"
          />
          {errors.apellidoMaterno && <div className="form-error">{errors.apellidoMaterno}</div>}
        </div>

        <div className="form-row">
          <label>Teléfono *</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className={errors.telefono ? 'error-field' : ''}
            placeholder="12345678"
            maxLength="8"
          />
          {errors.telefono && <div className="form-error">{errors.telefono}</div>}
        </div>

        <div className="form-row">
          <label>Fecha de Nacimiento *</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className={errors.fechaNacimiento ? 'error-field' : ''}
          />
          {errors.fechaNacimiento && <div className="form-error">{errors.fechaNacimiento}</div>}
        </div>

        <div className="form-row">
          <label>Dirección *</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className={errors.direccion ? 'error-field' : ''}
            placeholder="Dirección completa"
          />
          {errors.direccion && <div className="form-error">{errors.direccion}</div>}
        </div>

        {/* Información Laboral */}
        <div className="form-row">
          <label>Estado Operativo *</label>
          <select
            name="estadoOperativo"
            value={formData.estadoOperativo}
            onChange={handleChange}
            className={errors.estadoOperativo ? 'error-field' : ''}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Vacaciones">Vacaciones</option>
            <option value="Licencia">Licencia</option>
          </select>
          {errors.estadoOperativo && <div className="form-error">{errors.estadoOperativo}</div>}
        </div>

        <div className="form-row">
          <label>Hora Inicio Turno *</label>
          <input
            type="time"
            name="horaInicioTurno"
            value={formData.horaInicioTurno}
            onChange={handleChange}
            className={errors.horaInicioTurno ? 'error-field' : ''}
          />
          {errors.horaInicioTurno && <div className="form-error">{errors.horaInicioTurno}</div>}
        </div>

        <div className="form-row">
          <label>Hora Fin Turno *</label>
          <input
            type="time"
            name="horaFinTurno"
            value={formData.horaFinTurno}
            onChange={handleChange}
            className={errors.horaFinTurno ? 'error-field' : ''}
          />
          {errors.horaFinTurno && <div className="form-error">{errors.horaFinTurno}</div>}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
          <button type="button" className="btn-cancel" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}