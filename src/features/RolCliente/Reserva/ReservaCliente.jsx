// src/features/Reserva/pages/ReservaCliente.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../auth/hooks/useAuth";
import { useEffect, useState } from "react";
import { getClienteById } from "../../../api/clienteApi";
import { ChevronLeft, X, Camera } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../context/ToastContext";
import AnimacionTransicion from "./components/AnimacionTransicion";
import Stepper from "./components/Stepper";



export default function ReservaCliente() {
  const { isDarkMode } = useTheme();
  const { addToast } = useToast();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const reserva = location.state?.reserva;
  const [clienteCompleto, setClienteCompleto] = useState(null);

  useEffect(() => {
    if (!currentUser?.idPersona) return;
    const fetchCliente = async () => {
      try {
        const data = await getClienteById(currentUser.idPersona);
        setClienteCompleto(data);
      } catch (error) {
        console.error("Error al cargar el cliente:", error);
        addToast({ message: "❌ Error al cargar tus datos.", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchCliente();
  }, [currentUser?.idPersona, addToast]);

  const handleSiguiente = () => {
    if (!clienteCompleto) {
      addToast({ message: "⚠️ Cargando datos del cliente...", type: "warning" });
      return;
    }
    if (!reserva?.canchaId || !reserva?.disciplinaId) {
      addToast({ message: "⚠️ Faltan datos de la reserva.", type: "warning" });
      return;
    }

    const payload = {
      ...reserva,
      clienteId: clienteCompleto.id,
    };

    navigate("/reservas/confirmacion", {
      state: { reserva: payload, cliente: clienteCompleto },
    });
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-[#0f1213]' : 'bg-[#f2efeb]'}`}>
        <div className="text-center">
          <div
            className="w-6 h-6 border-2 border-transparent rounded-full animate-spin mx-auto"
            style={{ borderTopColor: isDarkMode ? '#f35734' : '#f28627' }}
          ></div>
          <p style={{ fontFamily: 'var(--font-Balo)', color: isDarkMode ? '#a0aec0' : '#6b7280' }} className="mt-3">
            Cargando tus datos...
          </p>
        </div>
      </div>
    );
  }

  if (!clienteCompleto) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? 'bg-[#0f1213]' : 'bg-[#f2efeb]'}`}>
        <p style={{ fontFamily: 'var(--font-Balo)', color: isDarkMode ? '#f35734' : '#f28627' }}>
          No se encontró tu perfil. Por favor, inicia sesión nuevamente.
        </p>
      </div>
    );
  }

  // === COLORES DINÁMICOS ===
  const pageBg = isDarkMode ? 'bg-[#0f1213]' : 'bg-[#f2efeb]';
  const cardBg = isDarkMode ? 'bg-[#1a1d1e]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-[#2d3748]' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const secondaryText = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const accentColor = isDarkMode ? '#2C7366' : '#41bfb2';
  const errorColor = isDarkMode ? '#8a2628' : '#d61727';

  return (
    <AnimacionTransicion direction="right">
      <div className={`min-h-screen py-10 px-4 pt-16 transition-colors duration-300 ${pageBg}`}>
        <div className="max-w-2xl mx-auto">
          <Stepper step={2} isDarkMode={isDarkMode} />
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-8"
            style={{ fontFamily: 'var(--font-Alumni)', color: textColor }}
          >
            Verifica tus datos
          </h2>
          <div className={`rounded-2xl p-7 ${cardBg} ${borderColor} border shadow-sm`}>
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
              
              {/* Datos del cliente */}
              <div className="flex-1 space-y-3 order-2 lg:order-1">
                <p>
                  <span className="font-medium" style={{ color: textColor }}>Nombre:</span>{' '}
                  <span style={{ color: secondaryText }}>
                    {`${clienteCompleto.nombre} ${clienteCompleto.apellidoPaterno} ${clienteCompleto.apellidoMaterno}`}
                  </span>
                </p>
                <p>
                  <span className="font-medium" style={{ color: textColor }}>Correo:</span>{' '}
                  <span style={{ color: secondaryText }}>{clienteCompleto.email}</span>
                </p>
                <p>
                  <span className="font-medium" style={{ color: textColor }}>Fecha de nacimiento:</span>{' '}
                  <span style={{ color: secondaryText }}>{clienteCompleto.fechaNacimiento || "No registrada"}</span>
                </p>
                <p>
                  <span className="font-medium" style={{ color: textColor }}>Teléfono:</span>{' '}
                  <span style={{ color: secondaryText }}>{clienteCompleto.telefono || "No registrado"}</span>
                </p>
              </div>

              {/* Foto de perfil */}
              <div className="relative order-1 lg:order-2 flex-shrink-0">
                <img
                  src={clienteCompleto.urlImagen || "/defaults/user-default.jpg"}
                  alt="Foto del cliente"
                  className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover border-4"
                  style={{ borderColor: accentColor }}
                  onError={(e) => { e.target.onerror = null; e.target.src = "/defaults/user-default.jpg"; }}
                />
                <button
                  className="absolute bottom-2 right-2 bg-[#4b5563] dark:bg-[#2d3748] text-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                  aria-label="Actualizar foto"
                >
                  <Camera size={16} />
                </button>
              </div>

            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10 pt-6 border-t" style={{ borderColor: isDarkMode ? '#2d3748' : '#e5e7eb' }}>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200"
              style={{
                fontFamily: 'var(--font-josefin)',
                backgroundColor: isDarkMode ? '#2d3748' : 'white',
                color: accentColor,
                border: `2px solid ${accentColor}`
              }}
            >
              <ChevronLeft size={16} /> Atrás
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-josefin)',
                  backgroundColor: errorColor
                }}
              >
                <X size={16} /> Salir
              </button>
              <button
                onClick={handleSiguiente}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-josefin)',
                  backgroundColor: accentColor
                }}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimacionTransicion>
  );
}