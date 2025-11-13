import React, { useEffect, useState } from "react";
import {
  obtenerCanchasSupervisadasPorUsuario,
  asignarCanchaASupervisor,
  quitarCanchaDeSupervisor,
} from "../../../../api/supervisaApi";
import { getCanchas } from "../../../../api/CanchaApi";
import ConfirmDialog from "../../../../components/ui/ConfirmDialog";
import ToastMensaje from "../../../../components/ui/ToastMensaje";
import "./ModalCanchasUsuarioControl.css";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

export default function ModalCanchasUsuarioControl({ usuario, onClose }) {
  const [canchasDisponibles, setCanchasDisponibles] = useState([]);
  const [canchasAsignadas, setCanchasAsignadas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmarQuitar, setConfirmarQuitar] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); 

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
      id => !canchasAsignadas.some(c => c.idCancha === id)
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
      onClose(); // recarga desde el padre
    }, 2500);
  }

  async function handleQuitar(idCancha) {
    try {
      await quitarCanchaDeSupervisor(usuario.id, idCancha);
      setCanchasAsignadas(prev => prev.filter(c => c.idCancha !== idCancha));
      setToast("Cancha desasignada con éxito");
    } catch (err) {
      console.error(`Error al quitar cancha ${idCancha}:`, err);
    }
    setConfirmarQuitar(null);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content wide">
        <h3>Canchas asignadas al Usuario Control {usuario.nombre}</h3>

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

        {loading ? (
          <p>Cargando canchas...</p>
        ) : (
          <>
            <div className="section">
              <h4>Asignar nuevas canchas</h4>
              <div className="card-grid">
                {canchasDisponibles.map(c => {
                  const id = c.idCancha || c.id;
                  const yaAsignada = canchasAsignadas.some(a => a.idCancha === id);
                  return (
                    <div key={id} className={`card-item ${yaAsignada ? "disabled" : ""}`}>
                      <label>
                        <input
                          type="checkbox"
                          disabled={yaAsignada}
                          checked={seleccionadas.includes(id)}
                          onChange={() => toggleSeleccion(id)}
                        />
                        <span>{c.nombre}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
              <button
                className="btn btn-primary"
                onClick={handleAsignar}
                disabled={seleccionadas.length === 0}
              >
                Asignar seleccionadas
              </button>
            </div>

            {canchasAsignadas.length > 0 && (
              <div className="section">
                <h4>Canchas ya asignadas</h4>
                <div className="asignadas-container">
                  {canchasAsignadas.map(c => (
                    <div key={c.idCancha} className="asignada-item">
                      <span>{c.nombre}</span>
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => setConfirmarQuitar(c.idCancha)}
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="form-actions">
          <button className="btn-cancel" onClick={onClose}>Cerrar</button>
        </div>

        {toast && (
          <ToastMensaje mensaje={toast} onClose={() => setToast(null)} />
        )}

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
