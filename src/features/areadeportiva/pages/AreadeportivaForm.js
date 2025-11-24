// src/features/areadeportivas/pages/AreadeportivaForm.jsx
import React, { useEffect, useState, useMemo } from "react";
import Button from "../../../components/ui/Button";
import { Plus, X } from "lucide-react";
import './Areadeportiva.css';

import * as ZonaService from "../../../api/ZonaApi";
import * as AdministradorService from "../../../api/administradorApi";

export default function AreadeportivaForm({ 
  initialData, 
  onSave, 
  onCancel,
  mode,}) {
  
  const computedMode = useMemo(() => {
      if (mode) return mode;
      if (initialData?._readonly) return "view";
      return initialData ? "edit" : "create";
  }, [mode, initialData]);
  
  const readonly = computedMode === "view";

  // Campos principales
  const [nombreArea, setNombreArea] = useState('');
  const [descripcionArea, setDescripcionArea] = useState('');
  const [emailArea, setEmailArea] = useState('');
  const [telefonoArea, setTelefonoArea] = useState('');
  const [horaInicioArea, setHoraInicioArea] = useState('');
  const [horaFinArea, setHoraFinArea] = useState('');
  const [urlImagen, setUrlImagen] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [estado, setEstado] = useState(true);

  // Llaves foráneas
  const [idZona, setIdZona] = useState(null);
  const [id, setId] = useState(null);

  const [zonas, setZonas] = useState([]); // Lista de zonas para select
  const [administradores, setAdministradores] = useState([]); // Lista de administradores
  const [loadingData, setLoadingData] = useState(false);
  const [errors, setErrors] = useState({});

  // Cargar zonas y administradores al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        // Usa los servicios de API en lugar de fetch directo
        const [zonasData, adminsData] = await Promise.all([
          ZonaService.getZonas(),
          AdministradorService.getAdministradores()
        ]);
        
        setZonas(Array.isArray(zonasData) ? zonasData : []);
        setAdministradores(Array.isArray(adminsData) ? adminsData : []);
      } catch (err) {
        console.error("Error cargando zonas o administradores:", err);
        setZonas([]);
        setAdministradores([]);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  // Cargar datos iniciales (editar)
  useEffect(() => {
    if (initialData) {
      setNombreArea(initialData.nombreArea || '');
      setDescripcionArea(initialData.descripcionArea || '');
      setEmailArea(initialData.emailArea || '');
      setTelefonoArea(initialData.telefonoArea || '');
      setHoraInicioArea(initialData.horaInicioArea || '');
      setHoraFinArea(initialData.horaFinArea || '');
      setEstado(initialData.estado ?? true);
      setUrlImagen(initialData.urlImagen || '');
      setLatitud(initialData.latitud ?? '');
      setLongitud(initialData.longitud ?? '');
      setIdZona(initialData.idZona ?? null);
      setId(initialData.id ?? null);
    } else {
      setNombreArea('');
      setDescripcionArea('');
      setEmailArea('');
      setTelefonoArea('');
      setHoraInicioArea('');
      setHoraFinArea('');
      setEstado(true);
      setUrlImagen('');
      setLatitud('');
      setLongitud('');
      setIdZona(null);
      setId(null);
    }
    setErrors({});
  }, [initialData]);

  // Validación del formulario
  function validate() {
    const e = {};
    if (!nombreArea.trim()) e.nombreArea = "El nombre del área es obligatorio";
    if (!idZona) e.idZona = "Debe seleccionar una zona";
    if (!id) e.id = "Debe seleccionar un administrador";
    if (!latitud) e.latitud = "Latitud es obligatoria";
    if (!longitud) e.longitud = "Longitud es obligatoria";
    if (!horaInicioArea) e.horaInicioArea = "Hora de inicio obligatoria";
    if (!horaFinArea) e.horaFinArea = "Hora de fin obligatoria";
    return e;
  };
  
//ENVIO FORMULARIO
  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    
//REVISO
    const payload = {
      ...(initialData?.idAreadeportiva ? { idAreadeportiva: initialData.idAreadeportiva } : {}),
      nombreArea: nombreArea.trim(),
      descripcionArea: descripcionArea.trim(),
      emailArea: emailArea.trim(),
      telefonoArea: telefonoArea.trim(),
      horaInicioArea: horaInicioArea,
      horaFinArea: horaFinArea,
      estado: estado,
      urlImagen: urlImagen.trim(),
      latitud: Number(latitud),
      longitud: Number(longitud),
      idZona: Number(idZona),
      id: Number(id)
    };

    onSave(payload);
  };

  const title =
    computedMode === "view"
      ? "Ver Area Deportiva"
      : computedMode === "edit"
      ? "Editar Area Deportiva"
      : "Nuevo Area Deportiva";

  return (
    <form className="Areadeportiva-form" onSubmit={handleSubmit}>
      <h3>{title}</h3>

      <div className="form-row">
        <label>Nombre del Área</label>
        <input 
          value={nombreArea} 
          onChange={e => setNombreArea(e.target.value)} 
          disabled={readonly}
          aria-readonly={readonly}
          className={readonly ? "field-readonly" : ""}
        />
        {errors.nombreArea && <div className="form-error">{errors.nombreArea}</div>}
      </div>

      <div className="form-row">
        <label>Descripción</label>
        <textarea 
          value={descripcionArea} 
          onChange={e => setDescripcionArea(e.target.value)}
          disabled={readonly}
          aria-readonly={readonly}
          className={readonly ? "field-readonly" : ""}
          rows={4} 
        />
      </div>

      <div className="form-row">
        <label>Email</label>
        <input 
          type="email" 
          value={emailArea} 
          onChange={e => setEmailArea(e.target.value)} 
          disabled={readonly}
          aria-readonly={readonly}
        />
      </div>

      <div className="form-row">
        <label>Teléfono</label>
        <input 
          value={telefonoArea} 
          onChange={e => setTelefonoArea(e.target.value)} 
          placeholder="8 dígitos" 
          disabled={readonly}
          aria-readonly={readonly}
        />
      </div>

      <div className="form-row">
        <label>Hora Inicio</label>
        <input type="time" 
          value={horaInicioArea} 
          onChange={e => setHoraInicioArea(e.target.value)}
          disabled={readonly}
          aria-readonly={readonly}
        />
        {errors.horaInicioArea && <div className="form-error">{errors.horaInicioArea}</div>}
      </div>

      <div className="form-row">
        <label>Hora Fin</label>
        <input 
          type="time" 
          value={horaFinArea} 
          onChange={e => setHoraFinArea(e.target.value)}
          disabled={readonly}
          aria-readonly={readonly}
        />
        {errors.horaFinArea && <div className="form-error">{errors.horaFinArea}</div>}
      </div>

      <div className="form-row">
        <label>Latitud</label>
        <input 
          type="number" 
          step="any" 
          value={latitud} 
          onChange={e => setLatitud(e.target.value)} 
          disabled={readonly}
          aria-readonly={readonly}
        />
        {errors.latitud && <div className="form-error">{errors.latitud}</div>}
      </div>

      <div className="form-row">
        <label>Longitud</label>
        <input 
          type="number" 
          step="any" 
          value={longitud} 
          onChange={e => setLongitud(e.target.value)}
          disabled={readonly}
          aria-readonly={readonly}
        />
        {errors.longitud && <div className="form-error">{errors.longitud}</div>}
      </div>

      <div className="form-row">
        <label>Url</label>
        <input 
          type="string" 
          step="any" 
          value={urlImagen} 
          onChange={e => setUrlImagen(e.target.value)}
          disabled={readonly}
          aria-readonly={readonly} 
        />
        {errors.urlImagen && <div className="form-error">{errors.urlImagen}</div>}
      </div>

            <div className="form-row">
        <label>Zona</label>
        <select 
          value={idZona ?? ''} 
          onChange={e => setIdZona(Number(e.target.value))}
          disabled={readonly || loadingData}
          aria-readonly={readonly} 
        >
          <option value="">Seleccione una zona</option>
          {loadingData ? (
            <option value="" disabled>Cargando zonas...</option>
          ) : (
            zonas.map(z => (
              <option key={z.idZona} value={z.idZona}>{z.nombre}</option>
            ))
          )}
        </select>
        {errors.idZona && <div className="form-error">{errors.idZona}</div>}
      </div>

      <div className="form-row">
        <label>Administrador</label>
        <select 
          value={id ?? ''} 
          onChange={e => setId(Number(e.target.value))}
          disabled={readonly || loadingData}
          aria-readonly={readonly} 
        >
          <option value="">Seleccione un administrador</option>
          {loadingData ? (
            <option value="" disabled>Cargando administradores...</option>
          ) : (
            administradores.map(a => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))
          )}
        </select>
        {errors.id && <div className="form-error">{errors.id}</div>}
      </div>

      <div className="form-row">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={estado} 
            onChange={e => setEstado(e.target.checked)}
            disabled={readonly}
            aria-readonly={readonly} 
          /> Activo
        </label>
        
      </div>

      <div className="form-actions">
        {readonly ? (
          <Button variant="primary" size="sm" icon={X} onClick={onCancel}>
            Cerrar
          </Button>
        ) : (
          <>
            <Button type="submit" variant="accent1" size="sm" icon={Plus}>
              Guardar
            </Button>
            <Button variant="primary" size="sm" icon={X} onClick={onCancel}>
              Cancelar
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
