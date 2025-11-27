import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DisciplinaForm from "./DisciplinaForm"; 
import * as disciplinaService from "../../../api/AreadeportivaApi"; 
import "./DisciplinaListAdmin.css";
import Button from "../../../components/ui/Button";
import SearchBar from "../../../components/ui/SearchInput";
import { Plus, Eye, Edit3, Trash2, CheckCircle } from "lucide-react";
import CRUDTable from "../../../components/ui/CRUDTable";

export default function DisciplinaListAdmin() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [showFirstDisciplinaModal, setShowFirstDisciplinaModal] = useState(false);

  // ⚠️ Obtener adminId desde el objeto guardado al loguearse
  const storedUser = JSON.parse(localStorage.getItem("user")); 
  const adminId = storedUser?.id; // usar id

  // cargar disciplinas por admin
  const load = useCallback(async () => {
    if (!adminId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await disciplinaService.getDisciplinasPorAdmin(adminId);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("No se pudieron cargar las disciplinas");
    } finally {
      setLoading(false);
    }
  }, [adminId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSearch(e) {
    e && e.preventDefault();

    if (!search.trim()) {
      load();
      return;
    }

    const filtered = items.filter((item) =>
      item.nombre?.toLowerCase().includes(search.trim().toLowerCase())
    );
    setItems(filtered);
  }

  const openCreate = useCallback(() => {
    setEditing(null);
    setShowForm(true);
  }, []);

  const openEdit = useCallback((item) => {
    setEditing(item);
    setShowForm(true);
  }, []);

  const openView = useCallback((item) => {
    setEditing({ ...item, _readonly: true }); 
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      if (!id) return;
      if (!window.confirm("¿Eliminar esta disciplina?")) return;

      try {
        await disciplinaService.deleteDisciplinaPorAdmin(adminId, id);
        setItems((prev) => prev.filter((x) => x.idDisciplina !== id));
      } catch (err) {
        alert("No se pudo eliminar");
      }
    },
    [adminId]
  );

  async function handleSave(payload) {
    try {
      if (editing && editing.idDisciplina) {
        const updated = await disciplinaService.updateDisciplinaPorAdmin(
          adminId,
          editing.idDisciplina,
          payload
        );
        setItems((prev) =>
          prev.map((p) =>
            p.idDisciplina === updated.idDisciplina ? updated : p
          )
        );
      } else {
        const isFirst = items.length === 0; // detectar si es la primera disciplina
        const created = await disciplinaService.createDisciplinaPorAdmin(
          adminId,
          payload,
          [] // idsCanchas opcional
        );
        setItems((prev) => [created, ...prev]);
        if (isFirst) {
          // mostrar modal informativo especial
          setShowFirstDisciplinaModal(true);
        }
      }

      setShowForm(false);
      setEditing(null);
    } catch (err) {
      alert("Error guardando disciplina");
    }
  }

  const columns = useMemo(
    () => [
      { header: "ID", accessor: "idDisciplina", width: 90, sortable: true, align: "right" },
      { header: "Nombre", accessor: "nombre", sortable: true, truncate: 220 },
      { header: "Descripción", accessor: "descripcion", className: "block max-w-[500px] truncate text-gray-700" },
      {
        header: "Estado",
        accessor: "estado",
        width: 120,
        sortable: true,
        render: (v) => (
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs border"
            style={{
              background: v ? "rgba(14, 223, 202, 0.12)" : "rgba(168, 61, 37, 0.13)",
              color: "#222",
            }}
          >
            {v ? "Activo" : "Inactivo"}
          </span>
        ),
      },
    ],
    []
  );

  const actions = useMemo(
    () => [
      { label: "", icon: Eye, size: "sm", variant: "botoncrear", onClick: (row) => openView(row) },
      { label: "", icon: Edit3, variant: "botoneditar", onClick: (row) => openEdit(row) },
      { label: "", icon: Trash2, variant: "botoneliminar", show: (row) => row.estado, onClick: (row) => handleDelete(row.idDisciplina) },
    ],
    [openView, openEdit, handleDelete]
  );

  return (
    <div className="disciplina-page card">
      <div className="page-header">
        <h2 className="h-heading text-2xl mb-2">Disciplinas</h2>

        <div className="search-actions-container">
          <form onSubmit={handleSearch} className="search-form">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={() => handleSearch()}
              onClear={() => {
                setSearch("");
                load();
              }}
              placeholder="Buscar disciplina por nombre..."
              size="md"
              className="search-input"
            />
          </form>

          <div className="button-group">
            <Button variant="primary" size="sm" icon={Plus} onClick={openCreate}>
              Nuevo
            </Button>
          </div>
        </div>
      </div>

      {error ? (
        <p className="error">{error}</p>
      ) : (
        <CRUDTable
          columns={columns}
          data={items}
          actions={actions}
          rowIdKey="idDisciplina"
          dense="md"
          stickyHeader
          pageSize={5}
          initialSort={{ accessor: "idDisciplina", direction: "asc" }}
          loading={loading}
          emptyMessage="Sin datos"
        />
      )}

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <DisciplinaForm
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

      {/* Modal informativo para la primera disciplina creada - diseño consistente con canchas */}
      <AnimatePresence>
        {showFirstDisciplinaModal && (
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 60 }}>
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowFirstDisciplinaModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-3xl md:max-w-4xl w-full p-8 md:p-10 border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 leading-tight" style={{ fontFamily: 'var(--font-Oswald)' }}>
                    ¡Primera disciplina creada!
                  </h3>
                  <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-semibold" style={{ fontFamily: 'var(--font-Balo)' }}>
                    Ahora puedes regresar al módulo de Canchas y asígnarla. Este paso es importante: cada cancha debe tener al menos una disciplina asignada para que los clientes sepan qué deportes se pueden practicar en ella al momento de reservar.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => setShowFirstDisciplinaModal(false)}
                  className="px-6 md:px-7 py-3 md:py-3.5 rounded-xl font-semibold text-base md:text-lg border border-gray-300 text-gray-800 hover:bg-gray-100 transition"
                  style={{ fontFamily: 'var(--font-josefin)' }}
                >
                  Quedarme en Disciplinas
                </button>
                <button
                  onClick={() => { setShowFirstDisciplinaModal(false); navigate('/admin/canchas_admin'); }}
                  className="px-6 md:px-7 py-3 md:py-3.5 rounded-xl text-white font-semibold text-base md:text-lg shadow-md hover:shadow-lg transition"
                  style={{ backgroundColor: 'var(--color-accent)', fontFamily: 'var(--font-josefin)' }}
                >
                  Ir a Canchas
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
