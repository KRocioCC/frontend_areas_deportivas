import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../auth/hooks/useAuth'; 
import canchaService from '../services/canchaService';
import toast from 'react-hot-toast'; // <--- IMPORTAR TOAST

export const useMisCanchas = () => {
    const fullAuthContext = useAuth(); 
    const [canchas, setCanchas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCanchas = useCallback(async () => {
        setLoading(true);
        
        let userId = null;
        if (fullAuthContext?.auth?.user?.id) userId = fullAuthContext.auth.user.id;
        else if (fullAuthContext?.auth?.id) userId = fullAuthContext.auth.id;
        else if (fullAuthContext?.currentUser?.id) userId = fullAuthContext.currentUser.id;

        if (!userId) {
            setLoading(false);
            return; 
        }

        try {
            const data = await canchaService.getMisCanchasSupervisadas(userId);
            setCanchas(data);
            // Opcional: toast.success('Canchas cargadas correctamente');
        } catch (err) {
            console.error("❌ [useMisCanchas] Error:", err);
            const msg = err.response?.data?.message || 'Error al cargar tus canchas.';
            setError(msg);
            
            // 🔥 AQUÍ DISPARAMOS LA ALERTA VISUAL
            // Si es 401/403 es un error de permisos
            if (err.response?.status === 401 || err.response?.status === 403) {
                toast.error(`No tienes permiso para ver estas canchas (${err.response.status})`);
            } else {
                toast.error(msg);
            }
        } finally {
            setLoading(false);
        }
    }, [fullAuthContext]);

    useEffect(() => {
        fetchCanchas();
    }, [fetchCanchas]);

    return { canchas, loading, error, refetch: fetchCanchas };
};