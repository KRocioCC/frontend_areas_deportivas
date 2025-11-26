import React, { useState, useEffect } from 'react';
import { useMiAreaInfo } from '../../hooks/useMiAreaInfo';
import imagenService from '../../services/imagenService';
import AreaBackgroundCarousel from './components/AreaBackgroundCarousel';
import styles from './MiAreaPage.module.css';
import MapaUbicacion from './components/MapaUbicacion';


const MiAreaPage = () => {
  const { areaDeportiva, loading, error } = useMiAreaInfo();
  const [imagenesArea, setImagenesArea] = useState([]);

  // Cargar imágenes de la galería polimórfica
  useEffect(() => {
    const cargarImagenes = async () => {
      if (!areaDeportiva?.idAreadeportiva) return;
      try {
        const data = await imagenService.getImagenes('AREADEPORTIVA', areaDeportiva.idAreadeportiva);
        setImagenesArea(data.sort((a, b) => a.orden - b.orden));
      } catch (error) {
        console.error(error);
      }
    };
    cargarImagenes();
  }, [areaDeportiva]);

  if (loading) return <div className="p-5 text-center">Cargando...</div>;
  if (!areaDeportiva) return <div className="p-5 text-center">Sin asignación.</div>;

  // --- LÓGICA DE IMAGEN HÍBRIDA ---
  // Si hay fotos en galería, usamos esas.
  // Si NO hay, pero el área tiene una urlImagen antigua, creamos un objeto falso para que el carrusel la use.
  let imagesForCarousel = imagenesArea;
  if (imagenesArea.length === 0 && areaDeportiva.urlImagen) {
      imagesForCarousel = [{ 
          idImagen: 999, 
          urlAcceso: areaDeportiva.urlImagen // Pasamos la URL directa
      }];
  }

  return (
    <div className={styles.container}>
      
      {/* HERO */}
      <div className={styles.hero}>
        <AreaBackgroundCarousel images={imagesForCarousel} />
        
        <div className={styles.heroContent}>
            {/* Título dinámico */}
            <h1 className={styles.title}>{areaDeportiva.nombreArea}</h1>
            <span className={styles.subtitle}>COMPLEJO DEPORTIVO</span>
        </div>
      </div>

      {/* CONTENIDO GRID - (Sin el div mainSection que rompía todo) */}
      <div className={styles.content}>
        
        {/* COLUMNA IZQUIERDA (Grande) */}
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <i className={`fas fa-info-circle ${styles.cardIcon}`}></i>
                <h3 className={styles.cardTitle}>Sobre Nosotros</h3>
            </div>
            
            <p className={styles.description}>
                {areaDeportiva.descripcionArea || "Bienvenido a nuestras instalaciones deportivas."}
            </p>
            
            <div style={{marginTop: '2.5rem'}}>
                <h4 style={{fontFamily: 'var(--font-Oswald)', color:'var(--color-p-8)', marginBottom:'10px'}}>
                    <i className="fas fa-map-marked-alt" style={{marginRight:'8px'}}></i> 
                    UBICACIÓN
                </h4>
                
                <div style={{marginTop: '10px'}}>
    <MapaUbicacion 
        lat={areaDeportiva.latitud} 
        lng={areaDeportiva.longitud} 
        nombre={areaDeportiva.nombreArea} 
    />
</div>
            </div>
        </div>

        {/* COLUMNA DERECHA (Pequeña) */}
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <i className={`fas fa-clock ${styles.cardIcon}`}></i>
                <h3 className={styles.cardTitle}>Atención</h3>
            </div>
            
            <div className={styles.infoList}>
                <div className={styles.infoItem}>
                    <div className={styles.iconBox}><i className="fas fa-clock"></i></div>
                    <div className={styles.infoData}>
                        <h4>Horario</h4>
                        <p>{areaDeportiva.horaInicioArea?.substring(0,5)} - {areaDeportiva.horaFinArea?.substring(0,5)}</p>
                    </div>
                </div>

                <div className={styles.infoItem}>
                    <div className={styles.iconBox}><i className="fas fa-envelope"></i></div>
                    <div className={styles.infoData}>
                        <h4>Email</h4>
                        <p style={{fontSize:'0.9rem'}}>{areaDeportiva.emailArea}</p>
                    </div>
                </div>

                <div className={styles.infoItem}>
                    <div className={styles.iconBox}><i className="fas fa-phone-alt"></i></div>
                    <div className={styles.infoData}>
                        <h4>Teléfono</h4>
                        <p>{areaDeportiva.telefonoArea}</p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default MiAreaPage;