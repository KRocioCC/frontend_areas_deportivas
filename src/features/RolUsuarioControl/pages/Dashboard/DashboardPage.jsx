import React, { useState, useEffect } from 'react';
import { useControlContext } from '../../context/ControlProvider';
import reservaService from '../../services/reservaService';
import CanchaCard from './components/CanchaCard';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const { canchas, loading, error } = useControlContext();
  const [agendaHoy, setAgendaHoy] = useState([]);
  const [stats, setStats] = useState({ totalHoy: 0, pendientes: 0 });

  // Efecto para cargar la agenda global del día
  useEffect(() => {
    const cargarAgendaGlobal = async () => {
      if (canchas.length === 0) return;

      try {
        // Pedimos las reservas de TODAS las canchas en paralelo
        const promesas = canchas.map(c => reservaService.getReservasPorCancha(c.idCancha));
        const resultados = await Promise.all(promesas);

        // Aplanamos el array (array de arrays -> array simple)
        const todasLasReservas = resultados.flat();

        // Filtramos solo las de HOY
        const hoyStr = new Date().toISOString().split('T')[0];
        const reservasHoy = todasLasReservas.filter(r => r.fechaReserva === hoyStr);

        // Ordenamos por hora de inicio
        reservasHoy.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

        setAgendaHoy(reservasHoy);
        
        // Calculamos estadísticas rápidas
        setStats({
            totalHoy: reservasHoy.length,
            pendientes: reservasHoy.filter(r => r.estadoReserva === 'CONFIRMADA' || r.estadoReserva === 'PENDIENTE').length
        });

      } catch (err) {
        console.error("Error cargando agenda global:", err);
      }
    };

    cargarAgendaGlobal();
  }, [canchas]);

  const getEstadoColor = (estado) => {
      // Mapeo simple de colores para la tabla
      const mapa = { 'CONFIRMADA': '#dcfce7', 'PENDIENTE': '#fef9c3', 'COMPLETADA': '#e0f2fe', 'CANCELADA': '#fee2e2' };
      return mapa[estado] || '#f3f4f6';
  };

  if (loading) return <div className="p-5 text-center">Cargando panel...</div>;
  if (error) return <div className="p-5 text-center text-danger">{error}</div>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Panel de Supervisor</h1>
        <span className={styles.dateBadge}>
            📅 {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
      </div>

      {/* 1. BARRA DE ESTADÍSTICAS (Aprovechando el ancho) */}
      <div className={styles.statsContainer}>
          <div className={styles.statCard}>
              <div className={styles.statIcon}><i className="fas fa-basketball-ball"></i></div>
              <div className={styles.statInfo}>
                  <h4>Canchas Asignadas</h4>
                  <p>{canchas.length}</p>
              </div>
          </div>
          <div className={styles.statCard}>
              <div className={styles.statIcon} style={{color:'#F28627', background:'rgba(242, 134, 39, 0.1)'}}><i className="fas fa-calendar-check"></i></div>
              <div className={styles.statInfo}>
                  <h4>Reservas Hoy</h4>
                  <p>{stats.totalHoy}</p>
              </div>
          </div>
          <div className={styles.statCard}>
              <div className={styles.statIcon} style={{color:'#D92332', background:'rgba(217, 35, 50, 0.1)'}}><i className="fas fa-clock"></i></div>
              <div className={styles.statInfo}>
                  <h4>Por Jugar</h4>
                  <p>{stats.pendientes}</p>
              </div>
          </div>
      </div>

      {/* 2. AGENDA GLOBAL (La justificación del Navbar vs Sidebar) */}
      {agendaHoy.length > 0 && (
          <div>
              <h2 className={styles.sectionTitle}>Agenda Global del Día</h2>
              <div className={styles.agendaTableContainer}>
                  <table className={styles.table}>
                      <thead>
                          <tr>
                              <th>Horario</th>
                              <th>Cancha</th>
                              <th>Cliente</th>
                              <th>Estado</th>
                          </tr>
                      </thead>
                      <tbody>
                          {agendaHoy.map((r) => (
                              <tr key={r.idReserva}>
                                  <td className={styles.timeCell}>{r.horaInicio} - {r.horaFin}</td>
                                  <td>
                                      {/* Buscamos el nombre de la cancha en nuestro contexto local */}
                                      <span className={styles.canchaTag}>
                                          {canchas.find(c => c.idCancha === (r.idCancha || r.cancha?.idCancha))?.nombre || 'Cancha'}
                                      </span>
                                  </td>
                                  <td>{r.cliente?.nombre} {r.cliente?.apellidoPaterno}</td>
                                  <td>
                                      <span style={{
                                          backgroundColor: getEstadoColor(r.estadoReserva),
                                          padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight:'bold', color:'#444'
                                      }}>
                                          {r.estadoReserva}
                                      </span>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      )}

      {/* 3. LISTA DE TARJETAS (ACCESO RÁPIDO) */}
      <h2 className={styles.sectionTitle}>Mis Canchas</h2>
      {canchas.length === 0 ? (
        <p>No tienes canchas asignadas.</p>
      ) : (
        <div className={styles.grid}>
          {canchas.map((cancha) => (
            <CanchaCard key={cancha.idCancha} cancha={cancha} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;