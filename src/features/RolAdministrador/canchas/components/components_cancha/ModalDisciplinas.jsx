import React, { useEffect, useState, useCallback } from "react";
import {
  obtenerDisciplinasPorCancha,
  asociarDisciplinaACancha,
  desasociarDisciplinaDeCancha,
} from "../../../../../api/sepracticaApi";
import * as disciplinaService from "../../../../../api/AreadeportivaApi";
import Button from "../../../../../components/ui/Button";
import { X } from "lucide-react";
import "./ModalDisciplinas.css";

export default function ModalDisciplinas({ canchaId, adminId, onClose }) {
  const [disciplinasArea, setDisciplinasArea] = useState([]);
  const [disciplinasCancha, setDisciplinasCancha] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [effectiveAdminId, setEffectiveAdminId] = useState(adminId);
  const [nivelDificultad, setNivelDificultad] = useState("MEDIO"); // Valor por defecto

  // DEBUG: Agregar logs para verificar props
  console.log("🔧 ModalDisciplinas - Props recibidas:", { canchaId, adminId });

  // Efecto para obtener el adminId del localStorage si no viene como prop
  useEffect(() => {
    if (!adminId) {
      console.log("🔄 adminId no proporcionado, buscando en localStorage...");
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          console.log("👤 Datos de usuario en localStorage:", user);
          
          // Usar el id como adminId (según tu estructura de login)
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

  // cargar disciplinas del área y de la cancha
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
      
      // Cargar disciplinas del área del administrador
      const data = await disciplinaService.getDisciplinasPorAdmin(effectiveAdminId);
      console.log("📋 Disciplinas del área cargadas:", data);
      
      if (Array.isArray(data)) {
        setDisciplinasArea(data);
        console.log("✅ Disciplinas del área establecidas:", data.length);
      } else {
        console.error("❌ Los datos no son un array:", data);
        setDisciplinasArea([]);
      }
      
      // Cargar disciplinas ya asignadas a la cancha
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
      console.warn("⚠️ Faltan parámetros:", { canchaId, effectiveAdminId });
      if (!effectiveAdminId) {
        setError("No se pudo identificar al administrador. Por favor, cierre y vuelva a abrir el modal.");
      }
    }
  }, [loadDisciplinas, canchaId, effectiveAdminId]);

  // verificar si una disciplina ya está asignada a la cancha
  const isAsignada = (idDisciplina) =>
    disciplinasCancha.some((d) => d.idDisciplina === idDisciplina);

  // asignar disciplina
  const handleAsignar = async (disciplina) => {
    try {
      console.log("➕ Asignando disciplina:", disciplina.idDisciplina, "a cancha:", canchaId);
      
      // Crear objeto con nivelDificultad incluido
      const datosAsociacion = {
        idCancha: canchaId,
        idDisciplina: disciplina.idDisciplina,
        nivelDificultad: nivelDificultad // Campo requerido agregado
      };
      
      console.log("📤 Datos enviados al backend:", datosAsociacion);
      
      await asociarDisciplinaACancha(datosAsociacion);
      
      // Agregar a la lista local
      setDisciplinasCancha((prev) => [...prev, disciplina]);
      console.log("✅ Disciplina asignada correctamente");
    } catch (err) {
      console.error("❌ Error al asignar disciplina:", err);
      console.error("❌ Detalles del error:", err.response?.data || err.message);
      alert("Error al asignar disciplina: " + (err.response?.data?.message || err.message));
    }
  };

  // desasignar disciplina
  const handleDesasignar = async (disciplina) => {
    try {
      console.log("➖ Desasignando disciplina:", disciplina.idDisciplina, "de cancha:", canchaId);
      await desasociarDisciplinaDeCancha(canchaId, disciplina.idDisciplina);
      // Remover de la lista local
      setDisciplinasCancha((prev) =>
        prev.filter((d) => d.idDisciplina !== disciplina.idDisciplina)
      );
      console.log("✅ Disciplina desasignada correctamente");
    } catch (err) {
      console.error("❌ Error al desasignar disciplina:", err);
      alert("Error al desasignar disciplina");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-ultra-wide">
        <div className="modal-header">
          <h3>Gestión de Disciplinas </h3>
          <Button 
            variant="primary" 
            size="sm" 
            icon={X} 
            onClick={onClose}
            className="close-button"
          >
            Cerrar
          </Button>
        </div>

        {/* Selector de Nivel de Dificultad 
        <div className="nivel-dificultad-section">
          <label htmlFor="nivelDificultad">
            <strong>Nivel de Dificultad para nuevas asignaciones:</strong>
          </label>
          <select
            id="nivelDificultad"
            value={nivelDificultad}
            onChange={(e) => setNivelDificultad(e.target.value)}
            className="nivel-dificultad-select"
          >
            <option value="BAJO">Bajo</option>
            <option value="MEDIO">Medio</option>
            <option value="ALTO">Alto</option>
            <option value="PROFESIONAL">Profesional</option>
          </select>
        </div>*/}

        {/* DEBUG INFO - Solo en desarrollo
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-info">
            <p><strong>Debug:</strong> adminId={adminId}, effectiveAdminId={effectiveAdminId}, canchaId={canchaId}</p>
            <p><strong>Nivel Dificultad:</strong> {nivelDificultad}</p>
            <p><strong>Disciplinas área:</strong> {disciplinasArea.length}</p>
            <p><strong>Disciplinas cancha:</strong> {disciplinasCancha.length}</p>
          </div>
        )} */}

        {loading ? (
          <div className="loading-container">
            <p>Cargando disciplinas...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error">{error}</p>
            <Button variant="primary" size="sm" onClick={loadDisciplinas}>
              Reintentar
            </Button>
          </div>
        ) : (
          <div className="disciplinas-container-horizontal">
            {/* Resumen 
            <div className="resumen-section">
              <p>
                <strong>Disciplinas disponibles en el área:</strong> {disciplinasArea.length} | 
                <strong> Asignadas a esta cancha:</strong> {disciplinasCancha.length}
              </p>
            </div>*/}

            {disciplinasArea.length === 0 ? (
              <div className="empty-state">
                <p>No hay disciplinas disponibles en el área deportiva.</p>
                <p className="empty-subtext">
                  Crea disciplinas primero en la sección de administración.
                </p>
              </div>
            ) : (
              <div className="disciplinas-grid-container">
                <div className="disciplinas-grid">
                  {disciplinasArea.map((disciplina) => {
                    const asignada = isAsignada(disciplina.idDisciplina);
                    return (
                      <div 
                        key={disciplina.idDisciplina} 
                        className={`disciplina-card ${asignada ? 'asignada' : 'disponible'}`}
                      >
                        <div className="disciplina-card-content">
                          <div className="disciplina-header">
                            <strong className="disciplina-nombre">
                              {disciplina.nombre}
                            </strong>
                            <span className="disciplina-id">
                              ID: {disciplina.idDisciplina}
                            </span>
                          </div>
                          
                          <div className="disciplina-body">
                            <p className="disciplina-descripcion">
                              {disciplina.descripcion || "Sin descripción"}
                            </p>
                            
                            <div className="disciplina-meta">
                              <span className={`disciplina-estado ${asignada ? 'asignada' : 'disponible'}`}>
                                {asignada ? "ASIGNADA" : "DISPONIBLE"}
                              </span>
                              <span className="disciplina-activo">
                                {disciplina.estado ? "🟢 Activo" : "🔴 Inactivo"}
                              </span>
                            </div>
                          </div>

                          <div className="disciplina-actions">
                            {asignada ? (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDesasignar(disciplina)}
                                className="action-button"
                                fullWidth
                              >
                                Quitar de Cancha
                              </Button>
                            ) : (
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => handleAsignar(disciplina)}
                                className="action-button"
                                fullWidth
                              >
                                Asignar a Cancha
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}