const cron = require('node-cron');
const { checkAndSendPaymentAlerts } = require('./Alert'); // Asegúrate de exportar la función en tu servidor Node.js

// Configura una tarea que se ejecuta diariamente
cron.schedule('0 0 * * *', async () => {
  await checkAndSendPaymentAlerts();
});
