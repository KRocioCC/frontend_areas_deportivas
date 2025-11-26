import { useState, useEffect, useCallback } from 'react';
import canchaService from '../services/canchaService';
import toast from 'react-hot-toast';

export const useCanchaInfo = (idCancha) => {
    const [cancha, setCancha] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInfo = useCallback(async () => {
        if (!idCancha) return;
        
        setLoading(true);
        try {
            const data = await canchaService.getCanchaDetalle(idCancha);
            setCancha(data);
        } catch (err) {
            console.error(err);
            setError("No se pudo cargar la información de la cancha");
            toast.error("Error al cargar detalles de la cancha");
        } finally {
            setLoading(false);
        }
    }, [idCancha]);

    useEffect(() => {
        fetchInfo();
    }, [fetchInfo]);

    return { cancha, loading, error, refetch: fetchInfo };
};