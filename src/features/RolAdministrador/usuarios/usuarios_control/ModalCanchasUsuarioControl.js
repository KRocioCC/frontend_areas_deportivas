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

export default function ModalCanchasUsuarioControl({ usuario, onClose }) {
  const [canchasDisponibles, setCanchasDisponibles] = useState([]);
  const [canchasAsignadas, setCanchasAsignadas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [confirmarQuitar, setConfirmarQuitar] = useState(null);

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
        console.error("❌ Error al cargar canchas:", err);
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
        console.log(`✅ Cancha ${id} asignada`);
      } catch (err) {
        console.error(`❌ Error al asignar cancha ${id}:`, err);
      }
    }

    setToast("Canchas asignadas con éxito");
    onClose(); // recarga desde el padre
  }

  async function handleQuitar(idCancha) {
    try {
      await quitarCanchaDeSupervisor(usuario.id, idCancha);
      setCanchasAsignadas(prev => prev.filter(c => c.idCancha !== idCancha));
      setToast("Cancha desasignada con éxito");
    } catch (err) {
      console.error(`❌ Error al quitar cancha ${idCancha}:`, err);
    }
    setConfirmarQuitar(null);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content small">
        <h3>Canchas de {usuario.nombre}</h3>

        {loading ? (
          <p>Cargando canchas...</p>
        ) : (
          <>
            <div className="form-row">
              <label>Asignar nuevas canchas</label>
              <div className="checkbox-group">
                {canchasDisponibles.map(c => (
                  <div key={c.idCancha || c.id} className="checkbox-item">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={seleccionadas.includes(c.idCancha || c.id)}
                        onChange={() => toggleSeleccion(c.idCancha || c.id)}
                      />
                      {c.nombre}
                    </label>
                  </div>
                ))}
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
              <div className="form-row">
                <label>Canchas ya asignadas</label>
                <ul className="asignadas-list">
                  {canchasAsignadas.map(c => (
                    <li key={c.idCancha}>
                      {c.nombre}
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => setConfirmarQuitar(c.idCancha)}
                      >
                        Quitar
                      </button>
                    </li>
                  ))}
                </ul>
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
