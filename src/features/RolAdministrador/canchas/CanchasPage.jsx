import React, { useEffect, useState } from "react";
import { getAreadeportivaPorAdminId } from "../../../api/AreadeportivaApi";
import {
  getCanchasPorArea,
  updateCancha,
  createCancha,
  deleteCancha,
  agregarImagenesCancha,
} from "../../../api/CanchaApi";
import { useAuth } from "../../../auth/hooks/useAuth";
import BuscadorCanchas from "./components/components_cancha/BuscadorCanchas";
import CanchaCard from "./components/components_cancha/CanchaCard";
import WizardCrearCancha from "./WizardCrearCancha";
import ModalEdicionCancha from "./components/components_cancha/ModalEdicionCancha";

const CanchasPage = () => {
  const { currentUser } = useAuth();
  const [canchas, setCanchas] = useState([]);
  const [filteredCanchas, setFilteredCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idArea, setIdArea] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [err, setErr] = useState(null);

  // Wizard states
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    const fetchAreaYcanchas = async () => {
      try {
        const area = await getAreadeportivaPorAdminId(currentUser.idPersona);
        const id = area?.idAreadeportiva;
        if (!id) {
          setLoading(false);
          return;
        }
        setIdArea(id);

        const canchasData = await getCanchasPorArea(id);
        setCanchas(canchasData);
        setFilteredCanchas(canchasData);
      } catch (error) {
        console.error("Error al obtener área o canchas:", error);
        setErr("No se pudo cargar las canchas.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.idPersona) {
      fetchAreaYcanchas();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredCanchas(canchas);
      return;
    }
    const filtered = canchas.filter(
      (cancha) =>
        cancha.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cancha.tipoSuperficie?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cancha.cubierta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cancha.areaDeportiva?.zona?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCanchas(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredCanchas(canchas);
  };

  const handleEditCancha = (canchaId) => {
    setEditingId(canchaId);
    const canchaOriginal = canchas.find((c) => c.idCancha === canchaId);
    setEditedData({ ...canchaOriginal });
  };

  const handleChangeField = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveCancha = async () => {
    try {
      await updateCancha(editingId, editedData);
      const updatedList = canchas.map((c) =>
        c.idCancha === editingId ? { ...c, ...editedData } : c
      );
      setCanchas(updatedList);
      setFilteredCanchas(updatedList);
      setEditingId(null);
      setEditedData({});
    } catch (error) {
      console.error("Error al actualizar cancha:", error);
      alert(" Error al actualizar la cancha");
    }
  };

  const handleDesactivarCancha = async (idCancha) => {
    if (!window.confirm("¿Estás seguro de que deseas desactivar esta cancha?")) {
      return;
    }
    
    try {
      await deleteCancha(idCancha);
      const actualizadas = canchas.map((c) =>
        c.idCancha === idCancha ? { ...c, estado: false } : c
      );
      setCanchas(actualizadas);
      setFilteredCanchas(actualizadas);
      alert(" Cancha desactivada correctamente");
    } catch (error) {
      console.error("Error al desactivar cancha:", error);
      alert(" Error al desactivar la cancha");
    }
  };

  const handleCanchaCreada = () => {
    // Recargar las canchas después de crear una nueva
    const fetchCanchas = async () => {
      try {
        const canchasData = await getCanchasPorArea(idArea);
        setCanchas(canchasData);
        setFilteredCanchas(canchasData);
      } catch (error) {
        console.error("Error al recargar canchas:", error);
      }
    };
    
    if (idArea) {
      fetchCanchas();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando canchas...</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <p className="text-red-600 text-lg font-semibold">{err}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header con fondo mejorado */}
      <div 
        className="relative bg-cover mb-8 bg-center bg-no-repeat py-16"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/Fondos/Deporte11.png')`,
        }}
      >
        <div className="absolute inset-0  bg-black bg-opacity-30"></div>
        <div className="relative max-w-7xl mb-6 mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gestión de Canchas
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Administra y organiza todas las canchas de tu área deportiva
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
    <div className="w-full mx-auto px-12 py-16 -mt-8 relative z-10">
       { /* Panel de Búsqueda y Acciones */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="flex-1 w-full">
                {/* Búsqueda por nombre de cancha */}
                <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              placeholder="Buscar por nombre de cancha..."
              className="w-full pl-4 pr-24 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#45bfb5] text-white rounded-md transition-colors text-sm"
            >
              Buscar
            </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
            onClick={handleClearSearch}
            className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl flex items-center justify-center"
                >
            <span> Limpiar</span>
                </button>
                
                <button
            onClick={() => setShowWizard(true)}
            className="px-6 py-3 bg-gradient-to-r from-black to-gray-900 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center border border-gray-700"
                >
            <span className="mr-2"></span>
            Crear Nueva Cancha
                </button>
              </div>
            </div>

            {/* Estadísticas rápidas */}
          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Total: <strong>{canchas.length}</strong> canchas</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Activas: <strong>{canchas.filter(c => c.estado).length}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Inactivas: <strong>{canchas.filter(c => !c.estado).length}</strong></span>
            </div>
          </div>
        </div>

        {/* Grid de Canchas */}
        {filteredCanchas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
            
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? "No se encontraron canchas" : "No hay canchas registradas"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? "No existen canchas que coincidan con tu búsqueda. Intenta con otros términos."
                : "Comienza agregando la primera cancha a tu área deportiva."
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowWizard(true)}
                className="px-8 py-3 bg-gradient-to-r from-black-500 to-gray-900 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Crear Primera Cancha
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Información de resultados */}
            <div className="flex justify-between items-center mb-6">
              
              
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                >
                </button>
              )}
            </div>

            {/* Grid de Canchas */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredCanchas.map((cancha) => (
                <CanchaCard
                  key={cancha.idCancha}
                  cancha={cancha}
                  onEdit={handleEditCancha}
                  isEditing={editingId === cancha.idCancha}
                  editedData={editedData}
                  onChangeField={handleChangeField}
                  onSave={handleSaveCancha}
                  onCancel={() => {
                    setEditingId(null);
                    setEditedData({});
                  }}
                  onDesactivar={handleDesactivarCancha}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Wizard Modal */}
      <WizardCrearCancha
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onCanchaCreada={handleCanchaCreada}
      />

      {/* Modal de edición: se muestra cuando editingId está definido */}
      <ModalEdicionCancha
        isOpen={!!editingId}
        onClose={() => { setEditingId(null); setEditedData({}); }}
        cancha={canchas.find(c => c.idCancha === editingId)}
        onCanchaActualizada={() => {
          // recargar canchas y limpiar estado de edición
          setEditingId(null);
          setEditedData({});
          handleCanchaCreada();
        }}
      />
    </div>
  );
};

export default CanchasPage;