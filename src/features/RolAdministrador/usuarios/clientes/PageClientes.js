import React, { useEffect, useState } from "react";
import { getClientesPorAdministrador } from "../../../../api/administradorApi";
import "./PageClientes.css";

export default function PageClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Obtener el ID de la persona que actúa como administrador
  const id = localStorage.getItem("id");

  console.log("🧠 ID del administrador obtenido:", id);

  useEffect(() => {
    async function fetchClientes() {
      if (!id) {
        console.warn("⚠️ ID no disponible en localStorage");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await getClientesPorAdministrador(id);
        setClientes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Error al cargar clientes:", err);
        setError("No se pudieron cargar los clientes.");
      } finally {
        setLoading(false);
      }
    }

    fetchClientes();
  }, [id]);

  async function handleSearch(e) {
    e.preventDefault();

    if (!search.trim()) {
      const data = await getClientesPorAdministrador(id);
      setClientes(Array.isArray(data) ? data : []);
      return;
    }

    const filtered = clientes.filter(cliente =>
      cliente.nombre?.toLowerCase().includes(search.trim().toLowerCase())
    );
    setClientes(filtered);
  }

  return (
    <div className="clientes-page card">
      <div className="page-header">
        <h2>Clientes que realizaron reservas</h2>

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
            <button className="btn btn-secondary" onClick={handleSearch}>
              Buscar
            </button>
            <button
              type="button"
              className="btn btn-accent"
              onClick={() => {
                setSearch("");
                handleSearch(); // recarga todos
              }}
            >
              Limpiar
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
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    Sin datos
                  </td>
                </tr>
              ) : (
                clientes.map(cliente => (
                  <tr
                    key={cliente.id}
                    className={!cliente.estado ? "row-inactive" : ""}
                  >
                    <td>{cliente.id}</td>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.apaterno || "-"}</td>
                    <td>{cliente.amaterno || "-"}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.telefono}</td>
                    <td>{cliente.estado ? "Activo" : "Inactivo"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
