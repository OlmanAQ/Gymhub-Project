import { doc, deleteDoc, getDoc, updateDoc} from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import { ref, deleteObject } from 'firebase/storage';
import { storage, auth  } from '../firebaseConfig/firebase';
import { deleteUser as deleteAuthUser, getAuth } from 'firebase/auth';

export const eliminarUsuario = async (usuarioId, uid) => {
  try {
    const usuarioDocRef = doc(db, 'User', usuarioId);
    await deleteDoc(usuarioDocRef);
    console.log('Documento del usuario eliminado de Firestore');
    const auth = getAuth();
    const userToDelete = auth.currentUser;
    if (userToDelete && userToDelete.uid === uid) {
      await deleteAuthUser(userToDelete);
      console.log('Usuario eliminado de Firebase Authentication');
    } else {
      console.log('El UID del usuario no coincide o el usuario no está logueado.');
    }
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