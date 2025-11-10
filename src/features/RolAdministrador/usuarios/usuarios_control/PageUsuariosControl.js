import React, { useEffect, useState } from "react";
import {
  crearUsuarioControlDesdeAdministrador,
  getUsuariosControlPorAdministrador,
} from "../../../../api/administradorApi";
import {
  obtenerCanchasSupervisadasPorUsuario,
} from "../../../../api/supervisaApi";
import {
  updateUsuarioControl,
  cambiarEstadoUsuarioControl,
} from "../../../../api/usuarioControlApi";
import PageUsuariosControlForm from "./PageUsuariosControlForm";
import Paginacion from "../../../../components/ui/Paginacion";
import ModalCanchasUsuarioControl from "./ModalCanchasUsuarioControl";
import ConfirmDialog from "../../../../components/ui/ConfirmDialog";
import ToastMensaje from "../../../../components/ui/ToastMensaje";
import "./PageUsuariosControl.css";

export default function PageUsuariosControl() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showCanchasModal, setShowCanchasModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [toast, setToast] = useState(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const [usuariosPorPagina, setUsuariosPorPagina] = useState(5);

  const idAdmin = localStorage.getItem("id");

  useEffect(() => {
    if (idAdmin) {
      console.log("🔄 Cargando usuarios para admin:", idAdmin);
      loadUsuarios();
    }
  }, [idAdmin]);

  async function loadUsuarios() {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsuariosControlPorAdministrador(idAdmin);
      console.log("✅ Usuarios recibidos:", data);

      const enriched = await Promise.all(
        data.map(async usuario => {
          try {
            const canchas = await obtenerCanchasSupervisadasPorUsuario(usuario.id);
            return { ...usuario, canchas };
          } catch (err) {
            console.warn(`⚠️ Error al obtener canchas para usuario ${usuario.id}:`, err);
            return { ...usuario, canchas: [] };
          }
        })
      );

      setUsuarios(enriched);
    } catch (err) {
      console.error("❌ Error al cargar usuarios control:", err);
      setError("No se pudieron cargar los usuarios de control.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    console.log("🔍 Buscando:", search);
    if (!search.trim()) {
      loadUsuarios();
      return;
    }
    const filtered = usuarios.filter(u =>
      u.nombre?.toLowerCase().includes(search.trim().toLowerCase())
    );
    setPaginaActual(1);
    setUsuarios(filtered);
  }

  function handleCreate() {
    console.log("🆕 Crear nuevo usuario");
    setSelectedUsuario(null);
    setShowForm(true);
  }

  async function handleSave(payload) {
    try {
      let usuarioGuardado;
      if (selectedUsuario) {
        console.log("✏️ Editando usuario:", selectedUsuario.id);
        await updateUsuarioControl(selectedUsuario.id, payload);
        usuarioGuardado = { ...selectedUsuario, ...payload };
        setToast("Usuario actualizado con éxito");
      } else {
        console.log("🆕 Creando usuario nuevo");
        usuarioGuardado = await crearUsuarioControlDesdeAdministrador(idAdmin, payload);
        setToast("Usuario creado con éxito");
      }

      setShowForm(false);
      await loadUsuarios();
      return usuarioGuardado;
    } catch (err) {
      console.error("❌ Error al guardar usuario control:", err);
      return null;
    }
  }

  async function handleDesactivar(idUsuario) {
    try {
      console.log("🚫 Desactivando usuario:", idUsuario);
      await cambiarEstadoUsuarioControl(idUsuario, false);
      setToast("Usuario desactivado con éxito");
      await loadUsuarios();
    } catch (err) {
      console.error(`❌ Error al desactivar usuario ${idUsuario}:`, err);
    }
  }

  const indiceInicio = (paginaActual - 1) * usuariosPorPagina;
  const usuariosPaginados = usuarios.slice(indiceInicio, indiceInicio + usuariosPorPagina);
  const totalPaginas = Math.ceil(usuarios.length / usuariosPorPagina);

  return (
    <div className="usuarios-control-page card">
      <div className="page-header">
        <h2>Usuarios de Control</h2>
        <button className="btn btn-accent" onClick={handleCreate}>
          Nuevo Usuario de Control
        </button>
      </div>

      <div className="search-actions-container">
        <form onSubmit={handleSearch} className="search-form">
          <input
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
              loadUsuarios();
            }}
          >
            Limpiar
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <PageUsuariosControlForm
              initialData={selectedUsuario}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {showCanchasModal && selectedUsuario && (
        <ModalCanchasUsuarioControl
          usuario={selectedUsuario}
          onClose={() => {
            console.log("🏟 Cerrando modal de canchas");
            setShowCanchasModal(false);
            loadUsuarios();
          }}
        />
      )}

      {showConfirm && usuarioAEliminar && (
        <>
          {console.log("❗ Mostrando ConfirmDialog para:", usuarioAEliminar)}
          <ConfirmDialog
            mensaje={`¿Estás segur@ de desactivar a ${usuarioAEliminar.nombre}?`}
            onConfirmar={async () => {
              await handleDesactivar(usuarioAEliminar.id);
              setShowConfirm(false);
            }}
            onCancelar={() => setShowConfirm(false)}
          />
        </>
        )}
            {toast && (
        <>
          {console.log("📢 Mostrando ToastMensaje:", toast)}
          <ToastMensaje
            mensaje={toast}
            onClose={() => setToast(null)}
          />
        </>
      )}

      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <div className="table-wrap">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Canchas Supervisadas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosPaginados.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      Sin datos
                    </td>
                  </tr>
                ) : (
                  usuariosPaginados.map(usuario => (
                    <tr
                      key={usuario.id}
                      className={!usuario.estado ? "row-inactive" : ""}
                    >
                      <td>{usuario.id}</td>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.email}</td>
                      <td>{usuario.telefono}</td>
                      <td>{usuario.estado ? "Activo" : "Inactivo"}</td>
                      <td>
                        {usuario.canchas?.map(c => c.nombre).join(", ") || "—"}
                      </td>
                      <td>
                        <button className="btn btn-sm" onClick={() => {
                          console.log("✏️ Editar usuario:", usuario.id);
                          setSelectedUsuario(usuario);
                          setShowForm(true);
                        }}>
                          Editar
                        </button>
                        <button className="btn btn-sm" onClick={() => {
                          console.log("🏟 Abrir canchas para:", usuario.id);
                          setSelectedUsuario(usuario);
                          setShowCanchasModal(true);
                        }}>
                          Canchas
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => {
                            console.log("🚫 Solicitar confirmación para desactivar:", usuario.id);
                            setUsuarioAEliminar(usuario);
                            setShowConfirm(true);
                          }}
                          disabled={!usuario.estado}
                        >
                          Desactivar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            onPageChange={setPaginaActual}
          />
        </>
      )}
    </div>
  );
}
