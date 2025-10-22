import React, { useEffect, useState, useMemo, useCallback } from "react";
import MacrodistritoForm from "../pages/MacrodistritoForm";
import * as macrodistritoService from "../../../api/macrodistritoApi";
import "../pages/macrodistritoPage.css";
import Button from "../../../components/ui/Button";
import SearchBar from "../../../components/ui/SearchInput";
import { Plus, Eye, Edit3, Trash2 } from "lucide-react";
import CRUDTable from "../../../components/ui/CRUDTable";

export default function MacrodistritoPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  // 🔍 FUNCIÓN DE DEPURACIÓN - Verifica el token y hace prueba
  const debugAuth = useCallback(() => {
    console.log('🔍 === DEBUG AUTH ===');
    console.log('🔐 Token en localStorage:', localStorage.getItem('token'));
    console.log('👤 Usuario en localStorage:', localStorage.getItem('user'));
    
    // Prueba manual de petición
    fetch('http://localhost:8032/api/macrodistritos', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('📊 Status:', response.status);
      console.log('OK:', response.ok);
      return response.json();
    })
    .then(data => {
      console.log('📦 Data recibida:', data);
      setItems(Array.isArray(data) ? data : []);
    })
    .catch(error => console.error('❌ Error fetch:', error));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Cargando macrodistritos...');
      const data = await macrodistritoService.getMacrodistritos();
      console.log('✅ Datos recibidos:', data);
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Error cargando:', err);
      setError("No se pudieron cargar los macrodistritos: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ... el resto de tu código se mantiene igual
  async function handleSearch(e) {
    e && e.preventDefault();

    if (!search.trim()) {
      load();
      return;
    }

    const filtered = items.filter(item =>
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

  const handleDelete = useCallback(async (id) => {
    if (!id) return;
    if (!window.confirm("¿Desactivar este macrodistrito?")) return;

    try {
      const itemToUpdate = items.find(x => x.idMacrodistrito === id);
      if (!itemToUpdate) return;

      const updated = { ...itemToUpdate, estado: false };
      await macrodistritoService.updateMacrodistrito(id, updated);
      setItems(prev => prev.map(x => x.idMacrodistrito === id ? { ...x, estado: false } : x));
    } catch (err) {
      alert("No se pudo desactivar: " + err.message);
    }
  }, [items]);

  async function handleSave(payload) {
    try {
      const dataToSend =
        editing && editing.idMacrodistrito
          ? { ...editing, ...payload, idMacrodistrito: editing.idMacrodistrito }
          : payload;

      if (dataToSend.idMacrodistrito) {
        const updated = await macrodistritoService.updateMacrodistrito(
          dataToSend.idMacrodistrito,
          dataToSend
        );
        setItems(prev =>
          prev.map(p =>
            p.idMacrodistrito === updated.idMacrodistrito ? updated : p
          )
        );
      } else {
        const created = await macrodistritoService.createMacrodistrito(dataToSend);
        setItems(prev => [created, ...prev]);
      }

      setShowForm(false);
      setEditing(null);
    } catch (err) {
      alert("Error guardando macrodistrito: " + err.message);
    }
  }

  const columns = useMemo(() => [
    { header: "ID", accessor: "idMacrodistrito", width: 90, sortable: true, align: "right" },
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
  ], []);

  const actions = useMemo(() => [
    { label: "", icon: Eye, size: "sm", variant: "botoncrear", onClick: (row) => openView(row) },
    { label: "", icon: Edit3, variant: "botoneditar", onClick: (row) => openEdit(row) },
    { label: "", icon: Trash2, variant: "botoneliminar", show: (row) => row.estado, onClick: (row) => handleDelete(row.idMacrodistrito) },
  ], [openView, openEdit, handleDelete]);

  return (
    <div className="macrodistrito-page card">
      <div className="page-header">
        <h2 className="h-heading text-2xl mb-2">Macrodistritos</h2>

        {/* 🔍 BOTÓN DE DEBUG TEMPORAL */}
        <div style={{ marginBottom: '10px' }}>
          <button 
            onClick={debugAuth}
            style={{
              padding: '5px 10px',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🔍 Debug Auth
          </button>
        </div>

        <div className="search-actions-container">
          <form onSubmit={handleSearch} className="search-form">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={() => handleSearch()} 
              onClear={() => { setSearch(""); load(); }}
              placeholder="Buscar macrodistrito por nombre..."
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
        <div>
          <p className="error">{error}</p>
          <button onClick={debugAuth} className="btn btn-secondary">
            🔍 Ver detalles del error
          </button>
        </div>
      ) : (
        <CRUDTable
          columns={columns}
          data={items}
          actions={actions}
          rowIdKey="idMacrodistrito"
          dense="md"
          stickyHeader
          pageSize={5}
          initialSort={{ accessor: "idMacrodistrito", direction: "asc" }}
          loading={loading}
          emptyMessage="Sin datos"
        />
      )}

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <MacrodistritoForm
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