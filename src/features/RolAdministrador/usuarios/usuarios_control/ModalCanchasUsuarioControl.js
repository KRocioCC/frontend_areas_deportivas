import React, { useEffect, useState } from "react";
import {
  obtenerCanchasSupervisadasPorUsuario,
  asignarCanchaASupervisor,
  quitarCanchaDeSupervisor,
} from "../../../../api/supervisaApi";
import { getCanchas } from "../../../../api/CanchaApi";
import ConfirmDialog from "../../../../components/ui/ConfirmDialog";
import "./ModalCanchasUsuarioControl.css";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { FaCheck, FaTimes, FaPlus, FaTrash, FaFutbol, FaUserCog } from "react-icons/fa";

export default function ModalCanchasUsuarioControl({ usuario, onClose }) {
  const [canchasDisponibles, setCanchasDisponibles] = useState([]);
  const [canchasAsignadas, setCanchasAsignadas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmarQuitar, setConfirmarQuitar] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const todas = await getCanchas();
        const asignadas = await obtenerCanchasSupervisadasPorUsuario(usuario.id);
        setCanchasDisponibles(todas);
        setCanchasAsignadas(asignadas);
        setSeleccionadas([]);
      } catch (err) {
        console.error("Error al cargar canchas:", err);
      } finally {
        setLoading(false);
      }
    }
    if (usuario?.id) loadData();
  }, [usuario]);

  function toggleSeleccion(idCancha) {
    if (!idCancha) return;
    setSeleccionadas(prev =>
      prev.includes(idCancha)
        ? prev.filter(id => id !== idCancha)
        : [...prev, idCancha]
    );
  }

  async function handleAsignar() {
    const nuevas = seleccionadas.filter(
      id => !canchasAsignadas.some(a => a.idCancha === id)
    );

    for (const id of nuevas) {
      try {
        await asignarCanchaASupervisor(usuario.id, id);
        console.log(`Cancha ${id} asignada`);
      } catch (err) {
        console.error(`Error al asignar cancha ${id}:`, err);
      }
    }

    setShowSuccessAlert(true);
    setSeleccionadas([]);

    setTimeout(() => {
      setShowSuccessAlert(false);
      onClose();
    }, 2500);
  }

  async function handleQuitar(idCancha) {
    try {
      await quitarCanchaDeSupervisor(usuario.id, idCancha);
      setCanchasAsignadas(prev => prev.filter(c => c.idCancha !== idCancha));
      setShowRemoveAlert(true);
      
      setTimeout(() => {
        setShowRemoveAlert(false);
      }, 2500);
    } catch (err) {
      console.error(`Error al quitar cancha ${idCancha}:`, err);
    }
    setConfirmarQuitar(null);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content wide">
        {/* Header */}
        <div className="modal-header">
          <div className="header-icon">
            <FaUserCog className="icon" />
          </div>
          <div className="header-content">
            <h3>Gestión de Canchas</h3>
            <p className="user-info">Usuario Control: <span>{usuario.nombre}</span></p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Alerta de asignación exitosa */}
        {showSuccessAlert && (
          <div className="alert-overlay">
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>
                <AlertTitle>Asignación exitosa</AlertTitle>
                Las canchas fueron asignadas correctamente.
              </Alert>
            </Stack>
          </div>
        )}

        {/* Alerta de desasignación exitosa */}
        {showRemoveAlert && (
          <div className="alert-overlay">
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity="info" onClose={() => setShowRemoveAlert(false)}>
                <AlertTitle>Desasignación exitosa</AlertTitle>
                La cancha fue desasignada correctamente.
              </Alert>
            </Stack>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando canchas...</p>
          </div>
        ) : (
          <>
            {/* Sección para asignar nuevas canchas */}
            <div className="section">
              <div className="section-header">
                <FaPlus className="section-icon" />
                <h4>Asignar Nuevas Canchas</h4>
              </div>
              <p className="section-description">Selecciona las canchas que deseas asignar a este usuario</p>
              
              <div className="card-grid">
                {canchasDisponibles.map(c => {
                  const id = c.idCancha || c.id;
                  const yaAsignada = canchasAsignadas.some(a => a.idCancha === id);
                  return (
                    <div 
                      key={id} 
                      className={`card-item ${yaAsignada ? "disabled" : ""} ${seleccionadas.includes(id) ? "selected" : ""}`}
                      onClick={() => !yaAsignada && toggleSeleccion(id)}
                    >
                      <div className="card-checkbox">
                        <input
                          type="checkbox"
                          disabled={yaAsignada}
                          checked={seleccionadas.includes(id)}
                          onChange={() => toggleSeleccion(id)}
                        />
                        <span className="checkmark"></span>
                      </div>
                      <div className="card-content">
                        <FaFutbol className="card-icon" />
                        <span className="card-title">{c.nombre}</span>
                        {yaAsignada && (
                          <span className="badge assigned">Asignada</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="action-bar">
                <div className="selection-info">
                  {seleccionadas.length > 0 && (
                    <span>{seleccionadas.length} cancha(s) seleccionada(s)</span>
                  )}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleAsignar}
                  disabled={seleccionadas.length === 0}
                >
                  <FaCheck className="btn-icon" />
                  Asignar Seleccionadas
                </button>
              </div>
            </div>

            {/* Sección de canchas asignadas */}
            {canchasAsignadas.length > 0 && (
              <div className="section">
                <div className="section-header">
                  <FaCheck className="section-icon assigned" />
                  <h4>Canchas Asignadas</h4>
                </div>
                <p className="section-description">Canchas actualmente supervisadas por este usuario</p>
                
                <div className="asignadas-container">
                  {canchasAsignadas.map(c => (
                    <div key={c.idCancha} className="asignada-item">
                      <div className="asignada-info">
                        <FaFutbol className="asignada-icon" />
                        <span>{c.nombre}</span>
                      </div>
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => setConfirmarQuitar(c.idCancha)}
                      >
                        <FaTrash className="btn-icon" />
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            <FaTimes className="btn-icon" />
            Cerrar
          </button>
        </div>

        {confirmarQuitar && (
          <ConfirmDialog
            mensaje="¿Estás segur@ de quitar esta cancha?"
            onConfirmar={() => handleQuitar(confirmarQuitar)}
            onCancelar={() => setConfirmarQuitar(null)}
          />
        )}
      </div>
    </div>
  );
}