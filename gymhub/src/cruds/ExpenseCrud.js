import { collection, doc, setDoc, getDocs, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';

// Obtener la lista de gastos
export const obtenerGastos = async () => {
  const expenseRef = collection(db, 'gastos');
  const snapshot = await getDocs(expenseRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Agregar un nuevo gasto
export const agregarGasto = async (gasto) => {
  const expenseRef = collection(db, 'gastos');
  const docRef = doc(expenseRef);
  await setDoc(docRef, gasto);
  return { id: docRef.id, ...gasto };
};

// Obtener un gasto específico por ID
export const obtenerGastoPorId = async (gastoId) => {
  const expenseRef = doc(db, 'gastos', gastoId);
  const expenseDoc = await getDoc(expenseRef);
  if (expenseDoc.exists()) {
    return { id: expenseDoc.id, ...expenseDoc.data() };
  } else {
    throw new Error('Gasto no encontrado');
  }
};

// Actualizar un gasto específico
export const actualizarGasto = async (gastoId, gasto) => {
  const expenseRef = doc(db, 'gastos', gastoId);
  await setDoc(expenseRef, gasto, { merge: true });
  return { id: expenseRef.id, ...gasto };
};

// Eliminar un gasto
export const eliminarGasto = async (gastoId) => {
  const expenseRef = doc(db, 'gastos', gastoId);
  await deleteDoc(expenseRef);
};