import React, { useEffect, useState } from "react";
import AdministradorForm from "../components/AdministradorForm";
import * as administradorService from "../../../api/administradorApi";
import "../pages/userPage.css";

function normalizeAdministrador(raw = {}) {
  const apaterno =
    raw.apaterno ??
    raw.aPaterno ??
    raw.a_paterno ??
    raw.apellidoPaterno ??
    raw.apellido_paterno ??
    "";

  const amaterno =
    raw.amaterno ??
    raw.aMaterno ??
    raw.a_materno ??
    raw.apellidoMaterno ??
    raw.apellido_materno ??
    "";

  const fechaNacimiento =
    raw.fechaNacimiento ?? raw.fecha_nacimiento ?? raw.fecha_nac ?? "";

  const urlImagen = raw.urlImagen ?? raw.url_imagen ?? raw.url_image ?? "";

  const id = raw.id ?? raw.id_persona ?? raw.idPersona ?? raw.id_administrador ?? 0;

  const estado = typeof raw.estado === "boolean" ? raw.estado : !!raw.estado;

  return {
    id,
    nombre: raw.nombre ?? "",
    apaterno,
    amaterno,
    fechaNacimiento,
    telefono: raw.telefono ?? raw.phone ?? "",
    email: raw.email ?? "",
    ci: raw.ci ?? "",
    urlImagen,
    estado,
    cargo: raw.cargo ?? "",
    direccion: raw.direccion ?? "",
    _raw: raw,
  };
}

