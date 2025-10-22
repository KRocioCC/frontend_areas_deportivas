import React, { useCallback, useEffect,useMemo, useState } from "react";
import AreadeportivaForm from "../pages/AreadeportivaForm";
import * as AreadeportivaService from "../../../api/AreadeportivaApi";

//import "../pages/macrodistritoPage.css";
import Button from "../../../components/ui/Button";
import SearchBar from "../../../components/ui/SearchInput";
import { Plus , Eye, Edit3, Trash2  } from "lucide-react";

import CRUDTable from "../../../components/ui/CRUDTable";

//import "../pages/AreadeportivaPage.css"; // Importar CSS de la página


export default function AreadeportivaPage() {
  const [items, setItems] = useState([]); //listadito de Areadeportivas
  const [loading, setLoading] = useState(false);//Indica si los datos están siendo cargados desde la API.
  const [error, setError] = useState(null); //Guarda cualquier mensaje de error que ocurra al hacer una solicitud.
  const [showForm, setShowForm] = useState(false); //Controla si se muestra el formulario para crear o editar una Areadeportiva.
  const [editing, setEditing] = useState(null); //Guarda la Areadeportiva que se está editando. Si es
  const [search, setSearch] = useState("");//El valor del campo de búsqueda para filtrar las Areadeportivas por nombre.

  const load =useCallback(async () => {
    setLoading(true);
        setError(null);
        try {
          const data = await AreadeportivaService.getAreadeportiva();
          setItems(Array.isArray(data) ? data : []);
        } catch (err) {
          setError("No se pudieron cargar los areadeportiva");
        } finally {
          setLoading(false);
        }
  }, []);

  useEffect(() => {
    load();
  }, [load]);


  async function handleSearch(e) {
    e && e.preventDefault(); // Previene el comportamiento por defecto del formulario

    if (!search.trim()) {
      load(); // Si no hay búsqueda, recarga todas las Areadeportivas
      return;
    }

    const filtered = items.filter(item =>
      item.nombreArea?.toLowerCase().includes(search.trim().toLowerCase()) // Filtra las Areadeportivas por nombre
    );
    setItems(filtered); // Actualiza el estado con las Areadeportivas filtradas
  }

  const openCreate = useCallback(() =>  {
    setEditing(null); // No hay Areadeportiva en edición
    setShowForm(true); // Muestra el formulario de creación
  },[])

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

      // Crear payload con estado = false
      const updated = {
        ...itemToUpdate,
        estado: false // Booleano 
      };

      // Llamada al backend
      await AreadeportivaService.updateAreadeportiva(id, updated);

      // Actualizar la lista local para reflejar el cambio
      setItems(prev =>
        prev.map(x =>
          x.idAreadeportiva === id ? { ...x, estado: false } : x
        )
      );
    } catch (err) {
      console.error("Error desactivando área:", err);
      alert("No se pudo desactivar el área deportiva");
    }
  },[items]);


async function handleSave(payload) {
  try {
    // Depuración: Verificar los datos que se envían
    console.log("Payload a enviar:", payload);

    const dataToSend =
      editing && editing.idAreadeportiva
        ? { ...editing, ...payload, idAreadeportiva: editing.idAreadeportiva } // Si estamos editando, actualizamos los datos
        : payload; // Si estamos creando, usamos los datos del formulario

    // Verificar que el payload tiene la propiedad idZona
    if (!dataToSend.idZona) {
      console.error("Falta el idZona en el payload");
      return;
    }

    if (dataToSend.idAreadeportiva) {
      const updated = await AreadeportivaService.updateAreadeportiva(dataToSend.idAreadeportiva, dataToSend); // Actualiza la Areadeportiva
      setItems(prev =>
        prev.map(p => p.idAreadeportiva === updated.idAreadeportiva ? updated : p) // Actualiza la Areadeportiva en el estado
      );
    } else {
      const created = await AreadeportivaService.createAreadeportiva(dataToSend); // Crea la nueva Areadeportiva
      setItems(prev => [created, ...prev]); // Agrega la nueva Areadeportiva al principio de la lista
    }

    setShowForm(false); // Cierra el formulario
    setEditing(null); // Resetea el estado de edición
  } catch (err) {
    console.error("Error guardando Areadeportiva:", err);
    alert("Error guardando Areadeportiva");
  }
}


const columns = useMemo(() => [
    { header: "ID", accessor: "idAreadeportiva", width: 90, sortable: true, align: "right" },
    { header: "Nombre", accessor: "nombreArea", sortable: true, truncate: 220 },
    { header: "Email", accessor: "emailArea", sortable: true, truncate: 220 },
    { header: "Telefono", accessor: "telefonoArea", truncate: 220 },
    { header: "Horario", render: (_, row) => `${row.horaInicioArea} - ${row.horaFinArea}`, truncate: 220 },
    {
      header: "Estado",
      accessor: "estado",
      width: 120,
      sortable: true,
      render: (v) => (
        <span
          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs border"
          style={{
            background: v ? "rgba(14, 223, 202, 0.12)" : "rgba(168, 61, 37, 0.13)",
            color: "#222",
          }}
        >
          {v ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ], []);
  
  const actions = useMemo(() => [
      { label: "", icon: Eye, size: "sm",  variant: "botoncrear",     onClick: (row) => openView(row) },
      { label: "", icon: Edit3, variant: "botoneditar",    onClick: (row) => openEdit(row) },
      { label: "", icon: Trash2, variant: "botoneliminar", show: (row) => row.estado, onClick: (row) => handleDelete(row.idMacrodistrito) },
  ], [openView, openEdit, handleDelete]);


  return (
    <div className="Areadeportiva-page card">
      <div className="page-header">
        <h2 className="h-heading text-2xl mb-2" >Areadeportivas</h2>

        <div className="search-actions-container">
          <form onSubmit={handleSearch} className="search-form">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={() => handleSearch()} 
              onClear={() => { setSearch(""); load(); }}
              placeholder="Buscar Area Deportiva por nombre..."
              size="md"
              className="search-input"
            />
          </form>
          <div className="button-group">
            <Button variant="primary" size="sm" icon={Plus} onClick={openCreate} >
              Nuevo
            </Button>
          </div>
        </div>
      </div>

      {error ? (
        <p className="error">{error}</p>
      ) : (
        <CRUDTable
          columns={columns}
          data={items}
          actions={actions}
          rowIdKey="idAreadeportiva"
          dense="md"
          stickyHeader
          pageSize={5}
          initialSort={{ accessor: "idAreadeportiva", direction: "asc" }}
          loading={loading}
          emptyMessage="Sin datos"
        />
      )}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <AreadeportivaForm
              initialData={editing}
              onCancel={() => { setShowForm(false); setEditing(null); }}
              onSave={handleSave}
              // opcional: puedes forzar el modo aquí si no usas _readonly
              // mode={editing?._readonly ? "view" : (editing ? "edit" : "create")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
