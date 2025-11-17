import React, { useEffect, useState } from "react";
import UsuarioControlForm from "../components/UsuarioControlForm";
import * as usuarioControlService from "../../../api/usuarioControlApi";
import "../pages/userPage.css";

function normalizeUsuarioControl(raw = {}) {
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

  const id = raw.id ?? raw.id_persona ?? raw.idPersona ?? raw.id_us_control ?? 0;

  const estado = typeof raw.estado === "boolean" ? raw.estado : !!raw.estado;
  const estadoOperativo = typeof raw.estadoOperativo === "boolean" ? raw.estadoOperativo : 
                         typeof raw.estado_operativo === "boolean" ? raw.estado_operativo : true;

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
    estadoOperativo,
    horaInicioTurno: raw.horaInicioTurno ?? raw.hora_inicio_turno ?? "",
    horaFinTurno: raw.horaFinTurno ?? raw.hora_fin_turno ?? "",
    direccion: raw.direccion ?? "",
    _raw: raw,
  };
}

export default function UsuarioControlPage() {
  const [usuariosControl, setUsuariosControl] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedUsuarioControl, setSelectedUsuarioControl] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsuariosControl();
  }, []);

  async function loadUsuariosControl() {
    setLoading(true);
    setError(null);
    try {
      const data = await usuarioControlService.getUsuariosControl();
      const lista = Array.isArray(data) ? data.map((r) => normalizeUsuarioControl(r)) : [];
      setUsuariosControl(lista);
    } catch (err) {
      console.error("loadUsuariosControl error:", err);
      setError("Error al cargar los usuarios de control");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e && e.preventDefault();
    if (!search.trim()) {
      loadUsuariosControl();
      return;
    }
    try {
      const result = await usuarioControlService.searchUsuariosControl(search.trim());
      const lista = Array.isArray(result) ? result.map((r) => normalizeUsuarioControl(r)) : [];
      setUsuariosControl(lista);
    } catch (err) {
      console.error("search error:", err);
      alert("No se pudo buscar el usuario de control");
    }
  }

  function openCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(usuarioControl) {
    setEditing(usuarioControl);
    setShowForm(true);
  }

  function openDetail(usuarioControl) {
    setSelectedUsuarioControl(usuarioControl);
    setShowDetail(true);
  }

  function closeModals() {
    setShowForm(false);
    setShowDetail(false);
    setEditing(null);
    setSelectedUsuarioControl(null);
  }

  async function handleSave(payload) {
    try {
      if (editing && editing.id) {
        const existingFromServer = await usuarioControlService.getUsuarioControlById(editing.id);
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
        const updated = await usuarioControlService.updateUsuarioControl(editing.id, merged);
        const normalized = normalizeUsuarioControl(updated);
        setUsuariosControl((prev) => prev.map((u) => (u.id === normalized.id ? normalized : u)));
      } else {
        const createPayload = {
          nombre: payload.nombre ?? "",
          fechaNacimiento: payload.fechaNacimiento || null,
          telefono: payload.telefono ?? "",
          email: payload.email ?? "",
          ci: payload.ci ?? "",
          urlImagen: payload.urlImagen ?? "",
          estado: Boolean(payload.estado),
          estadoOperativo: Boolean(payload.estadoOperativo),
          horaInicioTurno: payload.horaInicioTurno ?? "",
          horaFinTurno: payload.horaFinTurno ?? "",
          direccion: payload.direccion ?? "",
          apaterno: payload.apaterno ?? payload.aPaterno ?? payload.apellidoPaterno ?? "",
          aPaterno: payload.apaterno ?? payload.aPaterno ?? payload.apellidoPaterno ?? "",
          apellidoPaterno: payload.apaterno ?? payload.aPaterno ?? payload.apellidoPaterno ?? "",
          amaterno: payload.amaterno ?? payload.aMaterno ?? payload.apellidoMaterno ?? "",
          aMaterno: payload.amaterno ?? payload.aMaterno ?? payload.apellidoMaterno ?? "",
          apellidoMaterno: payload.amaterno ?? payload.aMaterno ?? payload.apellidoMaterno ?? "",
        };

        console.log("POST payload:", createPayload);
        const created = await usuarioControlService.createUsuarioControl(createPayload);
        setUsuariosControl((prev) => [normalizeUsuarioControl(created), ...prev]);
      }

      closeModals();
    } catch (err) {
      console.error("handleSave error:", err);
      alert("Error guardando usuario de control. Revisa la consola para más detalle.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario de control?")) return;
    try {
      await usuarioControlService.deleteUsuarioControl(id);
      setUsuariosControl((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("delete error:", err);
      alert("Error al eliminar el usuario de control");
    }
  }

  async function toggleEstado(usuarioControl) {
    if (!usuarioControl.id) return;

    const confirmMsg = usuarioControl.estado ? 
      "¿Desactivar este usuario de control?" : 
      "¿Activar este usuario de control?";
    
    if (!window.confirm(confirmMsg)) return;

    try {
      console.log("estado actual:", usuarioControl.estado);
      const response = await usuarioControlService.cambiarEstadoUsuarioControl(usuarioControl.id, !usuarioControl.estado);

      if (response && (response.id || response.estado !== undefined)) {
        const updatedNormalized = normalizeUsuarioControl(response);
        setUsuariosControl(prev => prev.map(u => (u.id === updatedNormalized.id ? updatedNormalized : u)));
      } else {
        setUsuariosControl(prev =>
          prev.map(u => (u.id === usuarioControl.id ? { ...u, estado: !u.estado } : u))
        );
      }
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("No se pudo cambiar el estado del usuario de control.");
    }
  }

  function DetailModal({ usuarioControl, onClose, onEdit }) {
    if (!usuarioControl) return null;

    return (
      <div className="modal">
        <div className="modal-content detail-modal">
          <div className="detail-content">
            <div className="detail-header">
              {usuarioControl.urlImagen ? (
                <img
                  src={usuarioControl.urlImagen}
                  alt={`${usuarioControl.nombre} ${usuarioControl.apaterno}`}
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
                display: usuarioControl.urlImagen ? 'none' : 'flex' 
              }}>
                SIN IMG
              </div>
              <div className="detail-title">
                <h3>{usuarioControl.nombre} {usuarioControl.apaterno} {usuarioControl.amaterno}</h3>
                <div className="detail-subtitle">Usuario de Control #{usuarioControl.id}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className={`status-badge ${usuarioControl.estado ? 'status-active' : 'status-inactive'}`}>
                  {usuarioControl.estado ? 'Activo' : 'Inactivo'}
                </span>
                <span className={`status-badge ${usuarioControl.estadoOperativo ? 'status-active' : 'status-inactive'}`}>
                  {usuarioControl.estadoOperativo ? 'Operativo' : 'No Operativo'}
                </span>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{usuarioControl.email || <span className="empty-text">No especificado</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Teléfono</span>
                <span className="detail-value">{usuarioControl.telefono || <span className="empty-text">No especificado</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">CI</span>
                <span className="detail-value">{usuarioControl.ci || <span className="empty-text">No especificado</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Hora Inicio Turno</span>
                <span className="detail-value">{usuarioControl.horaInicioTurno || <span className="empty-text">No especificada</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Hora Fin Turno</span>
                <span className="detail-value">{usuarioControl.horaFinTurno || <span className="empty-text">No especificada</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fecha Nacimiento</span>
                <span className="detail-value">{usuarioControl.fechaNacimiento || <span className="empty-text">No especificada</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Apellido Paterno</span>
                <span className="detail-value">{usuarioControl.apaterno || <span className="empty-text">No especificado</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Apellido Materno</span>
                <span className="detail-value">{usuarioControl.amaterno || <span className="empty-text">No especificado</span>}</span>
              </div>
              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                <span className="detail-label">Dirección</span>
                <span className="detail-value">{usuarioControl.direccion || <span className="empty-text">No especificada</span>}</span>
              </div>
            </div>

            <div className="detail-actions">
              <button className="btn btn-secondary" onClick={onClose}>
                Cerrar
              </button>
              <button className="btn btn-primary" onClick={() => onEdit(usuarioControl)}>
                Editar Usuario
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
        <h2>Gestión de Usuarios de Control</h2>
        
        <div className="search-actions-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              className="search-input"
              placeholder="Inserte un nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={handleSearch}>
              Buscar
            </button>
            <button className="btn btn-accent" onClick={loadUsuariosControl}>
              Limpiar
            </button>
            {/*
            <button className="btn btn-primary" onClick={openCreate}>
              Nuevo Usuario
            </button>
            */}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <p>Cargando usuarios de control...</p>
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
                <th>Horario Turno</th>
                <th>Estado</th>
                <th>Operativo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosControl.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>
                    No se encontraron usuarios de control
                  </td>
                </tr>
              ) : (
                usuariosControl.map((u) => (
                  <tr key={u.id} className={!u.estado ? "row-inactive" : ""}>
                    <td>
                      {u.urlImagen ? (
                        <img
                          src={u.urlImagen}
                          alt={`${u.nombre} ${u.apaterno}`}
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
                      <div className="avatar-placeholder" style={{ display: u.urlImagen ? 'none' : 'flex' }}>
                        SIN IMG
                      </div>
                    </td>
                    <td>
                      <strong>{u.nombre} {u.apaterno}</strong>
                      <br />
                      <small style={{ color: '#666' }}>{u.amaterno}</small>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      {u.horaInicioTurno} - {u.horaFinTurno}
                    </td>
                    <td>
                      <span className={`status-badge ${u.estado ? 'status-active' : 'status-inactive'}`}>
                        {u.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${u.estadoOperativo ? 'status-active' : 'status-inactive'}`}>
                        {u.estadoOperativo ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn btn-success" 
                          onClick={() => openDetail(u)}
                          title="Ver detalles"
                        >
                          Ver
                        </button>
                        <button 
                          className="btn btn-warning" 
                          onClick={() => toggleEstado(u)}
                          title={u.estado ? 'Desactivar' : 'Activar'}
                        >
                          {u.estado ? 'Desactivar' : 'Activar'}
                        </button>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => handleDelete(u.id)}
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
            <UsuarioControlForm
              initialData={editing}
              onCancel={closeModals}
              onSave={handleSave}
            />
          </div>
        </div>
      )}

      {showDetail && selectedUsuarioControl && (
        <DetailModal
          usuarioControl={selectedUsuarioControl}
          onClose={closeModals}
          onEdit={(usuarioControl) => {
            setEditing(usuarioControl);
            setShowDetail(false);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
}