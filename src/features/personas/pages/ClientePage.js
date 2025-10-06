import React, { useEffect, useState } from "react";
import ClienteForm from "../components/ClienteForm";
import * as clienteService from "../../../api/clienteApi";
import "../pages/userPage.css";


function normalizeCliente(raw = {}) {
  const apaterno =
    raw.apaterno ??
    raw.aPaterno ??
    raw.a_paterno ??
    raw.apellidoPaterno ??
    raw.apellido_paterno ??
    raw.apellidoPaterno ?? ""; // fallback

  const amaterno =
    raw.amaterno ??
    raw.aMaterno ??
    raw.a_materno ??
    raw.apellidoMaterno ??
    raw.apellido_materno ??
    raw.apellidoMaterno ?? "";

  const fechaNacimiento =
    raw.fechaNacimiento ?? raw.fecha_nacimiento ?? raw.fecha_nac ?? "";

  const urlImagen = raw.urlImagen ?? raw.url_imagen ?? raw.url_image ?? "";

  const id = raw.id ?? raw.id_persona ?? raw.idPersona ?? 0;

  const estado = typeof raw.estado === "boolean" ? raw.estado : !!raw.estado;

  return {
    // propiedades usadas en la UI
    id,
    nombre: raw.nombre ?? "",
    apaterno,
    amaterno,
    fechaNacimiento,
    telefono: raw.telefono ?? raw.phone ?? "",
    email: raw.email ?? "",
    urlImagen,
    estado,
    estadoCliente: raw.estadoCliente ?? raw.estado_cliente ?? "",
    // mantener raw original por si queremos hacer merge directo
    _raw: raw,
  };
}

