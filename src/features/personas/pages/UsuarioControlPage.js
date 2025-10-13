import React, { useEffect, useState } from "react";
import UsuarioControlForm from "../components/UsuarioControlForm";
import * as usuarioService from "../../../api/usuarioControlApi";
import "../pages/userPage.css";

// Normaliza los datos del backend para que React los pueda renderizar
function normalizeUsuario(raw = {}) {
  return {
    id: raw.id ?? raw.idPersona ?? 0,
    nombre: raw.nombre ?? "",
    apaterno: raw.apaterno ?? raw.aPaterno ?? raw.apellidoPaterno ?? "",
    amaterno: raw.amaterno ?? raw.aMaterno ?? raw.apellidoMaterno ?? "",
    estadoOperativo: raw.estadoOperativo ?? "",
    horaInicioTurno: raw.horaInicioTurno
      ? typeof raw.horaInicioTurno === "string"
        ? raw.horaInicioTurno
        : `${raw.horaInicioTurno.hour?.toString().padStart(2, "0")}:${raw.horaInicioTurno.minute?.toString().padStart(2, "0")}`
      : "",
    horaFinTurno: raw.horaFinTurno
      ? typeof raw.horaFinTurno === "string"
        ? raw.horaFinTurno
        : `${raw.horaFinTurno.hour?.toString().padStart(2, "0")}:${raw.horaFinTurno.minute?.toString().padStart(2, "0")}`
      : "",
    direccion: raw.direccion ?? "",
    estado: typeof raw.estado === "boolean" ? raw.estado : !!raw.estado,
    _raw: raw,
  };
}

export default function UsuarioControlPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsuarios();
  }, []);

  async function loadUsuarios() {
    setLoading(true);
    setError(null);
    try {
      const data = await usuarioService.getUsuariosControl();
      const lista = Array.isArray(data) ? data.map((r) => normalizeUsuario(r)) : [];
      setUsuarios(lista);
    } catch (err) {
      console.error("loadUsuarios error:", err);
      setError("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e && e.preventDefault();
    if (!search.trim()) {
      loadUsuarios();
      return;
    }
    try {
      const result = await usuarioService.searchUsuarioControl(search.trim());
      const lista = Array.isArray(result) ? result.map((r) => normalizeUsuario(r)) : [];
      setUsuarios(lista);
    } catch (err) {
      console.error("search error:", err);
      alert("No se pudo buscar el usuario");
    }
  }

  function openCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(usuario) {
    setEditing(usuario);
    setShowForm(true);
  }

  async function handleSave(payload) {
    try {
      if (editing && editing.id) {
        const existingFromServer = await usuarioService.getUsuarioControlById(editing.id);
        const merged = { ...existingFromServer, ...payload };
        const updated = await usuarioService.updateUsuarioControl(editing.id, merged);
        const normalized = normalizeUsuario(updated);
        setUsuarios((prev) => prev.map((u) => (u.id === normalized.id ? normalized : u)));
      } else {
        const created = await usuarioService.createUsuarioControl(payload);
        setUsuarios((prev) => [normalizeUsuario(created), ...prev]);
      }
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error("handleSave error:", err);
      alert("Error guardando usuario");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await usuarioService.deleteUsuarioControl(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("delete error:", err);
      alert("Error al eliminar");
    }
  }

  async function toggleEstado(usuario) {
    if (!usuario.id) return;

    const confirmMsg = usuario.estado ? "¿Desactivar este usuario?" : "¿Activar este usuario?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const updatedRaw = await usuarioService.cambiarEstadoUsuarioControl(usuario.id, !usuario.estado);
      const updated = normalizeUsuario(updatedRaw);
      setUsuarios((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      console.error("toggleEstado error:", err);
      alert("No se pudo cambiar el estado del usuario");
    }
  }

  return (
    <div className="usuario-control-page card">
      <div className="page-header">
        <h2>Usuarios de Control</h2>
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
            <button className="btn btn-secondary" onClick={handleSearch}>Buscar</button>
            <button className="btn btn-accent" onClick={() => loadUsuarios()}>Limpiar</button>
            <button className="btn btn-primary" onClick={openCreate}>Nuevo usuario</button>
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
                <th>Estado Operativo</th>
                <th>Hora Inicio Turno</th>
                <th>Hora Fin Turno</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center" }}>Sin datos</td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id} className={!u.estado ? "row-inactive" : ""}>
                    <td>{u.id}</td>
                    <td>{u.nombre}</td>
                    <td>{u.apaterno}</td>
                    <td>{u.amaterno}</td>
                    <td>{u.estadoOperativo}</td>
                    <td>{u.horaInicioTurno}</td>
                    <td>{u.horaFinTurno}</td>
                    <td>{u.direccion}</td>
                    <td>{u.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary" onClick={() => openEdit(u)}>Editar</button>
                        <button className="btn btn-warning" onClick={() => toggleEstado(u)}>
                          {u.estado ? "Desactivar" : "Activar"}
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(u.id)}>Eliminar</button>
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
            <UsuarioControlForm
              initialData={editing ?? null}
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
