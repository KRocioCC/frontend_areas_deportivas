import React from "react";
import "../../styles/Paginacion.css";

export default function Paginacion({ paginaActual, totalPaginas, onPageChange }) {
  if (totalPaginas <= 1) return null;

  const paginas = [];
  for (let i = 1; i <= totalPaginas; i++) {
    paginas.push(i);
  }

  return (
    <div className="paginacion">
      <button
        disabled={paginaActual === 1}
        onClick={() => onPageChange(paginaActual - 1)}
      >
        ←
      </button>
      {paginas.map(p => (
        <button
          key={p}
          className={p === paginaActual ? "active" : ""}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      <button
        disabled={paginaActual === totalPaginas}
        onClick={() => onPageChange(paginaActual + 1)}
      >
        →
      </button>
    </div>
  );
}
