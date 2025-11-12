// src/features/RolCliente/Cancha/CanchaDetalle.jsx
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getCancha } from "../../../api/CanchaApi";
import DisciplinaCli from "../Disciplina/DisciplinaCli";

export default function CanchaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cancha, setCancha] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCancha = async () => {
      try {
        const data = await getCancha(id);
        setCancha(data);
      } catch (e) {
        console.error("Error al cargar cancha", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCancha();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-12 w-12 border-t-2 border-blue-500 rounded-full"></div>
      </div>
    );

  return (
    <motion.div
      className="min-h-screen bg-white p-6"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button
        className="mb-4 text-gray-600 hover:text-gray-800"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>

      <div className="relative w-full h-64 mb-6">
        <img
          src={cancha.urlImagen || "/images/default-cancha.jpg"}
          alt={cancha.nombre}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      <h1 className="text-3xl font-bold mb-2">{cancha.nombre}</h1>
      <p className="text-gray-600 mb-6">{cancha.descripcion}</p>

      <h2 className="text-xl font-semibold mb-3">Disciplinas</h2>
      <DisciplinaCli canchaId={id} />

      <div className="mt-10 text-center">
        <button
          onClick={() => navigate(`/canchacli/reserva/${id}`)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
        >
          Seleccionar Disciplina y Reservar
        </button>
      </div>
    </motion.div>
  );
}
