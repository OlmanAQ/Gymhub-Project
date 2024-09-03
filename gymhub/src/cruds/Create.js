import { doc, setDoc} from 'firebase/firestore';
import { db, auth } from '../firebaseConfig/firebase';


const agregarClienteConRol = async (cliente) => {
    try {
      // uid del usuario actual
      const { uid } = auth.currentUser;
      //elimnar contraseña de cliente
      delete cliente.contrasena;
      
      const clienteConRol = {
        ...cliente,
        rol: 'cliente',
      };
      // Añadir el cliente a la colección 'Users' en Firestore con el id del usuario actual
      await setDoc(doc(db, 'User', uid), clienteConRol);
    } catch (error) {
      console.error('Error al agregar el cliente: ', error);
    }
};
  
  export { agregarClienteConRol };