// src/features/reservas/components/ReservaListAdmin.js
import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import * as ReservaService from "../../../api/ReservaApi";
import Button from "../../../components/ui/Button";
import SearchBar from "../../../components/ui/SearchInput";
import CRUDTable from "../../../components/ui/CRUDTable";
import { Eye } from "lucide-react";
import { AuthContext } from "../../../auth/context/AuthContext";
import ModalReservaList from "./ModalReservaList";

import "./ReservaListAdmin.css";

export default function ReservaListAdmin() {
  const { currentUser } = useContext(AuthContext);
  const idAdministrador = currentUser?.id;

  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // inicializar rango al mes actual
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];
    setInicio(firstDay);
    setFin(lastDay);
  }, []);

  const load = useCallback(async () => {
    if (!idAdministrador || !inicio || !fin) return;
    setLoading(true);
    setError(null);
    try {
      const data = await ReservaService.getReservasPorAdministradorEnRango(
        idAdministrador,
        inicio,
        fin
      );
      // solo CONFIRMADAS y PENDIENTES
      const filtradas = Array.isArray(data)
        ? data.filter(
            (reserva) =>
              reserva.estadoReserva === "CONFIRMADA" ||
              reserva.estadoReserva === "PENDIENTE"
          )
        : [];
      setItems(filtradas);
    } catch (err) {
      setError("No se pudieron cargar las reservas");
    } finally {
      setLoading(false);
    }
  }, [idAdministrador, inicio, fin]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSearch(e) {
    e && e.preventDefault();
    if (!search.trim()) {
      load();
      return;
    }

    const filtered = items.filter(
      (item) =>
        item.observaciones?.toLowerCase().includes(search.trim().toLowerCase()) ||
        item.cancha?.nombre?.toLowerCase().includes(search.trim().toLowerCase())
    );
    setItems(filtered);
  }

  const openView = useCallback((item) => {
    setEditing({ ...item, _readonly: true });
    setShowForm(true);
  }, []);

  const columns = useMemo(
    () => [
      { header: "ID", accessor: "idReserva", width: 80, sortable: true, align: "right" },
      { header: "Fecha", accessor: "fechaReserva", sortable: true },
      { header: "Hora", render: (_, row) => `${row.horaInicio} - ${row.horaFin}`, sortable: true },
      { header: "Estado", accessor: "estadoReserva", sortable: true },
      {
        header: "Cancha",
        render: (_, row) => row.cancha?.nombre || "Sin cancha",
        sortable: true,
      },
      { header: "Observaciones", accessor: "observaciones", truncate: 200 },
      {
        header: "Pago",
        render: (_, row) => (
          <span className="text-sm">
            {`Pagado: Bs ${row.totalPagado} / Pendiente: Bs ${row.saldoPendiente}`}
          </span>
        ),
      },
    ],
    []
  );

  const actions = useMemo(
    () => [
      { label: "", icon: Eye, variant: "botoncrear", onClick: (row) => openView(row) },
    ],
    [openView]
  );

  return (
    <div className="ReservaListAdmin card">
      <div className="page-header">
        <h2>Reservas</h2>

        <div className="filters-container">
          {/* Selector de rango de fechas */}
          <div className="date-range">
            <label>
              Inicio:
              <input
                type="date"
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
              />
            </label>
            <label>
              Fin:
              <input
                type="date"
                value={fin}
                onChange={(e) => setFin(e.target.value)}
              />
            </label>
            <Button variant="primary" size="sm" onClick={load}>
              Filtrar
            </Button>
          </div>

          {/* Buscador por observaciones o cancha */}
          <form onSubmit={handleSearch} className="search-form">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={() => handleSearch()}
              onClear={() => {
                setSearch("");
                load();
              }}
              placeholder="Buscar por observaciones o cancha..."
              size="md"
              className="search-input"
            />
          </form>
        </div>
      </div>

      {error ? (
        <p className="error">{error}</p>
      ) : (
        <CRUDTable
          columns={columns}
          data={items}
          actions={actions}
          rowIdKey="idReserva"
          dense="md"
          stickyHeader
          pageSize={5}
          initialSort={{ accessor: "idReserva", direction: "asc" }}
          loading={loading}
          emptyMessage="Sin reservas"
        />
      )}

      {showForm && (
        <ModalReservaList
          initialData={editing}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
