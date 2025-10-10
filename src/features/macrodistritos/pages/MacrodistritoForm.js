// src/features/macrodistritos/components/MacrodistritoForm.jsx
import React, { useEffect, useState, useMemo } from "react";
import Button from "../../../components/ui/Button";
import { Plus, X } from "lucide-react";
import "./macrodistritoForm.css";

export default function MacrodistritoForm({
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

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || "");
      setDescripcion(initialData.descripcion || "");
      setEstado(initialData.estado ?? true);
    } else {
      setNombre("");
      setDescripcion("");
      setEstado(true);
    }
    setErrors({});
  }, [initialData]);

  function validate() {
    const e = {};
    if (!nombre.trim()) e.nombre = "Nombre es requerido";
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (readonly) return; // en modo ver no se guarda

    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    const payload = {
      ...(initialData?.idMacrodistrito
        ? { idMacrodistrito: initialData.idMacrodistrito }
        : {}),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      estado,
    };
    onSave?.(payload);
  }

  // Título según modo
  const title =
    computedMode === "view"
      ? "Ver Macrodistrito"
      : computedMode === "edit"
      ? "Editar Macrodistrito"
      : "Nuevo Macrodistrito";

  return (
    <form className="macrodistrito-form" onSubmit={handleSubmit}>
      <h3>{title}</h3>

      <div className="form-row">
        <label>Nombre</label>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={readonly}
          aria-readonly={readonly}
          className={readonly ? "field-readonly" : ""}
        />
        {errors.nombre && !readonly && (
          <div className="form-error">{errors.nombre}</div>
        )}
      </div>

      <div className="form-row">
        <label>Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          disabled={readonly}
          aria-readonly={readonly}
          className={readonly ? "field-readonly" : ""}
          rows={4}
        />
      </div>

      <div className="form-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={estado}
            onChange={(e) => setEstado(e.target.checked)}
            disabled={readonly}
            aria-readonly={readonly}
          />{" "}
          Activo
        </label>
      </div>

      <div className="form-actions">
        {/* En view solo mostramos Cerrar */}
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
