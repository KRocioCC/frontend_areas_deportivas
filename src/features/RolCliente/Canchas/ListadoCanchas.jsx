import React, { useEffect, useState } from "react";
import { getCanchasActivas } from "../../../api/CanchaApi";
import CanchaCardTodas from "./components/CanchaCardTodas";
import { useTheme } from "../../../context/ThemeContext";
import FiltrosCanchas from "./components/FiltroCanchas";

export default function ListadoCanchas() {
  const [canchas, setCanchas] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isDarkMode } = useTheme();

  // 🔹 Cuando se aplican filtros
  const handleFilter = (data, filtros) => {
    setCanchas(data);
  };

  // 🔹 Cuando se reinician los filtros → traer todas las canchas
  const handleReset = async () => {
    setLoading(true);
    try {
      const data = await getCanchasActivas();
      setCanchas(data);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cargar todas las canchas al inicio
  useEffect(() => {
    handleReset();
  }, []);

  return (
    <div
      className={`min-h-screen p-16 pt-16 
      ${isDarkMode ? "bg-[#0f1213] text-white" : "bg-gray-50 text-black"}`}
    >
      <FiltrosCanchas onFilter={handleFilter} onReset={handleReset} />

      <h2 className="text-3xl font-bold mb-6">Canchas Disponibles</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {canchas.map((c) => (
          <CanchaCardTodas
            key={c.idCancha}
            cancha={c}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
}
