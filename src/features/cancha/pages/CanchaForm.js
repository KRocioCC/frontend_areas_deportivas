// src/features/Canchas/pages/CanchaForm.jsx
import React, { useEffect, useState, useMemo } from "react";
import Button from "../../../components/ui/Button";
import { Plus, X, Upload } from "lucide-react"; // Agregué icono Upload
import "../pages/CanchaForm.css";
import CanchaViewModal from "./CanchaViewModal";

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

  // Estados
  const [nombre, setNombre] = useState("");
  const [costoHora, setCostoHora] = useState("");
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

  // ESTADO PARA ARCHIVOS
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Cargar Áreas
  useEffect(() => {
    const loadData = async () => {
      try {
        // Nota: Idealmente usar api.get('/areasdeportivas')
        const res = await fetch('http://localhost:8032/api/areasdeportivas');
        if (!res.ok) throw new Error("Error al conectar con API");
        const data = await res.json();
        setAreadeportiva(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando Areadeportiva:", err);
        setAreadeportiva([]);
      }
    };
    loadData();
  }, []);

  // Cargar datos iniciales (Edición)
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
      // Reset para Crear
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
    setSelectedFiles([]); // Limpiar archivos al cambiar datos
  }, [initialData]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  function validate() {
    const e = {};
    if (!nombre.trim()) e.nombre = "El nombre de la cancha es obligatorio";
    const costoNum = costoHora === "" ? NaN : Number(costoHora);
    if (!costoHora || Number.isNaN(costoNum) || costoNum <= 0) e.costoHora = "Costo positivo requerido";
    const capNum = capacidad === "" ? NaN : Number(capacidad);
    if (!capacidad || Number.isNaN(capNum) || capNum <= 0) e.capacidad = "Capacidad requerida";
    if (!idAreadeportiva || idAreadeportiva <= 0) e.idAreadeportiva = "Seleccione un área";
    if (!horaInicio) e.horaInicio = "Hora inicio requerida";
    if (!horaFin) e.horaFin = "Hora fin requerida";
    return e;
  }

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    const payload = {
      ...(initialData?.idCancha ? { idCancha: initialData.idCancha } : {}),
      nombre: nombre.trim(),
      costoHora: costoHora === "" ? null : Number(costoHora),
      capacidad: capacidad === "" ? null : Number(capacidad),
      mantenimiento: mantenimiento.trim(),
      horaInicio: horaInicio,
      horaFin: horaFin,
      estado: estado,
      urlImagen: urlImagen.trim(), // URL de texto (legacy o portada)
      tipoSuperficie: tipoSuperficie.trim(),
      tamano: tamano.trim(),
      cubierta: cubierta.trim(),
      iluminacion: iluminacion.trim(),
      idAreadeportiva: idAreadeportiva ? Number(idAreadeportiva) : null
    };

    // IMPORTANTE: Pasamos Payload Y Archivos al padre
    onSave(payload, selectedFiles);
  };

  const title = computedMode === "view" ? "Ver Cancha" : computedMode === "edit" ? "Editar Cancha" : "Nueva Cancha";

  if (computedMode === "view") {
    return <CanchaViewModal initialData={initialData} onCancel={onCancel} />;
  }

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Sección General */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Información General</h3>
          
          {/* AREA DEPORTIVA (Movido arriba por importancia) */}
          <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700 mb-1">Área Deportiva *</label>
             <select
               value={idAreadeportiva ?? ""}
               onChange={e => setIdAreadeportiva(e.target.value ? Number(e.target.value) : null)}
               disabled={readonly}
               className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${errors.idAreadeportiva ? 'border-red-500' : 'border-gray-300'}`}
             >
               <option value="">-- Seleccione área --</option>
               {Areadeportiva.map(z => (
                 <option key={z.idAreadeportiva} value={z.idAreadeportiva}>{z.nombreArea || z.nombre}</option>
               ))}
             </select>
             {errors.idAreadeportiva && <div className="text-sm text-red-600">{errors.idAreadeportiva}</div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                disabled={readonly}
                className={`w-full px-3 py-2 border rounded-md ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.nombre && <div className="text-sm text-red-600">{errors.nombre}</div>}
            </div>
            
            {/* Input para URL de Texto (Opcional) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">URL Imagen (Portada)</label>
              <input
                type="text"
                value={urlImagen}
                onChange={e => setUrlImagen(e.target.value)}
                disabled={readonly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://..."
              />
            </div>
          </div>
          
          {/* NUEVO: Input para SUBIR IMÁGENES REALES */}
          <div className="mt-4 p-4 border-2 border-dashed border-blue-200 bg-blue-50 rounded-lg">
            <label className="flex items-center gap-2 text-sm font-bold text-blue-700 mb-2">
                <Upload size={18} /> Subir Fotografías (Galería)
            </label>
            <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleFileChange}
                disabled={readonly}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            {selectedFiles.length > 0 && (
                <p className="mt-2 text-xs text-green-600 font-semibold">
                    {selectedFiles.length} archivos seleccionados para subir al guardar.
                </p>
            )}
          </div>
        </div>

        {/* Costos y Capacidad */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Costo Por Hora</label>
              <input
                type="number" step="0.01"
                value={costoHora}
                onChange={e => setCostoHora(e.target.value)}
                disabled={readonly}
                className={`w-full px-3 py-2 border rounded-md ${errors.costoHora ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.costoHora && <div className="text-sm text-red-600">{errors.costoHora}</div>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Capacidad (Personas)</label>
              <input
                type="number" step="1"
                value={capacidad}
                onChange={e => setCapacidad(e.target.value)}
                disabled={readonly}
                className={`w-full px-3 py-2 border rounded-md ${errors.capacidad ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.capacidad && <div className="text-sm text-red-600">{errors.capacidad}</div>}
            </div>
           </div>
        </div>

        {/* Horarios y Detalles Técnicos */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Detalles Técnicos y Horario</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Hora Inicio</label>
              <input type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} disabled={readonly} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="space-y-2">
               <label className="block text-sm font-medium text-gray-700">Hora Fin</label>
               <input type="time" value={horaFin} onChange={e => setHoraFin(e.target.value)} disabled={readonly} className="w-full px-3 py-2 border rounded-md" />
            </div>
            
            {/* Detalles Extra */}
            <input placeholder="Tamaño (ej. 20x40)" value={tamano} onChange={e => setTamano(e.target.value)} disabled={readonly} className="w-full px-3 py-2 border rounded-md" />
            <input placeholder="Superficie (ej. Sintético)" value={tipoSuperficie} onChange={e => setTipoSuperficie(e.target.value)} disabled={readonly} className="w-full px-3 py-2 border rounded-md" />
            <input placeholder="Cubierta (Si/No)" value={cubierta} onChange={e => setCubierta(e.target.value)} disabled={readonly} className="w-full px-3 py-2 border rounded-md" />
            <input placeholder="Iluminación" value={iluminacion} onChange={e => setIluminacion(e.target.value)} disabled={readonly} className="w-full px-3 py-2 border rounded-md" />
          </div>
          
          <div className="mt-4">
             <label className="block text-sm font-medium text-gray-700">Mantenimiento / Notas</label>
             <textarea value={mantenimiento} onChange={e => setMantenimiento(e.target.value)} disabled={readonly} rows={3} className="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>

        {/* Estado */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={estado} onChange={e => setEstado(e.target.checked)} disabled={readonly} className="sr-only" />
            <div className={`relative w-14 h-7 rounded-full transition-colors ${estado ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <span className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform transform ${estado ? 'translate-x-7' : ''}`}></span>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">Cancha Activa</span>
          </label>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-end">
          <Button variant="primary" size="sm" icon={X} onClick={onCancel}>Cancelar</Button>
          {!readonly && (
            <Button type="submit" variant="accent1" size="sm" icon={Plus}>Guardar Todo</Button>
          )}
        </div>
      </form>
    </div>
  );
}