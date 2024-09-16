import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';

export const eliminarUsuario = async (usuarioId) => {
  try {
    // Crear una referencia al documento del usuario específico usando el ID
    const usuarioDocRef = doc(db, 'User', usuarioId);

    // Eliminar el documento
    await deleteDoc(usuarioDocRef);

    // Confirmar la eliminación
    console.log('Usuario eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
  }
};
