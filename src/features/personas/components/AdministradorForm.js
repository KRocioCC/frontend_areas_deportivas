import React, { useEffect, useState } from "react";
import "./personaForm.css";

const AdministradorForm = ({ initialData, onSave, onCancel }) => {
  const [form, setForm] = useState({
    nombre: "",
    apaterno: "",
    amaterno: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
    ci: "",
    urlImagen: "",
    estado: true,
    cargo: "",
    direccion: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        nombre: initialData.nombre ?? "",
        apaterno: initialData.apaterno ?? initialData.apellidoPaterno ?? initialData.aPaterno ?? "",
        amaterno: initialData.amaterno ?? initialData.apellidoMaterno ?? initialData.aMaterno ?? "",
        fechaNacimiento: initialData.fechaNacimiento ?? initialData.fecha_nacimiento ?? "",
        telefono: initialData.telefono ?? "",
        email: initialData.email ?? "",
        ci: initialData.ci ?? "",
        urlImagen: initialData.urlImagen ?? initialData.url_imagen ?? "",
        estado: initialData.estado ?? true,
        cargo: initialData.cargo ?? "",
        direccion: initialData.direccion ?? "",
      });
    }
  }, [initialData]);

  function validate() {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio";
    if (!form.apaterno.trim()) e.apaterno = "El apellido paterno es obligatorio";
    if (!form.telefono.trim()) e.telefono = "El teléfono es obligatorio";
    if (!form.email.trim()) e.email = "El correo electrónico es obligatorio";
    if (!form.ci.trim()) e.ci = "El carnet de identidad es obligatorio";
    if (!form.cargo.trim()) e.cargo = "El cargo es obligatorio";
    if (!form.direccion.trim()) e.direccion = "La dirección es obligatoria";
    
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "El formato del email no es válido";
    }
    
    return e;
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    const payload = {
      ...form,
      apaterno: form.apaterno ?? "",
      amaterno: form.amaterno ?? "",
      nombre: form.nombre ?? "",
      telefono: form.telefono ?? "",
      email: form.email ?? "",
      ci: form.ci ?? "",
      urlImagen: form.urlImagen ?? "",
      fechaNacimiento: form.fechaNacimiento || null,
      estado: Boolean(form.estado),
      cargo: form.cargo ?? "",
      direccion: form.direccion ?? "",
    };

    console.log("AdministradorForm send:", payload);
    onSave(payload);
  }

  return (
    <form className="persona-form" onSubmit={handleSubmit}>
      <h3>{initialData ? "Editar Administrador" : "Nuevo Administrador"}</h3>

      <div className="form-row">
        <label>Nombre *</label>
        <input 
          name="nombre" 
          value={form.nombre} 
          onChange={handleChange}
          className={errors.nombre ? 'error-field' : ''}
        />
        {errors.nombre && <div className="form-error">{errors.nombre}</div>}
      </div>

      <div className="form-row">
        <label>Apellido Paterno *</label>
        <input 
          name="apaterno" 
          value={form.apaterno} 
          onChange={handleChange}
          className={errors.apaterno ? 'error-field' : ''}
        />
        {errors.apaterno && <div className="form-error">{errors.apaterno}</div>}
      </div>

      <div className="form-row">
        <label>Apellido Materno</label>
        <input name="amaterno" value={form.amaterno} onChange={handleChange} />
      </div>

      <div className="form-row">
        <label>Fecha de Nacimiento</label>
        <input 
          type="date" 
          name="fechaNacimiento" 
          value={form.fechaNacimiento} 
          onChange={handleChange} 
        />
      </div>

      <div className="form-row">
        <label>Teléfono *</label>
        <input 
          name="telefono" 
          value={form.telefono} 
          onChange={handleChange}
          className={errors.telefono ? 'error-field' : ''}
        />
        {errors.telefono && <div className="form-error">{errors.telefono}</div>}
      </div>

      <div className="form-row">
        <label>Email *</label>
        <input 
          name="email" 
          type="email" 
          value={form.email} 
          onChange={handleChange}
          className={errors.email ? 'error-field' : ''}
        />
        {errors.email && <div className="form-error">{errors.email}</div>}
      </div>

      <div className="form-row">
        <label>Carnet de Identidad *</label>
        <input 
          name="ci" 
          value={form.ci} 
          onChange={handleChange}
          className={errors.ci ? 'error-field' : ''}
        />
        {errors.ci && <div className="form-error">{errors.ci}</div>}
      </div>

      <div className="form-row">
        <label>URL de Imagen</label>
        <input name="urlImagen" value={form.urlImagen} onChange={handleChange} />
        {form.urlImagen && (
          <div className="preview-container">
            <img
              src={form.urlImagen}
              alt="Preview"
              className="preview-image"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}
      </div>

      <div className="form-row">
        <label>Cargo *</label>
        <input 
          name="cargo" 
          value={form.cargo} 
          onChange={handleChange}
          className={errors.cargo ? 'error-field' : ''}
        />
        {errors.cargo && <div className="form-error">{errors.cargo}</div>}
      </div>

      <div className="form-row">
        <label>Dirección *</label>
        <textarea 
          name="direccion" 
          value={form.direccion} 
          onChange={handleChange}
          rows="3"
          className={errors.direccion ? 'error-field' : ''}
        />
        {errors.direccion && <div className="form-error">{errors.direccion}</div>}
      </div>

      <div className="form-row checkbox">
        <label className="checkbox-label">
          <input type="checkbox" name="estado" checked={form.estado} onChange={handleChange} /> 
          Administrador activo
        </label>
      </div>

      <div className="form-actions">
        <button type="submit">Guardar</button>
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default AdministradorForm;