import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';

export const actualizarUsuario = async (usuarioId, usuarioNuevo) => {
  try {
    // Limpiar el ID si es necesario (por ejemplo, eliminando una barra al inicio)
    const sanitizedUserId = usuarioId.replace(/^\/+/, '');

    // Imprimir ID recibido y el ID sanitizado
    console.log('ID del usuario recibido:', usuarioId);
    console.log('ID del usuario sanitizado:', sanitizedUserId);

    // Crear una referencia al documento del usuario específico usando el ID sanitizado
    const usuarioDocRef = doc(db, 'User', sanitizedUserId);

    // Obtener el documento actual del usuario
    const usuarioDoc = await getDoc(usuarioDocRef);

    // Imprimir referencia y datos del documento
    console.log('Referencia del documento:', usuarioDocRef.path);
    console.log('Datos del documento obtenido:', usuarioDoc.exists() ? usuarioDoc.data() : 'No existe');

    // Verificar si se encontró el documento del usuario
    if (usuarioDoc.exists()) {
      console.log('Documento encontrado:', usuarioDoc.id); // Depuración

      // Mostrar datos del documento actual
      console.log('Datos actuales del documento:', usuarioDoc.data());

      // Mostrar datos nuevos que se están intentando actualizar
      console.log('Datos a actualizar:', usuarioNuevo);

      // Actualizar el documento con los datos del nuevo usuario
      await updateDoc(usuarioDocRef, usuarioNuevo);

      // Verificar la actualización
      const updatedDoc = await getDoc(usuarioDocRef);
      if (updatedDoc.exists()) {
        console.log('Usuario actualizado correctamente:', updatedDoc.data());
      } else {
        console.log('Error al actualizar el usuario: El documento no existe después de la actualización');
      }
    } else {
      console.log('No se encontró el documento del usuario en la base de datos');
    }
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
  }
};
