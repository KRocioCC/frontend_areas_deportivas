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
import { FaArrowLeftLong } from "react-icons/fa6";
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-t-2 border-[var(--secondary)] rounded-full"></div>
      </div>
    );

  if (!cancha)
    return (
      <div className="flex flex-col justify-center items-center h-64 text-[var(--color-t-2)]">
        <p>Cancha no encontrada.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-[var(--secondary)] hover:underline"
        >
          ← Volver
        </button>
      </div>
    );

  const handleReservar = () => {
    if (!disciplina) {
      setError("Por favor, selecciona una disciplina antes de reservar.");
      return;
    }
    setError("");

    const url = `/reservascli?canchaId=${cancha.idCancha}&disciplinaId=${disciplina.idDisciplina}`;

    if (currentUser && isClient) {
      // usuario cliente ya logueado
      navigate(url);
    } else {
      // no logueado o no cliente: mandar al login guardando la URL destino
      navigate("/login", { state: { from: url } });
    }
  };
  console.log("Cancha:", cancha);
  console.log("Disciplina:", disciplina);
  
  return (
    <motion.div
      className="min-h-screen font-[var(--font-Balo)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: `linear-gradient(135deg, var(--color-p-3) 40%, var(--color-p-5) 100%)`,
      }}
    >
      <div className="max-w-6xl mx-auto p-6">
        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-[var(--color-p-6)] hover:text-[var(--color-p-4)] transition-all font-[var(--font-Oswald)]"
        >
          <FaArrowLeftLong className="text-lg" />
          <span>Volver</span>
        </button>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Izquierda: Imagen + Disciplinas */}
          <div className="space-y-4">
            <CanchaHeader cancha={cancha} />

            <div className="bg-[var(--color-p-6)] rounded-xl p-4 shadow-sm">
              <h3 className="font-[var(--font-Oswald)] text-lg text-[var(--primary)] mb-2">
                Disciplinas
              </h3>

              {/* PASAMOS setDisciplina como onSelectDisciplina */}
              <DisciplinaCli canchaId={cancha.idCancha} onSelectDisciplina={(d) => setDisciplina(d)} />

              {disciplina && (
                <div className="mt-3 text-sm text-gray-700">
                  Seleccionado: <strong>{disciplina.nombre || JSON.stringify(disciplina)}</strong>
                </div>
              )}

              {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
              
            </div>

          </div>

          {/* Derecha: Info + Detalles + Mapa */}
          <div className="flex flex-col gap-4">
            <CanchaInfo cancha={cancha} />
            <CanchaDetallesExtras cancha={cancha} />
            <CanchaMapa cancha={cancha} />

             <div className="text-center mt-4">
              <button onClick={handleReservar} className="px-6 py-3 bg-[var(--secondary)] hover:bg-[var(--color-b-2)] text-white rounded-xl font-[var(--font-josefin)] text-lg shadow-md transition-all">
                Ver Horarios y Reservar
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </motion.div>
  );
}
