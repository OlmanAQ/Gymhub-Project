import { db } from '../firebaseConfig/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, setDoc, getDoc } from 'firebase/firestore';

export const sendAlert = async (message, paymentId = null, clientId) => {
  await addDoc(collection(db, 'alerts'), { message, paymentId, clientId, scheduleDate: new Date().toISOString() });
};

export const getClientAlerts = async (clientId) => {
  const q = query(collection(db, 'alerts'), where('clientId', '==', clientId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteAlert = async (alertId) => {
  await deleteDoc(doc(db, 'alerts', alertId));
};

export const getClientsWithUpcomingPayments = async () => {
  const q = query(collection(db, 'Payments'), where('fechaVencimiento', '>', new Date().toISOString()));
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
