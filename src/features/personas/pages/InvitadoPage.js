import { useEffect, useState } from 'react';

const InvitadoPage = () => {
    const [invitados, setInvitados] = useState([]);

    useEffect(() => {
        // Usamos fetch en lugar de axios
        fetch('/api/invitados')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener invitados');
                }
                return response.json();
            })
            .then(data => setInvitados(data))
            .catch(error => console.error('Error al obtener invitados:', error));
    }, []);

    return (
        <div>
            <h3>Gestión de Invitados</h3>
            <button onClick={() => {/* Lógica para crear invitado */}}>Crear Invitado</button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {invitados.map(invitado => (
                        <tr key={invitado.idInvitado}>
                            <td>{invitado.idInvitado}</td>
                            <td>{invitado.nombre}</td>
                            <td>
                                <button onClick={() => {/* Lógica para editar invitado */}}>Editar</button>
                                <button onClick={() => {/* Lógica para eliminar invitado */}}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvitadoPage;
