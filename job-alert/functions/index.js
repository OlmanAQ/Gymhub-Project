// Importar el SDK de Firebase Functions para configurar los disparadores y el registro.
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// Función para parsear fechas en español a un formato que JavaScript entienda
const parseDateFromSpanish = (dateString) => {
  // Mapeo de meses en español a índices de meses de JavaScript
  const months = {
    'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
    'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
  };

  // Expresión regular para extraer las partes de la fecha
  const regex = /(\d{1,2}) de (\w+) de (\d{4}), (\d{1,2}):(\d{2}):(\d{2}) (AM|PM) UTC([+-]\d+)/;
  const match = dateString.match(regex);

  if (!match) {
    throw new Error('Fecha no válida');
  }

  const [, day, month, year, hours, minutes, seconds, ampm, utcOffset] = match;

  // Convertir horas AM/PM al formato de 24 horas
  let hours24 = parseInt(hours);
  if (ampm === 'PM' && hours24 < 12) {
    hours24 += 12;
  } else if (ampm === 'AM' && hours24 === 12) {
    hours24 = 0;
  }

  // Crear el objeto Date con la información parseada
  const parsedDate = new Date(Date.UTC(
    parseInt(year),
    months[month.toLowerCase()],
    parseInt(day),
    hours24,
    parseInt(minutes),
    parseInt(seconds)
  ));

  // Ajustar el offset UTC
  const offsetHours = parseInt(utcOffset);
  parsedDate.setUTCHours(parsedDate.getUTCHours() + offsetHours);

  return parsedDate;
};

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
      let dueDate;
      try {
        dueDate = parseDateFromSpanish(payment.fechaVencimiento);
      } catch (error) {
        logger.error(`Error parsing date for payment ${payment.id}: ${error.message}`);
        continue; // Saltar al siguiente pago si hay un error en el parsing
      }

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
