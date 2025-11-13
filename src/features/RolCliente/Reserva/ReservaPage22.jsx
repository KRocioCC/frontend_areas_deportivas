import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CalendarSelector from "../Reserva/components/CalendarSelector"
import HorariosDisponibles from "../Reserva/components/HorariosDisponibles";
import useReservaFlow from "../Reserva/hooks/useReservaFlow";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
// ReservaPage.jsx


export default function ReservaPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const canchaId = params.get("canchaId");
  const disciplinaId = params.get("disciplinaId");

  const reserva = useReservaFlow();
  const [horarios, setHorarios] = useState([]);

  // Console logs al cargar la página
  useEffect(() => {
    console.log("ReservaPage - Parámetros recibidos:");
    console.log("  canchaId:", canchaId);
    console.log("  disciplinaId:", disciplinaId);
  }, [canchaId, disciplinaId]);

  const handleSiguiente = () => {
    if (!reserva.fecha || horarios.length === 0) {
      alert("Selecciona fecha y horarios antes de continuar.");
      return;
    }

    // Guardar en el flow
    reserva.setCancha({ idCancha: canchaId });
    reserva.setDisciplina({ idDisciplina: disciplinaId });
    reserva.setHorariosSeleccionados(horarios);

    // Console logs antes de navegar
    console.log("ENVIANDO A CONFIRMACIÓN:");
    console.log("  Fecha:", reserva.fecha ? reserva.fecha.toISOString().split("T")[0] : null);
    console.log("  Cancha ID:", canchaId);
    console.log("  Disciplina ID:", disciplinaId);
    console.log("  Horarios seleccionados:", horarios);

    navigate("/confirmacion-cliente", { state: { reserva } });
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-p-4)", fontFamily: "var(--font-Balo)" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2
          className="text-4xl font-bold mb-8 text-center"
          style={{ fontFamily: "var(--font-Alumni)", color: "var(--color-p-1)" }}
        >
          Selecciona tu fecha y horario
        </h2>

        <div className="grid lg:grid-cols-2 gap-8">
          <CalendarSelector
            fecha={reserva.fecha}
            onChange={(d) => {
              console.log("Fecha cambiada desde ReservaPage:", d.toISOString().split("T")[0]);
              reserva.setFecha(d);
            }}
          />
          {reserva.fecha && (
            <HorariosDisponibles
              canchaId={canchaId}
              fecha={reserva.fecha.toISOString().split("T")[0]}
              onSelectRango={(seleccionados) => {
                console.log("Horarios seleccionados:", seleccionados);
                setHorarios(seleccionados);
              }}
            />
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10 pt-6 border-t border-gray-300">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
            style={{
              backgroundColor: "var(--color-white)",
              color: "var(--color-p-1)",
              border: "2px solid var(--color-p-1)",
              fontFamily: "var(--font-josefin)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-p-1)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-white)")}
          >
            <FaArrowLeft /> Volver
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all"
              style={{
                backgroundColor: "var(--color-danger)",
                color: "var(--color-white)",
                fontFamily: "var(--font-josefin)",
              }}
            >
              <FaTimes /> Salir
            </button>

            <button
              onClick={handleSiguiente}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all shadow-lg"
              style={{
                backgroundColor: "var(--color-p-1)",
                fontFamily: "var(--font-josefin)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b51e2a")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-p-1)")}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}