import React, { useEffect, useState } from 'react';
import './ZonaForm.css';

import * as MacrodistritoService from "../../../api/macrodistritoApi";

export default function ZonaForm({ initialData, onSave, onCancel }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState(true);
  const [errors, setErrors] = useState({});
  //LLAVES FORANEAS
  const [idMacrodistrito, setIdMacrodistrito] = useState(null);  // Guardamos el idMacrodistrito
  const [macrodistritos, setMacrodistritos] = useState([]); // Lista de macrodistritos
  const [loadingMacrodistritos, setLoadingMacrodistritos] = useState(false);

  // Cargar macrodistritos cuando el componente se monta

  useEffect(() => {
    const loadMacrodistritos = async () => {
      try {
        setLoadingMacrodistritos(true);
        const data = await MacrodistritoService.getMacrodistritos();
        if (Array.isArray(data)) {
          setMacrodistritos(data);
        } else {
          console.error('La respuesta no es un array:', data);
          setMacrodistritos([]);
        }
      } catch (err) {
        console.error("Error cargando los macrodistritos", err);
        setMacrodistritos([]);
      } finally {
        setLoadingMacrodistritos(false);
      }
    };
    loadMacrodistritos();
  }, []);

  // Actualizar el estado cuando se cargan los datos iniciales (para editar)
  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || '');
      setDescripcion(initialData.descripcion || '');
      setEstado(initialData.estado ?? true);
      setIdMacrodistrito(initialData.idMacrodistrito || null); // Preseleccionamos el idMacrodistrito al editar
    } else {
      setNombre('');
      setDescripcion('');
      setEstado(true);
      setIdMacrodistrito(null);
    }
    setErrors({});
  }, [initialData]);


  // Validación del formulario
  function validate() {
    const e = {};
    if (!nombre.trim()) e.nombre = 'Nombre es requerido';
    if (!idMacrodistrito) e.idMacrodistrito = 'El macrodistrito es obligatorio'; // Validamos si se seleccionó un macrodistrito
    return e;
  }

  // Manejo del envío del formulario
  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }





    const payload = {
      ...(initialData?.idZona ? { idZona: initialData.idZona } : {}),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      estado,
      idMacrodistrito, // Incluimos el idMacrodistrito seleccionado
    };
    onSave(payload); // Llamamos a la función onSave para guardar la zona
  }
  
  return (
    <form className="Zona-form" onSubmit={handleSubmit}>
      <h3>{initialData ? 'Editar Zona' : 'Nueva Zona'}</h3>

      <div className="form-row">
        <label>Nombre</label>
        <input value={nombre} onChange={e => setNombre(e.target.value)} />
        {errors.nombre && <div className="form-error">{errors.nombre}</div>}
      </div>

      <div className="form-row">
        <label>Descripción</label>
        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} />
      </div>

      <div className="form-row">
        <label>Macrodistrito</label>
        <select
          value={idMacrodistrito ?? ''}
          onChange={e => setIdMacrodistrito(e.target.value)}
          disabled={loadingMacrodistritos}
        >
          <option value="">Seleccione un macrodistrito</option>
          {loadingMacrodistritos ? (
            <option value="" disabled>Cargando...</option>
          ) : (
            macrodistritos.map(macrodistrito => (
              <option key={macrodistrito.idMacrodistrito} value={macrodistrito.idMacrodistrito}>
                {macrodistrito.nombre}
              </option>
            ))
          )}
        </select>
        {errors.idMacrodistrito && <div className="form-error">{errors.idMacrodistrito}</div>}
      </div>

      <div className="form-row">
        <label className="checkbox-label">
          <input type="checkbox" checked={estado} onChange={e => setEstado(e.target.checked)} /> Activo
        </label>
      </div>

      <div className="form-actions">
        <button type="submit">Guardar</button>
        <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
