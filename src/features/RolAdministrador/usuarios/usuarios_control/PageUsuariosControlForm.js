import React, { useState, useEffect } from "react";
import PasswordInput from "../../../../auth/components/PasswordInput";
import "./PageUsuariosControlForm.css";

import { useAuth } from "../../../../auth/hooks/useAuth";
import { crearYAsignarUsuarioControlAAdministrador } from "../../../../api/administradorApi";

export default function PageUsuariosControlForm({ initialData, onSave, onCancel, onUsuarioCreado }) {
  const { user } = useAuth();
  const adminId = user?.idPersona;

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
  const [pasoActual, setPasoActual] = useState("");

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
    
    if (!adminId) {
      setErrors({ 
        submit: "Error: No se identificó al administrador. Cierre sesión y vuelva a iniciar." 
      });
      return;
    }
    
    setIsLoading(true);
    setPasoActual("validando");
    
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
      setPasoActual("");
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

      console.log(`📤 Iniciando creación para admin ${adminId}`);
      
      if (initialData) {
        await onSave(payload);
      } else {
        setPasoActual("creando_usuario");
        
        // Proceso completo: crear + asignar con cancha
        const resultado = await crearYAsignarUsuarioControlAAdministrador(adminId, payload);
        
        console.log("✅ Resultado completo:", resultado);
        
        setSuccessData({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          adminId: adminId,
          usuarioId: resultado.idUsuario || resultado.usuario?.id || "N/A",
          nombreUsuario: resultado.usuario?.nombre || formData.nombre,
          mensaje: resultado.message || "¡Usuario creado y asignado exitosamente!",
          asignado: resultado.usuario ? true : false
        });
        
        setShowSuccessPopup(true);
        setPasoActual("completado");
        
        // Refrescar lista
        if (onUsuarioCreado) {
          setTimeout(() => {
            onUsuarioCreado();
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error completo:", error);
      
      let errorMessage = "Error al registrar el usuario de control";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (errorMessage.includes("username") || errorMessage.includes("Username")) {
        errorMessage = "El nombre de usuario ya existe. Elige otro.";
      } else if (errorMessage.includes("email") || errorMessage.includes("Email")) {
        errorMessage = "El email ya está registrado. Usa otro email.";
      }
      
      setErrors({ submit: errorMessage });
      setPasoActual("");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showSuccessPopup) {
      const popupElement = document.createElement('div');
      popupElement.id = 'global-success-popup';
      
      const mensajePrincipal = successData?.asignado 
        ? "Usuario creado correctamente"
        : "⚠️ Usuario creado - Asignación pendiente";
      
      const colorBorde = successData?.asignado ? "#4CAF50" : "#FF9800";
      const colorFondo = successData?.asignado ? "#e8f5e9" : "#fff3e0";
      const colorTexto = successData?.asignado ? "#2e7d32" : "#e65100";
      
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
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
          </style>
          <div style="
            background-color: white;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            animation: slideUp 0.3s ease;
            border: 3px solid ${colorBorde};
          ">
            <div style="
              background-color: ${colorBorde};
              color: white;
              padding: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <h3 style="margin: 0; font-size: 1.3rem; font-weight: 600;">
                ${successData?.asignado ? "¡Éxito!" : "Atención"}
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
              ">
                ×
              </button>
            </div>
            
            <div style="padding: 25px;">
              <div style="
                padding: 15px;
                background-color: ${colorFondo};
                border: 2px solid ${colorBorde};
                border-radius: 8px;
                color: ${colorTexto};
                font-size: 0.95rem;
                text-align: center;
                margin-bottom: 20px;
                font-weight: 500;
              ">
                ${successData?.asignado ? '✅ ' : '⚠️ '}
                <strong>${mensajePrincipal}</strong>
                ${successData?.asignado ? 
                  '<div style="margin-top: 8px; font-size: 0.9rem;">El usuario ya aparece en tu lista y tiene una cancha asignada</div>' :
                  '<div style="margin-top: 8px; font-size: 0.9rem;">El usuario fue creado pero necesita asignación manual</div>'
                }
              </div>
              
              <div style="
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 25px;
                border: 1px solid #e9ecef;
              ">
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px dashed #dee2e6;">
                  <strong style="font-size: 0.9rem; color: #666; display: block; margin-bottom: 5px;">Usuario</strong>
                  <span style="
                    font-family: monospace, Consolas;
                    background-color: white;
                    padding: 10px 15px;
                    border-radius: 6px;
                    border: 2px solid #4CAF50;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #333;
                    display: block;
                  ">
                    ${successData?.username || ""}
                  </span>
                </div>
                
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px dashed #dee2e6;">
                  <strong style="font-size: 0.9rem; color: #666; display: block; margin-bottom: 5px;">Contraseña</strong>
                  <span style="
                    font-family: monospace, Consolas;
                    background-color: white;
                    padding: 10px 15px;
                    border-radius: 6px;
                    border: 2px solid #2196F3;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #333;
                    display: block;
                    letter-spacing: 2px;
                  ">
                    ${successData?.password || ""}
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
                  Copiar Credenciales
                </button>
              </div>

              <div style="
                padding: 15px;
                background-color: #fff3e0;
                border: 2px solid #ffb74d;
                border-radius: 8px;
                color: #e65100;
                font-size: 0.9rem;
                text-align: center;
                font-weight: 500;
              ">
                <strong>¡Importante!</strong> Estas credenciales solo se mostrarán una vez.
                Asegúrate de guardarlas o enviarlas al usuario.
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
        setShowSuccessPopup(false);
        setSuccessData(null);
        onCancel();
      };
      
      closeBtn.onclick = closePopup;
      
      copyBtn.onclick = () => {
        const text = `CREDENCIALES DE USUARIO DE CONTROL\n\n` +
                    `Usuario: ${successData.username}\n` +
                    `Contraseña: ${successData.password}\n` +
                    `Email: ${successData.email}\n`+
                    `Puede iniciar sesión en la el sistema con estas credenciales.`;
        
        navigator.clipboard.writeText(text)
          .then(() => {
            const notification = document.createElement('div');
            notification.style.cssText = `
              position: fixed;
              top: 20px;
              right: 20px;
              background: linear-gradient(135deg, #4CAF50, #2E7D32);
              color: white;
              padding: 15px 25px;
              border-radius: 10px;
              box-shadow: 0 5px 15px rgba(0,0,0,0.3);
              z-index: 100000;
              animation: slideIn 0.3s ease;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 10px;
            `;
            notification.innerHTML = `
              <style>
                @keyframes slideIn {
                  from { transform: translateX(100%); opacity: 0; }
                  to { transform: translateX(0); opacity: 1; }
                }
              </style>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
              ¡Credenciales copiadas al portapapeles!
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
              if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
              }
            }, 3000);
          })
          .catch(err => {
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
        
        <div style={{ 
          marginBottom: '1rem', 
          padding: '1rem', 
          backgroundColor: adminId ? '#e8f5e9' : '#ffebee',
          borderRadius: '8px',
          border: adminId ? '2px solid #4CAF50' : '2px solid #f44336'
        }}>
          {adminId ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#4CAF50',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                ✓
              </div>
              <div>
                <strong style={{ color: '#2e7d32' }}>Registra un nuevo usuario de control</strong>
                <div style={{ fontSize: '0.9rem', color: '#555', marginTop: '5px' }}>
                  {/*ID: <strong>{adminId}</strong> | Usuario: <strong>{user?.username || "N/A"}</strong><br/> */}
                  <span style={{ color: '#4CAF50' }}>El usuario será asignado automáticamente a tu área, recuerda asignar las canchas</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#f44336',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                !
              </div>
              <div>
                <strong style={{ color: '#c62828' }}>Error: Administrador no identificado</strong>
                <div style={{ fontSize: '0.9rem', color: '#c62828', marginTop: '5px' }}>
                  No se pudo obtener el ID del administrador. Cierre sesión y vuelva a iniciar.
                </div>
              </div>
            </div>
          )}
        </div>

        {errors.submit && (
          <div className="form-error" style={{ 
            marginBottom: '1rem', 
            padding: '0.75rem', 
            backgroundColor: '#ffebee', 
            borderRadius: '8px',
            border: '2px solid #f44336'
          }}>
            <strong>Error:</strong> {errors.submit}
          </div>
        )}

        {isLoading && pasoActual && (
          <div style={{ 
            marginBottom: '1rem', 
            padding: '0.75rem', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '8px',
            border: '2px solid #2196F3',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #2196F3',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <div>
              <strong>Procesando...</strong>
              <div style={{ fontSize: '0.9rem', color: '#555' }}>
                {pasoActual === "creando_usuario" ? "Creando usuario en el sistema..." : 
                 pasoActual === "asignando" ? "Asignando al administrador..." : 
                 "Validando datos..."}
              </div>
            </div>
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
            disabled={initialData || isLoading}
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
            disabled={isLoading}
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
              disabled={isLoading}
            />
          ) : (
            <PasswordInput
              name="password"
              value={formData.password}
              onChange={handlePasswordChange}
              placeholder="Mínimo 6 caracteres"
              minLength="6"
              className={errors.password ? 'error-field' : ''}
              disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        <div className="form-row">
          <label>Nombre *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={errors.nombre ? 'error-field' : ''}
            placeholder="Tu nombre"
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
          {errors.direccion && <div className="form-error">{errors.direccion}</div>}
        </div>

        <div className="form-row">
          <label>Estado Operativo *</label>
          <select
            name="estadoOperativo"
            value={formData.estadoOperativo}
            onChange={handleChange}
            className={errors.estadoOperativo ? 'error-field' : ''}
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
          {errors.horaFinTurno && <div className="form-error">{errors.horaFinTurno}</div>}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isLoading || !adminId}
            style={{
              backgroundColor: (!adminId || isLoading) ? '#9e9e9e' : '#4CAF50',
              cursor: (!adminId || isLoading) ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? (
              <>
                <span style={{ display: 'inline-block', marginRight: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #f3f3f3',
                    borderTop: '2px solid #3498db',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    display: 'inline-block'
                  }}></div>
                </span>
                {pasoActual === "creando_usuario" ? "Creando..." : 
                 pasoActual === "asignando" ? "Asignando..." : "Procesando..."}
              </>
            ) : (
              initialData ? "Guardar Cambios" : "Crear Usuario"
            )}
          </button>
          <button 
            type="button" 
            className="btn-cancel" 
            onClick={onCancel} 
            disabled={isLoading}
          >
            Cancelar
          </button>
        </div>
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </form>
    </>
  );
}