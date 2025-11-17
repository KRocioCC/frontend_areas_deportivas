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
    raw.apellidoPaterno ?? "";

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
    id,
    nombre: raw.nombre ?? "",
    apaterno,
    amaterno,
    fechaNacimiento,
    telefono: raw.telefono ?? raw.phone ?? "",
    email: raw.email ?? "",
    urlImagen,
    estado,
    categoria: raw.categoria ?? raw.estado_cliente ?? "",
    _raw: raw,
  };
}

export default function ClientePage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
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
    setEditing(cliente);
    setShowForm(true);
  }

  function openDetail(cliente) {
    setSelectedCliente(cliente);
    setShowDetail(true);
  }

  function closeModals() {
    setShowForm(false);
    setShowDetail(false);
    setEditing(null);
    setSelectedCliente(null);
  }

  async function handleSave(payload) {
    try {
      if (editing && editing.id) {
        const existingFromServer = await clienteService.getClienteById(editing.id);
        const merged = {
          ...existingFromServer,
          ...payload,
          nombre: payload.nombre ?? existingFromServer.nombre ?? "",
          telefono: payload.telefono ?? existingFromServer.telefono ?? "",
          email: payload.email ?? existingFromServer.email ?? "",
          apaterno: payload.apaterno ?? payload.aPaterno ?? existingFromServer.apaterno ?? existingFromServer.aPaterno ?? existingFromServer.apellidoPaterno ?? "",
          amaterno: payload.amaterno ?? payload.aMaterno ?? existingFromServer.amaterno ?? existingFromServer.aMaterno ?? existingFromServer.apellidoMaterno ?? "",
        };

        console.log("PUT payload (merged):", merged);
        const updated = await clienteService.updateCliente(editing.id, merged);
        const normalized = normalizeCliente(updated);
        setClientes((prev) => prev.map((c) => (c.id === normalized.id ? normalized : c)));
      } else {
        const createPayload = {
          nombre: payload.nombre ?? "",
          fechaNacimiento: payload.fechaNacimiento || null,
          telefono: payload.telefono ?? "",
          email: payload.email ?? "",
          urlImagen: payload.urlImagen ?? "",
          estado: Boolean(payload.estado),
          categoria: payload.categoria ?? "",
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

      closeModals();
    } catch (err) {
      console.error("handleSave error:", err);
      alert("Error guardando cliente. Revisa la consola para más detalle.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) return;
    try {
      await clienteService.deleteCliente(id);
      setClientes((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("delete error:", err);
      alert("Error al eliminar el cliente");
    }
  }

  async function toggleEstado(cliente) {
    if (!cliente.id) return;

    const confirmMsg = cliente.estado ? 
      "¿Desactivar este cliente?" : 
      "¿Activar este cliente?";
    
    if (!window.confirm(confirmMsg)) return;

    try {
      console.log("estado actual:", cliente.estado);
      const response = await clienteService.cambiarEstado(cliente.id, !cliente.estado);

      if (response && (response.id || response.estado !== undefined)) {
        const updatedNormalized = normalizeCliente(response);
        setClientes(prev => prev.map(c => (c.id === updatedNormalized.id ? updatedNormalized : c)));
      } else {
        setClientes(prev =>
          prev.map(c => (c.id === cliente.id ? { ...c, estado: !c.estado } : c))
        );
      }
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("No se pudo cambiar el estado del cliente.");
    }
  }

  function DetailModal({ cliente, onClose, onEdit }) {
    if (!cliente) return null;

    return (
      <div className="modal">
        <div className="modal-content detail-modal">
          <div className="detail-content">
            <div className="detail-header">
              {cliente.urlImagen ? (
                <img
                  src={cliente.urlImagen}
                  alt={`${cliente.nombre} ${cliente.apaterno}`}
                  className="detail-avatar"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <div className="avatar-placeholder" style={{width: '70px', height: '70px'}}>
                  SIN IMG
                </div>
              )}
              <div className="detail-title">
                <h3>{cliente.nombre} {cliente.apaterno} {cliente.amaterno}</h3>
                <div className="detail-subtitle">Cliente #{cliente.id}</div>
              </div>
              <span className={`status-badge ${cliente.estado ? 'status-active' : 'status-inactive'}`}>
                {cliente.estado ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{cliente.email || <span className="empty-text">No especificado</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Teléfono</span>
                <span className="detail-value">{cliente.telefono || <span className="empty-text">No especificado</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fecha de Nacimiento</span>
                <span className="detail-value">{cliente.fechaNacimiento || <span className="empty-text">No especificada</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Categoría</span>
                <span className="detail-value">{cliente.categoria || <span className="empty-text">No especificada</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Apellido Paterno</span>
                <span className="detail-value">{cliente.apaterno || <span className="empty-text">No especificado</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Apellido Materno</span>
                <span className="detail-value">{cliente.amaterno || <span className="empty-text">No especificado</span>}</span>
              </div>
            </div>

            <div className="detail-actions">
              <button className="btn btn-secondary" onClick={onClose}>
                Cerrar
              </button>
              <button className="btn btn-primary" onClick={() => onEdit(cliente)}>
                Editar Cliente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cliente-page">
      <div className="page-header">
        <h2>Gestión de Clientes</h2>
        
        <div className="search-actions-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              className="search-input"
              placeholder="Buscar cliente por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={handleSearch}>
              Buscar
            </button>
            <button className="btn btn-accent" onClick={loadClientes}>
              Limpiar
            </button>
            {/*
            <button className="btn btn-primary" onClick={openCreate}>
              Nuevo Cliente
            </button>
            */}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <p>Cargando clientes...</p>
        </div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="table-wrap">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                    No se encontraron clientes
                  </td>
                </tr>
              ) : (
                clientes.map((c) => (
                  <tr key={c.id} className={!c.estado ? "row-inactive" : ""}>
                    <td>
                      {c.urlImagen ? (
                        <img
                          src={c.urlImagen}
                          alt={`${c.nombre} ${c.apaterno}`}
                          className="avatar"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          SIN IMG
                        </div>
                      )}
                    </td>
                    <td>
                      <strong>{c.nombre} {c.apaterno}</strong>
                      <br />
                      <small style={{ color: '#666' }}>{c.amaterno}</small>
                    </td>
                    <td>{c.email}</td>
                    <td>{c.telefono}</td>
                    <td>
                      <span className={`status-badge ${c.estado ? 'status-active' : 'status-inactive'}`}>
                        {c.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn btn-success" 
                          onClick={() => openDetail(c)}
                          title="Ver detalles"
                        >
                          Ver
                        </button>
                        <button 
                          className="btn btn-warning" 
                          onClick={() => toggleEstado(c)}
                          title={c.estado ? 'Desactivar' : 'Activar'}
                        >
                          {c.estado ? 'Desactivar' : 'Activar'}
                        </button>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => handleDelete(c.id)}
                          title="Eliminar"
                        >
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
          <div className="modal-content">
            <ClienteForm
              initialData={editing}
              onCancel={closeModals}
              onSave={handleSave}
            />
          </div>
        </div>
      )}

      {showDetail && selectedCliente && (
        <DetailModal
          cliente={selectedCliente}
          onClose={closeModals}
          onEdit={(cliente) => {
            setEditing(cliente);
            setShowDetail(false);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
}