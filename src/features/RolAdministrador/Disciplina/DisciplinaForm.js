import React, { useEffect, useState, useMemo } from "react";
import Button from "../../../components/ui/Button";
import { Plus, X } from "lucide-react";
import "./DisciplinaForm.css";

export default function DisciplinaForm({
  initialData,
  onSave,
  onCancel,
  mode,
}) {
  // Determinar modo: create, edit, view
  const computedMode = useMemo(() => {
    if (mode) return mode;
    if (initialData?._readonly) return "view";
    return initialData ? "edit" : "create";
  }, [mode, initialData]);

  const readonly = computedMode === "view";

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState(true);
  const [errors, setErrors] = useState({});

  // Cargar datos iniciales
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

  // Validación simple
  function validate() {
    const e = {};
    if (!nombre.trim()) e.nombre = "El nombre es requerido";
    if (descripcion.trim().length > 250)
      e.descripcion = "La descripción no puede superar 250 caracteres";
    return e;
  }

  // Guardar
  function handleSubmit(ev) {
    ev.preventDefault();
    if (readonly) return;

    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    const payload = {
      ...(initialData?.idDisciplina
        ? { idDisciplina: initialData.idDisciplina }
        : {}),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      estado,
    };

    onSave?.(payload);
  }

  // Título dinámico
  const title =
    computedMode === "view"
      ? "Ver Disciplina"
      : computedMode === "edit"
      ? "Editar Disciplina"
      : "Nueva Disciplina";

  return (
    <form className="disciplina-form" onSubmit={handleSubmit}>
      <h3>{title}</h3>

      <div className="form-row">
        <label>Nombre</label>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={readonly}
          aria-readonly={readonly}
          className={readonly ? "field-readonly" : ""}
          placeholder="Ej: Fútbol, Vóley..."
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
          placeholder="Breve descripción de la disciplina..."
        />
        {errors.descripcion && !readonly && (
          <div className="form-error">{errors.descripcion}</div>
        )}
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
