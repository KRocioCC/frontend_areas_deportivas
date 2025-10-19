// src/components/ui/filtros.js
import React from 'react';

const Filtros = ({ values, onChange, onClear }) => {
  return (
    <div className="filtros-container">
      <select
        value={values?.disciplina || ''}
        onChange={(e) => onChange('disciplina', e.target.value)}
        className="filtro-select"
      >
        <option value="">Todas las disciplinas</option>
        <option value="futbol">Fútbol</option>
        <option value="basket">Básquet</option>
        <option value="voley">Vóley</option>
      </select>

      <select
        value={values?.zona || ''}
        onChange={(e) => onChange('zona', e.target.value)}
        className="filtro-select"
      >
        <option value="">Todas las zonas</option>
        <option value="norte">Zona Norte</option>
        <option value="centro">Zona Centro</option>
        <option value="sur">Zona Sur</option>
      </select>

      <button className="btn-limpiar" onClick={onClear}>
        ✖ Limpiar Filtros
      </button>
    </div>
  );
};

export default Filtros;
