import { addDoc, collection} from 'firebase/firestore';
import { db, auth, storage } from '../firebaseConfig/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const agregarClienteConRol = async (cliente) => {
    try {
      // uid del usuario actual
      const { uid } = auth.currentUser;
      //elimnar contraseña de cliente
      delete cliente.contrasena;
      
      const clienteConRol = {
        ...cliente,
        rol: 'cliente',
        uid: uid
      };
      await addDoc(collection(db, 'User'), clienteConRol);
      console.log('Cliente agregado exitosamente');
    } catch (error) {
      console.error('Error al agregar el cliente: ', error);
    }
};

export const agregarUsuario = async (usuario) => {
  try {
    await addDoc(collection(db, 'User'), usuario);
    console.log('Usuario agregado exitosamente');
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