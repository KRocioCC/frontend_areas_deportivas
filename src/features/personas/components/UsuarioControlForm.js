import { useState } from "react";

export default function UsuarioControlForm({ initialData, onCancel, onSave }) {
  const [form, setForm] = useState(initialData ?? {});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    {
      /* Formulario con inputs para:
         nombre, apaterno, amaterno, fechaNacimiento,
         telefono, email, urlImagen, estadoCliente,
         estadoOperativo, horaInicioTurno, horaFinTurno, direccion
         y botones Guardar / Cancelar
         Todo con onChange={handleChange} y name correcto */
    }
  );
}
