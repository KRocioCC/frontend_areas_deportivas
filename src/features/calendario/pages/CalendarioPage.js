// src/features/calendario/pages/CalendarioPage.js
import React, { useState, useEffect, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { getReservas } from '../../../api/ReservaApi'; 
import './CalendarioPage.css';

const CalendarioPage = () => {
  const [date, setDate] = useState(new Date());
  const [filters, setFilters] = useState({ disciplina: '', zona: '' });
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const data = await getReservas(); 
        setReservas(data || []);
      } catch (error) {
        console.error('Error al cargar reservas:', error);
      }
    };
    fetchReservas();
  }, []);

  const diasConReservas = useMemo(() => {
    const fechas = reservas
      .map((r) => {
        if (!r.fechaReserva) return null;
        const d = new Date(r.fechaReserva);
        return d.toISOString().split('T')[0]; // formato ISO
      })
      .filter(Boolean);

    return new Set(fechas);
  }, [reservas]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const fechaISO = newDate.toISOString().split('T')[0];
    navigate(`/reservas/${fechaISO}`);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ disciplina: '', zona: '' });
  };

  const getISODate = (date) => date.toISOString().split('T')[0];


  return (
    <div className="calendario-container text-gray-900">
      <h1 className="titulo-calendario">Gestión de Reservas</h1>

      {/* === FILTROS === */}
      <div className="filtros-container">
        <select
          value={filters.disciplina}
          onChange={(e) => handleFilterChange('disciplina', e.target.value)}
          className="filtro-select"
        >
          <option value="">Todas las disciplinas</option>
          <option value="futbol">Fútbol</option>
          <option value="basket">Básquet</option>
          <option value="voley">Vóley</option>
        </select>

        <select
          value={filters.zona}
          onChange={(e) => handleFilterChange('zona', e.target.value)}
          className="filtro-select"
        >
          <option value="">Todas las zonas</option>
          <option value="norte">Zona Norte</option>
          <option value="centro">Zona Centro</option>
          <option value="sur">Zona Sur</option>
        </select>

        <button className="btn-limpiar" onClick={handleClearFilters}>
          ✖ Limpiar Filtros
        </button>
      </div>

      {/* === CALENDARIO === */}
      <Calendar
        locale="es-ES"
        onChange={handleDateChange}
        value={date}
        minDetail="month"
        next2Label="»"
        prev2Label="«"
        nextLabel="›"
        prevLabel="‹"
        className="qj-calendar"
        tileContent={({ date: d, view }) => {
          if (view === 'month' && diasConReservas.has(getISODate(d))) {
            return <div className="punto-reserva" />;
          }
          return null;
        }}
        tileClassName={({ date: d, view }) => {
          if (view !== 'month') return undefined;
          return d.getDay() === 6 ? 'is-saturday' : undefined;
        }}
      />
    </div>
  );
};

export default CalendarioPage;
