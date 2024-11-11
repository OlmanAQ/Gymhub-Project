import { collection, doc, setDoc, getDocs, deleteDoc, query, where, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';

// Obtener la lista de gimnasios
export const obtenerGimnasios = async () => {
  const gymRef = collection(db, 'gimnasios');
  const snapshot = await getDocs(gymRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Obtener inventario de un gimnasio específico
export const obtenerInventarioPorGimnasio = async (gimnasioId) => {
  console.log(gimnasioId);
  const inventoryRef = collection(db, 'gimnasios', gimnasioId, 'inventario');
  const snapshot = await getDocs(inventoryRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Agregar un producto a un gimnasio específico
export const agregarProducto = async ({ gimnasioId, producto }) => {
  // Verificar si `zonas` existe y tiene elementos, si no, eliminar `zonas`
  if (producto.zonas && producto.zonas.length === 0) {
    delete producto.zonas;
  }

  const inventoryRef = collection(db, 'gimnasios', gimnasioId, 'inventario');
  const docRef = doc(inventoryRef);
  await setDoc(docRef, producto);
  return { id: docRef.id, ...producto };
};


// Obtener un producto específico por ID
export const obtenerProductoPorId = async (gimnasioId, productoId) => {
  const productRef = doc(db, 'gimnasios', gimnasioId, 'inventario', productoId);
  const productDoc = await getDoc(productRef);
  if (productDoc.exists()) {
    return { id: productDoc.id, ...productDoc.data() };
  } else {
    throw new Error('Producto no encontrado');
  }
};

// Actualizar un producto específico
export const actualizarProducto = async (gimnasioId, productoId, producto) => {
  const productRef = doc(db, 'gimnasios', gimnasioId, 'inventario', productoId);
  await setDoc(productRef, producto, { merge: true });
  return { id: productRef.id, ...producto };
};


// Eliminar un producto del inventario de un gimnasio
export const eliminarProducto = async (gimnasioId, id) => {
  const productRef = doc(db, 'gimnasios', gimnasioId, 'inventario', id);
  await deleteDoc(productRef);
};


