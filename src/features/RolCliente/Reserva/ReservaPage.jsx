import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CalendarSelector from "../Reserva/components/CalendarSelector"
import HorariosDisponibles from "../Reserva/components/HorariosDisponibles";
import useReservaFlow from "../hooks/useReservaFlow";

export default function ReservaPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const canchaId = params.get("canchaId");
  const disciplinaId = params.get("disciplinaId");

  const reserva = useReservaFlow();
  const [horarios, setHorarios] = useState([]);

  const handleSiguiente = () => {
    if (!reserva.fecha || horarios.length === 0) {
      alert("Selecciona fecha y horarios antes de continuar.");
      return;
    }
    reserva.setCancha({ idCancha: canchaId });
    reserva.setDisciplina({ idDisciplina: disciplinaId });
    reserva.setHorariosSeleccionados(horarios);
    navigate("/confirmacion-cliente", { state: { reserva } });
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Selecciona tu fecha y horario</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <CalendarSelector
          fecha={reserva.fecha}
          onChange={(d) => reserva.setFecha(d)}
        />
        {reserva.fecha && (
          <HorariosDisponibles
            canchaId={canchaId}
            fecha={reserva.fecha.toISOString().split("T")[0]}
            onSelectRango={setHorarios}
          />
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={() => navigate(-1)} className="btn-secondary">← Volver</button>
        <div className="flex gap-3">
          <button onClick={() => navigate("/")} className="btn-danger">Salir</button>
          <button onClick={handleSiguiente} className="btn-primary">Siguiente →</button>
        </div>
      </div>
    </div>
  );
}
