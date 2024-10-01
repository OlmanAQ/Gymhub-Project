import { doc, deleteDoc, getDoc, updateDoc} from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../firebaseConfig/firebase';

export const eliminarUsuario = async (usuarioId) => {
  try {
    const usuarioDocRef = doc(db, 'User', usuarioId);
    await deleteDoc(usuarioDocRef);
    console.log('Usuario eliminado correctamente');
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
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