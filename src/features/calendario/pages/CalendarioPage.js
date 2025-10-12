import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getReservasPorDia } from '../../../api/ReservaApi';
import './CalendarioPage.css';


const CalendarioPage = () => {
  const [date, setDate] = useState(new Date());
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDateChange = async (newDate) => {
    setDate(newDate);
    const fechaISO = newDate.toISOString().split('T')[0];
    setLoading(true);
    try {
      const data = await getReservasPorDia(fechaISO);
      setReservas(data);
    } catch (error) {
      console.error('Error al obtener reservas del día:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calendario-container">
      <h1 className="titulo-calendario">Calendario de Reservas</h1>

      <Calendar
        onChange={handleDateChange}
        value={date}
        className="react-calendar"
      />

      <div className="reservas-del-dia">
        <h2>Reservas para el {date.toLocaleDateString()}</h2>

        {loading ? (
          <p>Cargando reservas...</p>
        ) : reservas.length === 0 ? (
          <p>No hay reservas para este día.</p>
        ) : (
          <ul className="lista-reservas">
            {reservas.map((reserva) => (
              <li key={reserva.idReserva} className="reserva-item">
                <p><strong>Cancha:</strong> {reserva.nombreEspacio || `Espacio ${reserva.idEspacio}`}</p>
                <p><strong>Hora:</strong> {reserva.horaInicio} - {reserva.horaFin}</p>
                <p><strong>Estado:</strong> {reserva.estadoE}</p>
                <p><strong>Cliente:</strong> {reserva.nombreCliente || 'Sin nombre'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CalendarioPage;
