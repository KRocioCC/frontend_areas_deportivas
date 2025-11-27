import React, { useEffect, useState } from "react";
import InvitadoForm from "../components/InvitadoForm";
import * as invitadoService from "../../../api/invitadoApi";
import "../pages/userPage.css";

function normalizeInvitado(raw = {}) {
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

  const id = raw.id ?? raw.id_persona ?? raw.idPersona ?? raw.id_invitado ?? 0;

  const estado = typeof raw.estado === "boolean" ? raw.estado : !!raw.estado;
  const verificado = typeof raw.verificado === "boolean" ? raw.verificado : false;

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
    verificado,
    _raw: raw,
  };
}

export default function InvitadoPage() {
  const [invitados, setInvitados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedInvitado, setSelectedInvitado] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadInvitados();
  }, []);

  async function loadInvitados() {
    setLoading(true);
    setError(null);
    try {
      const data = await invitadoService.getInvitados();
      const lista = Array.isArray(data) ? data.map((r) => normalizeInvitado(r)) : [];
      setInvitados(lista);
    } catch (err) {
      console.error("loadInvitados error:", err);
      setError("Error al cargar los invitados");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e && e.preventDefault();
    if (!search.trim()) {
      loadInvitados();
      return;
    }
    try {
      const result = await invitadoService.searchInvitados(search.trim());
      const lista = Array.isArray(result) ? result.map((r) => normalizeInvitado(r)) : [];
      setInvitados(lista);
    } catch (err) {
      console.error("search error:", err);
      alert("No se pudo buscar el invitado");
    }
  }

  function openCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(invitado) {
    setEditing(invitado);
    setShowForm(true);
  }

  function openDetail(invitado) {
    setSelectedInvitado(invitado);
    setShowDetail(true);
  }

  function closeModals() {
    setShowForm(false);
    setShowDetail(false);
    setEditing(null);
    setSelectedInvitado(null);
  }

  async function handleSave(payload) {
    try {
      if (editing && editing.id) {
        const existingFromServer = await invitadoService.getInvitadoById(editing.id);
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
        const updated = await invitadoService.updateInvitado(editing.id, merged);
        const normalized = normalizeInvitado(updated);
        setInvitados((prev) => prev.map((i) => (i.id === normalized.id ? normalized : i)));
      } else {
        const createPayload = {
          nombre: payload.nombre ?? "",
          fechaNacimiento: payload.fechaNacimiento || null,
          telefono: payload.telefono ?? "",
          email: payload.email ?? "",
          ci: payload.ci ?? "",
          urlImagen: payload.urlImagen ?? "",
          estado: Boolean(payload.estado),
          verificado: Boolean(payload.verificado),
          apaterno: payload.apaterno ?? payload.aPaterno ?? payload.apellidoPaterno ?? "",
          aPaterno: payload.apaterno ?? payload.aPaterno ?? payload.apellidoPaterno ?? "",
          apellidoPaterno: payload.apaterno ?? payload.aPaterno ?? payload.apellidoPaterno ?? "",
          amaterno: payload.amaterno ?? payload.aMaterno ?? payload.apellidoMaterno ?? "",
          aMaterno: payload.amaterno ?? payload.aMaterno ?? payload.apellidoMaterno ?? "",
          apellidoMaterno: payload.amaterno ?? payload.aMaterno ?? payload.apellidoMaterno ?? "",
        };

        console.log("POST payload:", createPayload);
        const created = await invitadoService.createInvitado(createPayload);
        setInvitados((prev) => [normalizeInvitado(created), ...prev]);
      }

      closeModals();
    } catch (err) {
      console.error("handleSave error:", err);
      alert("Error guardando invitado. Revisa la consola para más detalle.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este invitado?")) return;
    try {
      await invitadoService.deleteInvitado(id);
      setInvitados((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("delete error:", err);
      alert("Error al eliminar el invitado");
    }
  }

  async function toggleEstado(invitado) {
    if (!invitado.id) return;

    const confirmMsg = invitado.estado ? 
      "¿Desactivar este invitado?" : 
      "¿Activar este invitado?";
    
    if (!window.confirm(confirmMsg)) return;

    try {
      // Para cambiar el estado, necesitamos hacer un update completo
      const existingFromServer = await invitadoService.getInvitadoById(invitado.id);
      const updatedData = {
        ...existingFromServer,
        estado: !invitado.estado
      };

      const updated = await invitadoService.updateInvitado(invitado.id, updatedData);
      const normalized = normalizeInvitado(updated);
      setInvitados(prev => prev.map(i => (i.id === normalized.id ? normalized : i)));
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      alert("No se pudo cambiar el estado del invitado.");
    }
  }

  async function toggleVerificado(invitado) {
    if (!invitado.id) return;

    const confirmMsg = invitado.verificado ? 
      "¿Marcar como no verificado?" : 
      "¿Marcar como verificado?";
    
    if (!window.confirm(confirmMsg)) return;

    try {
      // Para cambiar el estado verificado, necesitamos hacer un update completo
      const existingFromServer = await invitadoService.getInvitadoById(invitado.id);
      const updatedData = {
        ...existingFromServer,
        verificado: !invitado.verificado
      };

      const updated = await invitadoService.updateInvitado(invitado.id, updatedData);
      const normalized = normalizeInvitado(updated);
      setInvitados(prev => prev.map(i => (i.id === normalized.id ? normalized : i)));
    } catch (err) {
      console.error("Error al cambiar estado verificado:", err);
      alert("No se pudo cambiar el estado verificado del invitado.");
    }
  }

  function DetailModal({ invitado, onClose, onEdit }) {
    if (!invitado) return null;

    return (
      <div className="modal text-gray-900">
        <div className="modal-content detail-modal">
          <div className="detail-content">
            <div className="detail-header">
              {invitado.urlImagen ? (
                <img
                  src={invitado.urlImagen}
                  alt={`${invitado.nombre} ${invitado.apaterno}`}
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
                display: invitado.urlImagen ? 'none' : 'flex' 
              }}>
                SIN IMG
              </div>
              <div className="detail-title">
                <h3>{invitado.nombre} {invitado.apaterno} {invitado.amaterno}</h3>
                <div className="detail-subtitle">Invitado #{invitado.id}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className={`status-badge ${invitado.estado ? 'status-active' : 'status-inactive'}`}>
                  {invitado.estado ? 'Activo' : 'Inactivo'}
                </span>
                <span className={`status-badge ${invitado.verificado ? 'status-active' : 'status-inactive'}`}>
                  {invitado.verificado ? 'Verificado' : 'No Verificado'}
                </span>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-value">{invitado.email || <span className="empty-text">No especificado</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Teléfono</span>
                <span className="detail-value">{invitado.telefono || <span className="empty-text">No especificado</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">CI</span>
                <span className="detail-value">{invitado.ci || <span className="empty-text">No especificado</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fecha Nacimiento</span>
                <span className="detail-value">{invitado.fechaNacimiento || <span className="empty-text">No especificada</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Apellido Paterno</span>
                <span className="detail-value">{invitado.apaterno || <span className="empty-text">No especificado</span>}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Apellido Materno</span>
                <span className="detail-value">{invitado.amaterno || <span className="empty-text">No especificado</span>}</span>
              </div>
            </div>

            <div className="detail-actions">
              <button className="btn btn-secondary" onClick={onClose}>
                Cerrar
              </button>
              <button className="btn btn-primary" onClick={() => onEdit(invitado)}>
                Editar Invitado
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
        <h2>Gestión de Invitados</h2>
        
        <div className="search-actions-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              className="search-input"
              placeholder="Buscar invitado por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={handleSearch}>
              Buscar
            </button>
            <button className="btn btn-accent" onClick={loadInvitados}>
              Limpiar
            </button>
            {/*
            <button className="btn btn-primary" onClick={openCreate}>
              Nuevo Invitado
            </button>
            */}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <p>Cargando invitados...</p>
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
                <th>Verificado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invitados.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "40px" }}>
                    No se encontraron invitados
                  </td>
                </tr>
              ) : (
                invitados.map((i) => (
                  <tr key={i.id} className={!i.estado ? "row-inactive" : ""}>
                    <td>
                      {i.urlImagen ? (
                        <img
                          src={i.urlImagen}
                          alt={`${i.nombre} ${i.apaterno}`}
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
                      <div className="avatar-placeholder" style={{ display: i.urlImagen ? 'none' : 'flex' }}>
                        SIN IMG
                      </div>
                    </td>
                    <td>
                      <strong>{i.nombre} {i.apaterno}</strong>
                      <br />
                      <small style={{ color: '#666' }}>{i.amaterno}</small>
                    </td>
                    <td>{i.email}</td>
                    <td>{i.telefono}</td>
                    <td>
                      <span className={`status-badge ${i.estado ? 'status-active' : 'status-inactive'}`}>
                        {i.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${i.verificado ? 'status-active' : 'status-inactive'}`}>
                        {i.verificado ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="btn btn-success" 
                          onClick={() => openDetail(i)}
                          title="Ver detalles"
                        >
                          Ver
                        </button>
                        <button 
                          className="btn btn-warning" 
                          onClick={() => toggleEstado(i)}
                          title={i.estado ? 'Desactivar' : 'Activar'}
                        >
                          {i.estado ? 'Desactivar' : 'Activar'}
                        </button>
                        <button 
                          className="btn btn-accent" 
                          onClick={() => toggleVerificado(i)}
                          title={i.verificado ? 'Marcar no verificado' : 'Marcar verificado'}
                        >
                          {i.verificado ? 'No Verificar' : 'Verificar'}
                        </button>
                        <button 
                          className="btn btn-danger" 
                          onClick={() => handleDelete(i.id)}
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
            <InvitadoForm
              initialData={editing}
              onCancel={closeModals}
              onSave={handleSave}
            />
          </div>
        </div>
      )}

      {showDetail && selectedInvitado && (
        <DetailModal
          invitado={selectedInvitado}
          onClose={closeModals}
          onEdit={(invitado) => {
            setEditing(invitado);
            setShowDetail(false);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
}