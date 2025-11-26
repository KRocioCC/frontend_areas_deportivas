import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMisCanchas } from '../hooks/useMisCanchas';

const ControlContext = createContext();

export const ControlProvider = ({ children }) => {
    // 1. Usamos el hook que acabamos de crear para traer la data
    const { canchas, loading, error, refetch } = useMisCanchas();
    
    // 2. Estado para saber qué cancha está seleccionada actualmente en el Dashboard
    const [canchaSeleccionada, setCanchaSeleccionada] = useState(null);

    // 3. Efecto inteligente: Si cargan las canchas y no hay ninguna seleccionada,
    // autoseleccionamos la primera por defecto para agilizar la UX.
    useEffect(() => {
        if (!loading && canchas.length > 0 && !canchaSeleccionada) {
            setCanchaSeleccionada(canchas[0]);
        }
    }, [canchas, loading, canchaSeleccionada]);

    // 4. Función para cambiar de cancha manualmente (usada en el Navbar o Selector)
    const cambiarCancha = (idCancha) => {
        const encontrada = canchas.find(c => c.idCancha === idCancha);
        if (encontrada) setCanchaSeleccionada(encontrada);
    };

    const value = {
        canchas,
        canchaSeleccionada, // La joya de la corona: accesible por cualquier componente hijo
        cambiarCancha,
        loading,
        error,
        refetch
    };

    return (
        <ControlContext.Provider value={value}>
            {children}
        </ControlContext.Provider>
    );
};

// Hook personalizado para consumir este contexto fácilmente
export const useControlContext = () => {
    const context = useContext(ControlContext);
    if (!context) {
        throw new Error('useControlContext debe usarse dentro de un ControlProvider');
    }
    return context;
};