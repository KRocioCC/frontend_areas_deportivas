// src/features/RolCliente/Cancha/Cancha.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCanchasPorArea } from "../../../api/CanchaApi.js";
import { getAreadeportivaById } from "../../../api/AreadeportivaApi"; 
import { FaArrowLeft, FaDollarSign, FaUsers } from "react-icons/fa";
//import CanchaModal from "./CanchaModal";
import { useNavigate } from "react-router-dom";
// ...

export default function Cancha() {
  const [area, setArea] = useState(null);
  const [canchas, setCanchas] = useState([]);
  const [selectedCancha, setSelectedCancha] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const areaId = new URLSearchParams(location.search).get("areaId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!areaId) return;
      try {
        const [areaData, canchasData] = await Promise.all([
          getAreadeportivaById(areaId),
          getCanchasPorArea(areaId)
        ]);
        console.log("Canchas recibidas:", canchasData);
        setArea(areaData);
        setCanchas(canchasData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [areaId]);



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header horizontal */}
      <div className="bg-gray-900 text-white p-4 md:p-6 flex flex-col md:flex-row items-center gap-4">
        <button
          onClick={() => window.history.back()}
          className="text-xl hover:text-gray-300"
        >
          ←
        </button>
        <img
          src={area?.urlImagen || "/images/default-area.jpg"}
          alt={area?.nombre}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div>
          <h1 className="text-xl md:text-2xl font-bold">{area?.nombre}</h1>
          <p className="text-sm text-gray-300">
            {area?.zona?.macrodistrito?.nombre || "Macrodistrito"} • {area?.zona?.nombre || "Zona"}
          </p>
        </div>
      </div>

      {/* Grid de canchas */}
      <div className="py-6 px-4 md:px-8">
        <h2 className="text-2xl text-gray-300 font-bold mb-4">Canchas Disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {canchas.map((cancha) => (
            <div
              key={cancha.idCancha}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <img
                src={cancha.urlImagen || "/images/default-cancha.jpg"}
                alt={cancha.nombre}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800">{cancha.nombre}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FaDollarSign /> S/{cancha.costoHora?.toFixed(2)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUsers /> {cancha.capacidad} pers.
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm"
                    onClick={() => alert("Ver Comentarios (próximamente mejor si jala hacia abajo lso comenatrios)")}
                  >
                    Ver Comentarios
                  </button>
                  <button
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                    onClick={() => navigate(`/canchacli/detalle/${cancha.idCancha}`)}
                  >
                    Realizar Reserva
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de detalle de cancha */}
      {/*{selectedCancha && (
        <CanchaModal
          cancha={selectedCancha}
          area={area}
          onClose={() => setSelectedCancha(null)}
        />
      )}*/}
    </div>
  );
}