export default function ClientePage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadClientes();
  }, []);

  async function loadClientes() {
    setLoading(true);
    setError(null);
    try {
      const data = await clienteService.getClientes();
      const lista = Array.isArray(data) ? data.map((r) => normalizeCliente(r)) : [];
      setClientes(lista);
    } catch (err) {
      console.error("loadClientes error:", err);
      setError("Error al cargar los clientes");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e && e.preventDefault();
    if (!search.trim()) {
      loadClientes();
      return;
    }
    try {
      const result = await clienteService.searchClientes(search.trim());
      const lista = Array.isArray(result) ? result.map((r) => normalizeCliente(r)) : [];
      setClientes(lista);
    } catch (err) {
      console.error("search error:", err);
      alert("No se pudo buscar el cliente");
    }
  }

  function openCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(cliente) {
    // cliente viene normalizado; pasamos el normalizado (contiene apaterno/amaterno)
    setEditing(cliente);
    setShowForm(true);
  }

  async function handleSave(payload) {
    try {
      if (editing && editing.id) {
        // obtener la versión completa desde el backend (server keys)
        const existingFromServer = await clienteService.getClienteById(editing.id);

        // merge: propiedades del payload (form) sobreescriben las del servidor
        // notar: payload usa apaterno/amaterno (normalizado), existingFromServer puede usar apaterno/amaterno u otra variante
        const merged = {
          ...existingFromServer,
          ...payload,
          // aseguramos valores no nulos para campos NOT NULL del backend
          nombre: payload.nombre ?? existingFromServer.nombre ?? "",
          telefono: payload.telefono ?? existingFromServer.telefono ?? "",
          email: payload.email ?? existingFromServer.email ?? "",
          // exportamos las variantes de apellido que el backend pueda necesitar:
          apaterno: payload.apaterno ?? payload.aPaterno ?? existingFromServer.apaterno ?? existingFromServer.aPaterno ?? existingFromServer.apellidoPaterno ?? "",
          amaterno: payload.amaterno ?? payload.aMaterno ?? existingFromServer.amaterno ?? existingFromServer.aMaterno ?? existingFromServer.apellidoMaterno ?? "",
        };

        console.log("PUT payload (merged):", merged);
        const updated = await clienteService.updateCliente(editing.id, merged);
        // normalizamos la respuesta y actualizamos la lista
        const normalized = normalizeCliente(updated);
        setClientes((prev) => prev.map((c) => (c.id === normalized.id ? normalized : c)));
      } else {
        // Crear: construimos un payload que incluya las variantes que el backend podría esperar
        const createPayload = {
          nombre: payload.nombre ?? "",
          fechaNacimiento: payload.fechaNacimiento || null,
          telefono: payload.telefono ?? "",
          email: payload.email ?? "",
          urlImagen: payload.urlImagen ?? "",
          estado: Boolean(payload.estado),
          estadoCliente: payload.estadoCliente ?? "",
          // variantes de apellidos (enviamos varias para asegurar compatibilidad)
          apaterno: payload.apaterno ?? payload.aPaterno ?? payload.apellidoPaterno ?? "",
          aPaterno: payload.apaterno ?? payload.aPaterno ?? payload.apellidoPaterno ?? "",
          apellidoPaterno: payload.apaterno ?? payload.aPaterno ?? payload.apellidoPaterno ?? "",
          amaterno: payload.amaterno ?? payload.aMaterno ?? payload.apellidoMaterno ?? "",
          aMaterno: payload.amaterno ?? payload.aMaterno ?? payload.apellidoMaterno ?? "",
          apellidoMaterno: payload.amaterno ?? payload.aMaterno ?? payload.apellidoMaterno ?? "",
        };

        console.log("POST payload:", createPayload);
        const created = await clienteService.createCliente(createPayload);
        setClientes((prev) => [normalizeCliente(created), ...prev]);
      }

      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error("handleSave error:", err);
      alert("Error guardando cliente. Revisa la consola para más detalle.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este cliente?")) return;
    try {
      await clienteService.deleteCliente(id);
      setClientes((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("delete error:", err);
      alert("Error al eliminar");
    }
  }

  async function toggleEstado(cliente) {
    if (!cliente.id) return;

    const confirmMsg = cliente.estado ? "¿Desactivar este cliente?" : "¿Activar este cliente?";
    if (!window.confirm(confirmMsg)) return;

    try {
      // Enviar solo el campo que queremos actualizar
      const updated = await clienteService.cambiarEstadoCliente(cliente.id, { estado: !cliente.estado });

      // Actualiza la UI directamente
      setClientes(prev =>
        prev.map(c => (c.id === cliente.id ? { ...c, estado: !cliente.estado } : c))
      );
    } catch (err) {
      console.error("toggleEstado error:", err);
      alert("No se pudo cambiar el estado del cliente");
    }
  }







  return (
    <div className="cliente-page card">
      <div className="page-header">
        <h2>Clientes</h2>

        <div className="search-actions-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              className="search-input"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={handleSearch}>
              Buscar
            </button>
            <button className="btn btn-accent" onClick={() => loadClientes()}>
              Limpiar
            </button>
            <button className="btn btn-primary" onClick={openCreate}>
              Nuevo cliente
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
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Fecha Nacimiento</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Imagen</th>
                <th>Estado</th>
                <th>Estado Cliente</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center" }}>
                    Sin datos
                  </td>
                </tr>
              ) : (
                clientes.map((c) => (
                  <tr key={c.id} className={!c.estado ? "row-inactive" : ""}>
                    <td>{c.id}</td>
                    <td>{c.nombre}</td>
                    <td>{c.apaterno}</td>
                    <td>{c.amaterno}</td>
                    <td>{c.fechaNacimiento}</td>
                    <td>{c.email}</td>
                    <td>{c.telefono}</td>
                    <td>
                      {c.urlImagen && (
                        <img
                          src={c.urlImagen}
                          alt="foto"
                          style={{ width: "50px", height: "50px", borderRadius: "8px" }}
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      )}
                    </td>
                    <td>{c.estado ? "Activo" : "Inactivo"}</td>
                    <td>{c.estadoCliente}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary" onClick={() => openEdit(c)}>
                          Editar
                        </button>
                        <button className="btn btn-warning" onClick={() => toggleEstado(c)}>
                          {c.estado ? "Desactivar" : "Activar"}
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>
                          Eliminar
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
          <div className="modal-content scrollable-modal">
            <ClienteForm
              initialData={editing ? editing : null}
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
