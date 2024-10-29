import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth, storage } from '../firebaseConfig/firebase'; // Importa db, auth, y storage
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'; // Importación de funciones de Storage
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from 'firebase/auth'; // Importa funciones de Authentication
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

export const agregarUsuario = async (usuario, adminEmail, adminPassword) => {
  try {
    // Crea y autentica temporalmente al nuevo usuario
    const userCredential = await createUserWithEmailAndPassword(auth, usuario.correo, usuario.contrasena);
    const newUser = userCredential.user;

    // Borra la contraseña del usuario antes de guardar en Firestore
    delete usuario.contrasena;

    // Agrega el usuario a la colección 'User' en Firestore con UID
    const usuarioConUID = {
      ...usuario,
      uid: newUser.uid,
      createdAt: serverTimestamp(),
      rol: usuario.rol || UserTypes.CLIENTE
    };

    await addDoc(collection(db, 'User'), usuarioConUID);

    // Desloguea al nuevo usuario
    await signOut(auth);

    // Re-autentica al administrador con las credenciales proporcionadas
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

    console.log('Usuario agregado exitosamente y sesión del administrador restaurada');
  } catch (error) {
    console.error('Error al agregar el usuario: ', error);
    throw error; // Para que el componente pueda manejar el error si es necesario
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

export const agregarFactura = async (factura) => {
  try {
    const facturaConFecha = {
      ...factura,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'Payments'), facturaConFecha);
    console.log('Factura agregada exitosamente');
  } catch (error) {
    console.error('Error al agregar la factura: ', error);
  }
};