export default function AdministradorPage() {
  const [administradores, setAdministradores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedAdministrador, setSelectedAdministrador] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAdministradores();
  }, []);

  async function loadAdministradores() {
    setLoading(true);
    setError(null);
    try {
      const data = await administradorService.getAdministradores();
      const lista = Array.isArray(data) ? data.map((r) => normalizeAdministrador(r)) : [];
      setAdministradores(lista);
    } catch (err) {
      console.error("loadAdministradores error:", err);
      setError("Error al cargar los administradores");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e && e.preventDefault();
    if (!search.trim()) {
      loadAdministradores();
      return;
    }
    try {
      const result = await administradorService.searchAdministradores(search.trim());
      const lista = Array.isArray(result) ? result.map((r) => normalizeAdministrador(r)) : [];
      setAdministradores(lista);
    } catch (err) {
      console.error("search error:", err);
      alert("No se pudo buscar el administrador");
    }
  }

  function openCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(administrador) {
    setEditing(administrador);
    setShowForm(true);
  }

  function openDetail(administrador) {
    setSelectedAdministrador(administrador);
    setShowDetail(true);
  }

  function closeModals() {
    setShowForm(false);
    setShowDetail(false);
    setEditing(null);
    setSelectedAdministrador(null);
  }

  async function handleSave(payload) {
    try {
      if (editing && editing.id) {
        const existingFromServer = await administradorService.getAdministradorById(editing.id);
        const merged = {
          ...existingFromServer,
          ...payload,
          nombre: payload.nombre ?? existingFromServer.nombre ?? "",
          telefono: payload.telefono ?? existingFromServer.telefono ?? "",
          email: payload.email ?? existingFromServer.email ?? "",
          ci: payload.ci ?? existingFromServer.ci ?? "",
          apaterno: payload.apaterno ?? payload.aPaterno ?? existingFromServer.apaterno ?? existingFromServer.aPaterno ?? existingFromServer.apellidoPaterno ?? "",
          amaterno: payload.amaterno ?? payload.aMaterno ?? existingFromServer.amaterno ?? existingFromServer.aMaterno ?? existingFromServer.apellidoMaterno ?? "",
        };

        console.log("PUT payload (merged):", merged);
        const updated = await administradorService.updateAdministrador(editing.id, merged);
        const normalized = normalizeAdministrador(updated);
        setAdministradores((prev) => prev.map((a) => (a.id === normalized.id ? normalized : a)));
      } else {
        const createPayload = {
          nombre: payload.nombre ?? "",
          fechaNacimiento: payload.fechaNacimiento || null,
          telefono: payload.telefono ?? "",
          email: payload.email ?? "",
          ci: payload.ci ?? "",
          urlImagen: payload.urlImagen ?? "",
          estado: Boolean(payload.estado),
          cargo: payload.cargo ?? "",
          direccion: payload.direccion ?? "",
          apaterno: payload.apaterno ?? payload.aPaterno ?? payload.apellidoPaterno ?? "",
          aPaterno: payload.apaterno ?? payload.aPaterno ?? payload.apellidoPaterno ?? "",
          apellidoPaterno: payload.apaterno ?? payload.aPaterno ?? payload.apellidoPaterno ?? "",
          amaterno: payload.amaterno ?? payload.aMaterno ?? payload.apellidoMaterno ?? "",
          aMaterno: payload.amaterno ?? payload.aMaterno ?? payload.apellidoMaterno ?? "",
          apellidoMaterno: payload.amaterno ?? payload.aMaterno ?? payload.apellidoMaterno ?? "",
        };

        console.log("POST payload:", createPayload);
        const created = await administradorService.createAdministrador(createPayload);
        setAdministradores((prev) => [normalizeAdministrador(created), ...prev]);
      }

      closeModals();
    } catch (err) {
      console.error("handleSave error:", err);
      alert("Error guardando administrador. Revisa la consola para más detalle.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este administrador?")) return;
    try {
      await administradorService.deleteAdministrador(id);
      setAdministradores((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("delete error:", err);
      alert("Error al eliminar el administrador");
    }
  }

  async function toggleEstado(administrador) {
    if (!administrador.id) return;

    const confirmMsg = administrador.estado ? 
      "¿Desactivar este administrador?" : 
      "¿Activar este administrador?";
    
    if (!window.confirm(confirmMsg)) return;

    try {
      console.log("estado actual:", administrador.estado);
      const response = await administradorService.cambiarEstadoAdministrador(administrador.id, !administrador.estado);

      if (response && (response.id || response.estado !== undefined)) {
        const updatedNormalized = normalizeAdministrador(response);
        setAdministradores(prev => prev.map(a => (a.id === updatedNormalized.id ? updatedNormalized : a)));
      } else {
        setAdministradores(prev =>
          prev.map(a => (a.id === administrador.id ? { ...a, estado: !a.estado } : a))
        );
      }
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("No se pudo cambiar el estado del administrador.");
    }
  }

  function DetailModal({ administrador, onClose, onEdit }) {
    if (!administrador) return null;

    return (
      <div className="modal">
        <div className="modal-content detail-modal">
          <div className="detail-content">
            <div className="detail-header">
              {administrador.urlImagen ? (
                <img
                  src={administrador.urlImagen}
                  alt={`${administrador.nombre} ${administrador.apaterno}`}
                  className="detail-avatar"
                  onError={(e) => {
                    e.target.style.display = "none";
                    const placeholder = e.target.parentNode.querySelector('.avatar-placeholder');
                    if (placeholder) {
                      placeholder.style.display = "flex";
                    }
                  }}
                />
              ) : null}
              <div className="avatar-placeholder" style={{ 
                width: '70px', 
                height: '70px', 
                display: administrador.urlImagen ? 'none' : 'flex' 
              }}>
                SIN IMG
              </div>
              <div className="detail-title">
                <h3>{administrador.nombre} {administrador.apaterno} {administrador.amaterno}</h3>
                <div className="detail-subtitle">Administrador #{administrador.id}</div>
              </div>
              <span className={`status-badge ${administrador.estado ? 'status-active' : 'status-inactive'}`}>
                {administrador.estado ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{administrador.email || <span className="empty-text">No especificado</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Teléfono</span>
                <span className="detail-value">{administrador.telefono || <span className="empty-text">No especificado</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">CI</span>
                <span className="detail-value">{administrador.ci || <span className="empty-text">No especificado</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Cargo</span>
                <span className="detail-value">{administrador.cargo || <span className="empty-text">No especificado</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fecha Nacimiento</span>
                <span className="detail-value">{administrador.fechaNacimiento || <span className="empty-text">No especificada</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Apellido Paterno</span>
                <span className="detail-value">{administrador.apaterno || <span className="empty-text">No especificado</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Apellido Materno</span>
                <span className="detail-value">{administrador.amaterno || <span className="empty-text">No especificado</span>}</span>
              </div>
              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                <span className="detail-label">Dirección</span>
                <span className="detail-value">{administrador.direccion || <span className="empty-text">No especificada</span>}</span>
              </div>
            </div>

            <div className="detail-actions">
              <button className="btn btn-secondary" onClick={onClose}>
                Cerrar
              </button>
              <button className="btn btn-primary" onClick={() => onEdit(administrador)}>
                Editar Administrador
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
        <h2>Gestión de Administradores</h2>
        
        <div className="search-actions-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              className="search-input"
              placeholder="Buscar administrador por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={handleSearch}>
              Buscar
            </button>
            <button className="btn btn-accent" onClick={loadAdministradores}>
              Limpiar
            </button>
            {/* 
            <button className="btn btn-primary" onClick={openCreate}>
              Nuevo Administrador
            </button>
            */}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <p>Cargando administradores...</p>
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
                <th>Cargo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {administradores.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                    No se encontraron administradores
                  </td>
                </tr>
              ) : (
                administradores.map((a) => (
                  <tr key={a.id} className={!a.estado ? "row-inactive" : ""}>
                    <td>
                      {a.urlImagen ? (
                        <img
                          src={a.urlImagen}
                          alt={`${a.nombre} ${a.apaterno}`}
                          className="avatar"
                          onError={(e) => {
                            e.target.style.display = "none";
                            const placeholder = e.target.parentNode.querySelector('.avatar-placeholder');
                            if (placeholder) {
                              placeholder.style.display = "flex";
                            }
                          }}
                        />
                      ) : null}
                      <div className="avatar-placeholder" style={{ display: a.urlImagen ? 'none' : 'flex' }}>
                        SIN IMG
                      </div>
                    </td>
                    <td>
                      <strong>{a.nombre} {a.apaterno}</strong>
                      <br />
                      <small style={{ color: '#666' }}>{a.amaterno}</small>
                    </td>
                    <td>{a.email}</td>
                    <td>{a.cargo}</td>
                    <td>
                      <span className={`status-badge ${a.estado ? 'status-active' : 'status-inactive'}`}>
                        {a.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn btn-success" 
                          onClick={() => openDetail(a)}
                          title="Ver detalles"
                        >
                          Ver
                        </button>
                        <button 
                          className="btn btn-warning" 
                          onClick={() => toggleEstado(a)}
                          title={a.estado ? 'Desactivar' : 'Activar'}
                        >
                          {a.estado ? 'Desactivar' : 'Activar'}
                        </button>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => handleDelete(a.id)}
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
            <AdministradorForm
              initialData={editing}
              onCancel={closeModals}
              onSave={handleSave}
            />
          </div>
        </div>
      )}

      {showDetail && selectedAdministrador && (
        <DetailModal
          administrador={selectedAdministrador}
          onClose={closeModals}
          onEdit={(administrador) => {
            setEditing(administrador);
            setShowDetail(false);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
}