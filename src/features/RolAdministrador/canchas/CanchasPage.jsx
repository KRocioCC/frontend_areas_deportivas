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
  const [wizardStep, setWizardStep] = useState(1);
  const [createdCanchaId, setCreatedCanchaId] = useState(null);
  const [imagenes, setImagenes] = useState([]);

  const [newCancha, setNewCancha] = useState({
    nombre: "",
    costoHora: 50,
    capacidad: 25,
    mantenimiento: "mensual",
    horaInicio: "07:00",
    horaFin: "22:00",
    tipoSuperficie: "césped natural",
    tamano: "40x60",
    iluminacion: "halógena",
    cubierta: "abierta",
    urlImagen: "",
    estado: true,
  });

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
        c.idCancha === editingId ? editedData : c
      );
      setCanchas(updatedList);
      setFilteredCanchas(updatedList);
      setEditingId(null);
      setEditedData({});
    } catch (error) {
      console.error("Error al actualizar cancha:", error);
    }
  };

  const handleDesactivarCancha = async (idCancha) => {
    try {
      await deleteCancha(idCancha);
      const actualizadas = canchas.map((c) =>
        c.idCancha === idCancha ? { ...c, estado: false } : c
      );
      setCanchas(actualizadas);
      setFilteredCanchas(actualizadas);
    } catch (error) {
      console.error("Error al desactivar cancha:", error);
    }
  };

  // Paso 1: Crear cancha
  const handleCrearCancha = async () => {
    if (!idArea) return;
    const payload = { ...newCancha, idAreadeportiva: idArea };

    try {
      const creada = await createCancha(payload);
      setCanchas((prev) => [...prev, creada]);
      setFilteredCanchas((prev) => [...prev, creada]);
      setCreatedCanchaId(creada.idCancha);
      alert("✅ Cancha creada con éxito");
      setWizardStep(2); // avanzar al paso 2
    } catch (error) {
      console.error("Error al crear cancha:", error);
    }
  };

  // Paso 2: Subir imágenes
  const handleUploadImages = async () => {
    try {
      const res = await agregarImagenesCancha(createdCanchaId, imagenes);
      alert("✅ Imágenes subidas correctamente");
      console.log(res.imagenes);
      setShowWizard(false);
      setWizardStep(1);
      setCreatedCanchaId(null);
      setImagenes([]);
    } catch (error) {
      console.error("Error al subir imágenes:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Cargando canchas…</p>;
  if (err) return <p className="text-center text-red-600">{err}</p>;

  return (
    <div
      className="w-full px-6 py-8"
      style={{
        backgroundImage: `url('/Fondos/Deporte11.png')`,
      }}
    >
      {/* Buscador centrado */}
      <div className="max-w-5xl mx-auto flex items-center gap-4">
        <BuscadorCanchas
          zona={searchTerm}
          disciplina=""
          onZonaChange={(e) => setSearchTerm(e.target.value)}
          onDisciplinaChange={() => {}}
          onBuscar={handleSearch}
        />
        <button
          onClick={() => setShowWizard(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition font-semibold text-sm"
        >
          Crear cancha
        </button>
        <button
          onClick={handleClearSearch}
          className="px-4 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-500 transition font-semibold text-sm"
        >
          Limpiar
        </button>
      </div>

      {/* Wizard de creación */}
      {showWizard && (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          {wizardStep === 1 && (
            <>
              <h2 className="text-lg font-bold mb-4 text-gray-800">Paso 1: Datos de la cancha</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(newCancha).map(([key, value]) =>
                  key !== "estado" ? (
                    <input
                      key={key}
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setNewCancha((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      placeholder={key}
                      className="border px-3 py-2 rounded text-sm"
                    />
                  ) : null
                )}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowWizard(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCrearCancha}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Guardar cancha
                </button>
              </div>
            </>
              )}
                    {wizardStep === 2 && (
            <>
              <h2 className="text-lg font-bold mb-4 text-gray-800">Paso 2: Subir imágenes</h2>
              <input
                type="file"
                multiple
                onChange={(e) => setImagenes(Array.from(e.target.files))}
                className="border px-3 py-2 rounded text-sm w-full"
              />
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowWizard(false);
                    setWizardStep(1);
                    setCreatedCanchaId(null);
                    setImagenes([]);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUploadImages}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Subir imágenes
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Separador visual */}
      <hr className="my-10 border-gray-300" />

      {/* Grid fijo en 3 columnas */}
      {filteredCanchas.length === 0 ? (
        <p className="text-center text-gray-600">
          {searchTerm
            ? "No se encontraron canchas que coincidan con la búsqueda."
            : "No hay canchas registradas para esta área."}
        </p>
      ) : (
        <div className="max-w-[1400px] mx-auto px-4">
          <section className="grid grid-cols-3 gap-12">
            {filteredCanchas.map((cancha) => (
              <CanchaCard
                key={cancha.idCancha}
                cancha={cancha}
                onEdit={handleEditCancha}
                isEditing={editingId === cancha.idCancha}
                editedData={editedData}
                onChangeField={handleChangeField}
                onSave={handleSaveCancha}
                onCancel={() => setEditingId(null)}
                onDesactivar={handleDesactivarCancha}
              />
            ))}
          </section>
        </div>
      )}
    </div>
  );
};

export default CanchasPage;
