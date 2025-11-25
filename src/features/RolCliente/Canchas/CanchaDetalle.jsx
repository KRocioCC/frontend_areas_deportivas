import { useNavigate, useParams } from "react-router-dom";
//import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getCancha } from "../../../api/CanchaApi";
import DisciplinaCli from "../Disciplina/DisciplinaCli";
//import CanchaHeader from "./CanchaHeader";
//import CanchaInfo from "./CanchaInfo";
import CanchaDetallesExtras from "./CanchaDetallesExtras";
import CanchaMapa from "./CanchaMapa";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../../auth/hooks/useAuth";
import FancyButton from "../../../components/ui/FancyButton.jsx";

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
    <div className="pt-10 w-full bg-[#0b0d0e] " >
      {/* HEADER IMAGEN GRANDE + MINI GALERÍA */}
      <div className="relative w-full max-w-6xl mx-auto mt-4 ">

        {/* Botón Volver */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 text-p-6 hover:text-p-5 font-medium text-lg z-20"
        >
          <FaArrowLeft /> Volver
        </button>

        {/* Layout responsivo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 ">

          {/* Imagen grande */}
          <div className="md:col-span-3 rounded-xl overflow-hidden shadow-md h-96 md:h-120 relative">
            <img
              src={
                cancha.imagenes && cancha.imagenes.length > 0
                  ? cancha.imagenes[0].urlAcceso?.startsWith('http')
                    ? cancha.imagenes[0].urlAcceso
                    : `http://localhost:8032${cancha.imagenes[0].urlAcceso}`
                  : cancha.urlImagen || "/images/default-cancha.jpg"
              }
              alt={cancha.nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/defaults/cancha-default.jpg";
              }}
            />

            {/* Gradiente oscuro */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            {/* Info del nombre */}
            <div className="absolute bottom-4 left-4 text-white">
              <h1 className="text-2xl font-[var(--font-Oswald)] tracking-wide">
                {cancha.nombre}
              </h1>
            </div>

            {/* Botón Ver galería completa 
            {cancha.imagenes && cancha.imagenes.length > 1 && (
              <button
                onClick={() => " "}
                className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-lg text-sm shadow-lg backdrop-blur-md transition"
              >
                Ver galería completa ({cancha.imagenes.length} fotos)
              </button>
            )}*/}
          </div>

          {/* Mini galería */}
          <div className="md:col-span-1 space-y-4">
            {cancha.imagenes && cancha.imagenes.length > 1 ? (
              cancha.imagenes.slice(1, 4).map((imagen, i) => (
                <div key={i} className="rounded-xl overflow-hidden shadow-md">
                  <img
                    src={
                      imagen.urlAcceso?.startsWith('http')
                        ? imagen.urlAcceso
                        : `http://localhost:8032${imagen.urlAcceso}`
                    }
                    alt={`${cancha.nombre} imagen ${i + 2}`}
                    className="w-full h-[7rem] object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/defaults/cancha-default.jpg";
                    }}
                  />
                </div>
              ))
            ) : (
              // Si no hay suficientes imágenes, mostrar la primera o default
              [1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl overflow-hidden shadow-md">
                  <img
                    src={cancha.urlImagen || "/defaults/cancha-default.jpg"}
                    alt={`${cancha.nombre} placeholder`}
                    className="w-full h-[7rem] object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/defaults/cancha-default.jpg";
                    }}
                  />
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {/* MENÚ DE TABS */}
      <div className="w-full border-b mt-6 bg-white shadow-sm">
        <div className="w-full border-b mt-6 bg-white shadow-sm">
          <div className="max-w-6xl mx-auto flex justify-start gap-10 p-4 text-orange-600 font-semibold">
            <button className="border-b-2 border-orange-600 pb-1">Descripción General</button>
            <button>Disciplina</button>
            <button>Equipamiento</button>
            <button>Opiniones</button>
          </div>
        </div>


        <div className="max-w-6xl mx-auto mt-8 grid grid-cols-3 gap-10">
          {/* IZQUIERDA */}
          <div className="md:col-span-2 space-y-8">

            {/* CARD PRINCIPAL */}
            <div className="p-6 rounded-xl ">

              {/* TÍTULO + ESTADO */}
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-[var(--font-Oswald)] tracking-wide">
                  {cancha.nombre}
                </h1>
                <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
                  {cancha.estado ? "Abierto" : "Cerrado"}
                </span>
              </div>

              {/* UBICACIÓN */}
              <p className="text-gray-700 mt-1">
                {cancha.areaDeportiva?.zona?.macrodistrito?.nombre}  –  {cancha.areaDeportiva?.zona?.nombre}
              </p>

              {/* TELÉFONO + EMAIL */}
              <div className="flex flex-col gap-2 mt-3 text-gray-700 text-sm">
                <a
                  href={`tel:${cancha.areaDeportiva?.telefonoArea}`}
                  className="flex items-center gap-2 hover:text-p-5"
                >
                  📞 {cancha.areaDeportiva?.telefonoArea}
                </a>
                <a
                  href={`mailto:${cancha.areaDeportiva?.emailArea}`}
                  className="flex items-center gap-2 hover:text-p-5"
                >
                  📧 {cancha.areaDeportiva?.emailArea}
                </a>

              </div>

              {/* COSTO Y CAPACIDAD */}
              <div className="flex gap-4 mt-4">

                <div className="border px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-500">Costo/Hora</p>
                  <p className="text-xl font-bold text-bg-p-1">{cancha.costoHora} Bs</p>
                </div>

                <div className="border px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-500">Capacidad</p>
                  <p className="text-xl font-bold text-orange-500">{cancha.capacidad} Pers.</p>
                </div>

              </div>
            </div>
            {/* DESCRIPCIÓN Y EXTRAS */}
            <div className="p-6">
              <CanchaDetallesExtras cancha={cancha} />
            </div>   

            
          </div>

          {/* DERECHA: MAPA */}
          <div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="font-bold text-xl mb-4 text-orange-600">Ubicación</h3>
              <CanchaMapa cancha={cancha} />
            </div>
          </div>
        </div>
        {/* Selección de Disciplinas estilo imagen */}
        <div className="bg-[#0b0d0e] p-8 m-0">
          <h3 className="font-bold text-xl mb-4">Escoge tus Disciplinas Favoritas</h3>
          <DisciplinaCli canchaId={cancha.idCancha} onSelectDisciplina={(d) => setDisciplina(d)} />
          {disciplina && (
            <p className="mt-2 text-green-600 font-medium text-sm">✓ {disciplina.nombre}</p>
          )}

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <div className="mt-6 flex justify-center">
            {/*<button
              onClick={handleReservar}
              disabled={!disciplina}
              className={`px-10 py-3 rounded-lg text-white font-bold shadow-md ${
                disciplina ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Reservar Ya
            </button>*/}
            <FancyButton
              onClick={handleReservar}
              disabled={!disciplina}
              className={`px-10 py-3 rounded-lg text-white font-bold shadow-md ${
                disciplina ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
              }`}
              bgColor="var(--color-p-1)"
              lineColor="var(--color-p-1)"
              hoverColor="var(--color-p-10)"
            >
              Reservar Ya
            </FancyButton>
          </div>

        </div>
      </div>

    </div>
  );
}
