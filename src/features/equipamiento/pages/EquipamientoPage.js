import React, { useEffect, useState } from "react";
import EquipamientoForm from "../pages/EquipamientoForm";
import * as EquipamientoService from "../../../api/EquipamientoApi";


//import "../pages/EquipamientoPage.css"; // Importar CSS de la página


export default function EquipamientoPage() {
  const [items, setItems] = useState([]); //listadito de Equipamientos
  const [loading, setLoading] = useState(false);//Indica si los datos están siendo cargados desde la API.
  const [error, setError] = useState(null); //Guarda cualquier mensaje de error que ocurra al hacer una solicitud.
  const [showForm, setShowForm] = useState(false); //Controla si se muestra el formulario para crear o editar una Equipamiento.
  const [editing, setEditing] = useState(null); //Guarda la Equipamiento que se está editando. Si es
  const [search, setSearch] = useState("");//El valor del campo de búsqueda para filtrar las Equipamientos por nombre.

  useEffect(() => {
    load();
  }, []);

  async function load() { 
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
  }


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


  function openCreate() {
    setEditing(null); // No hay Equipamiento en edición
    setShowForm(true); // Muestra el formulario de creación
  }

  function openEdit(item) {
    setEditing(item); // Establece la Equipamiento a editar
    setShowForm(true); // Muestra el formulario de edición
  }

  async function handleDelete(id) {
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
  }

async function handleSave(payload) {
  try {
    // Depuración: Verificar los datos que se envían
    console.log("Payload a enviar:", payload);

    const dataToSend =
      editing && editing.idEquipamiento
        ? { ...editing, ...payload, idEquipamiento: editing.idEquipamiento } // Si estamos editando, actualizamos los datos
        : payload; // Si estamos creando, usamos los datos del formulario

    // Verificar que el payload tiene la propiedad idMacrodistrito
    if (!dataToSend.idMacrodistrito) {
      console.error("Falta el idMacrodistrito en el payload");
      return;
    }

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



  return (
    <div className="Equipamiento-page card">
      <div className="page-header">
        <h2>Equipamientos</h2>

        <div className="search-actions-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              className="search-input"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </form>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={handleSearch}>Buscar</button>
            <button
              type="button"
              className="btn btn-accent"
              onClick={() => {
                setSearch("");
                load();
              }}
            >
              Limpiar
            </button>
            <button className="btn btn-primary" onClick={openCreate}>
              Nuevo Equipamiento
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="table-wrap">
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Sin datos
                  </td>
                </tr>
              ) : (
                items.map(item => (
                  <tr
                    key={item.idEquipamiento}
                    className={!item.estado ? "row-inactive" : ""}
                  >
                    <td>{item.idEquipamiento}</td>
                    <td>{item.nombre}</td>
                    <td>{item.descripcion}</td>
                    <td>{item.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary" onClick={() => openEdit(item)}>
                          Editar
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(item.idEquipamiento)}
                        >
                          Desactivar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
