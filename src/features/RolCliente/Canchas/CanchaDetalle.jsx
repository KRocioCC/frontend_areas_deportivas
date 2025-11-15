// src/features/RolCliente/Cancha/CanchaDetalle.jsx
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getCancha } from "../../../api/CanchaApi";
import DisciplinaCli from "../Disciplina/DisciplinaCli";
import CanchaHeader from "./CanchaHeader";
import CanchaInfo from "./CanchaInfo";
import CanchaDetallesExtras from "./CanchaDetallesExtras";
import CanchaMapa from "./CanchaMapa";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../../auth/hooks/useAuth";

export default function CanchaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cancha, setCancha] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser, isClient } = useAuth();
  const [error, setError] = useState('');
  const [disciplina, setDisciplina] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCancha(id);
        setCancha(data);
      } catch (e) {
        console.error("Error al cargar cancha", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!cancha) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <p className="text-gray-600 text-lg mb-4">Cancha no encontrada.</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <FaArrowLeft /> Volver
        </button>
      </div>
    );
  }

  const handleReservar = () => {
    if (!disciplina) {
      setError("Por favor, selecciona una disciplina antes de reservar.");
      return;
    }
    setError("");

    const url = `/reservascli?canchaId=${cancha.idCancha}&disciplinaId=${disciplina.idDisciplina}`;

    if (currentUser && isClient) {
      navigate(url);
    } else {
      navigate("/login", { state: { from: url } });
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('/Fondos/Deporte1.png')`,
      }}
    >
      {/* Overlay oscuro */}
      <div className="fixed inset-0 bg-black/60 -z-10"></div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 min-h-screen flex flex-col"
      >
        <div className="flex-1 max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Botón Volver */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-blue-300 font-medium text-sm mb-8 transition-colors"
          >
            <FaArrowLeft className="text-lg" />
            Volver
          </button>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Izquierda: Imagen + Disciplinas */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
                <CanchaHeader cancha={cancha} />
              </div>

              {/* Selector de Disciplinas */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
                <h3 className="font-semibold text-gray-900 mb-5 text-lg">Selecciona una Disciplina</h3>
                <DisciplinaCli
                  canchaId={cancha.idCancha}
                  onSelectDisciplina={(d) => setDisciplina(d)}
                />

                {disciplina && (
                  <p className="mt-3 text-sm text-green-700 font-medium">
                    ✓ {disciplina.nombre}
                  </p>
                )}

                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
                <CanchaInfo cancha={cancha} />
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
                <CanchaDetallesExtras cancha={cancha} />
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6">
                <CanchaMapa cancha={cancha} />
              </div>

              {/* Botón Reservar */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleReservar}
                  disabled={!disciplina}
                  className={`w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-white text-lg shadow-xl transition-all transform hover:scale-105 active:scale-100 ${
                    disciplina
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Ver Horarios y Reservar
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}