import React, { useEffect, useState } from "react";
import { getAllCanchas } from "../../api/CanchasApi";
import CanchaCardTodas from "./CanchaCardTodas";
import { useTheme } from "../../context/ThemeContext";

export default function ListadoCanchas() {
  const [canchas, setCanchas] = useState([]);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    getAllCanchas().then(setCanchas);
  }, []);

  return (
    <div
      className={`min-h-screen p-6 
      ${isDarkMode ? "bg-[#0f1213] text-white" : "bg-gray-50 text-black"}`}
    >
      <h2 className="text-3xl font-bold mb-6">Canchas Disponibles</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {canchas.map((c) => (
          <CanchaCardTodas key={c.idCancha} cancha={c} isDarkMode={isDarkMode} />
        ))}
      </div>
    </div>
  );
}
