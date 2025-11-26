import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CalendarSelector from "../Reserva/components/CalendarSelector"
import HorariosDisponibles from "../Reserva/components/HorariosDisponibles";
import useReservaFlow from "../Reserva/hooks/useReservaFlow";
import { ChevronLeft, X } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../context/ToastContext";
import Stepper from "./components/Stepper";

export default function ReservaPage() {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
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
        showToast("Selecciona una fecha y al menos un horario para continuar ", "warning");
      //alert("Selecciona fecha y horarios antes de continuar.");
      return;
    }

    // Guardar en el flow
    reserva.setCancha({ idCancha: canchaId });
    reserva.setDisciplina({ idDisciplina: disciplinaId });
    reserva.setHorariosSeleccionados(horarios);
    //Console logs antes de navegar
    console.log("ENVIANDO A CONFIRMACIÓN:");
    console.log("  Fecha:", reserva.fecha ? reserva.fecha.toISOString().split("T")[0] : null);
    console.log("  Cancha ID:", canchaId);
    console.log("  Disciplina ID:", disciplinaId);
    console.log("  Horarios seleccionados:", horarios);

    const fecha = reserva.fecha.toISOString().split("T")[0]; // YYYY-MM-DD
    const horaInicio = horarios[0]; // ejemplo: primer horario
    const horaFin = horarios[horarios.length - 1]; // ejemplo: último horario

    navigate("/reservas/cliente", 
      {  state: {
          reserva: {
            fecha,
            horaInicio,
            horaFin,
            canchaId,
            disciplinaId,
          }
        }
      }
    );
  };
   // === COLORES DINÁMICOS ===
  const pageBg = isDarkMode ? 'bg-[#0f1213]' : 'bg-[#f2efeb]';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const accentColor = isDarkMode ? '#2C7366' : '#41bfb2';
  const warningColor = isDarkMode ? '#f35734' : '#f28627';
  const errorColor = isDarkMode ? '#8a2628' : '#d61727';
  const btnHoverBg = isDarkMode ? '#3e5a52' : '#33a396'; // ligeramente más oscuro


  return (
    <div className={`min-h-screen ${pageBg} pt-16 transition-colors duration-300`}>
       <div className="max-w-6xl mx-auto px-4">
        <Stepper step={1} isDarkMode={isDarkMode} />
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
            <h2
              className="text-3xl md:text-4xl font-bold mb-8 text-center"
              style={{ fontFamily: 'var(--font-Alumni)', color: textColor }}
            >
              Selecciona tu fecha y horario para Reservar
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
                    console.log("Horarios seleccionados fin:", seleccionados);
                    setHorarios(seleccionados);
                  }}
                />
              )}
            </div>

            <div
              className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10 pt-6 border-t"
              style={{ borderColor: isDarkMode ? "#2d3748" : "#e5e7eb" }}
            >
              {/* Botón Volver */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 border shadow-sm hover:shadow-md"
                style={{
                  fontFamily: "var(--font-josefin)",
                  backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                  color: accentColor,
                  borderColor: accentColor,
                }}
              >
                <ChevronLeft size={18} />
                Volver
              </button>

              {/* Grupo derecha */}
              <div className="flex gap-4">
                {/* Botón Salir */}
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-sm hover:shadow-lg"
                  style={{
                    fontFamily: "var(--font-josefin)",
                    backgroundColor: errorColor,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = isDarkMode ? "#b13644" : "#c21f2e")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = errorColor)}
                >
                  <X size={18} />
                  Salir
                </button>

                {/* Botón Siguiente */}
                <button
                  onClick={handleSiguiente}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-sm hover:shadow-lg"
                  style={{
                    fontFamily: "var(--font-josefin)",
                    backgroundColor: accentColor,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = btnHoverBg)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = accentColor)}
                >
                  Siguiente
                </button>
              </div>
            </div>



          </div>
        </div>
      </div>
    </div>
  );
}