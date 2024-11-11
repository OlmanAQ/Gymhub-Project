import { db } from '../firebaseConfig/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, setDoc, getDoc } from 'firebase/firestore';

export const sendAlert = async (message, paymentId = null, clientId, clientEmail) => {
  await addDoc(collection(db, 'alerts'), { message, paymentId, clientId, scheduleDate: new Date().toISOString() });
  await addDoc(collection(db, 'mail'), {
    to: [clientEmail],
    message: {
      subject: 'Alerta de Pago',
      text: message,
      html: `<p>${message}</p>`
    }
  });
};

export const getClientAlerts = async (clientId) => {
  try {
    const q = query(collection(db, 'alerts'), where('clientId', '==', clientId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting alerts: ', error);
    return [];
  }
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

// Function to check for overdue payments and send alerts if needed
export const checkAndSendPaymentAlerts = async () => {
  try {
    // Get general alert configuration
    const config = await getGeneralAlertConfig();
    if (!config) {
      console.log('No se ha configurado la alerta general.');
      return;
    }

    const { daysBefore, message } = config;
    const now = new Date();

    // Get all payments
    const paymentsSnapshot = await getDocs(collection(db, 'Payments'));
    const payments = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Iterate over payments to find those that need an alert
    for (const payment of payments) {
      const dueDate = new Date(payment.fechaVencimiento);
      const differenceInDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

      if (differenceInDays <= daysBefore) {
        // Send alert to the client
        await sendAlert(
          `${message} Su próximo pago es el ${payment.fechaVencimiento.split(',')[0]}.`,
          payment.id,
          payment.uid,
          payment.correo
        );
      }
    }
  } catch (error) {
    console.error('Error checking and sending payment alerts: ', error);
  }
};
