import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';

const verificarCorreoExistente = async (correo) => {
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

const verificarUsuario = async (usuario) => {
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

export { verificarCorreoExistente, verificarUsuario };
