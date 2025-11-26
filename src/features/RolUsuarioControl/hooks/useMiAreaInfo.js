import { useMisCanchas } from './useMisCanchas';

export const useMiAreaInfo = () => {
    // 1. Reutilizamos el hook que ya trae las canchas y sus relaciones
    // (Recordemos que el backend ya incluye el objeto 'areaDeportiva' dentro de cada cancha)
    const { canchas, loading, error, refetch } = useMisCanchas();

    // 2. Lógica de extracción:
    // Asumimos que el supervisor trabaja en un solo complejo a la vez.
    // Tomamos el área de la primera cancha que encontremos.
    const areaDeportiva = (canchas && canchas.length > 0) 
        ? canchas[0].areaDeportiva 
        : null;

    return { 
        areaDeportiva, 
        loading, 
        error,
        refetch 
    };
};