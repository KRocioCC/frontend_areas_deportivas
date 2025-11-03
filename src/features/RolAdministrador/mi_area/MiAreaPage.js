// src/features/personas/ROL-Administrador/mi_area/MiAreaPage.js
import React, { useEffect, useMemo, useState } from 'react';
import { getAreadeportivaPorAdminId, updateAreadeportivaPorAdminId } from "../../../api/AreadeportivaApi";
import { useAuth } from '../../../auth/hooks/useAuth';
import './MiAreaPage.css';

const MiAreaPage = () => {
  const { currentUser } = useAuth();

  const [area, setArea] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showDebugInfo, setShowDebugInfo] = useState(false); // ← Nuevo estado para debug

  // --- CARGA INICIAL ---------------------------------------------------------
  useEffect(() => {
    if (!currentUser?.idPersona) return;

    const fetchArea = async () => {
      try {
        console.log('Iniciando carga del área para admin ID:', currentUser.idPersona);
        const data = await getAreadeportivaPorAdminId(currentUser.idPersona);
        console.log(' Área cargada:', data);

        // Guarda el objeto completo para mostrarlo
        setArea(data);

        // IMPORTANTE: tomar idZona desde data.zona.idZona
        setFormData({
          idAreadeportiva: data.idAreadeportiva ?? null,
          idZona: data?.zona?.idZona ?? '',          // <- zONA
          estado: data.estado ?? true,

          nombreArea: data.nombreArea || '',
          descripcionArea: data.descripcionArea || '',
          latitud: data.latitud ?? '',
          longitud: data.longitud ?? '',
          telefonoArea: data.telefonoArea || '',
          emailArea: data.emailArea || '',
          horaInicioArea: data.horaInicioArea || '',
          horaFinArea: data.horaFinArea || '',
          urlImagen: data.urlImagen || ''
        });
      } catch (error) {
        console.error("Error al cargar el área:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArea();
  }, [currentUser?.idPersona]);

  // --- HANDLERS --------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      console.log(' Iniciando guardado...');
      
      // Validación mínima de zona
      const idZona = Number(formData.idZona || area?.zona?.idZona);
      if (!idZona) {
        alert("No se puede guardar: falta idZona.");
        return;
      }

      const payload = {
        id: currentUser.idPersona, 
        idAreadeportiva: formData.idAreadeportiva ?? area?.idAreadeportiva ?? null,
        idZona: idZona, 
        
        // Campos de ubicación (NotNull en el DTO)
        latitud: formData.latitud === '' ? null : Number(formData.latitud),
        longitud: formData.longitud === '' ? null : Number(formData.longitud),
        
        // Campos obligatorios en el DTO
        nombreArea: formData.nombreArea?.trim() ?? area?.nombreArea ?? '',
        horaInicioArea: formData.horaInicioArea ?? area?.horaInicioArea ?? '',
        horaFinArea: formData.horaFinArea ?? area?.horaFinArea ?? '',
        estado: formData.estado ?? area?.estado ?? true,

        // Campos opcionales
        descripcionArea: formData.descripcionArea?.trim() ?? area?.descripcionArea ?? '',
        telefonoArea: formData.telefonoArea?.trim() ?? '',
        emailArea: formData.emailArea?.trim() ?? '',
        urlImagen: formData.urlImagen ?? ''
      };

      console.log(' Payload a enviar:', payload);
      console.log('Campos críticos - id:', payload.id, 'idAreadeportiva:', payload.idAreadeportiva, 'idZona:', payload.idZona);

      console.log('Llamando a updateAreadeportivaPorAdminId...');
      const updated = await updateAreadeportivaPorAdminId(currentUser.idPersona, payload);
      
      console.log(' Área actualizada exitosamente:', updated);
      setArea(updated);
      setEditMode(false);
      alert(' Cambios guardados exitosamente');
    } catch (err) {
      console.error(" Error al guardar:", err);
      console.error(" Detalles del error:", err.response?.data);
      console.error(" Status del error:", err.response?.status);
      alert(' Error al guardar los cambios. Revisa la consola para más detalles.');
    }
  };

  // --- PREVIEW DE IMAGEN (segura: no dispara 401 al backend) -----------------
  // Solo renderiza <img> si la URL es pública (http/https) y NO corresponde a tu backend protegido.
  const publicImageSrc = useMemo(() => {
    const u = (formData.urlImagen || area?.urlImagen || '').trim();
    if (!u) return null;

    const isHttp = /^https?:\/\//i.test(u);
    const isBackend = /localhost:8032/i.test(u); // tu backend protegido
    if (isHttp && !isBackend) return u;

    // Para rutas relativas (p.ej. "img/escalada.jpg") o backend: no cargar imagen (evita 401)
    return null;
  }, [area?.urlImagen, formData.urlImagen]);

  // --- RENDER ----------------------------------------------------------------
  if (loading) return <div className="mi-area-loading">Cargando área deportiva...</div>;
  if (!area) return <div className="mi-area-error">No se encontró un área asignada.</div>;

  return (
    <div className="mi-area-container">
      <div className="mi-area-card">
        <h1>Área deportiva: {area.nombreArea}</h1>
        <p className="mi-area-zona">
          ZONA: {area.zona?.nombre ?? "Sin zona asignada"}
        </p>
{/* QUITAR ESTO DESPUES */}
        {/* Botón para mostrar/ocultar info de debug (opcional) */}
        {process.env.NODE_ENV === 'development' && (
          <button 
            className="btn-debug" 
            onClick={() => setShowDebugInfo(!showDebugInfo)}
            style={{
              padding: '2px 8px',
              fontSize: '10px',
              background: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginBottom: '10px',
              cursor: 'pointer'
            }}
          >
            {showDebugInfo ? '👁️ Ocultar Debug' : '👁️ Mostrar Debug'}
          </button>
        )}




        <div className="mi-area-layout">
          {/* FORMULARIO */}
          <div className="mi-area-form">

            {/* Mantener idZona en el payload aunque no se edite */}
            {editMode && (
              <input type="hidden" name="idZona" value={formData.idZona} onChange={handleChange} />
            )}

            <div className="mi-area-row">
              <label>Teléfono</label>
              {editMode ? (
                <input name="telefonoArea" value={formData.telefonoArea} onChange={handleChange} />
              ) : <span>{area.telefonoArea || 'No especificado'}</span>}
            </div>

            <div className="mi-area-row">
              <label>Email</label>
              {editMode ? (
                <input name="emailArea" value={formData.emailArea} onChange={handleChange} />
              ) : <span>{area.emailArea || 'No especificado'}</span>}
            </div>

            <div className="mi-area-row two-cols">
              <div>
                <label>Latitud</label>
                {editMode ? (
                  <input 
                    name="latitud" 
                    value={formData.latitud} 
                    onChange={handleChange}
                    placeholder="Ej: -16.123456"
                  />
                ) : <span>{area.latitud}</span>}
              </div>
              <div>
                <label>Longitud</label>
                {editMode ? (
                  <input 
                    name="longitud" 
                    value={formData.longitud} 
                    onChange={handleChange}
                    placeholder="Ej: -68.123456"
                  />
                ) : <span>{area.longitud}</span>}
              </div>
            </div>

            <div className="mi-area-row">
              <label>Descripción</label>
              {editMode ? (
                <textarea name="descripcionArea" value={formData.descripcionArea} onChange={handleChange} />
              ) : <span>{area.descripcionArea}</span>}
            </div>

            <div className="mi-area-row two-cols">
              <div>
                <label>Hora Apertura</label>
                {editMode ? (
                  <input 
                    name="horaInicioArea" 
                    value={formData.horaInicioArea} 
                    onChange={handleChange} 
                    placeholder="08:00" 
                  />
                ) : <span>{area.horaInicioArea || '—'}</span>}
              </div>
              <div>
                <label>Hora Cierre</label>
                {editMode ? (
                  <input 
                    name="horaFinArea" 
                    value={formData.horaFinArea} 
                    onChange={handleChange} 
                    placeholder="16:00" 
                  />
                ) : <span>{area.horaFinArea || '—'}</span>}
              </div>
            </div>

            {/* Meta - SOLO SE MUESTRA EN MODO DEBUG */}
            {showDebugInfo && (
              <div className="mi-area-meta" style={{ 
                background: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '4px',
                fontSize: '12px',
                border: '1px dashed #ccc'
              }}>
                <h4>Información :</h4>
                <span>ID Área: {area.idAreadeportiva}</span>
                <span>Estado: {area.estado ? 'Activo' : 'Inactivo'}</span>
                <span>ID Zona (payload): {formData.idZona || '—'}</span>
                <span>ID Admin: {currentUser?.idPersona || '—'}</span>
              </div>
            )}

            <div className="mi-area-actions">
              {editMode ? (
                <>
                  <button className="btn-primary" onClick={handleSave}>Guardar</button>
                  <button className="btn-secondary" onClick={() => setEditMode(false)}>Cancelar</button>
                </>
              ) : (
                <>
                  <button className="btn-primary" onClick={() => setEditMode(true)}>Editar</button>
                  <button className="btn-secondary">Salir</button>
                </>
              )}
            </div>
          </div>

          {/* IMAGEN (segura) */}
          <div className="mi-area-image">
            {publicImageSrc ? (
              <img
                src={publicImageSrc}
                alt={`Imagen de ${area.nombreArea}`}
                loading="lazy"
                onError={(e) => { 
                  console.log(' Error cargando imagen:', publicImageSrc);
                  e.currentTarget.style.display = 'none'; 
                }}
              />
            ) : (
              <span style={{ color: '#888' }}>Imagen no disponible</span>
            )}

            {editMode && (
              <div className="mi-area-row" style={{ width: '100%', marginTop: '1rem' }}>
                <label>URL Imagen (pública opcional)</label>
                <input
                  name="urlImagen"
                  value={formData.urlImagen}
                  onChange={handleChange}
                  placeholder="https://misitio.com/imagen.jpg"
                />
                <small style={{ color: '#6b7280' }}>
                  Por ahora solo se previsualizan URLs públicas. Las rutas del backend (p. ej. <code>/img/…</code>) se ignoran para evitar 401.
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiAreaPage;