// src/features/personas/ROL-Administrador/mi_area/MiAreaPage.js
import React, { useEffect, useMemo, useState } from 'react';
import { getAreadeportivaPorAdminId, createAreadeportiva } from "../../../api/AreadeportivaApi";
import { getZonas } from "../../../api/ZonaApi";
import { useAuth } from '../../../auth/hooks/useAuth';
import './MiAreaPage.css';

const MiAreaPage = () => {
  const { currentUser } = useAuth();

  const [area, setArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createMode, setCreateMode] = useState(false);
  const [zonas, setZonas] = useState([]);
  const [loadingZonas, setLoadingZonas] = useState(false);
  const [formData, setFormData] = useState({
    nombreArea: '',
    descripcionArea: '',
    latitud: '',
    longitud: '',
    telefonoArea: '',
    emailArea: '',
    horaInicioArea: '08:00',
    horaFinArea: '16:00',
    urlImagen: '',
    idZona: '',
    estado: true
  });

  // --- CARGAR ZONAS ----------------------------------------------------------
  useEffect(() => {
    const loadZonas = async () => {
      try {
        setLoadingZonas(true);
        console.log('🗺️ Cargando lista de zonas...');
        const zonasData = await getZonas();
        console.log('✅ Zonas cargadas:', zonasData);
        setZonas(zonasData);
      } catch (error) {
        console.error('Error al cargar zonas:', error);
        alert('Error al cargar la lista de zonas');
      } finally {
        setLoadingZonas(false);
      }
    };

    loadZonas();
  }, []);

  // --- CARGA INICIAL DEL ÁREA ------------------------------------------------
  useEffect(() => {
    if (!currentUser?.idPersona) {
      console.log(' No hay currentUser.idPersona');
      setLoading(false);
      return;
    }

    const checkAreaExists = async () => {
      try {
        console.log('Verificando si existe área para admin ID:', currentUser.idPersona);
        
        const data = await getAreadeportivaPorAdminId(currentUser.idPersona);
        console.log('rea encontrada:', data);
        
        if (data) {
          // Si existe área, la mostramos
          setArea(data);
          setCreateMode(false);
        } else {
          // Si no existe área, activamos modo creación
          console.log('📭 No existe área, activando modo creación...');
          setCreateMode(true);
        }
      } catch (error) {
        console.error('❌ Error al verificar área:', error);
        
        // Si hay error 401 (no tiene área), activamos modo creación
        if (error.response?.status === 401) {
          console.log('401 - Administrador sin área, activando modo creación');
          setCreateMode(true);
        } else {
          console.error('Error desconocido:', error);
          setCreateMode(true);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAreaExists();
  }, [currentUser]);

  // --- HANDLERS PARA MODO CREACIÓN -------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateArea = async () => {
    try {
      
      
        const payload = {
        id: currentUser.idPersona, 
        nombreArea: formData.nombreArea.trim(),
        descripcionArea: formData.descripcionArea?.trim() || '',
        latitud: formData.latitud ? Number(formData.latitud) : null,
        longitud: formData.longitud ? Number(formData.longitud) : null,
        telefonoArea: formData.telefonoArea?.trim() || '',
        emailArea: formData.emailArea?.trim() || '',
        horaInicioArea: formData.horaInicioArea || '08:00',
        horaFinArea: formData.horaFinArea || '16:00',
        urlImagen: formData.urlImagen || '',
        idZona: Number(formData.idZona),
        estado: true
      };

      // ENDPOINT POST para crear el área
      const newArea = await createAreadeportiva(payload);
      
      console.log(' Área creada exitosamente:', newArea);
      
      // Actualizar estado
      setArea(newArea);
      setCreateMode(false);
      
      alert(' ¡Área deportiva creada exitosamente!');
      
    } catch (error) {
      console.error(' Error al crear área:', error);
      alert(' Error al crear el área deportiva. Revisa la consola para más detalles.');
    }
  };

  // --- RENDER ----------------------------------------------------------------
  if (loading) {
    return <div className="mi-area-loading">Cargando...</div>;
  }

  // MODO CREACIÓN - Administrador nuevo sin área
  if (createMode) {
    return (
      <div className="mi-area-container">
        <div className="mi-area-card">
          <div className="welcome-banner">
            <h1>¡Bienvenido a QJuego , {currentUser?.username}!</h1>
            <p>Por favor, registra los datos de tu área deportiva para comenzar</p>
            
          </div>

          <div className="mi-area-form">
            <div className="form-section">
              <h3>Información Básica</h3>
              
              <div className="mi-area-row">
                <label>Nombre del Área *</label>
                <input 
                  name="nombreArea" 
                  value={formData.nombreArea} 
                  onChange={handleChange}
                  placeholder="Ej: Cancha Los Olivos, Estadio Municipal, etc."
                  required
                />
              </div>

              <div className="mi-area-row">
                <label>Zona *</label>
                {loadingZonas ? (
                  <div>Cargando zonas...</div>
                ) : (
                  <select 
                    name="idZona" 
                    value={formData.idZona} 
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona una zona</option>
                    {zonas.map((zona) => (
                      <option key={zona.idZona} value={zona.idZona}>
                        {zona.nombre}
                      </option>
                    ))}
                  </select>
                )}
                {zonas.length === 0 && !loadingZonas && (
                  <small style={{color: 'red'}}>
                    No hay zonas disponibles. Contacta al administrador del sistema.
                  </small>
                )}
              </div>

              <div className="mi-area-row">
                <label>Descripción</label>
                <textarea 
                  name="descripcionArea" 
                  value={formData.descripcionArea} 
                  onChange={handleChange}
                  placeholder="Describe las instalaciones, deportes disponibles, servicios..."
                  rows="3"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Contacto</h3>
              
              <div className="mi-area-row">
                <label>Teléfono</label>
                <input 
                  name="telefonoArea" 
                  value={formData.telefonoArea} 
                  onChange={handleChange}
                  placeholder="Ej: 76543210"
                />
              </div>

              <div className="mi-area-row">
                <label>Email</label>
                <input 
                  name="emailArea" 
                  value={formData.emailArea} 
                  onChange={handleChange}
                  placeholder="Ej: contacto@miarea.com"
                  type="email"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Ubicación</h3>
              
              <div className="mi-area-row two-cols">
                <div>
                  <label>Latitud</label>
                  <input 
                    name="latitud" 
                    value={formData.latitud} 
                    onChange={handleChange}
                    placeholder="Ej: -16.123456"
                  />
                </div>
                <div>
                  <label>Longitud</label>
                  <input 
                    name="longitud" 
                    value={formData.longitud} 
                    onChange={handleChange}
                    placeholder="Ej: -68.123456"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Horarios</h3>
              
              <div className="mi-area-row two-cols">
                <div>
                  <label>Hora Apertura</label>
                  <input 
                    name="horaInicioArea" 
                    value={formData.horaInicioArea} 
                    onChange={handleChange} 
                    type="time"
                  />
                </div>
                <div>
                  <label>Hora Cierre</label>
                  <input 
                    name="horaFinArea" 
                    value={formData.horaFinArea} 
                    onChange={handleChange} 
                    type="time"
                  />
                </div>
              </div>
            </div>

            <div className="mi-area-actions">
              <button 
                className="btn-primary" 
                onClick={handleCreateArea}
                disabled={!formData.idZona || !formData.nombreArea.trim() || !currentUser?.idPersona}
              >
                Crear Mi Área Deportiva
              </button>
              <small style={{display: 'block', marginTop: '10px', color: '#666'}}>
                * Campos obligatorios
              </small>
              {!currentUser?.idPersona && (
                <small style={{color: 'red', display: 'block', marginTop: '5px'}}>
                  Error: No se pudo identificar al administrador
                </small>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MODO NORMAL - Administrador con área existente
  if (!area) {
    return (
      <div className="mi-area-container">
        <div className="mi-area-card">
          <div className="mi-area-error">
            <h2>No se pudo cargar la información del área</h2>
            <p>Intenta recargar la página o contacta al administrador del sistema.</p>
            <button 
              className="btn-primary" 
              onClick={() => window.location.reload()}
            >
              Recargar Página
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mi-area-container">
      <div className="mi-area-card">
        <h1>Mi Área Deportiva: {area.nombreArea || 'Sin nombre'}</h1>
        <p className="mi-area-zona">
          Zona: {area.zona?.nombre || "No asignada"}
        </p>
        
        <div className="mi-area-info">
          <p><strong>Descripción:</strong> {area.descripcionArea || "Sin descripción"}</p>
          <p><strong>Teléfono:</strong> {area.telefonoArea || "No especificado"}</p>
          <p><strong>Email:</strong> {area.emailArea || "No especificado"}</p>
          <p><strong>Horario:</strong> {area.horaInicioArea || '--:--'} - {area.horaFinArea || '--:--'}</p>
        </div>

        <div className="mi-area-actions">
          <button className="btn-secondary">
            Editar Información
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiAreaPage;