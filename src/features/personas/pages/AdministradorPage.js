import React, { useEffect, useState } from "react";
import AdministradorForm from "../components/AdministradorForm";
import * as adminService from "../../../api/administradorApi";
import "../pages/userPage.css";

export default function AdministradorPage() {
  const [administradores, setAdministradores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAdministradores();
  }, []);

  async function loadAdministradores() {
    setLoading(true);
    try {
      const data = await adminService.getAdministradores();
      setAdministradores(Array.isArray(data) ? data : []);
    } catch {
      setError("Error al cargar los administradores");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e?.preventDefault();
    if (!search.trim()) {
      loadAdministradores();
      return;
    }
    try {
      const result = await adminService.searchAdministradores(search);
      setAdministradores(result);
    } catch {
      alert("No se pudo buscar el administrador");
    }
  }

  function openCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(admin) {
    setEditing(admin);
    setShowForm(true);
  }

  async function handleSave(payload) {
    try {
      if (editing) {
        const updated = await adminService.updateAdministrador(editing.id, payload);
        setAdministradores((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      } else {
        const created = await adminService.createAdministrador(payload);
        setAdministradores((prev) => [created, ...prev]);
      }
      setShowForm(false);
      setEditing(null);
    } catch {
      alert("Error guardando administrador");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Eliminar este administrador?")) return;
    try {
      await adminService.deleteAdministrador(id);
      setAdministradores((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Error al eliminar");
    }
  }

  async function toggleEstado(admin) {
    try {
      const updated = await adminService.cambiarEstadoAdministrador(admin.id, !admin.estado);
      setAdministradores((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    } catch {
      alert("No se pudo cambiar el estado");
    }
  }

  return (
    <div className="administrador-page card">
      <div className="page-header">
        <h2>Administradores</h2>
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
            <button className="btn btn-accent" onClick={() => loadAdministradores()}>Limpiar</button>
            <button className="btn btn-primary" onClick={openCreate}>Nuevo administrador</button>
          </div>
        </div>
      </div>

      {loading ? <p>Cargando...</p> : error ? <p className="error">{error}</p> : (
        <div className="table-wrap">
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Imagen</th>
                <th>Cargo</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {administradores.length === 0 ? (
                <tr><td colSpan="11" style={{ textAlign: "center" }}>Sin datos</td></tr>
              ) : (
                administradores.map((a) => (
                  <tr key={a.id} className={!a.estado ? "row-inactive" : ""}>
                    <td>{a.id}</td>
                    <td>{a.nombre}</td>
                    <td>{a.apaterno}</td>
                    <td>{a.amaterno}</td>
                    <td>{a.email}</td>
                    <td>{a.telefono}</td>
                    <td>
                      {a.urlImagen && (
                        <img
                          src={a.urlImagen}
                          alt="foto"
                          style={{ width: "50px", height: "50px", borderRadius: "8px" }}
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      )}
                    </td>
                    <td>{a.cargo}</td>
                    <td>{a.direccion}</td>
                    <td>{a.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary" onClick={() => openEdit(a)}>Editar</button>
                        <button className="btn btn-warning" onClick={() => toggleEstado(a)}>
                          {a.estado ? "Desactivar" : "Activar"}
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(a.id)}>Eliminar</button>
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
              onCancel={() => { setShowForm(false); setEditing(null); }}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
}
