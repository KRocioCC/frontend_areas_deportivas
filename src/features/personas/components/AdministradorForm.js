import React, { useEffect, useState } from "react";
import "./personaForm.css";

export default function AdministradorForm({ initialData, onSave, onCancel }) {
  const [form, setForm] = useState({
    nombre: "",
    apaterno: "",
    amaterno: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
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
        apaterno: initialData.apaterno ?? initialData.apellidoPaterno ?? "",
        amaterno: initialData.amaterno ?? initialData.apellidoMaterno ?? "",
        fechaNacimiento: initialData.fechaNacimiento ?? initialData.fecha_nacimiento ?? "",
        telefono: initialData.telefono ?? "",
        email: initialData.email ?? "",
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
    if (!form.amaterno.trim()) e.amaterno = "El apellido materno es obligatorio";
    if (!form.telefono.trim()) e.telefono = "El teléfono es obligatorio";
    if (!form.email.trim()) e.email = "El correo electrónico es obligatorio";
    if (!form.cargo.trim()) e.cargo = "El cargo es obligatorio";
    if (!form.direccion.trim()) e.direccion = "La dirección es obligatoria";
    return e;
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
    <form className="administrador-form" onSubmit={handleSubmit}>
      <h3>{initialData ? "Editar Administrador" : "Nuevo Administrador"}</h3>

      <div className="form-row">
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} />
        {errors.nombre && <div className="form-error">{errors.nombre}</div>}
      </div>

      <div className="form-row">
        <label>Apellido Paterno</label>
        <input name="apaterno" value={form.apaterno} onChange={handleChange} />
      </div>

      <div className="form-row">
        <label>Apellido Materno</label>
        <input name="amaterno" value={form.amaterno} onChange={handleChange} />
        {errors.amaterno && <div className="form-error">{errors.amaterno}</div>}
      </div>

      <div className="form-row">
        <label>Fecha de Nacimiento</label>
        <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} />
      </div>

      <div className="form-row">
        <label>Teléfono</label>
        <input name="telefono" value={form.telefono} onChange={handleChange} />
        {errors.telefono && <div className="form-error">{errors.telefono}</div>}
      </div>

      <div className="form-row">
        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} />
        {errors.email && <div className="form-error">{errors.email}</div>}
      </div>

      <div className="form-row">
        <label>URL de Imagen</label>
        <input name="urlImagen" value={form.urlImagen} onChange={handleChange} />
        {form.urlImagen && (
          <div className="preview-container">
            <img src={form.urlImagen} alt="Preview" className="preview-image" onError={(e) => (e.target.style.display = "none")} />
          </div>
        )}
      </div>

      <div className="form-row">
        <label>Cargo</label>
        <input name="cargo" value={form.cargo} onChange={handleChange} />
        {errors.cargo && <div className="form-error">{errors.cargo}</div>}
      </div>

      <div className="form-row">
        <label>Dirección</label>
        <input name="direccion" value={form.direccion} onChange={handleChange} />
        {errors.direccion && <div className="form-error">{errors.direccion}</div>}
      </div>

      <div className="form-row checkbox">
        <label>
          <input type="checkbox" name="estado" checked={form.estado} onChange={handleChange} /> Activo
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
}
