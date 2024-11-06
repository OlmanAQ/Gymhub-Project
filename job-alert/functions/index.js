// Importar el SDK de Firebase Functions para configurar los disparadores y el registro.
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// Definir la función programada para verificar y enviar alertas de pago
exports.checkAndSendPaymentAlerts = onSchedule("every 24 hours", async (event) => {
  try {
    // Obtener configuración de alerta general
    const configRef = db.collection('config').doc('generalAlert');
    const configSnap = await configRef.get();
    if (!configSnap.exists) {
      logger.log('No se ha configurado la alerta general.');
      return null;
    }

    const { daysBefore, message } = configSnap.data();
    const now = new Date();

    // Obtener todos los pagos
    const paymentsSnapshot = await db.collection('Payments').get();
    const payments = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Iterar sobre los pagos para encontrar aquellos que necesitan una alerta
    for (const payment of payments) {
      const dueDate = new Date(payment.fechaVencimiento);
      const differenceInDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

      if (differenceInDays <= daysBefore) {
        // Enviar alerta al cliente
        await db.collection('alerts').add({
          message: `${message} Su próximo pago es el ${payment.fechaVencimiento.split(',')[0]}.`,
          paymentId: payment.id,
          clientId: payment.uid,
          scheduleDate: new Date().toISOString()
        });

        // Enviar correo electrónico utilizando la colección `mail` conectada a la extensión de Firebase
        await db.collection('mail').add({
          to: [payment.correo],
          message: {
            subject: 'Alerta de Pago',
            text: `${message} Su próximo pago es el ${payment.fechaVencimiento.split(',')[0]}.`,
            html: `<p>${message} Su próximo pago es el ${payment.fechaVencimiento.split(',')[0]}.</p>`
          }
        });
      }
    }

    logger.log('Proceso de alerta de pagos completado.');
    return null;

  } catch (error) {
    logger.error('Error checking and sending payment alerts: ', error);
    return null;
  }
});
