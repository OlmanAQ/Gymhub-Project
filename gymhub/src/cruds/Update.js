import { doc, updateDoc, getDoc, collection, query, where, getDocs, setDoc} from 'firebase/firestore';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
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

export const comprarProducto = async (productoId, usuarioId, cantidadMenos) => {
  try {
    const sanitizedProductoId = productoId.replace(/^\/+/, '');
    const productoDocRef = doc(db, 'Sales', sanitizedProductoId);
    const productoDoc = await getDoc(productoDocRef);

    if (productoDoc.exists()) {
      const productoData = productoDoc.data();
      let { quantity, state } = productoData;
      const cantidadNumerica = parseInt(quantity, 10);

      if (cantidadNumerica >= cantidadMenos) {
        const nuevaCantidad = cantidadNumerica - cantidadMenos;
        const nuevoEstado = nuevaCantidad === 0 ? 'Agotado' : 'Disponible';

        await updateDoc(productoDocRef, {
          quantity: nuevaCantidad.toString(),
          state: nuevoEstado
        });

        // Agregar o actualizar en la colección ShopingCar
        const shopingCarRef = collection(db, 'ShopingCar');
        const q = query(shopingCarRef, where("idProduct", "==", productoId), where("idUser", "==", usuarioId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          // Si el producto ya existe en el carrito, actualizar la cantidad
          const carItemRef = querySnapshot.docs[0].ref;
          const carItemData = querySnapshot.docs[0].data();
          const nuevaCantidadCar = parseInt(carItemData.quantity, 10) + cantidadMenos;
          const nuevoTotal = parseInt(productoData.price, 10) * nuevaCantidadCar;

          await updateDoc(carItemRef, {
            quantity: nuevaCantidadCar.toString(),
            totalAmount: nuevoTotal.toString()
          });
        } else {
          // Si no existe, agregarlo al carrito
          const totalAmount = parseInt(productoData.price, 10) * cantidadMenos;
          await setDoc(doc(shopingCarRef), {
            idProduct: productoId,
            idUser: usuarioId,
            name: productoData.name,
            description: productoData.description,
            imageID: productoData.imageID,
            price: productoData.price,
            quantity: cantidadMenos.toString(),
            totalAmount: totalAmount.toString()
          });
        }
      } else {
        throw new Error('Cantidad insuficiente en el stock.');
      }
    }
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
  }
};

export const contarProductosEnCarrito = async (usuarioId) => {
  try {
    const shopingCarRef = collection(db, 'ShopingCar');
    const q = query(shopingCarRef, where("idUser", "==", usuarioId));
    const querySnapshot = await getDocs(q);

    let totalProductos = 0;
    querySnapshot.forEach((doc) => {
      totalProductos += parseInt(doc.data().quantity, 10);
    });

    return totalProductos;
  } catch (error) {
    console.error('Error al contar productos en el carrito:', error);
    return 0;
  }
};

export const actualizarContrasena = async (correoUsuarioActual, contrasenaActual, nuevaContrasena) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const credential = EmailAuthProvider.credential(
        correoUsuarioActual,
        contrasenaActual
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, nuevaContrasena);

      console.log('Contraseña actualizada correctamente.');
    } else {
      throw new Error('No hay ningún usuario autenticado.');
    }
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    throw error;
  }
};