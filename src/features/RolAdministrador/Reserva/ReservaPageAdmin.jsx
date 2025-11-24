import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CalendarSelector from "../Reserva/components/CalendarSelector";
import HorariosDisponibles from "../Reserva/components/HorariosDisponibles";
import useReservaFlow from "../Reserva/hooks/useReservaFlow";
import { FaArrowLeft, FaTimes, FaCalendarAlt, FaClock, FaArrowRight } from "react-icons/fa";

export default function ReservaPageAdmin() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const canchaId = params.get("canchaId");
  const disciplinaId = params.get("disciplinaId");

  const reserva = useReservaFlow();
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    console.log("ReservaPageAdmin - Parámetros recibidos:");
    console.log("  canchaId:", canchaId);
    console.log("  disciplinaId:", disciplinaId);
  }, [canchaId, disciplinaId]);

  const handleSiguiente = () => {
    if (!reserva.fecha || horarios.length === 0) {
      alert("Selecciona fecha y horarios antes de continuar.");
      return;
    }

    reserva.setCancha({ idCancha: canchaId });
    reserva.setDisciplina({ idDisciplina: disciplinaId });
    reserva.setHorariosSeleccionados(horarios);

    const fecha = reserva.fecha.toISOString().split("T")[0];
    const horaInicio = horarios[0];
    const horaFin = horarios[horarios.length - 1];

    console.log("ENVIANDO A CONFIRMACIÓN (admin):", {
      fecha,
      horaInicio,
      horaFin,
      canchaId,
      disciplinaId,
    });

    navigate("/admin/reservas/confirmacion", {
      state: {
        reserva: {
          fecha,
          horaInicio,
          horaFin,
          canchaId,
          disciplinaId,
        },
      },
    });
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url('/Fondos/Deporte5.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col py-8">
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl mb-6 border border-white/20">
              <FaCalendarAlt className="text-3xl text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Alumni_Sans']">
              Reserva Administrativa
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto font-['Josefin_Sans']">
              Selecciona la fecha y horario para la reserva
            </p>
          </div>

          {/* Contenido principal */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Selector de calendario */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <FaCalendarAlt className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 font-['Alumni_Sans']">
                    Selecciona la Fecha
                  </h3>
                  <p className="text-gray-600 text-sm font-['Josefin_Sans']">
                    Elige el día para tu reserva
                  </p>
                </div>
              </div>
              <CalendarSelector
                fecha={reserva.fecha}
                onChange={(d) => {
                  console.log("Fecha cambiada (admin):", d.toISOString().split("T")[0]);
                  reserva.setFecha(d);
                }}
              />
            </div>

            {/* Horarios disponibles */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <FaClock className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 font-['Alumni_Sans']">
                    Horarios Disponibles
                  </h3>
                  <p className="text-gray-600 text-sm font-['Josefin_Sans']">
                    {reserva.fecha 
                      ? `Horarios para el ${reserva.fecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
                      : "Selecciona una fecha primero"
                    }
                  </p>
                </div>
              </div>
              
              {reserva.fecha ? (
                <HorariosDisponibles
                  canchaId={canchaId}
                  fecha={reserva.fecha.toISOString().split("T")[0]}
                  onSelectRango={(seleccionados) => {
                    console.log("Horarios seleccionados (admin):", seleccionados);
                    setHorarios(seleccionados);
                  }}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaClock className="text-gray-400 text-2xl" />
                  </div>
                  <p className="text-gray-500 font-['Josefin_Sans']">
                    Selecciona una fecha para ver los horarios disponibles
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Indicador de selección */}
          {horarios.length > 0 && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-8 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FaClock className="text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg font-['Alumni_Sans']">
                      Horarios Seleccionados
                    </h4>
                    <p className="text-white/90 font-['Josefin_Sans']">
                      {horarios.length} horario(s) seleccionado(s) - {horarios[0]} a {horarios[horarios.length - 1]}
                    </p>
                  </div>
                </div>
                <div className="text-white font-bold text-2xl font-['Alumni_Sans']">
                  {horarios.length}h
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-white/20">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md"
            >
              <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
              <span className="font-['Josefin_Sans']">Volver Atrás</span>
            </button>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/admin/canchas_admin")}
                className="group flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 bg-red-500/90 hover:bg-red-600 text-white backdrop-blur-md border border-red-400/20"
              >
                <FaTimes />
                <span className="font-['Josefin_Sans']">Cancelar</span>
              </button>

              <button
                onClick={handleSiguiente}
                disabled={!reserva.fecha || horarios.length === 0}
                className={`group flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 backdrop-blur-md border ${
                  reserva.fecha && horarios.length > 0
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl transform hover:scale-105 border-blue-500/20"
                    : "bg-gray-500/50 cursor-not-allowed border-gray-400/20"
                }`}
              >
                <span className="font-['Josefin_Sans']">Continuar</span>
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}