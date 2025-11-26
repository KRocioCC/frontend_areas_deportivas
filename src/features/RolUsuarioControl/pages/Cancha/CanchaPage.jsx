import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCanchaInfo } from '../../hooks/useCanchaInfo';
import opinionService from '../../services/opinionService';
import StarRating from '../../components/ui/StarRating';
import styles from './CanchaPage.module.css';

// Componentes de pestañas
import TabReservas from './components/TabReservas';
import TabEquipos from './components/TabEquipos';
import TabOpiniones from './components/TabOpiniones';

import GaleriaGridReadOnly from '../../components/ui/GaleriaGridReadOnly';
// Ajusta el puerto de tu backend
const API_BASE_URL = 'http://localhost:8032';

const CanchaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Ya no necesitamos 'refetch' porque el supervisor no sube fotos
  const { cancha, loading, error } = useCanchaInfo(id);
  
  const [activeTab, setActiveTab] = useState('reservas');
  const [ratingData, setRatingData] = useState({ promedio: 0, total: 0 });

  // Calcular promedio de estrellas
  useEffect(() => {
    const calcularPromedio = async () => {
      if (!id) return;
      try {
        const comentarios = await opinionService.getOpinionesPorCancha(id);
        if (comentarios.length > 0) {
          const suma = comentarios.reduce((acc, curr) => acc + curr.calificacion, 0);
          setRatingData({
            promedio: suma / comentarios.length,
            total: comentarios.length
          });
        }
      } catch (e) {
        console.error("No se pudo calcular el rating", e);
      }
    };
    calcularPromedio();
  }, [id]);

  if (loading) return <div className="p-5 text-center">Cargando...</div>;
  if (error) return <div className="p-5 text-center text-danger">{error}</div>;
  if (!cancha) return null;

  // --- LÓGICA PARA LA IMAGEN DE CABECERA (PORTADA) ---
  let imagenPortadaUrl = null;

  // 1. Verificamos si existen imágenes polimórficas
  if (cancha.imagenes && cancha.imagenes.length > 0) {
      // 2. Ordenamos descendentemente por 'orden' para obtener la última agregada primero.
      // Hacemos una copia con [...cancha.imagenes] para no mutar el estado original.
      const imagenesOrdenadas = [...cancha.imagenes].sort((a, b) => b.orden - a.orden);
      const ultimaImagen = imagenesOrdenadas[0];

      // 3. Construimos la URL completa si es necesario
      if (ultimaImagen && ultimaImagen.urlAcceso) {
          if (ultimaImagen.urlAcceso.startsWith('http')) {
            imagenPortadaUrl = ultimaImagen.urlAcceso;
          } else {
            imagenPortadaUrl = `${API_BASE_URL}${ultimaImagen.urlAcceso}`;
          }
      }
  }
  // NOTA: Si imagenPortadaUrl sigue siendo null, se mostrará la pelotita por defecto.

  return (
    <div className={styles.container}>
      
      {/* --- HERO HEADER --- */}
      <div className={styles.hero}>
        
        <button onClick={() => navigate(-1)} className={styles.btnBack}>
           <i className="fas fa-arrow-left"></i> Volver
        </button>
        
        <div className={styles.imageContainer}>
          {imagenPortadaUrl ? (
            <img 
                src={imagenPortadaUrl} 
                alt={cancha.nombre} 
                className={styles.canchaImg} 
                onError={(e) => {
                    // Si falla la imagen, ocultamos y mostramos el icono
                    e.target.style.display = 'none'; 
                    e.target.parentElement.querySelector('.fallback-icon').style.display = 'block';
                }}
            />
          ) : null}
           {/* Icono de respaldo (pelotita) si no hay imagen o si falla la carga */}
           <span className="fallback-icon" style={{
               color: 'var(--primary)', 
               display: imagenPortadaUrl ? 'none' : 'block', // Ocultar si hay URL inicialmente
               fontSize: '4rem'
            }}>
               ⚽
           </span>
        </div>
        
        <div className={styles.info}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'10px'}}>
             <div>
                <h1 className={styles.title}>{cancha.nombre}</h1>
                <div style={{marginTop: '5px', marginBottom: '10px'}}>
                    <StarRating calificacion={ratingData.promedio} reviewsCount={ratingData.total} />
                </div>
             </div>
             
             <span className={styles.badgeEstado} style={{
                 color: cancha.estado ? 'var(--color-p-11)' : '#aaa',
                 opacity: cancha.estado ? 1 : 0.8
             }}>
                 {cancha.estado ? '● ACTIVA' : '○ INACTIVA'}
             </span>
          </div>

          <div className={styles.badgesContainer}>
            {cancha.disciplinas && cancha.disciplinas.map(d => (
                <span key={d.idDisciplina} className={styles.badgeDisciplina}>
                    {d.nombre}
                </span>
            ))}
          </div>

          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <i className="fas fa-dollar-sign"></i> Costo: <strong>{cancha.costoHora} Bs.</strong> /hr
            </span>
            <span className={styles.metaItem}>
              <i className="fas fa-users"></i> Capacidad: <strong>{cancha.capacidad}</strong> Pers.
            </span>
            <span className={styles.metaItem}>
              <i className="fas fa-layer-group"></i> {cancha.tipoSuperficie}
            </span>
          </div>
        </div>
      </div>

      {/* --- NAVEGACIÓN TABS --- */}
      <div className={styles.tabsContainer}>
         <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'reservas' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('reservas')}
          >
            📅 Agenda
          </button>

          <button 
            className={`${styles.tab} ${activeTab === 'equipos' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('equipos')}
          >
            🏀 Equipos
          </button>
          
          <button 
            className={`${styles.tab} ${activeTab === 'opiniones' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('opiniones')}
          >
            ⭐ Opiniones ({ratingData.total})
          </button>

          <button 
            className={`${styles.tab} ${activeTab === 'galeria' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('galeria')}
          >
            📷 Galería
          </button>
        </div>
      </div>

      {/* --- CONTENIDO --- */}
      <div className={styles.content}>
        
        {activeTab === 'reservas' && <TabReservas canchaId={id} />}
        
        {activeTab === 'equipos' && <TabEquipos canchaId={id} />}
        
        {activeTab === 'opiniones' && <TabOpiniones canchaId={id} />}

        {activeTab === 'galeria' && (
       <div style={{width: '100%', margin: '0 auto'}}>
           <h3 style={{
               fontFamily:'var(--font-Oswald)', 
               marginBottom:'1.5rem', 
               color:'var(--color-p-8)', 
               textTransform:'uppercase', 
               textAlign:'center',
               fontSize: '2rem'
           }}>
               Galería de Fotos
           </h3>

           {/* Nuevo componente de Muro */}
           <GaleriaGridReadOnly 
               entidadTipo="CANCHA" 
               entidadId={id} 
           />
       </div>
    )}

      </div>
    </div>
  );
};

export default CanchaPage;