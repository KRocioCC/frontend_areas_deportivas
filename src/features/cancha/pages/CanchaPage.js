import React, { useEffect, useState ,useMemo, useCallback} from "react";
import CanchaForm from "../pages/CanchaForm";
import * as CanchaService from "../../../api/CanchaApi";
//import "../../macrodistritos/pages/macrodistritoPage.css";
import Button from "../../../components/ui/Button";
import SearchBar from "../../../components/ui/SearchInput";
import { Plus , Eye, Edit3, Trash2  } from "lucide-react";


import "../pages/CanchaForm.css"; 

import CRUDTable from "../../../components/ui/CRUDTable";

export default function CanchaPage() {
  const [items, setItems] = useState([]); //listadito de Canchas
  const [loading, setLoading] = useState(false);//Indica si los datos están siendo cargados desde la API.
  const [error, setError] = useState(null); //Guarda cualquier mensaje de error que ocurra al hacer una solicitud.
  const [showForm, setShowForm] = useState(false); //Controla si se muestra el formulario para crear o editar una Cancha.
  const [editing, setEditing] = useState(null); //Guarda la Cancha que se está editando. Si es
  const [search, setSearch] = useState("");//El valor del campo de búsqueda para filtrar las Canchas por nombre.

  

  const load = useCallback(async () =>  { 
    setLoading(true);
    setError(null);
    try {
      const data = await CanchaService.getCanchas(); // Llama a la función para obtener las Canchas
      setItems(Array.isArray(data) ? data : []); // Guarda las Canchas en el estado
    } catch (err) {
      setError("No se pudieron cargar los Canchas"); // Si hay un error, muestra el mensaje
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSearch(e) {
    e && e.preventDefault(); // Previene el comportamiento por defecto del formulario

    if (!search.trim()) {
      load(); // Si no hay búsqueda, recarga todas las Canchas
      return;
    }

    const filtered = items.filter(item =>
      item.nombre?.toLowerCase().includes(search.trim().toLowerCase()) // Filtra las Canchas por nombre
    );
    setItems(filtered); // Actualiza el estado con las Canchas filtradas
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
    setEditing({ ...item, _readonly: true }); // modo solo lectura
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id) =>{
    if (!id) return;

    if (!window.confirm("¿Desactivar este Cancha?")) return;

    try {
      const itemToUpdate = items.find(x => x.idCancha === id);
      if (!itemToUpdate) return;

      const updated = {
        ...itemToUpdate,
        estado: false,
      };

      await CanchaService.updateCancha(id, updated);

      setItems(prev =>
        prev.map(x =>
          x.idCancha === id ? { ...x, estado: false } : x
        )
      );
    } catch (err) {
      alert("No se pudo desactivar");
    }
  }, [items]);

async function handleSave(payload) {
  try {
    // Depuración: Verificar los datos que se envían
    console.log("Payload a enviar:", payload);

    const dataToSend =
      editing && editing.idCancha
        ? { ...editing, ...payload, idCancha: editing.idCancha } // Si estamos editando, actualizamos los datos
        : payload; // Si estamos creando, usamos los datos del formulario

    // Verificar que el payload tiene la propiedad idCancha
    if (!dataToSend.idAreadeportiva) {
      console.error("Falta el idAreadeportiva en el payload");
      return;
    }

    if (dataToSend.idCancha) {
      const updated = await CanchaService.updateCancha(dataToSend.idCancha, dataToSend); // Actualiza la Cancha
      setItems(prev =>
        prev.map(p => p.idCancha === updated.idCancha ? updated : p) // Actualiza la Cancha en el estado
      );
    } else {
      const created = await CanchaService.createCancha(dataToSend); // Crea la nueva Cancha
      setItems(prev => [created, ...prev]); // Agrega la nueva Cancha al principio de la lista
    }

    setShowForm(false); // Cierra el formulario
    setEditing(null); // Resetea el estado de edición
  } catch (err) {
    console.error("Error guardando Cancha:", err);
    alert("Error guardando Cancha");
  }
}
  const columns = useMemo(() => [
    { header: "ID", accessor: "idCancha", width: 90, sortable: true, align: "right" },
    { header: "Nombre", accessor: "nombre", sortable: true, truncate: 220 },
    { header: "Capacidad", accessor: "capacidad",sortable: true, truncate: 220 },
    { header: " Costo Hora", accessor: "costoHora", sortable: true, truncate: 220 },
    { header: "Horario", render: (_, row) => `${row.horaInicio} - ${row.horaFin}`, truncate: 220 },
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
    { label: "", icon: Trash2, variant: "botoneliminar", show: (row) => row.estado, onClick: (row) => handleDelete(row.idCancha) },
  ], [openView, openEdit, handleDelete]);


  return (
    <div className="Cancha-page card text-gray-900">
      <div className="page-header">
        <h2>Canchas</h2>

        <div className="search-actions-container">
          <form onSubmit={handleSearch} className="search-form">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={() => handleSearch()} 
              onClear={() => { setSearch(""); load(); }}
              placeholder="Buscar Cancha por nombre..."
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
          rowIdKey="idCancha"
          dense="md"
          stickyHeader
          pageSize={5}
          initialSort={{ accessor: "idCancha", direction: "asc" }}
          loading={loading}
          emptyMessage="Sin datos"
        />
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          {/* Backdrop blur effect */}
          <div className="absolute inset-0 backdrop-blur-sm"></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <CanchaForm
              initialData={editing}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
}
