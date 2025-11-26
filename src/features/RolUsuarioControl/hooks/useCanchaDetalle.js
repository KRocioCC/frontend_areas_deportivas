import { useState, useEffect } from 'react';
import { canchaService } from '../services/canchaService';

export const useCanchaDetalle = (idCancha) => {
  const [cancha, setCancha] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idCancha) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Ejecutamos ambas peticiones en paralelo usando Promise.all
        const [canchaData, reservasData] = await Promise.all([
          canchaService.getCanchaPorId(idCancha),
          canchaService.getReservasPorCancha(idCancha)
        ]);

        setCancha(canchaData);
        setReservas(reservasData);
      } catch (err) {
        setError(err.message || "Error al cargar los datos de la cancha");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idCancha]);

  return { cancha, reservas, loading, error };
};