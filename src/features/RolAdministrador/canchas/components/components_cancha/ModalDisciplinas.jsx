import React, { useEffect, useState, useCallback } from "react";
import {
  obtenerDisciplinasPorCancha,
  asociarDisciplinaACancha,
  desasociarDisciplinaDeCancha,
} from "../../../../../api/sepracticaApi";
import * as disciplinaService from "../../../../../api/AreadeportivaApi";
import Button from "../../../../../components/ui/Button";
import { X, CheckCircle, XCircle, Trophy, ChevronRight } from "lucide-react"; // Se eliminaron los iconos específicos de disciplina

export default function ModalDisciplinas({ canchaId, adminId, onClose }) {
  const [disciplinasArea, setDisciplinasArea] = useState([]);
  const [disciplinasCancha, setDisciplinasCancha] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [effectiveAdminId, setEffectiveAdminId] = useState(adminId);
  const [nivelDificultad] = useState("MEDIO"); 
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Variables de estilo inspiradas en el código de pagos:
  const primaryColor = "#46c4b7"; // Verde/Cian, similar a '--color-secondary' / '#46c4b7'
  const secondaryColor = "#f38321"; // Naranja, para el contraste en cards, similar a '--color-danger' en el código de pagos
  const bgColor = "#f9fafb"; // Fondo ligeramente gris para el contenido

  // Mostrar toast
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // DEBUG: Agregar logs para verificar props (Mantener la lógica original)
  console.log("🔧 ModalDisciplinas - Props recibidas:", { canchaId, adminId });

  // Efecto para obtener el adminId del localStorage si no viene como prop (Lógica original)
  useEffect(() => {
    if (!adminId) {
      console.log("🔄 adminId no proporcionado, buscando en localStorage...");
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          console.log("👤 Datos de usuario en localStorage:", user);
          
          const possibleAdminId = user.id;
          console.log("🔍 adminId encontrado (user.id):", possibleAdminId);
          
          if (possibleAdminId) {
            setEffectiveAdminId(possibleAdminId);
            console.log("✅ effectiveAdminId establecido:", possibleAdminId);
          } else {
            console.error("❌ No se pudo encontrar adminId en user data");
          }
        } catch (error) {
          console.error("❌ Error parseando user data:", error);
        }
      } else {
        console.error("❌ No hay user data en localStorage");
      }
    } else {
      console.log("✅ adminId proporcionado como prop:", adminId);
      setEffectiveAdminId(adminId);
    }
  }, [adminId]);

  // cargar disciplinas del área y de la cancha (Lógica original)
  const loadDisciplinas = useCallback(async () => {
    if (!effectiveAdminId) {
      console.error("❌ No hay effectiveAdminId disponible");
      setError("No se identificó al administrador");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("🔄 Cargando disciplinas para admin:", effectiveAdminId, "cancha:", canchaId);
      
      const data = await disciplinaService.getDisciplinasPorAdmin(effectiveAdminId);
      console.log("📋 Disciplinas del área cargadas:", data);
      
      if (Array.isArray(data)) {
        setDisciplinasArea(data);
        console.log("✅ Disciplinas del área establecidas:", data.length);
      } else {
        console.error("❌ Los datos no son un array:", data);
        setDisciplinasArea([]);
      }
      
      const canchaDisciplinas = await obtenerDisciplinasPorCancha(canchaId);
      console.log("🏟️ Disciplinas de la cancha:", canchaDisciplinas);
      
      setDisciplinasCancha(Array.isArray(canchaDisciplinas) ? canchaDisciplinas : []);
      
    } catch (err) {
      console.error("❌ Error cargando disciplinas:", err);
      console.error("❌ Detalles del error:", err.response?.data || err.message);
      setError("No se pudieron cargar las disciplinas");
    } finally {
      setLoading(false);
    }
  }, [canchaId, effectiveAdminId]);

  useEffect(() => {
    console.log("🎯 useEffect ejecutándose, effectiveAdminId:", effectiveAdminId);
    if (canchaId && effectiveAdminId) {
      loadDisciplinas();
    } else {
      if (!effectiveAdminId) {
        // Dejar el log vacío para mantener la lógica original de no hacer nada si no hay ID
      }
    }
  }, [loadDisciplinas, canchaId, effectiveAdminId]);

  // verificar si una disciplina ya está asignada a la cancha (Lógica original)
  const isAsignada = (idDisciplina) =>
    disciplinasCancha.some((d) => d.idDisciplina === idDisciplina);

  // NOTA: Se ha eliminado la lógica de getRandomIcon y disciplinaIcons.

  // asignar disciplina (Lógica original)
  const handleAsignar = async (disciplina) => {
    try {
      console.log("➕ Asignando disciplina:", disciplina.idDisciplina, "a cancha:", canchaId);
      
      const datosAsociacion = {
        idCancha: canchaId,
        idDisciplina: disciplina.idDisciplina,
        nivelDificultad: nivelDificultad 
      };
      
      console.log("📤 Datos enviados al backend:", datosAsociacion);
      
      await asociarDisciplinaACancha(datosAsociacion);
      
      const disciplinaAsignada = {
          ...disciplina, 
          nivelDificultad: nivelDificultad 
      };

      setDisciplinasCancha((prev) => [...prev, disciplinaAsignada]);
      showToast("Disciplina asignada con éxito", "success");
      console.log("✅ Disciplina asignada correctamente");
    } catch (err) {
      console.error("❌ Error al asignar disciplina:", err);
      console.error("❌ Detalles del error:", err.response?.data || err.message);
      showToast("Error al asignar disciplina", "error");
    }
  };

  // desasignar disciplina (Lógica original)
  const handleDesasignar = async (disciplina) => {
    try {
      console.log("➖ Desasignando disciplina:", disciplina.idDisciplina, "de cancha:", canchaId);
      await desasociarDisciplinaDeCancha(canchaId, disciplina.idDisciplina);
      setDisciplinasCancha((prev) =>
        prev.filter((d) => d.idDisciplina !== disciplina.idDisciplina)
      );
      showToast("Disciplina removida con éxito", "success");
      console.log("✅ Disciplina desasignada correctamente");
    } catch (err) {
      console.error("❌ Error al desasignar disciplina:", err);
      showToast("Error al remover disciplina", "error");
    }
  };

  // Nivel de dificultad para el select
  // const nivelesDificultad = ["BAJO", "MEDIO", "ALTO", "PROFESIONAL"]; // actualmente no usado

  // Componente de botón mejorado para coincidir con la inspiración
  const ActionButton = ({ onClick, children, isAssigned, isDisabled = false }) => {
    const baseClasses = "w-full py-3 rounded-xl shadow-lg transition-all duration-300 font-semibold text-white flex items-center justify-center gap-2";
    
    if (isAssigned) {
      return (
        <Button
          variant="danger" 
          onClick={(e) => { e.stopPropagation(); onClick && onClick(e); }}
          className={`${baseClasses} bg-red-600 hover:bg-red-700 hover:shadow-xl transform hover:-translate-y-0.5`}
          style={{ fontFamily: "var(--font-josefin)" }}
          disabled={isDisabled}
        >
          {children}
        </Button>
      );
    } else {
      return (
        <Button
          variant="success" 
          onClick={(e) => { e.stopPropagation(); onClick && onClick(e); }}
          className={`${baseClasses} hover:bg-[#3ba196] hover:shadow-xl transform hover:-translate-y-0.5`}
          style={{ fontFamily: "var(--font-josefin)", backgroundColor: primaryColor }}
          disabled={isDisabled}
        >
          {children}
        </Button>
      );
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11, 13, 14, 0.75)' }}>
      {/* Toast Notification (Diseño mejorado) */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-[60] px-5 py-3 rounded-xl shadow-xl transition-all duration-300 border-t-4 ${
          toast.type === "success" 
            ? `bg-white text-gray-800 border-t-[${primaryColor}]` 
            : "bg-white text-gray-800 border-t-[#d40000]"
        }`}>
          <div className="flex items-center gap-3">
            {toast.type === "success" ? (
              <CheckCircle className="w-6 h-6" style={{ color: primaryColor }} />
            ) : (
              <XCircle className="w-6 h-6 text-[#d40000]" />
            )}
            <span className="font-medium text-lg" style={{fontFamily: "var(--font-Balo)"}}>
              {toast.message}
            </span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 sm:p-8 border-b border-gray-100 flex-shrink-0 bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1 tracking-tight" style={{fontFamily: "var(--font-Oswald)"}}>
              GESTOR DE DISCIPLINAS
            </h3>
            <p className="text-gray-600 text-base sm:text-xl" style={{fontFamily: "var(--font-Alumni)"}}>
              Asigna y desasigna deportes a esta cancha de juego.
            </p>
          </div>
          <Button 
            variant="default" 
            size="sm" 
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-5 py-2.5 rounded-xl shadow-sm transition-all duration-300 font-semibold"
            style={{fontFamily: "var(--font-josefin)"}}
          >
            <X className="w-5 h-5" /> Cerrar
          </Button>
        </div>

        {/* Totales (Inspiración en cards de pagos) */}
        <div className="grid grid-cols-2 gap-4 p-6 sm:p-8 border-b border-gray-100 flex-shrink-0 bg-white">
            {/* Disciplinas del Área */}
            <div 
              className="rounded-xl p-5 shadow-sm border transition-all duration-200 hover:shadow-md"
              style={{
                background: bgColor, 
                border: '1px solid #e0e0e0',
                boxShadow: `0 2px 6px rgba(0,0,0,0.05)`,
              }}
            >
              <div 
                className="text-xs font-medium uppercase tracking-wide opacity-80 mb-1"
                style={{ fontFamily: 'var(--font-Alumni)' }}
              >
                Disponibles en el área
              </div>
              <div 
                className="font-bold text-2xl tracking-tight"
                style={{ 
                  fontFamily: 'var(--font-Oswald)',
                  color: primaryColor
                }}
              >
                {disciplinasArea.length}
              </div>
            </div>
            
            {/* Disciplinas de la Cancha */}
            <div 
              className="rounded-xl p-5 shadow-sm border transition-all duration-200 hover:shadow-md"
              style={{
                background: bgColor, 
                border: '1px solid #e0e0e0',
                boxShadow: `0 2px 6px rgba(0,0,0,0.05)`,
              }}
            >
              <div 
                className="text-xs font-medium uppercase tracking-wide opacity-80 mb-1"
                style={{ fontFamily: 'var(--font-Alumni)' }}
              >
                Asignadas a esta cancha
              </div>
              <div 
                className="font-bold text-2xl tracking-tight"
                style={{ 
                  fontFamily: 'var(--font-Oswald)',
                  color: secondaryColor
                }}
              >
                {disciplinasCancha.length}
              </div>
            </div>
        </div>

        {/* Contenido desplazable */}
        <div className="flex-1 overflow-y-auto bg-white">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-gray-300 rounded-full animate-spin mb-4" style={{ borderTopColor: primaryColor }}></div>
              <p className="text-gray-600 text-lg" style={{fontFamily: "var(--font-Balo)"}}>
                Cargando disciplinas...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
              <p className="text-red-600 text-lg font-semibold mb-4" style={{fontFamily: "var(--font-Balo)"}}>
                {error}
              </p>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={loadDisciplinas}
                className={`text-white px-6 py-2.5 rounded-xl shadow-md transition-all duration-300 hover:bg-[#3ba196]`}
                style={{fontFamily: "var(--font-josefin)", backgroundColor: primaryColor}}
              >
                Reintentar
              </Button>
            </div>
          ) : (
            <div className="p-6 sm:p-8">
              {disciplinasArea.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
                  <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl text-gray-600 mb-2" style={{fontFamily: "var(--font-Alumni)"}}>
                    No hay disciplinas disponibles en el área deportiva.
                  </p>
                  <p className="text-gray-500 text-base" style={{fontFamily: "var(--font-Balo)"}}>
                    CREA DISCIPLINAS PRIMERO EN LA SECCION DE ADMINISTRACION, LUEGO PODRAS AGINARLAS.
                  </p>
                </div>
              ) : (
                <>
                    {/* Selector de Nivel de Dificultad (para la próxima asignación) 
                    <div className="mb-6 flex flex-wrap items-center justify-end gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <label 
                            htmlFor="nivelDificultad" 
                            className="text-base font-semibold text-gray-700"
                            style={{ fontFamily: "var(--font-josefin)" }}
                        >
                            Nivel por defecto (al asignar):
                        </label>
                        <select
                            id="nivelDificultad"
                            value={nivelDificultad}
                            onChange={(e) => setNivelDificultad(e.target.value)}
                            className="p-2.5 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-800 focus:ring-2 focus:ring-[${primaryColor}] focus:border-[${primaryColor}] transition-all duration-200"
                            style={{ fontFamily: "var(--font-Balo)" }}
                        >
                            {nivelesDificultad.map(nivel => (
                                <option key={nivel} value={nivel}>{nivel}</option>
                            ))}
                        </select>
                    </div>*/}

                    {/* Lista de Disciplinas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {disciplinasArea.map((disciplina) => {
                        const asignada = isAsignada(disciplina.idDisciplina);
                        
                        return (
                          <div 
                            key={disciplina.idDisciplina} 
                            className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex flex-col cursor-pointer ${
                              asignada 
                                ? `bg-white shadow-lg` 
                                : "bg-white border-gray-200 hover:border-gray-300"
                            }`}
                            style={asignada ? { borderColor: primaryColor, borderWidth: 2 } : undefined}
                            onClick={() => {
                              if (asignada) {
                                // desasignar en cualquier lugar del card
                                handleDesasignar(disciplina);
                              } else {
                                // asignar si está activa; si no, mostrar aviso
                                if (disciplina.estado) {
                                  handleAsignar(disciplina);
                                } else {
                                  showToast("Disciplina inactiva, no se puede asignar.", "error");
                                }
                              }
                            }}
                          >
                            <div className="flex items-start justify-end mb-4">
                                {/* Se ha eliminado la sección del icono de disciplina */}
                                
                                {/* Estado Activo/Inactivo */}
                                <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm transition-all duration-200 ${
                                  disciplina.estado 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-red-100 text-red-700"
                                }`} style={{fontFamily: "var(--font-Balo)"}}>
                                  <div className={`w-2 h-2 rounded-full ${
                                    disciplina.estado ? "bg-green-500" : "bg-red-500"
                                  } animate-pulse`}></div>
                                  {disciplina.estado ? "ACTIVO" : "INACTIVO"}
                                </span>
                            </div>

                            {/* Nombre y Descripción */}
                            <div className="flex flex-col flex-1">
                                <h4 className="text-xl font-bold text-gray-900 mb-1 tracking-tight" style={{fontFamily: "var(--font-Alumni)"}}>
                                    {disciplina.nombre.toUpperCase()}
                                </h4>
                                <p className="text-sm text-gray-600 leading-snug mb-4 flex-1" style={{fontFamily: "var(--font-Balo)"}}>
                                    {disciplina.descripcion || "Sin descripción disponible"}
                                </p>
                            </div>

                            {/* Separador */}
                            <hr className="my-3 border-gray-100" />
                            
                            {/* Estado de Asignación y Botón */}
                            <div className="mt-auto pt-2">
                                <div className="flex items-center gap-2 mb-3">
                                    {asignada ? (
                                        <span className="flex items-center gap-1 text-sm font-semibold text-white px-3 py-1 rounded-full bg-green-500" style={{fontFamily: "var(--font-Alumni)"}}>
                                            <CheckCircle className="w-4 h-4" /> ASIGNADA
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-sm font-semibold text-gray-600 px-3 py-1 rounded-full bg-gray-100" style={{fontFamily: "var(--font-Alumni)"}}>
                                            <ChevronRight className="w-4 h-4" /> DISPONIBLE
                                        </span>
                                    )}
                                </div>

                                {/* Botón de acción usando el componente mejorado */}
                                <ActionButton
                                    onClick={() => asignada ? handleDesasignar(disciplina) : handleAsignar(disciplina)}
                                    isAssigned={asignada}
                                    isDisabled={!disciplina.estado} 
                                >
                                    {asignada ? 'QUITAR DE CANCHA' : 'ASIGNAR A CANCHA'}
                                </ActionButton>

                                {/* Mensaje de estado (opcional, si está inactiva) */}
                                {!disciplina.estado && (
                                    <p className="text-xs text-red-500 mt-2 text-center" style={{ fontFamily: "var(--font-Balo)" }}>
                                        Disciplina inactiva, no se puede asignar.
                                    </p>
                                )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}