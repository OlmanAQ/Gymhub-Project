import { doc, deleteDoc, getDoc, updateDoc} from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../firebaseConfig/firebase';
import { getFunctions, httpsCallable } from "firebase/functions";

export const eliminarUsuario = async (usuarioId, uid) => {
  try {
    // Paso 1: Elimina el documento del usuario en Firestore
    const usuarioDocRef = doc(db, 'User', usuarioId);
    await deleteDoc(usuarioDocRef);
    console.log('Documento del usuario eliminado de Firestore');

    // Paso 2: Llama a la Cloud Function para eliminar al usuario en Firebase Authentication
    const functions = getFunctions();
    const eliminarUsuarioAuth = httpsCallable(functions, 'eliminarUsuario');

    const result = await eliminarUsuarioAuth({ uid });
    
    if (result.data.success) {
      console.log('Usuario eliminado de Firebase Authentication');
    } else {
      console.error('Error al eliminar el usuario en Authentication:', result.data.message);
    }
  } catch (error) {
    console.error('Error en la función eliminarUsuario:', error.message || error);
  }
};

export const eliminarProducto = async (productoId, imageID) => {
  try {
    const productoDocRef = doc(db, 'Sales', productoId);
    await deleteDoc(productoDocRef);

    const imageRef = ref(storage, imageID);
    await deleteObject(imageRef);

    console.log('Producto e imagen eliminados correctamente');
  } catch (error) {
    console.error('Error al eliminar el producto o la imagen:', error);
  }
};

export const eliminarProductoCarrito = async (productoId, idProduct, quantity) => {
  try {
    const productoRef = doc(db, 'ShopingCar', productoId);
    await deleteDoc(productoRef);
    const productoSalesRef = doc(db, 'Sales', idProduct);
    const productoDoc = await getDoc(productoSalesRef);

    if (productoDoc.exists()) {
      const productoData = productoDoc.data();
      const nuevaCantidad = parseInt(productoData.quantity, 10) + parseInt(quantity, 10);
      await updateDoc(productoSalesRef, {
        quantity: nuevaCantidad.toString(),
      });
    }
  } catch (error) {
    console.error('Error al eliminar el producto del carrito:', error);
  }
};

export const eliminarFactura = async (facturaId) => {
  try {
    const facturaDocRef = doc(db, 'Payments', facturaId);
    await deleteDoc(facturaDocRef);
    console.log(`Factura con ID: ${facturaId} eliminada correctamente.`);
  } catch (error) {
    console.error('Error al eliminar la factura:', error);
  }
};