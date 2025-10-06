import { useEffect, useState } from 'react';
import axios from 'axios';

const InvitadoPage = () => {
    const [invitados, setInvitados] = useState([]);

    useEffect(() => {
        axios.get('/api/invitados')
        .then(response => setInvitados(response.data))
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
