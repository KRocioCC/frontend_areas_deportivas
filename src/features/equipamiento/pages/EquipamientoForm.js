// src/features/Equipamientos/pages/EquipamientoForm.jsx
import React, { useEffect, useState, useMemo } from "react";
import Button from "../../../components/ui/Button";
import { Plus, X } from "lucide-react";
import '../../cancha/pages/CanchaForm.css';

export default function EquipamientoForm({ 
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
  const [nombreEquipamiento, setNombreEquipamiento] = useState('');
  const [tipoEquipamiento, setTipoEquipamiento] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [urlImagen, setUrlImagen] = useState('');
  const [estado, setEstado] = useState(true);

  // Llaves foráneas
  //const [idZona, setIdZona] = useState(null);

  //const [zonas, setZonas] = useState([]); // Lista de zonas para select
  const [errors, setErrors] = useState({});

  // Cargar zonas y administradores al montar el componente
  /*useEffect(() => {

    const loadData = async () => {
      try {
        const zonasRes = await fetch('http://localhost:8032/api/zona');
        const zonasData = await zonasRes.json();
        setZonas(Array.isArray(zonasData) ? zonasData : []);

        const adminsRes = await fetch('http://localhost:8032/api/administradores');
        const adminsData = await adminsRes.json();
        setAdministradores(Array.isArray(adminsData) ? adminsData : []);
      } catch (err) {
        console.error("Error cargando zonas o administradores:", err);
        setZonas([]);
        setAdministradores([]);
      }
    };
    loadData();
  }, []);*/

  // Cargar datos iniciales (editar)
  useEffect(() => {
    if (initialData) {
      setNombreEquipamiento(initialData.nombreEquipamiento || '');
      setTipoEquipamiento(initialData.tipoEquipamiento || '');
      setDescripcion(initialData.descripcion || '');
      setEstado(initialData.estado ?? true);
      setUrlImagen(initialData.urlImagen || '');
      //setIdZona(initialData.idZona ?? null);
    } else {
      setNombreEquipamiento('');
      setTipoEquipamiento('');
      setDescripcion('');
      setEstado(true);
      setUrlImagen('');
    }
    setErrors({});
  }, [initialData]);

  // Validación del formulario
  function validate() {
    const e = {};
    if (!nombreEquipamiento.trim()) e.nombreEquipamiento = "El nombre del área es obligatorio";
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
      ...(initialData?.idEquipamiento ? { idEquipamiento: initialData.idEquipamiento } : {}),
      nombreEquipamiento: nombreEquipamiento.trim(),
      tipoEquipamiento: tipoEquipamiento.trim(),
      descripcion: descripcion.trim(),
      estado: estado,
      urlImagen: urlImagen.trim(),
      //idZona: Number(idZona),
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
    <form className="Equipamiento-form" onSubmit={handleSubmit}>
      <h3>{title}</h3>

      <div className="form-row">
        <label>Nombre del Área</label>
        <input 
          value={nombreEquipamiento} 
          onChange={e => setNombreEquipamiento(e.target.value)} 
          disabled={readonly}
          aria-readonly={readonly}
          className={readonly ? "field-readonly" : ""}
        />
        {errors.nombreEquipamiento && <div className="form-error">{errors.nombreEquipamiento}</div>}
      </div>

      <div className="form-row">
        <label>tipoEquipamiento</label>
        <textarea 
          value={tipoEquipamiento} 
          onChange={e => setTipoEquipamiento(e.target.value)}
          disabled={readonly}
          aria-readonly={readonly}
        />
      </div>

      <div className="form-row">
        <label>Descripcion</label>
        <input 
          value={descripcion} 
          onChange={e => setDescripcion(e.target.value)} 
          disabled={readonly}
          aria-readonly={readonly}
          className={readonly ? "field-readonly" : ""}
          rows={4} 
        />
      </div>


      <div className="form-row">
        <label>Url</label>
        <input 
          type="string" 
          value={urlImagen} 
          onChange={e => setUrlImagen(e.target.value)}
          disabled={readonly}
          aria-readonly={readonly} 
        />
        {errors.urlImagen && <div className="form-error">{errors.urlImagen}</div>}
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
