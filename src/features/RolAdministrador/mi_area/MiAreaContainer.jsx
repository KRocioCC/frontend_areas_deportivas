import React, { useState, useEffect } from 'react';
import { getAreadeportivaPorAdminId } from '../../../api/AreadeportivaApi';
import { useAuth } from '../../../auth/hooks/useAuth';
import MiAreaPage from './MiAreaPage';
import CreateMiAreaPage from './CreateMiAreaPage';

export default function MiAreaContainer() {
    const { currentUser } = useAuth();
    const [areaDeportiva, setAreaDeportiva] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    console.log("🔍 [MiAreaContainer] INICIADO - currentUser.idPersona:", currentUser?.idPersona);

    // Verificar si el administrador tiene área deportiva
    useEffect(() => {
        console.log("🔄 [MiAreaContainer] useEffect EJECUTADO");
        
        const verificarAreaDeportiva = async () => {
            console.log("🚀 [MiAreaContainer] verificarAreaDeportiva INICIADA");
            
            if (!currentUser?.idPersona) {
                console.log("❌ [MiAreaContainer] NO hay currentUser.idPersona - ABORTANDO");
                return;
            }
            
            try {
                setLoading(true);
                console.log("📞 [MiAreaContainer] Llamando a getAreadeportivaPorAdminId con ID:", currentUser.idPersona);
                
                const area = await getAreadeportivaPorAdminId(currentUser.idPersona);
                console.log("✅ [MiAreaContainer] RESPUESTA de API:", area);
                
                if (area && area.idAreadeportiva) {
                    console.log("🎯 [MiAreaContainer] Área ENCONTRADA - ID:", area.idAreadeportiva);
                    setAreaDeportiva(area);
                    setShowCreate(false);
                } else {
                    console.log("❌ [MiAreaContainer] NO se encontró área deportiva");
                    setAreaDeportiva(null);
                    setShowCreate(true);
                    // Preparar tour para nuevo admin sin área
                    try {
                        const tourRaw = localStorage.getItem('adminTourStatus');
                        const tourObj = tourRaw ? JSON.parse(tourRaw) : null;
                        if (!tourObj || tourObj.done || tourObj.stage !== 'start') {
                            localStorage.setItem('adminTourStatus', JSON.stringify({ done: false, stage: 'start', ts: Date.now() }));
                        }
                        window.dispatchEvent(new Event('adminTourForceCheck'));
                    } catch { /* noop */ }
                }
            } catch (error) {
                console.error("💥 [MiAreaContainer] ERROR en verificarAreaDeportiva:", error);
                console.log("💥 [MiAreaContainer] Error status:", error.response?.status);
                
                // Si hay error 404 o cualquier otro, mostrar creación
                if (error.response?.status === 404) {
                    console.log("🔍 [MiAreaContainer] Error 404 - Mostrando creación");
                    setAreaDeportiva(null);
                    setShowCreate(true);
                    // Forzar inicio del tour para admins sin área
                    try {
                        localStorage.setItem('adminTourStatus', JSON.stringify({ done: false, stage: 'start', ts: Date.now() }));
                        window.dispatchEvent(new Event('adminTourForceCheck'));
                    } catch { /* noop */ }
                } else {
                    console.log("🔍 [MiAreaContainer] Otro error - Mostrando creación también");
                    setAreaDeportiva(null);
                    setShowCreate(true);
                    try {
                        const tourRaw = localStorage.getItem('adminTourStatus');
                        const tourObj = tourRaw ? JSON.parse(tourRaw) : null;
                        if (!tourObj) {
                            localStorage.setItem('adminTourStatus', JSON.stringify({ done: false, stage: 'start', ts: Date.now() }));
                        }
                        window.dispatchEvent(new Event('adminTourForceCheck'));
                    } catch { /* noop */ }
                }
            } finally {
                setLoading(false);
                console.log("🏁 [MiAreaContainer] FINALIZADO - showCreate:", showCreate);
            }
        };

        verificarAreaDeportiva();
        // showCreate solo se usa para logging al final; evitar re-fetch infinito
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    const handleAreaCreada = () => {
        console.log("🎉 [MiAreaContainer] handleAreaCreada EJECUTADA");
        setShowCreate(false);
        // Recargar los datos del área
        if (currentUser?.idPersona) {
            console.log("🔄 [MiAreaContainer] Recargando datos después de crear área...");
            getAreadeportivaPorAdminId(currentUser.idPersona)
                .then(areaData => {
                    console.log("✅ [MiAreaContainer] Datos recargados:", areaData);
                    if (areaData && areaData.idAreadeportiva) {
                        setAreaDeportiva(areaData);
                    }
                })
                .catch(error => {
                    console.error("❌ [MiAreaContainer] Error al recargar área:", error);
                });
        }
    };

    console.log("📊 [MiAreaContainer] RENDER - Estado:", {
        loading,
        showCreate, 
        areaDeportiva: areaDeportiva ? `Sí (ID: ${areaDeportiva.idAreadeportiva})` : 'No'
    });

    if (loading) {
        console.log("⏳ [MiAreaContainer] Mostrando LOADING...");
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando información del área deportiva...</p>
                    <p className="text-sm text-gray-500 mt-2">User ID: {currentUser?.idPersona}</p>
                </div>
            </div>
        );
    }

    // PRIMERO verificar si debe mostrar el formulario de creación
    if (showCreate) {
        console.log("📝 [MiAreaContainer] Mostrando CREATE FORM");
        return <CreateMiAreaPage onAreaCreada={handleAreaCreada} />;
    }

    // LUEGO verificar si tiene área para mostrar
    if (areaDeportiva) {
        console.log("🏟️ [MiAreaContainer] Mostrando MI AREA PAGE");
        return <MiAreaPage />;
    }

    // Fallback por seguridad
    console.log("❓ [MiAreaContainer] Mostrando FALLBACK");
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="text-6xl mb-4">🏟️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Configura tu Área Deportiva
                </h2>
                <button
                    onClick={() => setShowCreate(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium"
                >
                    Crear Área Deportiva
                </button>
            </div>
        </div>
    );
}