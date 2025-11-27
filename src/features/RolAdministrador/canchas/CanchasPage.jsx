import React, { useEffect, useState } from "react";
import { getAreadeportivaPorAdminId } from "../../../api/AreadeportivaApi";
import {
  getCanchasPorArea,
  updateCancha,
  deleteCancha,
} from "../../../api/CanchaApi";
import { useAuth } from "../../../auth/hooks/useAuth";
// import BuscadorCanchas from "./components/components_cancha/BuscadorCanchas";
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
  const [sinAreaDeportiva, setSinAreaDeportiva] = useState(false);

  // Wizard states
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    const fetchAreaYcanchas = async () => {
      try {
        const area = await getAreadeportivaPorAdminId(currentUser.idPersona);
        const id = area?.idAreadeportiva;
        if (!id) {
          // No tiene área deportiva: mostrar mensaje amigable y evitar error
          setSinAreaDeportiva(true);
          setLoading(false);
          return;
        }
        setIdArea(id);

        const canchasData = await getCanchasPorArea(id);
        setCanchas(canchasData);
        setFilteredCanchas(canchasData);
      } catch (error) {
        console.error("Error al obtener área o canchas:", error);
        // Si la API devuelve 404 para el área, tratar como sin área deportiva
        if (error?.response?.status === 404) {
          setSinAreaDeportiva(true);
          setErr(null);
        } else {
          setErr("No se pudo cargar las canchas.");
        }
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-p-4)] to-[var(--color-p-5)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg" style={{fontFamily: "var(--font-Balo)"}}>Cargando canchas...</p>
        </div>
      </div>
    );
  }

  // Mensaje amigable cuando no existe área deportiva aún
  if (sinAreaDeportiva) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-p-4)] via-white to-[var(--color-p-5)]">
        <div 
          className="relative bg-cover bg-center bg-no-repeat py-20 px-4 md:px-8 overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url('/Fondos/Deporte11.png')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          <div className="max-w-5xl mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4" style={{fontFamily: "var(--font-Oswald)"}}>
              Primero crea tu <span className="text-[var(--color-secondary)]">Área Deportiva</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto" style={{fontFamily: "var(--font-Balo)"}}>
              Para gestionar las canchas necesitas configurar tu área deportiva. Dirígete a <strong>Mi Área</strong> y completa la información.
            </p>
          </div>
        </div>

        <div className="w-full mx-auto px-4 md:px-12 py-12">
          <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 p-10 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">🏟️</span>
            </div>
            <p className="text-gray-700 mb-6" style={{fontFamily: "var(--font-Balo)"}}>
              Ve a <strong>Mi Área</strong> para crear tu área deportiva; luego vuelve aquí para añadir tus canchas.
            </p>
            <button
              onClick={() => { window.location.href = '/admin/mi_area'; }}
              className="px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold shadow-lg"
              style={{fontFamily: "var(--font-josefin)"}}
            >
              Ir a Mi Área
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-p-4)] to-[var(--color-p-5)]">
        <div className="text-center">
          <div className="w-16 h-16 bg-[var(--color-danger)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-[var(--color-danger)] text-lg font-semibold" style={{fontFamily: "var(--font-Balo)"}}>{err}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-semibold"
            style={{fontFamily: "var(--font-josefin)"}}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-p-4)] via-white to-[var(--color-p-5)]">
      {/* Header con fondo de imagen */}
      <div 
        className="relative bg-cover bg-center bg-no-repeat py-24 px-4 md:px-8 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/Fondos/Deporte11.png')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Fondo sutil con formas deportivas */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-[var(--color-secondary)] blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full bg-[var(--color-accent)] blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] 
                          rotate-45 bg-[var(--color-secondary)]/10 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 
            className="text-5xl md:text-8xl font-black tracking-tighter mb-6"
            style={{fontFamily: "var(--font-Oswald)"}}
          >
            <span className="text-white">GESTIÓN DE</span>{" "}
            <span className="text-[var(--color-secondary)]">CANCHAS</span>
          </h1>
          <p 
            className="text-xl md:text-2xl opacity-90 text-gray-200 max-w-4xl mx-auto"
            style={{fontFamily: "var(--font-Alumni)"}}
          >
            Administra las canchas de tu área deportiva
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="w-full mx-auto px-4 md:px-12 py-16 -mt-8 relative z-10">
        {/* Panel de Búsqueda y Acciones */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            <div className="flex-1 w-full">
              {/* Búsqueda con diseño moderno */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                  placeholder="Buscar por nombre, superficie, zona..."
                  className="w-full pl-6 pr-32 py-4 border border-gray-300 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-[var(--color-secondary)]/20 bg-white/90 backdrop-blur-sm transition-all duration-300"
                  style={{fontFamily: "var(--font-Balo)"}}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 hover:shadow-xl transition-all duration-300 font-semibold text-sm"
                  style={{fontFamily: "var(--font-josefin)"}}
                >
                  Buscar
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                id="btn-crear-cancha"
                onClick={handleClearSearch}
                className="px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center border border-gray-600"
                style={{fontFamily: "var(--font-josefin)"}}
              >
                Limpiar 
              </button>
              
              <button
                id="btn-abrir-wizard-crear-cancha"
                onClick={() => setShowWizard(true)}
                className="px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center border border-gray-700"
                style={{fontFamily: "var(--font-josefin)"}}
              >
                Crear Cancha
              </button>
            </div>
          </div>

          {/* Estadísticas con diseño moderno */}
          <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-gray-300/50">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-4 h-4 bg-[var(--color-secondary)] rounded-full shadow-lg"></div>
              <span className="font-semibold text-gray-700" style={{fontFamily: "var(--font-Balo)"}}>
                Total: <strong className="text-[var(--color-p-10)]">{canchas.length}</strong> canchas
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
              <span className="font-semibold text-gray-700" style={{fontFamily: "var(--font-Balo)"}}>
                Activas: <strong className="text-green-600">{canchas.filter(c => c.estado).length}</strong>
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-4 h-4 bg-[var(--color-danger)] rounded-full shadow-lg"></div>
              <span className="font-semibold text-gray-700" style={{fontFamily: "var(--font-Balo)"}}>
                Inactivas: <strong className="text-[var(--color-danger)]">{canchas.filter(c => !c.estado).length}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Grid de Canchas */}
        {filteredCanchas.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20">
            
            <h3 className="text-2xl font-bold text-gray-800 mb-4" style={{fontFamily: "var(--font-Alumni)"}}>
              {searchTerm ? "No se encontraron canchas" : "No hay canchas registradas"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg" style={{fontFamily: "var(--font-Balo)"}}>
              {searchTerm 
                ? "No existen canchas que coincidan con tu búsqueda. Intenta con otros términos."
                : "Comienza agregando la primera cancha a tu área deportiva."
              }
            </p>
            {!searchTerm && (
              <button
                id="cta-primer-cancha"
                onClick={() => setShowWizard(true)}
                className="px-10 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
                style={{fontFamily: "var(--font-josefin)"}}
              >
                Crea tu Primer Cancha
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* Información de resultados */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800" style={{fontFamily: "var(--font-Alumni)"}}>
                {searchTerm ? `Resultados (${filteredCanchas.length})` : 'Todas las Canchas'}
              </h2>
              
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all duration-300 font-semibold text-sm"
                  style={{fontFamily: "var(--font-josefin)"}}
                >
                  Ver Todas
                </button>
              )}
            </div>

            {/* Grid de Canchas con diseño inspirado */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12">
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

      {/* Modal de edición */}
      <ModalEdicionCancha
        isOpen={!!editingId}
        onClose={() => { setEditingId(null); setEditedData({}); }}
        cancha={canchas.find(c => c.idCancha === editingId)}
        onCanchaActualizada={() => {
          setEditingId(null);
          setEditedData({});
          handleCanchaCreada();
        }}
      />
    </div>
  );
};

export default CanchasPage;