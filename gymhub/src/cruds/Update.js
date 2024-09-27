import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';

// Método para actualizar un usuario en la colección "User"
export const actualizarUsuario = async (usuarioId, usuarioNuevo) => {
  try {
    const sanitizedUserId = usuarioId.replace(/^\/+/, '');
    console.log('ID del usuario recibido:', usuarioId);
    console.log('ID del usuario sanitizado:', sanitizedUserId);
    const usuarioDocRef = doc(db, 'User', sanitizedUserId);
    const usuarioDoc = await getDoc(usuarioDocRef);
    console.log('Referencia del documento:', usuarioDocRef.path);
    console.log('Datos del documento obtenido:', usuarioDoc.exists() ? usuarioDoc.data() : 'No existe');
    if (usuarioDoc.exists()) {
      console.log('Documento encontrado:', usuarioDoc.id);
      console.log('Datos actuales del documento:', usuarioDoc.data());
      console.log('Datos a actualizar:', usuarioNuevo);
      await updateDoc(usuarioDocRef, usuarioNuevo);
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

// Método para actualizar un producto en la colección "Sales"
export const actualizarProducto = async (productoId, productoNuevo) => {
  try {
    const sanitizedProductoId = productoId.replace(/^\/+/, '');
    console.log('ID del producto recibido:', productoId);
    console.log('ID del producto sanitizado:', sanitizedProductoId);
    const productoDocRef = doc(db, 'Sales', sanitizedProductoId);
    const productoDoc = await getDoc(productoDocRef);
    console.log('Referencia del documento:', productoDocRef.path);
    console.log('Datos del documento obtenido:', productoDoc.exists() ? productoDoc.data() : 'No existe');
    if (productoDoc.exists()) {
      console.log('Documento encontrado:', productoDoc.id);
      console.log('Datos actuales del documento:', productoDoc.data());
      console.log('Datos a actualizar:', productoNuevo);
      await updateDoc(productoDocRef, productoNuevo);
      const updatedDoc = await getDoc(productoDocRef);
      if (updatedDoc.exists()) {
        console.log('Producto actualizado correctamente:', updatedDoc.data());
      } else {
        console.log('Error al actualizar el producto: El documento no existe después de la actualización');
      }
    } else {
      console.log('No se encontró el documento del producto en la base de datos');
    }
  } catch (error) {
    console.error('Error al actualizar el producto en ventas:', error);
  }
};
