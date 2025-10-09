import React from "react";
import { Search, X } from "lucide-react";

/**
 -texto del input
 --funcion que se ejecutara cuan el usaurio escribe 
 --funcion que se ejecutara cuando el usuario haga click en buscar
  --funcion que se ejecutara cuando el usuario haga click en limpiar
  --texto ayuda dentro del del input
  --tamaño del input (sm, md, lg)
  --clase adicional para el contenedor
 */
const SearchBar = React.memo(({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = "Buscar...",
  size = "md",
  className = "",
}) => {
  const SIZES = {
    sm: { h: "h-9",   text: "text-sm", icon: 16, padX: "px-3", gap: "gap-2" },
    md: { h: "h-10",  text: "text-base", icon: 18, padX: "px-4", gap: "gap-3" },
    lg: { h: "h-12",  text: "text-lg", icon: 20, padX: "px-5", gap: "gap-5" },
  };
  const S = SIZES[size] || SIZES.md;

  return (
    <div className={`inline-flex items-center ${S.gap} ${className}`}>
      {/* Wrapper del input (el estilo vive aquí) */}
      <div
        className={[
          "relative flex items-center rounded-full shadow-sm",
          "bg-[var(--light)] border ",
          S.h, S.padX, "w-full",
          "focus-within:ring-2 focus-within:ring-[var(--color-primary)]",
          "transition-all duration-300 ease-in-out",
        ].join(" ")}
        style={{ minWidth: "18rem" }} 
      >
        {/* Icono izquierda */}
        <Search
          size={S.icon}
          className="text-[var(--primary)] opacity-80 mr-2"
        />

        {/* Input (sin borde) */}
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={[
            "flex-1 bg-transparent outline-none border-none",
            S.text, "placeholder-gray-500",
            "appearance-none",
          ].join(" ")}
          style={{ fontFamily: "Baloo Tamma 2, sans-serif" }}
        />

        {/* Limpiar */}
        {value && (
          <button
            type="button"
            onClick={onClear}
            className="ml-2 rounded-full p-1 text-[var( --color-background:)] hover:text-[var( --color-background:)] transition"
            aria-label="Limpiar búsqueda"
          >
            <X size={S.icon} />
          </button>
        )}
      </div>

      {/* Botón buscar */}
      <button
        type="button"
        onClick={onSearch}
        className={[
          "rounded-full bg-[var(--secondary)] text-white shadow-sm hover:brightness-110",
          "transition-all duration-200",
          S.h, "px-5", S.text,
        ].join(" ")}
        style={{ fontFamily: "Josefin Slab, serif" }}
      >
        Buscar
      </button>
    </div>
  );
});

export default SearchBar;
