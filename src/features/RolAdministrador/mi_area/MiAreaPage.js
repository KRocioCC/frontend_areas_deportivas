import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../auth/hooks/useAuth';
import { 
    getAreadeportivaPorAdminId, 
    createAreadeportiva, 
    updateAreadeportiva, 
    agregarImagenesArea 
} from "../../../api/AreadeportivaApi";
import api from "../../../api/api"; 
import { MapPin, Phone, Mail, Clock, Edit3, Upload, X, Save, Image as ImageIcon, Info } from "lucide-react";
import './MiAreaPage.css';

const BASE_URL_IMG = "http://localhost:8032/"; 

const formatTime = (timeString) => timeString ? timeString.substring(0, 5) : '';

// Función auxiliar para obtener URL limpia
const getImgUrl = (img) => {
    if (!img) return null;
    // Si es un objeto (del backend) o una url directa
    const ruta = img.rutaAlmacenamiento || img.url;
    if (!ruta) return null;
    return ruta.startsWith('http') ? ruta : `${BASE_URL_IMG}${ruta}`;
};

export default function MiAreaPage() {
  const { currentUser } = useAuth();

  const [area, setArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [zonas, setZonas] = useState([]);
  
  const [formData, setFormData] = useState({
    nombreArea: '', descripcionArea: '', telefonoArea: '', emailArea: '',
    horaInicioArea: '08:00', horaFinArea: '22:00', 
    idZona: '', 
    latitud: '', longitud: ''
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // --- CARGA INICIAL ---
  useEffect(() => {
    const initData = async () => {
        if (!currentUser?.idPersona) return;
        setLoading(true);
        try {
            const zonasRes = await api.get('/zona');
            setZonas(Array.isArray(zonasRes.data) ? zonasRes.data : []);

            const areaData = await getAreadeportivaPorAdminId(currentUser.idPersona);
            if (areaData) {
                setArea(areaData);
                setFormData({
                    nombreArea: areaData.nombreArea || '',
                    descripcionArea: areaData.descripcionArea || '',
                    telefonoArea: areaData.telefonoArea || '',
                    emailArea: areaData.emailArea || '',
                    horaInicioArea: areaData.horaInicioArea || '08:00',
                    horaFinArea: areaData.horaFinArea || '22:00',
                    idZona: areaData.idZona || '', 
                    latitud: areaData.latitud || '',
                    longitud: areaData.longitud || ''
                });
                setIsEditing(false);
            } else {
                setIsEditing(true); 
            }
        } catch (err) {
            console.warn("Admin nuevo o error:", err);
            setIsEditing(true);
        } finally {
            setLoading(false);
        }
    };
    initData();
  }, [currentUser]);

  // --- HANDLERS ---
  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleZonaChange = (e) => {
      const val = e.target.value ? Number(e.target.value) : '';
      setFormData(prev => ({ ...prev, idZona: val }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index) => {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
      setPreviews(prev => {
          URL.revokeObjectURL(prev[index]); 
          return prev.filter((_, i) => i !== index);
      });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.idZona) return alert("⚠️ Selecciona una Zona.");

    try {
        const payload = {
            ...formData,
            idZona: Number(formData.idZona), 
            latitud: Number(formData.latitud),
            longitud: Number(formData.longitud),
            id: currentUser.idPersona,
            estado: true,
            ...(area?.idAreadeportiva ? { idAreadeportiva: area.idAreadeportiva } : {})
        };

        let areaActualizada;
        if (area?.idAreadeportiva) {
            areaActualizada = await updateAreadeportiva(area.idAreadeportiva, payload);
        } else {
            areaActualizada = await createAreadeportiva(payload);
        }

        if (selectedFiles.length > 0 && areaActualizada?.idAreadeportiva) {
            areaActualizada = await agregarImagenesArea(areaActualizada.idAreadeportiva, selectedFiles);
        }

        alert("¡Cambios guardados!");
        setArea(areaActualizada); 
        setSelectedFiles([]);
        setPreviews([]);
        setIsEditing(false);
        
    } catch (error) {
        console.error("❌ Error:", error);
        alert("Error al guardar.");
    }
  };

  // --- LÓGICA DE PORTADA (Última imagen subida) ---
  // Si hay imágenes, tomamos la última del array (la más reciente)
  const portadaUrl = (area?.imagenes && area.imagenes.length > 0) 
        ? getImgUrl(area.imagenes[area.imagenes.length - 1]) 
        : null;

  if (loading) return <div className="loading-screen"><div className="spinner"></div>Cargando...</div>;

  // --- MODO EDICIÓN ---
  if (isEditing) {
    return (
      <div className="mi-area-container">
        <div className="mi-area-card form-mode">
          <div className="header-flex">
             <h2>{area ? "Editar Mi Espacio" : "Registrar Espacio"}</h2>
             {area && (
                 <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
                    <X size={18}/> Cancelar
                 </button>
             )}
          </div>

          <form onSubmit={handleSave}>
            <div className="form-grid">
                <div className="form-group">
                    <label>Nombre del Establecimiento *</label>
                    <input name="nombreArea" value={formData.nombreArea} onChange={handleChange} required placeholder="Ej: Club Los Pinos" autoComplete="off" />
                </div>
                <div className="form-group">
                    <label>Zona *</label>
                    <select name="idZona" value={formData.idZona} onChange={handleZonaChange} required className={!formData.idZona ? "text-gray-400" : "text-black"}>
                        <option value="">-- Selecciona --</option>
                        {zonas.map(z => <option key={z.idZona} value={z.idZona} className="text-black">{z.nombre}</option>)}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label>Descripción / Slogan</label>
                <textarea name="descripcionArea" rows="4" value={formData.descripcionArea} onChange={handleChange} placeholder="Describe lo mejor de tu cancha..." />
            </div>

            {/* SECCIÓN: FOTOS EXISTENTES (Lo que pediste) */}
            {area?.imagenes && area.imagenes.length > 0 && (
                <div className="existing-photos-section">
                    <label className="label-title">📸 Galería Actual</label>
                    <div className="photos-grid-mini">
                        {area.imagenes.map((img, i) => (
                            <div key={i} className="photo-card">
                                <img src={getImgUrl(img)} alt="existente" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SECCIÓN: SUBIR NUEVAS */}
            <div className="upload-section">
                <label className="upload-box">
                    <Upload size={32} className="text-blue-500"/>
                    <span className="font-semibold">Agregar nuevas fotos</span>
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} hidden />
                </label>
                
                {previews.length > 0 && (
                    <div className="preview-grid">
                        {previews.map((url, i) => (
                            <div key={i} className="preview-item">
                                <img src={url} alt="pre" />
                                <button type="button" onClick={() => removeFile(i)} className="remove-btn"><X size={12}/></button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="form-grid">
                <div className="form-group"><label>Teléfono</label><input name="telefonoArea" value={formData.telefonoArea} onChange={handleChange}/></div>
                <div className="form-group"><label>Email</label><input name="emailArea" value={formData.emailArea} onChange={handleChange}/></div>
                <div className="form-group"><label>Apertura</label><input type="time" name="horaInicioArea" value={formData.horaInicioArea} onChange={handleChange}/></div>
                <div className="form-group"><label>Cierre</label><input type="time" name="horaFinArea" value={formData.horaFinArea} onChange={handleChange}/></div>
                <div className="form-group"><label>Latitud</label><input type="number" step="any" name="latitud" value={formData.latitud} onChange={handleChange}/></div>
                <div className="form-group"><label>Longitud</label><input type="number" step="any" name="longitud" value={formData.longitud} onChange={handleChange}/></div>
            </div>

            <div className="form-actions">
                <button type="submit" className="btn-primary"><Save size={18}/> Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- MODO VISUALIZACIÓN ---
  return (
    <div className="mi-area-container">
        <div className="area-header">
            {/* PORTADA: Muestra la ÚLTIMA imagen subida */}
            {portadaUrl ? (
                <img 
                    src={portadaUrl} 
                    alt="Portada" 
                    className="cover-img"
                    onError={(e) => e.target.style.display = 'none'}
                />
            ) : (
                <div className="cover-placeholder">
                    <ImageIcon size={48} />
                    <p>Sin foto de portada</p>
                </div>
            )}
            <div className="area-title-card">
                <h1>{area?.nombreArea}</h1>
                <span className="badge-zona">{area?.zona?.nombre || "Zona no asignada"}</span>
            </div>
            <button className="edit-fab" onClick={() => setIsEditing(true)} title="Editar">
                <Edit3 size={24} />
            </button>
        </div>

        <div className="area-content">
            <div className="info-grid">
                <div className="info-card">
                    <Clock className="icon" />
                    <div><h4>Horario</h4><p>{formatTime(area?.horaInicioArea)} - {formatTime(area?.horaFinArea)}</p></div>
                </div>
                <div className="info-card">
                    <Phone className="icon" />
                    <div><h4>Contacto</h4><p>{area?.telefonoArea || "--"}</p></div>
                </div>
                <div className="info-card">
                    <MapPin className="icon" />
                    <div><h4>Ubicación</h4><p>Lat: {area?.latitud}, Lon: {area?.longitud}</p></div>
                </div>
            </div>

            {/* DESCRIPCIÓN MEJORADA */}
            <div className="description-section">
                <div className="desc-header">
                    <Info size={20} className="text-blue-600"/>
                    <h3>Sobre nosotros</h3>
                </div>
                <div className="desc-body">
                    <p>{area?.descripcionArea || "Añade una descripción para atraer a más clientes."}</p>
                </div>
            </div>

            {/* GALERÍA */}
            {area?.imagenes && area.imagenes.length > 0 && (
                <div className="gallery-section">
                    <h3>Galería de Fotos</h3>
                    <div className="gallery-grid">
                        {area.imagenes.map((img, i) => (
                            <div key={i} className="gallery-item">
                                <img src={getImgUrl(img)} alt={`Foto ${i}`} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}