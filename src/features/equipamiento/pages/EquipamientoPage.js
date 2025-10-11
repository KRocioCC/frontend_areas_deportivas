import React, { useEffect, useState ,useMemo, useCallback} from "react";
import EquipamientoForm from "../pages/EquipamientoForm";
import * as EquipamientoService from "../../../api/EquipamientoApi";


//import "../pages/EquipamientoPage.css"; // Importar CSS de la página
import Button from "../../../components/ui/Button";
import SearchBar from "../../../components/ui/SearchInput";
import { Plus , Eye, Edit3, Trash2  } from "lucide-react";

//import "../pages/CanchaForm.css"; 

import CRUDTable from "../../../components/ui/CRUDTable";

export default function EquipamientoPage() {
  const [items, setItems] = useState([]); //listadito de Equipamientos
  const [loading, setLoading] = useState(false);//Indica si los datos están siendo cargados desde la API.
  const [error, setError] = useState(null); //Guarda cualquier mensaje de error que ocurra al hacer una solicitud.
  const [showForm, setShowForm] = useState(false); //Controla si se muestra el formulario para crear o editar una Equipamiento.
  const [editing, setEditing] = useState(null); //Guarda la Equipamiento que se está editando. Si es
  const [search, setSearch] = useState("");//El valor del campo de búsqueda para filtrar las Equipamientos por nombre.

  

  const load = useCallback(async () =>  { 
    setLoading(true);
    setError(null);
    try {
      const data = await EquipamientoService.getEquipamientos(); // Llama a la función para obtener las Equipamientos
      setItems(Array.isArray(data) ? data : []); // Guarda las Equipamientos en el estado
    } catch (err) {
      setError("No se pudieron cargar los Equipamientos"); // Si hay un error, muestra el mensaje
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  },[]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSearch(e) {
    e && e.preventDefault(); // Previene el comportamiento por defecto del formulario

    if (!search.trim()) {
      load(); // Si no hay búsqueda, recarga todas las Equipamientos
      return;
    }

    const filtered = items.filter(item =>
      item.nombre?.toLowerCase().includes(search.trim().toLowerCase()) // Filtra las Equipamientos por nombre
    );
    setItems(filtered); // Actualiza el estado con las Equipamientos filtradas
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

  const handleDelete = useCallback(async (id) => {
    if (!id) return;

    if (!window.confirm("¿Desactivar este Equipamiento?")) return;

    try {
      const itemToUpdate = items.find(x => x.idEquipamiento === id);
      if (!itemToUpdate) return;

      const updated = {
        ...itemToUpdate,
        estado: false,
      };

      await EquipamientoService.updateEquipamiento(id, updated);

      setItems(prev =>
        prev.map(x =>
          x.idEquipamiento === id ? { ...x, estado: false } : x
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
      editing && editing.idEquipamiento
        ? { ...editing, ...payload, idEquipamiento: editing.idEquipamiento } // Si estamos editando, actualizamos los datos
        : payload; // Si estamos creando, usamos los datos del formulario

    // Verificar que el payload tiene la propiedad idMacrodistrito
    /*if (!dataToSend.idMacrodistrito) {
      console.error("Falta el idMacrodistrito en el payload");
      return;
    }*/

    if (dataToSend.idEquipamiento) {
      const updated = await EquipamientoService.updateEquipamiento(dataToSend.idEquipamiento, dataToSend); // Actualiza la Equipamiento
      setItems(prev =>
        prev.map(p => p.idEquipamiento === updated.idEquipamiento ? updated : p) // Actualiza la Equipamiento en el estado
      );
    } else {
      const created = await EquipamientoService.createEquipamiento(dataToSend); // Crea la nueva Equipamiento
      setItems(prev => [created, ...prev]); // Agrega la nueva Equipamiento al principio de la lista
    }

    setShowForm(false); // Cierra el formulario
    setEditing(null); // Resetea el estado de edición
  } catch (err) {
    console.error("Error guardando Equipamiento:", err);
    alert("Error guardando Equipamiento");
  }
}
  const columns = useMemo(() => [
    { header: "ID", accessor: "idEquipamiento", width: 90, sortable: true, align: "right" },
    { header: "Nombre", accessor: "nombreEquipamiento", sortable: true, truncate: 220 },
    { header: "Tipo", accessor: "tipoEquipamiento",sortable: true, truncate: 220 },
    { header: "Descripcion", accessor: "descripcion", sortable: true, truncate: 220 },
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
    <div className="Equipamiento-page card">
      <div className="page-header">
        <h2>Equipamientos</h2>

        <div className="search-actions-container">
          <form onSubmit={handleSearch} className="search-form">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={() => handleSearch()} 
              onClear={() => { setSearch(""); load(); }}
              placeholder="Buscar Equipamiento por nombre..."
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
          rowIdKey="idEquipamiento"
          dense="md"
          stickyHeader
          pageSize={5}
          initialSort={{ accessor: "idEquipamiento", direction: "asc" }}
          loading={loading}
          emptyMessage="Sin datos"
        />
      )}

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <EquipamientoForm
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
