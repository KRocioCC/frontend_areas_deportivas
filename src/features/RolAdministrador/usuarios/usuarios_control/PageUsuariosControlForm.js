import React, { useEffect, useState } from "react";
import {
  asignarCanchaASupervisor,
  quitarCanchaDeSupervisor,
  obtenerCanchasSupervisadasPorUsuario,
} from "../../../../api/supervisaApi";
import { getCanchas } from "../../../../api/CanchaApi";
import "./PageUsuariosControlForm.css";

export default function PageUsuariosControlForm({ initialData, onSave, onCancel }) {
  const [nombre, setNombre] = useState("");
  const [apaterno, setApaterno] = useState("");
  const [amaterno, setAmaterno] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [urlImagen, setUrlImagen] = useState("");
  const [estado, setEstado] = useState(true);
  const [estadoOperativo, setEstadoOperativo] = useState("Activo");
  const [horaInicioTurno, setHoraInicioTurno] = useState("");
  const [horaFinTurno, setHoraFinTurno] = useState("");
  const [direccion, setDireccion] = useState("");
  const [canchas, setCanchas] = useState([]);
  const [canchasSeleccionadas, setCanchasSeleccionadas] = useState([]);
  const [canchasAsignadas, setCanchasAsignadas] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadCanchas() {
      try {
        const data = await getCanchas();
        setCanchas(Array.isArray(data) ? data : []);
        console.log("✅ Canchas disponibles:", data);
      } catch (err) {
        console.error("❌ Error al cargar canchas:", err);
        setCanchas([]);
      }
    }

    async function loadAsignadas() {
      if (initialData?.id) {
        try {
          const data = await obtenerCanchasSupervisadasPorUsuario(initialData.id);
          setCanchasAsignadas(Array.isArray(data) ? data : []);
          console.log("✅ Canchas asignadas al usuario:", data);
        } catch (err) {
          console.error("❌ Error al cargar canchas asignadas:", err);
          setCanchasAsignadas([]);
        }
      }
    }

    loadCanchas();
    loadAsignadas();
  }, [initialData]);

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || "");
      setApaterno(initialData.apaterno || "");
      setAmaterno(initialData.amaterno || "");
      setFechaNacimiento(initialData.fechaNacimiento || "");
      setTelefono(initialData.telefono || "");
      setEmail(initialData.email || "");
      setUrlImagen(initialData.urlImagen || "");
      setEstado(initialData.estado ?? true);
      setEstadoOperativo(initialData.estadoOperativo || "Activo");
      setHoraInicioTurno(initialData.horaInicioTurno || "");
      setHoraFinTurno(initialData.horaFinTurno || "");
      setDireccion(initialData.direccion || "");
      setCanchasSeleccionadas([]);
    } else {
      setNombre("");
      setApaterno("");
      setAmaterno("");
      setFechaNacimiento("");
      setTelefono("");
      setEmail("");
      setUrlImagen("");
      setEstado(true);
      setEstadoOperativo("Activo");
      setHoraInicioTurno("");
      setHoraFinTurno("");
      setDireccion("");
      setCanchasSeleccionadas([]);
      setCanchasAsignadas([]);
    }
    setErrors({});
  }, [initialData]);

  function validate() {
    const e = {};
    if (!nombre.trim()) e.nombre = "Nombre es requerido";
    if (!apaterno.trim()) e.apaterno = "Apellido paterno es requerido";
    if (!email.trim()) e.email = "Email es requerido";
    if (!horaInicioTurno) e.horaInicioTurno = "Hora de inicio es requerida";
    if (!horaFinTurno) e.horaFinTurno = "Hora de fin es requerida";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    const payload = {
      nombre: nombre.trim(),
      apaterno: apaterno.trim(),
      amaterno: amaterno.trim(),
      fechaNacimiento,
      telefono: telefono.trim(),
      email: email.trim(),
      urlImagen: urlImagen.trim(),
      estado,
      estadoOperativo,
      horaInicioTurno,
      horaFinTurno,
      direccion: direccion.trim(),
    };

    console.log("📤 Enviando payload de usuario control:", payload);
    const usuarioCreado = await onSave(payload);

    if (usuarioCreado?.id && canchasSeleccionadas.length > 0) {
      for (const canchaId of canchasSeleccionadas) {
        try {
          await asignarCanchaASupervisor(usuarioCreado.id, canchaId);
          console.log(`✅ Cancha ${canchaId} asignada`);
        } catch (err) {
          console.error(`❌ Error al asignar cancha ${canchaId}:`, err);
        }
      }
    }
  }

  function toggleCancha(id) {
    setCanchasSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  }

  async function handleQuitarCancha(idCancha) {
    if (!initialData?.id) return;
    try {
      await quitarCanchaDeSupervisor(initialData.id, idCancha);
      setCanchasAsignadas(prev => prev.filter(c => c.id !== idCancha));
      console.log(`🗑️ Cancha ${idCancha} desasignada`);
    } catch (err) {
      console.error(`❌ Error al quitar cancha ${idCancha}:`, err);
    }
}
  return (
    <form className="UsuarioControl-form" onSubmit={handleSubmit}>
      <h3>{initialData ? "Editar Usuario de Control" : "Nuevo Usuario de Control"}</h3>

      {/* Campos personales */}
      <div className="form-row"><label>Nombre</label><input value={nombre} onChange={e => setNombre(e.target.value)} />{errors.nombre && <div className="form-error">{errors.nombre}</div>}</div>
      <div className="form-row"><label>Apellido Paterno</label><input value={apaterno} onChange={e => setApaterno(e.target.value)} />{errors.apaterno && <div className="form-error">{errors.apaterno}</div>}</div>
      <div className="form-row"><label>Apellido Materno</label><input value={amaterno} onChange={e => setAmaterno(e.target.value)} /></div>
      <div className="form-row"><label>Fecha de Nacimiento</label><input type="date" value={fechaNacimiento} onChange={e => setFechaNacimiento(e.target.value)} /></div>
      <div className="form-row"><label>Teléfono</label><input value={telefono} onChange={e => setTelefono(e.target.value)} /></div>
      <div className="form-row"><label>Email</label><input value={email} onChange={e => setEmail(e.target.value)} />{errors.email && <div className="form-error">{errors.email}</div>}</div>
      <div className="form-row"><label>URL de Imagen</label><input value={urlImagen} onChange={e => setUrlImagen(e.target.value)} /></div>
      <div className="form-row"><label>Dirección</label><input value={direccion} onChange={e => setDireccion(e.target.value)} /></div>
      <div className="form-row"><label>Hora Inicio Turno</label><input type="time" value={horaInicioTurno} onChange={e => setHoraInicioTurno(e.target.value)} />{errors.horaInicioTurno && <div className="form-error">{errors.horaInicioTurno}</div>}</div>
      <div className="form-row"><label>Hora Fin Turno</label><input type="time" value={horaFinTurno} onChange={e => setHoraFinTurno(e.target.value)} />{errors.horaFinTurno && <div className="form-error">{errors.horaFinTurno}</div>}</div>


      <div className="form-actions">
        <button type="submit">Guardar</button>
        <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
    