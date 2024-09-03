import {collection, addDoc} from 'firebase/firestore';
import { db, auth } from '../firebaseConfig/firebase';


export const agregarClienteConRol = async (cliente) => {
    try {
      const clienteConRol = {
        ...cliente,
        rol: 'cliente'
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
