import {collection, addDoc} from 'firebase/firestore';
import { db, auth } from '../firebaseConfig/firebase';


const agregarClienteConRol = async (cliente) => {
    try {
      const clienteConRol = {
        ...cliente,
        rol: 'cliente' // Agregar el rol por defecto como "cliente"
      };
  
      // Añadir el cliente a la colección 'Users' en Firebase
      await addDoc(collection(db, 'User'), clienteConRol);
      console.log('Cliente agregado exitosamente');
    } catch (error) {
      console.error('Error al agregar el cliente: ', error);
    }
};
  
  export { agregarClienteConRol };