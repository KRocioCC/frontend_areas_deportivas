import api from './api';

const API_URL = '/administradores';

// Obtener todos los administradores (activos o todos)
export async function getAdministradores(activos = false) {
  const url = activos ? `${API_URL}/activos` : API_URL;
  const res = await api.get(url);
  return res.data;
}

// Obtener administrador por ID
export async function getAdministradorById(id) {
  const res = await api.get(`${API_URL}/${id}`);
  return res.data;
}

// Buscar administradores por nombre
export async function searchAdministradores(nombre) {
  const res = await api.get(`${API_URL}/buscar/${encodeURIComponent(nombre)}`);
  return res.data;
}

// Buscar administradores por nombre y apellidos
export async function buscarAdministradoresPorNombreApellidos(nombre, aPaterno, aMaterno) {
  const params = new URLSearchParams();
  if (nombre) params.append("nombre", nombre);
  if (aPaterno) params.append("aPaterno", aPaterno);
  if (aMaterno) params.append("aMaterno", aMaterno);
  const res = await api.get(`${API_URL}/buscar?${params.toString()}`);
  return res.data;
}

// Buscar administradores por rango de fechas
export async function buscarAdministradoresPorFechas(inicio, fin) {
  const res = await api.get(`${API_URL}/buscar/fechas?inicio=${inicio}&fin=${fin}`);
  return res.data;
}

// Crear administrador
export async function createAdministrador(payload) {
  const res = await api.post(API_URL, payload);
  return res.data;
}

// Actualizar administrador
export async function updateAdministrador(id, payload) {
  const res = await api.put(`${API_URL}/${id}`, payload);
  return res.data;
}

// Eliminar administrador
export async function deleteAdministrador(id) {
  const res = await api.delete(`${API_URL}/${id}`);
  return res.data;
}

// Cambiar estado de administrador
export async function cambiarEstadoAdministrador(id, estado) {
  if (typeof estado !== "boolean") {
    throw new Error("El valor de 'estado' debe ser booleano.");
  }
  const url = `${API_URL}/${id}/estado?estado=${encodeURIComponent(estado)}`;
  const res = await api.patch(url);
  return res.data;
}

// Obtener clientes que hicieron reserva en una de las canchas de un administrador
export async function getClientesPorAdministrador(id) {
  const res = await api.get(`${API_URL}/${id}/clientes`);
  return res.data;
}

// Obtener usuarios de control asociados a un administrador
export async function getUsuariosControlPorAdministrador(idAdmin) {
  const res = await api.get(`${API_URL}/${idAdmin}/usuarios-control`);
  return res.data;
}

// Crear usuario de control asociado a un administrador
export async function crearUsuarioControlDesdeAdministrador(idAdmin, payload) {
  const res = await api.post(`${API_URL}/${idAdmin}/usuarios-control`, payload);
  return res.data;
}

// Asignar usuario de control existente a un administrador
export async function asignarUsuarioControlAAdministrador(adminId, usuarioControlId) {
  const res = await api.post(`${API_URL}/${adminId}/usuarios-control/asignar/${usuarioControlId}`);
  return res.data;
}

// NUEVO: Crear usuario y asignarlo automáticamente con una cancha
export async function crearYAsignarUsuarioControlAAdministrador(adminId, userData) {
  console.log(`🚀 INICIANDO PROCESO COMPLETO para admin ${adminId}`);
  
  try {
    // PASO 1: Crear el usuario de control en el sistema
    console.log("📤 Paso 1: Creando usuario en auth...");
    const registroResponse = await api.post('/auth/registro/usuario-control', userData);
    console.log("✅ Usuario creado en auth:", registroResponse.data);
    
    // Esperar un momento para que el backend procese
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // PASO 2: Buscar el usuario recién creado por email
    console.log("🔍 Paso 2: Buscando usuario creado...");
    const usuariosResponse = await api.get('/usuario_control');
    const usuarios = usuariosResponse.data;
    
    const usuarioCreado = usuarios.find(u => u.email === userData.email);
    
    if (!usuarioCreado) {
      throw new Error("No se encontró el usuario recién creado");
    }
    
    console.log(`✅ Usuario encontrado: ID ${usuarioCreado.id}, Nombre: ${usuarioCreado.nombre}`);
    
    // PASO 3: Activar el usuario si está inactivo
    if (usuarioCreado.estado === false) {
      console.log("🔄 Activando usuario...");
      await api.patch(`/api/usuario_control/${usuarioCreado.id}/estado?estado=true`);
    }
    
    // PASO 4: Asignar el usuario al administrador (con cancha automática)
    console.log(`🔗 Paso 3: Asignando usuario ${usuarioCreado.id} al admin ${adminId}...`);
    const asignacionResponse = await api.post(`${API_URL}/${adminId}/usuarios-control/asignar/${usuarioCreado.id}`);
    
    console.log("✅ PROCESO COMPLETADO:", asignacionResponse.data);
    
    // Retornar toda la información
    return {
      ...asignacionResponse.data,
      usuario: usuarioCreado,
      authData: registroResponse.data,
      username: userData.username,
      password: userData.password,
      idUsuario: usuarioCreado.id
    };
    
  } catch (error) {
    console.error("❌ Error en proceso completo:", error);
    
    // Si falla el proceso completo, al menos crear el usuario
    if (error.response?.status === 404 || error.message.includes("No se encontró")) {
      console.log("⚠️ Falló asignación automática, pero el usuario fue creado");
      // Retornar al menos el éxito del registro
      const registroResponse = await api.post('/auth/registro/usuario-control', userData);
      return {
        message: "Usuario creado. Asignación manual requerida.",
        username: userData.username,
        password: userData.password,
        authData: registroResponse.data
      };
    }
    
    throw error;
  }
}

// Función original de registro
export const crearUsuarioControlRegistro = async (userData) => {
  try {
    const response = await api.post('/auth/registro/usuario-control', userData);
    return response.data;
  } catch (error) {
    console.error('Error al registrar usuario de control:', error);
    throw error;
  }
};