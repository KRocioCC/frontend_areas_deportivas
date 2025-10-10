// src/features/Canchas/pages/CanchaForm.jsx
import React, { useEffect, useState, useMemo } from "react";
import Button from "../../../components/ui/Button";
import { Plus, X } from "lucide-react";
import "../pages/CanchaForm.css";

export default function CanchaForm({
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

  // estados (mantengo strings para inputs numéricos y luego convierto)
  const [nombre, setNombre] = useState("");
  const [costoHora, setCostoHora] = useState(""); // string, convertir luego
  const [capacidad, setCapacidad] = useState("");
  const [mantenimiento, setMantenimiento] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [urlImagen, setUrlImagen] = useState("");
  const [tipoSuperficie, setTipoSuperficie] = useState("");
  const [tamano, setTamano] = useState("");
  const [cubierta, setCubierta] = useState("");
  const [iluminacion, setIluminacion] = useState("");
  const [estado, setEstado] = useState(true);

  const [idAreadeportiva, setIdAreadeportiva] = useState(null);
  const [Areadeportiva, setAreadeportiva] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('http://localhost:8032/api/areasdeportivas');
        const data = await res.json();
        setAreadeportiva(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando Areadeportiva:", err);
        setAreadeportiva([]);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre ?? "");
      setCostoHora(initialData.costoHora ?? "");
      setCapacidad(initialData.capacidad ?? "");
      setMantenimiento(initialData.mantenimiento ?? "");
      setHoraInicio(initialData.horaInicio ?? "");
      setHoraFin(initialData.horaFin ?? "");
      setEstado(initialData.estado ?? true);
      setUrlImagen(initialData.urlImagen ?? "");
      setTipoSuperficie(initialData.tipoSuperficie ?? "");
      setTamano(initialData.tamano ?? "");
      setCubierta(initialData.cubierta ?? "");
      setIluminacion(initialData.iluminacion ?? "");
      setIdAreadeportiva(initialData.idAreadeportiva ?? null);
    } else {
      setNombre("");
      setCostoHora("");
      setCapacidad("");
      setMantenimiento("");
      setHoraInicio("");
      setHoraFin("");
      setEstado(true);
      setUrlImagen("");
      setTipoSuperficie("");
      setTamano("");
      setCubierta("");
      setIluminacion("");
      setIdAreadeportiva(null);
    }
    setErrors({});
  }, [initialData]);

  function validate() {
    const e = {};
    if (!nombre.trim()) e.nombre = "El nombre de la cancha es obligatorio";
    const costoNum = costoHora === "" ? NaN : Number(costoHora);
    if (!costoHora || Number.isNaN(costoNum) || costoNum <= 0) e.costoHora = "Costo por hora debe ser un número positivo";
    const capNum = capacidad === "" ? NaN : Number(capacidad);
    if (!capacidad || Number.isNaN(capNum) || capNum <= 0) e.capacidad = "La capacidad debe ser un número entero positivo";
    if (!idAreadeportiva || idAreadeportiva <= 0) e.idAreadeportiva = "Debe seleccionar una zona";
    if (!tipoSuperficie.trim()) e.tipoSuperficie = "Tipo de superficie es obligatorio";
    if (!tamano.trim()) e.tamano = "Tamaño es obligatorio";
    if (!horaInicio) e.horaInicio = "Hora de inicio obligatoria";
    if (!horaFin) e.horaFin = "Hora de fin obligatoria";
    return e;
  }

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    // Construyo payload correctamente (ejecuto .trim() y convierto números)
    const payload = {
      ...(initialData?.idCancha ? { idCancha: initialData.idCancha } : {}),
      nombre: nombre.trim(),
      costoHora: costoHora === "" ? null : Number(costoHora),
      capacidad: capacidad === "" ? null : Number(capacidad),
      mantenimiento: mantenimiento.trim(),
      horaInicio: horaInicio, // "HH:mm"
      horaFin: horaFin,
      estado: estado,
      urlImagen: urlImagen.trim(),
      tipoSuperficie: tipoSuperficie.trim(),
      tamano: tamano.trim(),
      cubierta: cubierta.trim(),
      iluminacion: iluminacion.trim(),
      idAreadeportiva: idAreadeportiva ? Number(idAreadeportiva) : null
    };
    
    console.log("Payload a enviar:", payload); // revisa en DevTools -> Network si llega bien
    onSave(payload);
  };
  

  const title =
    computedMode === "view"
      ? "Ver Cancha"
      : computedMode === "edit"
      ? "Editar Cancha"
      : "Nuevo Cancha";

  return (
    <form className="Cancha-form" onSubmit={handleSubmit}>
      <h3>{title}</h3>

      <div className="form-row">
        <label>Nombre de la Cancha</label>
        <input
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          disabled={readonly}
        />
        {errors.nombre && <div className="form-error">{errors.nombre}</div>}
      </div>

      <div className="form-row">
        <label>Imagen de la Cancha (URL)</label>
        <input
          type="text"
          value={urlImagen}
          onChange={e => setUrlImagen(e.target.value)}
          disabled={readonly}
        />
      </div>

      <div className="form-row">
        <label>Costo Por Hora</label>
        <input
          type="number"
          step="0.01"
          value={costoHora}
          onChange={e => setCostoHora(e.target.value)}
          disabled={readonly}
        />
        {errors.costoHora && <div className="form-error">{errors.costoHora}</div>}
      </div>

      <div className="form-row">
        <label>Límite de personas</label>
        <input
          type="number"
          step="1"
          value={capacidad}
          onChange={e => setCapacidad(e.target.value)}
          disabled={readonly}
        />
        {errors.capacidad && <div className="form-error">{errors.capacidad}</div>}
      </div>

      <div className="form-row">
        <label>Hora Inicio</label>
        <input type="time"
          value={horaInicio}
          onChange={e => setHoraInicio(e.target.value)}
          disabled={readonly}
        />
        {errors.horaInicio && <div className="form-error">{errors.horaInicio}</div>}
      </div>

      <div className="form-row">
        <label>Hora Fin</label>
        <input type="time"
          value={horaFin}
          onChange={e => setHoraFin(e.target.value)}
          disabled={readonly}
        />
        {errors.horaFin && <div className="form-error">{errors.horaFin}</div>}
      </div>

      <div className="form-row">
        <label>Tamaño</label>
        <input
          value={tamano}
          onChange={e => setTamano(e.target.value)}
          disabled={readonly}
        />
        {errors.tamano && <div className="form-error">{errors.tamano}</div>}
      </div>

      <div className="form-row">
        <label>Tipo de Superficie</label>
        <input
          value={tipoSuperficie}
          onChange={e => setTipoSuperficie(e.target.value)}
          disabled={readonly}
        />
        {errors.tipoSuperficie && <div className="form-error">{errors.tipoSuperficie}</div>}
      </div>

      <div className="form-row">
        <label>Cubierta</label>
        <input
          value={cubierta}
          onChange={e => setCubierta(e.target.value)}
          disabled={readonly}
        />
      </div>

      <div className="form-row">
        <label>Iluminación</label>
        <input
          value={iluminacion}
          onChange={e => setIluminacion(e.target.value)}
          disabled={readonly}
        />
      </div>

      <div className="form-row">
        <label>Mantenimiento</label>
        <textarea
          value={mantenimiento}
          onChange={e => setMantenimiento(e.target.value)}
          disabled={readonly}
          rows={4}
        />
      </div>

      <div className="form-row">
        <label>Área Deportiva</label>
        <select
          value={idAreadeportiva ?? ""}
          onChange={e => setIdAreadeportiva(e.target.value ? Number(e.target.value) : null)}
          disabled={readonly}
        >
          <option value="">Seleccione a que Área Deportiva Pertenece</option>
          {Areadeportiva.map(z => (
            <option key={z.idAreadeportiva} value={z.idAreadeportiva}>{z.nombreArea}</option>
          ))}
        </select>
        {errors.idAreadeportiva && <div className="form-error">{errors.idAreadeportiva}</div>}
      </div>

      <div className="form-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={estado}
            onChange={e => setEstado(e.target.checked)}
            disabled={readonly}
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
