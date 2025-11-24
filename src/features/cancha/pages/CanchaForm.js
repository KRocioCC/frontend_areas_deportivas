// src/features/Canchas/pages/CanchaForm.jsx
import React, { useEffect, useState, useMemo } from "react";
import Button from "../../../components/ui/Button";
import { Plus, X} from "lucide-react";
import "../pages/CanchaForm.css";
import CanchaViewModal from "./CanchaViewModal";
import * as AreadeportivaService from "../../../api/AreadeportivaApi";

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

    const [loadingAreas, setLoadingAreas] = useState(false); // ← AÑADE ESTA LÍNEA después del estado de areas

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingAreas(true);
        const data = await AreadeportivaService.getAreadeportiva();
        setAreadeportiva(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando Areadeportiva:", err);
        setAreadeportiva([]);
      } finally {
        setLoadingAreas(false);
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

  if (computedMode === "view") {
    return <CanchaViewModal initialData={initialData} onCancel={onCancel} />;
  }

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <button 
          onClick={onCancel}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sección General */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Información General</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nombre de la Cancha
              </label>
              <input
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                disabled={readonly}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.nombre && <div className="text-sm text-red-600">{errors.nombre}</div>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Imagen de la Cancha (URL)
              </label>
              <input
                type="text"
                value={urlImagen}
                onChange={e => setUrlImagen(e.target.value)}
                disabled={readonly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Costo Por Hora
              </label>
              <input
                type="number"
                step="0.01"
                value={costoHora}
                onChange={e => setCostoHora(e.target.value)}
                disabled={readonly}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.costoHora ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.costoHora && <div className="text-sm text-red-600">{errors.costoHora}</div>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Límite de personas
              </label>
              <input
                type="number"
                step="1"
                value={capacidad}
                onChange={e => setCapacidad(e.target.value)}
                disabled={readonly}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.capacidad ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.capacidad && <div className="text-sm text-red-600">{errors.capacidad}</div>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Área Deportiva
              </label>
              <select
                value={idAreadeportiva ?? ""}
                onChange={e => setIdAreadeportiva(e.target.value ? Number(e.target.value) : null)}
                disabled={readonly || loadingAreas}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.idAreadeportiva ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Seleccione área deportiva</option>
                {loadingAreas ? (
                  <option value="" disabled>Cargando áreas...</option>
                ) : (
                  Areadeportiva.map(z => (
                    <option key={z.idAreadeportiva} value={z.idAreadeportiva}>{z.nombreArea}</option>
                  ))
                )}
              </select>
              {errors.idAreadeportiva && <div className="text-sm text-red-600">{errors.idAreadeportiva}</div>}
            </div>
          </div>
        </div>

        {/* Sección Horarios */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Horarios</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Hora Inicio
              </label>
              <input
                type="time"
                value={horaInicio}
                onChange={e => setHoraInicio(e.target.value)}
                disabled={readonly}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.horaInicio ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.horaInicio && <div className="text-sm text-red-600">{errors.horaInicio}</div>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Hora Fin
              </label>
              <input
                type="time"
                value={horaFin}
                onChange={e => setHoraFin(e.target.value)}
                disabled={readonly}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.horaFin ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.horaFin && <div className="text-sm text-red-600">{errors.horaFin}</div>}
            </div>
          </div>
        </div>

        {/* Sección Detalles */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Detalles de la Cancha</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tamaño
              </label>
              <input
                value={tamano}
                onChange={e => setTamano(e.target.value)}
                disabled={readonly}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.tamano ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.tamano && <div className="text-sm text-red-600">{errors.tamano}</div>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Superficie
              </label>
              <input
                value={tipoSuperficie}
                onChange={e => setTipoSuperficie(e.target.value)}
                disabled={readonly}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.tipoSuperficie ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.tipoSuperficie && <div className="text-sm text-red-600">{errors.tipoSuperficie}</div>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cubierta
              </label>
              <input
                value={cubierta}
                onChange={e => setCubierta(e.target.value)}
                disabled={readonly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Iluminación
              </label>
              <input
                value={iluminacion}
                onChange={e => setIluminacion(e.target.value)}
                disabled={readonly}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Mantenimiento
            </label>
            <textarea
              value={mantenimiento}
              onChange={e => setMantenimiento(e.target.value)}
              disabled={readonly}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Estado */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={estado}
                onChange={e => setEstado(e.target.checked)}
                disabled={readonly}
                className="sr-only"
              />
              <div className={`relative w-14 h-7 rounded-full transition-colors duration-200 ease-in-out ${estado ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <span className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-in-out transform ${estado ? 'translate-x-7' : ''}`}></span>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">Activo</span>
            </label>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
    </div>
  );
}