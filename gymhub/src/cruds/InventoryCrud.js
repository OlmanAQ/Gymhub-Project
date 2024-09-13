import { collection, doc, setDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';

// Obtener la lista de gimnasios
export const obtenerGimnasios = async () => {
  const gymRef = collection(db, 'gimnasios');
  const snapshot = await getDocs(gymRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Obtener inventario de un gimnasio específico
export const obtenerInventarioPorGimnasio = async (gimnasioId) => {
  const inventoryRef = collection(db, 'gimnasios', gimnasioId, 'inventario');
  const snapshot = await getDocs(inventoryRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Agregar un producto a un gimnasio específico
export const agregarProducto = async (gimnasioId, producto) => {
  const inventoryRef = collection(db, 'gimnasios', gimnasioId, 'inventario');
  const docRef = doc(inventoryRef);
  await setDoc(docRef, producto);
  return { id: docRef.id, ...producto };
};

// Eliminar un producto del inventario de un gimnasio
export const eliminarProducto = async (gimnasioId, id) => {
  const productRef = doc(db, 'gimnasios', gimnasioId, 'inventario', id);
  await deleteDoc(productRef);
};
