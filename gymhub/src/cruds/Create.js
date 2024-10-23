import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth, storage } from '../firebaseConfig/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import UserTypes from '../utils/UsersTipos';

export const agregarClienteConRol = async (cliente) => {
  try {
    const { uid } = auth.currentUser;

    delete cliente.contrasena;

    const clienteConRol = {
      ...cliente,
      rol: UserTypes.CLIENTE, 
      uid: uid, 
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, 'User'), clienteConRol);
    console.log('Cliente agregado exitosamente con fecha de creación');
  } catch (error) {
    console.error('Error al agregar el cliente: ', error);
  }
};

export const agregarUsuario = async (usuario) => {
  try {
    const { uid } = auth.currentUser;

    delete usuario.contrasena;

    const usuarioConUID = {
      ...usuario,
      uid: uid,
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, 'User'), usuarioConUID);
    console.log('Usuario agregado exitosamente con fecha de creación');
  } catch (error) {
    console.error('Error al agregar el usuario: ', error);
  }
};

export const agregarProducto = async (producto, imagen) => {
  try {
    const storageRef = ref(storage, `products/${imagen.name}`);
    const snapshot = await uploadBytes(storageRef, imagen);
    console.log('Imagen subida exitosamente:', snapshot);

    const imageUrl = await getDownloadURL(snapshot.ref);
    console.log('URL de descarga de la imagen:', imageUrl);

    const productoConImagen = {
      ...producto,
      imageID: imageUrl,
    };

    await addDoc(collection(db, 'Sales'), productoConImagen);
    console.log('Producto agregado exitosamente con imagen.');
  } catch (error) {
    console.error('Error al agregar el producto: ', error);
  }
};
