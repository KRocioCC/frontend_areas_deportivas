import React, { useEffect, useState, useMemo } from "react";
import Button from "../../../components/ui/Button";
import { Plus, X, Upload } from "lucide-react";
import api from '../../../api/api'; // Tu instancia de Axios
import './Areadeportiva.css';

import * as ZonaService from "../../../api/ZonaApi";
import * as AdministradorService from "../../../api/administradorApi";
// Configuración de ruta base para imágenes
const BASE_URL_IMG = "http://localhost:8032/"; 

export default function AreadeportivaForm({ 
  initialData, 
  onSave, 
  onCancel,
  mode,
}) {
  
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

  const [selectedFiles, setSelectedFiles] = useState([]);
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

  // Cargar datos iniciales
  useEffect(() => {
    if (initialData) {
      setNombreArea(initialData.nombreArea || '');
      setDescripcionArea(initialData.descripcionArea || '');
      setEmailArea(initialData.emailArea || '');
      setTelefonoArea(initialData.telefonoArea || '');
      setHoraInicioArea(initialData.horaInicioArea || '');
      setHoraFinArea(initialData.horaFinArea || '');
      setEstado(initialData.estado ?? true);
      setLatitud(initialData.latitud ?? '');
      setLongitud(initialData.longitud ?? '');
      setIdZona(initialData.idZona ?? null);
      setId(initialData.id ?? null);
    } else {
      // Limpiar para crear
      setNombreArea('');
      setDescripcionArea('');
      setEmailArea('');
      setTelefonoArea('');
      setHoraInicioArea('');
      setHoraFinArea('');
      setEstado(true);
      setLatitud('');
      setLongitud('');
      setIdZona(null);
      setId(null);
    }
    setErrors({});
    setSelectedFiles([]); 
  }, [initialData]);

  const handleFileChange = (e) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    }
  };

  function validate() {
    const e = {};
    if (!nombreArea.trim()) e.nombreArea = "Nombre obligatorio";
    if (!idZona) e.idZona = "Seleccione una zona";
    if (!id) e.id = "Seleccione un administrador";
    if (!latitud) e.latitud = "Latitud obligatoria";
    if (!longitud) e.longitud = "Longitud obligatoria";
    if (!horaInicioArea) e.horaInicioArea = "Hora inicio obligatoria";
    if (!horaFinArea) e.horaFinArea = "Hora fin obligatoria";
    return e;
  };
  
  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    
    const payload = {
      ...(initialData?.idAreadeportiva ? { idAreadeportiva: initialData.idAreadeportiva } : {}),
      nombreArea: nombreArea.trim(),
      descripcionArea: descripcionArea.trim(),
      emailArea: emailArea.trim(),
      telefonoArea: telefonoArea.trim(),
      horaInicioArea: horaInicioArea,
      horaFinArea: horaFinArea,
      estado: estado,
      latitud: Number(latitud),
      longitud: Number(longitud),
      idZona: Number(idZona),
      id: Number(id)
    };

    // Enviamos payload y archivos al padre
    onSave(payload, selectedFiles);
  };

  const title = computedMode === "view" ? "Ver Área" : computedMode === "edit" ? "Editar Área" : "Nueva Área Deportiva";

  return (
    <form className="Areadeportiva-form p-4" onSubmit={handleSubmit}>
      <h3 className="text-xl font-bold mb-4">{title}</h3>

      <div className="form-row mb-3">
        <label className="block text-sm font-medium">Nombre del Área</label>
        <input 
          value={nombreArea} 
          onChange={e => setNombreArea(e.target.value)} 
          disabled={readonly}
          className={`w-full border p-2 rounded ${readonly ? "bg-gray-100" : ""}`}
        />
        {errors.nombreArea && <div className="text-red-500 text-sm">{errors.nombreArea}</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium">Zona</label>
            <select value={idZona ?? ''} onChange={e => setIdZona(Number(e.target.value))} disabled={readonly} className="w-full border p-2 rounded">
              <option value="">Seleccione una zona</option>
              {zonas.map(z => <option key={z.idZona} value={z.idZona}>{z.nombre}</option>)}
            </select>
            {errors.idZona && <div className="text-red-500 text-sm">{errors.idZona}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium">Administrador</label>
            <select value={id ?? ''} onChange={e => setId(Number(e.target.value))} disabled={readonly} className="w-full border p-2 rounded">
              <option value="">Seleccione un administrador</option>
              {administradores.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
            {errors.id && <div className="text-red-500 text-sm">{errors.id}</div>}
          </div>
      </div>

      {/* SUBIDA DE ARCHIVOS */}
      <div className="mb-4 p-4 border-2 border-dashed border-blue-300 bg-blue-50 rounded">
        <label className="flex items-center gap-2 font-bold text-blue-700 mb-2">
            <Upload size={18}/> Subir Nuevas Fotos
        </label>
        <input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={handleFileChange}
            disabled={readonly}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
        {selectedFiles.length > 0 && (
            <p className="text-sm text-green-600 mt-1 font-semibold">{selectedFiles.length} imágenes seleccionadas</p>
        )}
      </div>

      {/* GALERÍA DE IMÁGENES EXISTENTES */}
      {initialData?.imagenes && initialData.imagenes.length > 0 && (
        <div className="mb-4 p-4 bg-gray-50 border rounded-lg">
            <label className="block text-sm font-bold text-gray-700 mb-2">
                Galería ({initialData.imagenes.length} fotos)
            </label>
            <div className="flex flex-wrap gap-4">
                {initialData.imagenes.map((img, index) => (
                    <div key={img.idImagen || index} className="relative group">
                        <img 
                            // Lógica de URL: si viene completa se usa, si no se pega la base
                            src={img.rutaAlmacenamiento?.startsWith('http') ? img.rutaAlmacenamiento : `${BASE_URL_IMG}${img.rutaAlmacenamiento}`}
                            alt={`Foto ${index}`} 
                            className="w-24 h-24 object-cover rounded shadow border bg-white" 
                            onError={(e) => {
                                e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDUwIDUwIj48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TUE8L3RleHQ+PC9zdmc+";
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
      )}

      <div className="form-row mb-3">
        <label className="block text-sm font-medium">Descripción</label>
        <textarea value={descripcionArea} onChange={e => setDescripcionArea(e.target.value)} disabled={readonly} rows={3} className="w-full border p-2 rounded"/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" value={emailArea} onChange={e => setEmailArea(e.target.value)} disabled={readonly} className="w-full border p-2 rounded"/>
          </div>
          <div>
            <label className="block text-sm font-medium">Teléfono</label>
            <input value={telefonoArea} onChange={e => setTelefonoArea(e.target.value)} placeholder="8 dígitos" disabled={readonly} className="w-full border p-2 rounded"/>
          </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium">Hora Inicio</label>
            <input type="time" value={horaInicioArea} onChange={e => setHoraInicioArea(e.target.value)} disabled={readonly} className="w-full border p-2 rounded"/>
            {errors.horaInicioArea && <div className="text-red-500 text-sm">{errors.horaInicioArea}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium">Hora Fin</label>
            <input type="time" value={horaFinArea} onChange={e => setHoraFinArea(e.target.value)} disabled={readonly} className="w-full border p-2 rounded"/>
            {errors.horaFinArea && <div className="text-red-500 text-sm">{errors.horaFinArea}</div>}
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium">Latitud</label>
            <input type="number" step="any" value={latitud} onChange={e => setLatitud(e.target.value)} disabled={readonly} className="w-full border p-2 rounded"/>
            {errors.latitud && <div className="text-red-500 text-sm">{errors.latitud}</div>}
          </div>
          <div>
             <label className="block text-sm font-medium">Longitud</label>
             <input type="number" step="any" value={longitud} onChange={e => setLongitud(e.target.value)} disabled={readonly} className="w-full border p-2 rounded"/>
             {errors.longitud && <div className="text-red-500 text-sm">{errors.longitud}</div>}
          </div>
      </div>

      <div className="form-row mb-4">
        <label className="inline-flex items-center">
          <input type="checkbox" checked={estado} onChange={e => setEstado(e.target.checked)} disabled={readonly} className="form-checkbox"/>
          <span className="ml-2">Activo</span>
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="primary" size="sm" icon={X} onClick={onCancel}>Cancelar</Button>
        {!readonly && (
             <Button type="submit" variant="accent1" size="sm" icon={Plus}>Guardar</Button>
        )}
      </div>
    </form>
  );
}