import React from "react";
import { motion } from "framer-motion";
import Button from "./Button";

/**
 * CRUDTable
 * - columns: [{ header, accessor, render?, className?, width? }]
 * - data: array de objetos
 * - actions: [
 *    { label, icon, variant, onClick(row), show?(row)=true, size="sm", title? }
 *   ]
 * - rowIdKey: string de la key que identifica la fila (default: "id")
 * - getRowClassName: fn(row) => string
 * - loading: boolean
 * - dense: "sm" | "md" | "lg"  (espaciado vertical)
 * - stickyHeader: boolean (default true)
 */
const CRUDTable = ({
  columns = [],
  data = [],
  actions = [],
  rowIdKey = "id",
  getRowClassName,
  loading = false,
  dense = "md",
  stickyHeader = true,
}) => {
  const padY = dense === "sm" ? "py-2" : dense === "lg" ? "py-4" : "py-3";
  const cellBase = `px-4 ${padY} align-middle`;
  const thBase =
    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600";

  if (loading) {
    // Skeleton de carga
    return (
      <div className="rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 space-y-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-9 w-full rounded bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-2xl border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className={stickyHeader ? "sticky top-0 z-10" : ""}>
          <tr className="bg-gray-50">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`${thBase} ${col.className || ""}`}
                style={{ width: col.width }}
                scope="col"
              >
                {col.header}
              </th>
            ))}
            {!!actions.length && (
              <th
                className={`${thBase} text-right`}
                scope="col"
                style={{ width: 180 }}
              >
                Acciones
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                className={`${cellBase} text-center text-gray-500`}
                colSpan={columns.length + (actions.length ? 1 : 0)}
              >
                No se encontraron registros
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const key = row[rowIdKey] ?? rowIndex;
              const RowTag = motion.tr; // cambia a 'tr' si no quieres animación
              return (
                <RowTag
                  key={key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: rowIndex * 0.03 }}
                  className={`odd:bg-black/5 hover:bg-primary/5 ${getRowClassName ? getRowClassName(row) : ""}`}
                >
                  {columns.map((col, ci) => (
                    <td key={ci} className={`${cellBase} ${col.className || ""}`}>
                      {col.render
                        ? col.render(row[col.accessor], row)
                        : row[col.accessor]}
                    </td>
                  ))}

                  {!!actions.length && (
                    <td className={`${cellBase} text-right whitespace-nowrap`}>
                      <div className="inline-flex gap-2">
                        {actions.map((act, ai) => {
                          const visible =
                            typeof act.show === "function"
                              ? !!act.show(row)
                              : true;
                          if (!visible) return null;

                          const handle = () => act.onClick && act.onClick(row);

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
  );
};

export default CRUDTable;
