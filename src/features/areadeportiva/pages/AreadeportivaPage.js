import React, { useCallback, useEffect, useMemo, useState } from "react";
import AreadeportivaForm from "../pages/AreadeportivaForm";
import * as AreadeportivaService from "../../../api/AreadeportivaApi";
import Button from "../../../components/ui/Button";
import SearchBar from "../../../components/ui/SearchInput";
import { Plus, Eye, Edit3, Trash2 } from "lucide-react";
import CRUDTable from "../../../components/ui/CRUDTable";

// Configuración de ruta base
const BASE_URL_IMG = "http://localhost:8032/"; 

export default function AreadeportivaPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AreadeportivaService.getAreadeportiva();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("No se pudieron cargar las áreas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSearch(e) {
    e && e.preventDefault();
    if (!search.trim()) {
      load();
      return;
    }
    const filtered = items.filter(item =>
      item.nombreArea?.toLowerCase().includes(search.trim().toLowerCase())
    );
    setItems(filtered);
  }

  const openCreate = useCallback(() => {
    setEditing(null);
    setShowForm(true);
  }, []);

  const openEdit = useCallback((item) => {
    setEditing(item);
    setShowForm(true);
  }, []);

  const openView = useCallback((item) => {
    setEditing({ ...item, _readonly: true });
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!id) return;
    if (!window.confirm("¿Desactivar esta área deportiva?")) return;
    try {
      const itemToUpdate = items.find(x => x.idAreadeportiva === id);
      if (!itemToUpdate) return;
      const updated = { ...itemToUpdate, estado: false };
      await AreadeportivaService.updateAreadeportiva(id, updated);
      
      // Actualización optimista local
      setItems(prev =>
        prev.map(x => x.idAreadeportiva === id ? { ...x, estado: false } : x)
      );
    } catch (err) {
      console.error("Error desactivando área:", err);
      alert("No se pudo desactivar el área deportiva");
    }
  }, [items]);

  // --- LÓGICA DE GUARDADO (Datos + Fotos) ---
  async function handleSave(payload, files) {
    try {
      console.log("Guardando Área...", payload);

      const dataToSend = editing && editing.idAreadeportiva
        ? { ...editing, ...payload, idAreadeportiva: editing.idAreadeportiva }
        : payload;

      if (!dataToSend.idZona || !dataToSend.id) {
        alert("Error: Faltan datos obligatorios (Zona o Administrador).");
        return;
      }

      let savedArea = null;

      // 1. Guardar la Entidad (JSON)
      if (dataToSend.idAreadeportiva) {
        savedArea = await AreadeportivaService.updateAreadeportiva(dataToSend.idAreadeportiva, dataToSend);
      } else {
        savedArea = await AreadeportivaService.createAreadeportiva(dataToSend);
      }

      // 2. Subir Imágenes (Si hay archivos seleccionados)
      if (savedArea && savedArea.idAreadeportiva && files && files.length > 0) {
        console.log(`Subiendo ${files.length} imágenes...`);
        try {
           await AreadeportivaService.agregarImagenesArea(savedArea.idAreadeportiva, files);
           
           // RECARGA CRÍTICA: Para traer la lista de imágenes actualizada desde el server
           await load(); 
           
        } catch (uploadErr) {
           console.error("Error subiendo imágenes:", uploadErr);
           alert("El área se guardó, pero falló la subida de imágenes.");
        }
      } else {
         // Si no hubo fotos nuevas, solo recargamos la lista localmente para ser más rápidos
         await load(); 
      }

      setShowForm(false);
      setEditing(null);
      
    } catch (err) {
      console.error("Error guardando Areadeportiva:", err);
      alert("Error al guardar: " + (err.message || "Error desconocido"));
    }
  }

  // --- DEFINICIÓN DE COLUMNAS ---
  const columns = useMemo(() => [
    { 
      header: "Foto", 
      id: "foto",
      width: 80,
      render: (_, row) => {
          // 1. Obtener la primera imagen de la lista
          const primeraImagen = row.imagenes && row.imagenes.length > 0 
                ? row.imagenes[0].rutaAlmacenamiento // O .url según tu DTO
                : null;
          
          if (!primeraImagen) return <span className="text-gray-400 text-xs">Sin foto</span>;

          // 2. Construir URL
          const srcFinal = primeraImagen.startsWith('http') 
              ? primeraImagen 
              : `${BASE_URL_IMG}${primeraImagen}`;

          return (
            <div className="relative group">
                <img 
                  src={srcFinal} 
                  alt="Area" 
                  className="w-12 h-12 object-cover rounded-md border border-gray-200 shadow-sm bg-white"
                  onError={(e) => {
                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDUwIDUwIj48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TUE8L3RleHQ+PC9zdmc+";
                  }}
                />
                {/* Badge si hay más fotos */}
                {row.imagenes && row.imagenes.length > 1 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full shadow border-white border-2 font-bold">
                        +{row.imagenes.length - 1}
                    </span>
                )}
            </div>
          );
      }
    },
    { header: "ID", accessor: "idAreadeportiva", width: 60, sortable: true, align: "right" },
    { header: "Nombre", accessor: "nombreArea", sortable: true, truncate: 200 },
    { header: "Email", accessor: "emailArea", sortable: true, truncate: 150 },
    { header: "Teléfono", accessor: "telefonoArea", truncate: 100 },
    { header: "Horario", render: (_, row) => `${row.horaInicioArea?.slice(0,5) || ''} - ${row.horaFinArea?.slice(0,5) || ''}`, truncate: 120 },
    {
      header: "Estado",
      accessor: "estado",
      width: 100,
      sortable: true,
      render: (v) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs border ${v ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {v ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ], []);

  const actions = useMemo(() => [
    { label: "", icon: Eye, size: "sm", variant: "botoncrear", onClick: (row) => openView(row) },
    { label: "", icon: Edit3, variant: "botoneditar", onClick: (row) => openEdit(row) },
    { label: "", icon: Trash2, variant: "botoneliminar", show: (row) => row.estado, onClick: (row) => handleDelete(row.idAreadeportiva) },
  ], [openView, openEdit, handleDelete]);

  return (
    <div className="Areadeportiva-page card">
      <div className="page-header">
        <h2 className="h-heading text-2xl mb-2">Áreas Deportivas</h2>
        <div className="search-actions-container">
          <form onSubmit={handleSearch} className="search-form">
            <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} onSearch={() => handleSearch()} onClear={() => { setSearch(""); load(); }} placeholder="Buscar..." size="md" className="search-input"/>
          </form>
          <div className="button-group">
            <Button variant="primary" size="sm" icon={Plus} onClick={openCreate}>Nuevo</Button>
          </div>
        </div>
      </div>

      {error ? <p className="error">{error}</p> : (
        <CRUDTable columns={columns} data={items} actions={actions} rowIdKey="idAreadeportiva" dense="md" stickyHeader pageSize={5} initialSort={{ accessor: "idAreadeportiva", direction: "asc" }} loading={loading} emptyMessage="Sin datos"/>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
             <div className="absolute inset-0 backdrop-blur-sm"></div>
             <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <AreadeportivaForm initialData={editing} onCancel={() => { setShowForm(false); setEditing(null); }} onSave={handleSave} />
             </div>
        </div>
      )}
    </div>
  );
}