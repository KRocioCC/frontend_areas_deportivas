import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Button from "./Button";

function cx(...c) { return c.filter(Boolean).join(" "); }

/**
 * columns: [
 *  { header, accessor, render?(cell, row), width?, className?, align?:"left|center|right", sortable?, truncate? }
 * ]
 * actions: [
 *  { label, icon, variant, size="sm", title?, show?(row)=true, onClick(row) }
 * ]
 */
const CRUDTable = ({
  columns = [],
  data = [],
  actions = [],
  rowIdKey = "id",
  getRowClassName,
  loading = false,
  dense = "md",                 // "sm" | "md" | "lg"
  stickyHeader = true,
  emptyMessage = "No se encontraron registros",
  // Ordenamiento
  initialSort = null,           // { accessor, direction: "asc"|"desc" }
  onSortChange,                 // 
  // Paginación (cliente)
  pageSize = 10,
  page: controlledPage,         
  onPageChange,                 
}) => {
  const padY = dense === "sm" ? "py-2" : dense === "lg" ? "py-4" : "py-3";
  const cellBase = `px-4 ${padY} align-middle break-anywhere`;
  const thBase = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--color-t-1)] select-none";

  // ---- Ordenamiento
  const [sort, setSort] = useState(initialSort);
  function toggleSort(col) {
    if (!col.sortable) return;
    const dir =
      sort?.accessor === col.accessor
        ? (sort.direction === "asc" ? "desc" : "asc")
        : "asc";
    const next = { accessor: col.accessor, direction: dir };
    setSort(next);
    onSortChange?.(next);
  }

  const sorted = useMemo(() => {
    if (!sort?.accessor) return data;
    const copy = [...data];
    copy.sort((a, b) => {
      const va = a[sort.accessor];
      const vb = b[sort.accessor];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number" && typeof vb === "number") {
        return sort.direction === "asc" ? va - vb : vb - va;
      }
      return sort.direction === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
    return copy;
  }, [data, sort]);

  // ---- Paginación (no controlada por defecto)
  const [pageState, setPageState] = useState(1);
  const page = controlledPage ?? pageState;
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  function go(p) {
    const clamped = Math.min(Math.max(1, p), totalPages);
    onPageChange ? onPageChange(clamped) : setPageState(clamped);
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-9 w-full rounded bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-auto">
        <table className="min-w-full text-sm table-fixed">
          <thead className={stickyHeader ? "sticky top-0 z-8" : ""}>
            <tr className="bg-gray-50">
              {columns.map((col, idx) => {
                const active = sort?.accessor === col.accessor;
                return (
                  <th
                    key={idx}
                    className={cx(thBase, col.className, col.align === "right" && "text-right", col.align === "center" && "text-center")}
                    style={{ width: col.width }}
                    scope="col"
                    onClick={() => toggleSort(col)}
                  >
                    <span className={cx("inline-flex items-center gap-1", col.sortable && "cursor-pointer")}>
                      {col.header}
                      {col.sortable && (
                        <span className={cx("text-gray-400", active && "text-gray-700")}>
                          {active ? (sort.direction === "asc" ? "▲" : "▼") : "▵"}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
              {!!actions.length && (
                <th className={cx(thBase, "text-right")} scope="col" style={{ width: 200 }}>
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {current.length === 0 ? (
              <tr>
                <td className={`${cellBase} text-center text-gray-500`} colSpan={columns.length + (actions.length ? 1 : 0)}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              current.map((row, rowIndex) => {
                const key = row[rowIdKey] ?? rowIndex;
                const RowTag = motion.tr;
                return (
                  <RowTag
                    key={key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: rowIndex * 0.03 }}
                    className={cx("odd:bg-black/5 hover:bg-primary/5", getRowClassName?.(row))}
                  >
                    {columns.map((col, ci) => {
                      const content = col.render ? col.render(row[col.accessor], row) : row[col.accessor];
                      const truncate = col.truncate ? `max-w-[${col.truncate}px] truncate` : "";
                      return (
                        <td
                          key={ci}
                          className={cx(cellBase, col.className, col.align === "right" && "text-right", col.align === "center" && "text-center", truncate)}
                          title={col.truncate ? String(content ?? "") : undefined}
                        >
                          {content}
                        </td>
                      );
                    })}

                    {!!actions.length && (
                      <td className={cx(cellBase, "text-right whitespace-nowrap")}>
                        <div className="inline-flex gap-2">
                          {actions.map((act, ai) => {
                            const visible = typeof act.show === "function" ? !!act.show(row) : true;
                            if (!visible) return null;
                            const handle = () => act.onClick?.(row);
                            return (
                              <Button
                                key={ai}
                                variant={act.variant || "primary"}
                                size={act.size || "sm"}
                                icon={act.icon}
                                onClick={handle}
                                title={act.title || act.label}
                              >
                                {act.label}
                              </Button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </RowTag>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación simple */}
      <div className="flex items-center justify-end gap-3 px-4 py-3 bg-white border-t">
        <span className="text-xs text-gray-500">
          Página {page} de {totalPages}
        </span>
        <button className="px-3 py-1 text-sm  text-[var(--color-p-4)] bg-[var(--color-p-5)] rounded-full border hover:bg-gray-50 hover:text-[var(--color-t-1)] shadow-sm" onClick={() => go(1)} disabled={page === 1}>
          «
        </button>
        <button className="px-3 py-1 text-sm text-[var(--color-p-4)]  bg-[var(--color-p-5)] rounded-full border hover:bg-gray-50 hover:text-[var(--color-t-1)] shadow-sm" onClick={() => go(page - 1)} disabled={page === 1}>
          Anterior
        </button>
        <button className="px-3 py-1 text-sm text-[var(--color-p-4)] bg-[var(--color-p-5)] rounded-full border hover:bg-gray-50 hover:text-[var(--color-t-1)] shadow-sm" onClick={() => go(page + 1)} disabled={page === totalPages}>
          Siguiente
        </button>
        <button className="px-3 py-1 text-sm text-[var(--color-p-4)]  bg-[var(--color-p-5)] rounded-full border hover:bg-gray-50 hover:text-[var(--color-t-1)] shadow-sm" onClick={() => go(totalPages)} disabled={page === totalPages}>
          »
        </button>
      </div>
    </div>
  );
};

export default CRUDTable;
