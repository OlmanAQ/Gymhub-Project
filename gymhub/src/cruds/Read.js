import { collection, query, where, getDocs, getDoc, doc} from 'firebase/firestore';

import { db } from '../firebaseConfig/firebase';

export const verificarCorreoExistente = async (correo) => {
  try {
    // Crear una consulta a la colección 'User' para verificar si existe un documento con el correo proporcionado
    const q = query(collection(db, 'User'), where('correo', '==', correo));
    
    // Ejecutar la consulta
    const querySnapshot = await getDocs(q);

    // Verificar si se encontró algún documento
    if (!querySnapshot.empty) {
      return true; // El correo ya está registrado
    } else {
      return false; // El correo no está registrado
    }
  } catch (error) {
    console.error('Error al verificar el correo: ', error);
    throw new Error('No se pudo verificar el correo.');
  }
};

export const verificarUsuario = async (usuario) => {
    try {
      // Crear una consulta a la colección 'User' para verificar si existe un documento con el usuario proporcionado
      const q = query(collection(db, 'User'), where('usuario', '==', usuario));
      
      // Ejecutar la consulta
      const querySnapshot = await getDocs(q);
  
      // Verificar si se encontró algún documento
      if (!querySnapshot.empty) {
        return true; // El usuario ya está registrado
      } else {
        return false; // El usuario no está registrado
      }
    } catch (error) {
      console.error('Error al verificar el usuario: ', error);
      throw new Error('No se pudo verificar el usuario.');
    }
};

export const obtenerTodosLosUsuarios = async (sortOption) => {
  try {
    const q = query(collection(db, 'User'));
    const querySnapshot = await getDocs(q);

    // Mapear los documentos a un array de objetos
    const usuarios = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Función para convertir fecha en formato dd/mm/yyyy a un objeto Date
    const parseFecha = (fechaStr) => {
      const [day, month, year] = fechaStr.split('/').map(Number);
      return new Date(year, month - 1, day); // Meses en JavaScript están basados en 0
    };

    // Obtener la fecha actual sin la parte de la hora
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // Ajustar la hora para la comparación de fechas

    // Ordenar los usuarios según la opción de ordenación
    if (sortOption === 'Nombre completo (A-Z)') {
      usuarios.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (sortOption === 'Usuario (A-Z)') {
      usuarios.sort((a, b) => a.usuario.localeCompare(b.usuario));
    } else if (sortOption === 'Recientes') {
      usuarios.sort((a, b) => {
        const fechaInscripcionA = parseFecha(a.fechaInscripcion);
        const fechaInscripcionB = parseFecha(b.fechaInscripcion);
        fechaInscripcionA.setHours(0, 0, 0, 0);
        fechaInscripcionB.setHours(0, 0, 0, 0);

        // Calcular la diferencia en días entre la fecha de inscripción y la fecha actual
        const diffA = Math.abs(fechaActual - fechaInscripcionA);
        const diffB = Math.abs(fechaActual - fechaInscripcionB);

        // Ordenar en orden ascendente de proximidad a la fecha actual
        return diffA - diffB;
      });
    } else if (sortOption === 'Rol') {
      const rolesOrder = { 'administrador': 1, 'entrenador': 2, 'cliente': 3 };
      usuarios.sort((a, b) => rolesOrder[a.rol] - rolesOrder[b.rol]);
    } else if (sortOption === 'Tipo de membresía') {
      const membresiasOrder = { 'Dia': 1, 'Semana': 2, 'Mes': 3, 'Año': 4 };
      usuarios.sort((a, b) => membresiasOrder[a.tipoMembresia] - membresiasOrder[b.tipoMembresia]);
    }

    return usuarios;
  } catch (error) {
    console.error('Error al obtener los usuarios: ', error);
    throw new Error('No se pudo obtener la lista de usuarios.');
  }
};

export const obtenerInfoUsuario = async (correo, usuario) => {
  try {
    const q = query(
      collection(db, 'User'),
      where('correo', '==', correo),
      where('usuario', '==', usuario)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const usuarioDoc = querySnapshot.docs[0];
      return { id: usuarioDoc.id, ...usuarioDoc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el usuario: ', error);
    throw new Error('No se pudo obtener la información del usuario.');
  }
};


export const obtenerInfoUsuarioCorreo = async (correo) => {
  try {
    const q = query(
      collection(db, 'User'),
      where('correo', '==', correo),
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const usuarioDoc = querySnapshot.docs[0];
      return { id: usuarioDoc.id, ...usuarioDoc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el usuario: ', error);
    throw new Error('No se pudo obtener la información del usuario.');
  }
};