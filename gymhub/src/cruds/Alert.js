import { db } from '../firebaseConfig/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, setDoc, getDoc } from 'firebase/firestore';

export const sendAlert = async (message, clientId = null) => {
  await addDoc(collection(db, 'alerts'), { message, clientId, scheduleDate: new Date().toISOString() });
};

export const getClientAlerts = async () => {
  const querySnapshot = await getDocs(collection(db, 'alerts'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteAlert = async (alertId) => {
  await deleteDoc(doc(db, 'alerts', alertId));
};

export const getClientsWithUpcomingPayments = async () => {
  //const q = query(collection(db, 'clients'), where('nextPaymentDate', '>', new Date().toISOString()));
  const q = query(collection(db, 'User'), where('rol', '==', 'Cliente'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const configureGeneralAlert = async (message, daysBefore) => {
  await setDoc(doc(db, 'config', 'generalAlert'), { message, daysBefore });
};

export const getGeneralAlertConfig = async () => {
  const docRef = doc(db, 'config', 'generalAlert');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};