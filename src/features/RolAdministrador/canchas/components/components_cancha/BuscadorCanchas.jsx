import React from "react";
import { Search, MapPin, Grid } from "lucide-react";

const BuscadorCanchas = ({
  zona,
  disciplina,
  onZonaChange,
  onDisciplinaChange,
  onBuscar
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-10">
      <div className="flex flex-col md:flex-row bg-white rounded-full shadow-lg overflow-hidden">
        
        {/* Zona */}
        <div className="flex items-center px-4 py-3 flex-1 border-b md:border-b-0 md:border-r">
          <MapPin className="w-5 h-5 text-slate-500 mr-2" />
          <input
            type="text"
            placeholder="¿En qué zona quieres jugar?"
            value={zona}
            onChange={onZonaChange}
            className="w-full outline-none text-sm"
          />
        </div>

        {/* Disciplina */}
        <div className="flex items-center px-4 py-3 flex-1 border-b md:border-b-0 md:border-r">
          <Grid className="w-5 h-5 text-slate-500 mr-2" />
          <select
            value={disciplina}
            onChange={onDisciplinaChange}
            className="w-full outline-none text-sm bg-transparent"
          >
            <option value="">¿Qué disciplina necesitas?</option>
            <option value="futbol">Fútbol</option>
            <option value="basquet">Básquet</option>
            <option value="voley">Vóley</option>
            <option value="tenis">Tenis</option>
          </select>
        </div>

        {/* Botón buscar */}
        <button
          onClick={onBuscar}
          className="bg-turquesa text-white px-6 py-3 font-bold hover:bg-naranja transition"
        >
          Buscar
        </button>
      </div>
    </div>
  );
};

export default BuscadorCanchas;
