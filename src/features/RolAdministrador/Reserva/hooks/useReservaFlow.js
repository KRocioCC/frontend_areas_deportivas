// src/features/Reserva/hooks/useReservaFlow.js
import { useState } from "react";

export default function useReservaFlow() {
  const [fecha, setFecha] = useState(null);
  const [horariosSeleccionados, setHorariosSeleccionados] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [cancha, setCancha] = useState(null);
  const [disciplina, setDisciplina] = useState(null);
  const [monto, setMonto] = useState(null);

  return {
    fecha, setFecha,
    horariosSeleccionados, setHorariosSeleccionados,
    cliente, setCliente,
    cancha, setCancha,
    disciplina, setDisciplina,
    monto, setMonto
  };
}
