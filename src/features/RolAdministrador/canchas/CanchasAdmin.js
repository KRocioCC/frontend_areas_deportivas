// src/features/personas/RolAdministrador/canchas/CanchasAdmin.js
import React, { useEffect, useState } from 'react';
import { getAreadeportivaPorAdminId } from '../../../api/AreadeportivaApi';
import { getCanchasPorArea, updateCancha, createCancha } from '../../../api/CanchaApi';
import { useAuth } from '../../../auth/hooks/useAuth';
import SearchBar from '../../../components/ui/SearchInput';
import CanchaCard from './CanchaCard';
import './CanchasAdmin.css';

const CanchasAdmin = () => {
  const { currentUser } = useAuth();
  const [canchas, setCanchas] = useState([]);
  const [filteredCanchas, setFilteredCanchas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idArea, setIdArea] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    console.log("🔐 currentUser:", currentUser);
    console.log("🔐 JWT token:", localStorage.getItem('token'));

    const fetchAreaYcanchas = async () => {
      try {
        console.log(" Solicitando área deportiva del admin:", currentUser.idPersona);
        const area = await getAreadeportivaPorAdminId(currentUser.idPersona);
        console.log("Área deportiva recibida:", area);

        const id = area?.idAreadeportiva;
        if (!id) {
          console.warn(" idAreadeportiva no encontrado en el DTO.");
          setLoading(false);
          return;
        }

        setIdArea(id);
        console.log(" idArea asignado:", id);

        console.log(" Solicitando canchas del área:", id);
        const canchasData = await getCanchasPorArea(id);
        console.log("Canchas recibidas:", canchasData);

        setCanchas(canchasData);
        setFilteredCanchas(canchasData);
      } catch (error) {
        console.error(" Error al obtener área o canchas:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.idPersona) {
      fetchAreaYcanchas();
    } else {
      console.warn(" currentUser.idPersona no disponible.");
      setLoading(false);
    }
  }, [currentUser]);

  const handleSearch = () => {
    console.log(" Buscando:", searchTerm);
    if (!searchTerm.trim()) {
      setFilteredCanchas(canchas);
      return;
    }

    const filtered = canchas.filter(cancha =>
      cancha.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cancha.tipoSuperficie?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cancha.cubierta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cancha.areaDeportiva?.zona?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(" Resultados filtrados:", filtered);
    setFilteredCanchas(filtered);
  };

  const handleClearSearch = () => {
    console.log(" Limpiando búsqueda");
    setSearchTerm('');
    setFilteredCanchas(canchas);
  };

  const handleEditCancha = (canchaId) => {
    console.log(" Editando cancha:", canchaId);
    setEditingId(canchaId);
    const canchaOriginal = canchas.find(c => c.idCancha === canchaId);
    console.log(" Datos originales:", canchaOriginal);
    setEditedData({ ...canchaOriginal });
  };

  const handleChangeField = (field, value) => {
    console.log(`Campo editado: ${field} = ${value}`);
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveCancha = async () => {
    console.log("Guardando cancha:", editingId);
    console.log("Payload:", editedData);
    try {
      await updateCancha(editingId, editedData);
      const updatedList = canchas.map(c =>
        c.idCancha === editingId ? editedData : c
      );
      console.log("Cancha actualizada");
      setCanchas(updatedList);
      setFilteredCanchas(updatedList);
      setEditingId(null);
      setEditedData({});
    } catch (error) {
      console.error(" Error al actualizar cancha:", error);
    }
  };

  const handleCrearCancha = async () => {
    if (!idArea) {
      console.warn(" No hay idArea disponible para crear cancha");
      return;
    }

    const nuevaCancha = {
      nombre: 'Nueva cancha',
      costoHora: 1,
      capacidad: 1,
      estado: true,
      mantenimiento: 'mensual',
      horaInicio: '08:00',
      horaFin: '18:00',
      tipoSuperficie: 'sin definir',
      tamano: '0x0',
      iluminacion: 'sin definir',
      cubierta: 'sin definir',
      urlImagen: '',
      idAreadeportiva: idArea
    };

    console.log(" Creando nueva cancha con payload:", nuevaCancha);

    try {
      const creada = await createCancha(nuevaCancha);
      console.log(" Cancha creada:", creada);
      setCanchas(prev => [...prev, creada]);
      setFilteredCanchas(prev => [...prev, creada]);
      setEditingId(creada.idCancha);
      setEditedData({ ...creada });
    } catch (error) {
      console.error(" Error al crear cancha:", error);
    }
  };

  if (loading) return <div className="cancha-loading">Cargando canchas...</div>;

  return (
    <div className="canchas-container">
      <div className="search-container">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Buscar por nombre, superficie, cubierta o zona..."
          size="md"
        />
        <button className="btn-crear" onClick={handleCrearCancha}>
          Crear cancha
        </button>
      </div>

      {filteredCanchas.length === 0 ? (
        <div className="cancha-empty">
          {searchTerm ? 'No se encontraron canchas que coincidan con la búsqueda.' : 'No hay canchas registradas para esta área.'}
        </div>
      ) : (
        <div className="canchas-grid">
          {filteredCanchas.map((cancha) => (
            <CanchaCard 
              key={cancha.idCancha} 
              cancha={cancha}
              onEdit={handleEditCancha}
              isEditing={editingId === cancha.idCancha}
              editedData={editedData}
              onChangeField={handleChangeField}
              onSave={handleSaveCancha}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CanchasAdmin;
