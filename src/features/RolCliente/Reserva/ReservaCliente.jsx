import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../auth/hooks/useAuth";
import { FaArrowLeft, FaTimes, FaCamera } from "react-icons/fa";
import AnimacionTransicion from "./components/AnimacionTransicion";

import { useEffect, useState } from "react";
import { getClienteById } from "../../../api/clienteApi";

 // Asegúrate de tener esta función
export default function ReservaCliente() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const reserva = location.state?.reserva;
  //const [showDebugInfo, setShowDebugInfo] = useState(false); // ← Nuevo estado para debug
  const [clienteCompleto, setClienteCompleto] = useState(null);

  console.log("🟦cli Datos del usuario autenticado:", user);
  console.log("🟧cli Datos de la reserva recibida:", reserva);

// Cargar cliente completo desde API usando el email del usuario autenticado
  useEffect(() => {
    if (!currentUser?.idPersona) return;

    const fetchArea = async () => {
      try {
        console.log('Iniciando carga del el cliente:', currentUser.idPersona);
        const data = await getClienteById(currentUser.idPersona);
        console.log(' 🟧Cliente cargado:', data);
        setClienteCompleto(data);
        
      } catch (error) {
        console.error("Error al cargar el área:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArea();
  }, [currentUser?.idPersona]);

  const handleSiguiente = () => {
    if (!clienteCompleto) {
      alert("Cargando datos del cliente...");
      return;
    }

    if (!reserva?.canchaId || !reserva?.disciplinaId) {
      alert("Faltan datos de la reserva.");
      return;
    }

    const payload = {
      ...reserva,
      clienteId: clienteCompleto.id,
    };

    console.log("ENVIANDO A CONFIRMACIÓN:", payload);

    console.log("📤 Enviando a /reservas/confirmacion:");
    console.log("Reserva:", payload);
    console.log("Cliente:", clienteCompleto);

    navigate("/reservas/confirmacion", {
      state: { reserva: payload, cliente: clienteCompleto },
    });
  };

    // --- RENDER ----------------------------------------------------------------
  if (loading) return <div>Cargando área deportiva...</div>;
  if (!clienteCompleto) return <div>No se encontró un área asignada.</div>;


  return (
    <AnimacionTransicion direction="right">
      <div
        className="max-w-3xl mx-auto p-8 bg-p-6"
        style={{ fontFamily: "var(--font-Balo)" }}
      >
        <h2
          className="text-3xl font-bold text-center mb-8"
          style={{ color: "var(--color-p-1)" }}
        >
          Verifica tus datos
        </h2>

        {user ? (
          <div className="bg-white rounded-3xl shadow-lg p-8 space-y-3 border border-gray-200 relative">

            {/* FOTO DE PERFIL */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src={clienteCompleto.urlImagen || "https://via.placeholder.com/120"}
                  alt="Foto del cliente"
                  className="w-32 h-32 rounded-full object-cover border-4"
                  style={{ borderColor: "var(--color-p-5)" }}
                />

                {/* Botón minimalista para actualizar foto */}
                <button
                  className="absolute bottom-2 right-2 bg-[var(--color-p-1)] text-white p-2 rounded-full shadow hover:scale-110 transition"
                >
                  <FaCamera size={14} />
                </button>
              </div>
            </div>

            {/* DATOS */}
            <div className="space-y-2 text-[18px]">
              <p><strong>Nombre:</strong> {clienteCompleto.nombre +" "+ clienteCompleto.aPaterno + " "+ clienteCompleto.aMaterno || clienteCompleto.fullName}</p>
              <p><strong>Correo:</strong> {clienteCompleto.email}</p>
              <p><strong>Fecha nacimiento:</strong> {clienteCompleto.fechaNacimiento }</p>
              <p><strong>Teléfono:</strong> {clienteCompleto.telefono || "No registrado"}</p>
              <p><strong>Imagen:</strong> {clienteCompleto.urlImagen}</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No hay información del cliente. Inicia sesión nuevamente.
          </p>
        )}

        {/* BOTONES */}
        <div className="flex justify-between mt-10">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-lg border-2 font-semibold flex items-center gap-2"
            style={{ borderColor: "var(--color-p-1)", color: "var(--color-p-1)" }}
          >
            <FaArrowLeft /> Atrás
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold flex items-center gap-2"
            >
              <FaTimes /> Salir
            </button>

            <button
              onClick={handleSiguiente}
              className="px-6 py-3 bg-[var(--color-p-1)] text-white rounded-lg font-semibold"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </AnimacionTransicion>
  );
}
