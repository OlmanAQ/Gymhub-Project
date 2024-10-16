import React, { useState, useEffect } from 'react';
import { getAlerts, sendAlert, scheduleAlert, getClientsWithUpcomingPayments, configureGeneralAlert, getGeneralAlertConfig } from '../../cruds/Alert';
import Swal from 'sweetalert2';
import '../../css/AdminAlertView.css';

const AdminAlertView = () => {
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [clients, setClients] = useState([]);
  const [daysBefore, setDaysBefore] = useState(0);
  const [generalAlertMessage, setGeneralAlertMessage] = useState('');

  useEffect(() => {
    const fetchAlerts = async () => {
      const fetchedAlerts = await getAlerts();
      setAlerts(fetchedAlerts);
    };

    const fetchClients = async () => {
      const fetchedClients = await getClientsWithUpcomingPayments();
      setClients(fetchedClients);
    };

    const fetchGeneralAlertConfig = async () => {
      const config = await getGeneralAlertConfig();
      if (config) {
        setGeneralAlertMessage(config.message);
        setDaysBefore(config.daysBefore);
      }
    };

    fetchAlerts();
    fetchClients();
    fetchGeneralAlertConfig();
  }, []);

  const handleSendAlert = async () => {
    if (!newAlert) {
      Swal.fire('Error', 'El mensaje de alerta no puede estar vacío.', 'error');
      return;
    }

    await sendAlert(newAlert);
    setNewAlert('');
    Swal.fire('Éxito', 'Alerta enviada correctamente.', 'success');
  };

  const handleScheduleAlert = async () => {
    if (!newAlert || !scheduleDate) {
      Swal.fire('Error', 'El mensaje de alerta y la fecha no pueden estar vacíos.', 'error');
      return;
    }

    await scheduleAlert(newAlert, scheduleDate);
    setNewAlert('');
    setScheduleDate('');
    Swal.fire('Éxito', 'Alerta programada correctamente.', 'success');
  };

  const handleSendPaymentReminder = async (client) => {
    const message = `Recordatorio: Su próximo pago es el ${client.nextPaymentDate}.`;
    await sendAlert(message, client.id);
    Swal.fire('Éxito', 'Recordatorio de pago enviado correctamente.', 'success');
  };

  const handleConfigureGeneralAlert = async () => {
    if (!generalAlertMessage || daysBefore <= 0) {
      Swal.fire('Error', 'El mensaje de alerta y los días antes del pago no pueden estar vacíos o ser negativos.', 'error');
      return;
    }

    await configureGeneralAlert(generalAlertMessage, daysBefore);
    Swal.fire('Éxito', 'Alerta general configurada correctamente.', 'success');
  };

  return (
    <div className="admin-alert-view">
      <h2>Gestión de Alertas</h2>
      <div className="alert-form">
        <textarea
          placeholder="Escribe el mensaje de alerta..."
          value={newAlert}
          onChange={(e) => setNewAlert(e.target.value)}
        />
        <input
          type="datetime-local"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
        />
        <button onClick={handleSendAlert}>Enviar Alerta</button>
        <button onClick={handleScheduleAlert}>Programar Alerta</button>
      </div>
      <div className="alert-list">
        <h3>Alertas Programadas</h3>
        <ul>
          {alerts.map((alert) => (
            <li key={alert.id}>{alert.message} - {alert.scheduleDate}</li>
          ))}
        </ul>
      </div>
      <div className="client-list">
        <h3>Clientes con Próximos Pagos</h3>
        <ul>
          {clients.map((client) => (
            <li key={client.id}>
              {client.name} - Próximo pago: {client.nextPaymentDate}
              <button onClick={() => handleSendPaymentReminder(client)}>Enviar Recordatorio</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="general-alert-form">
        <h3>Configurar Alerta General</h3>
        <textarea
          placeholder="Escribe el mensaje de alerta general..."
          value={generalAlertMessage}
          onChange={(e) => setGeneralAlertMessage(e.target.value)}
        />
        <input
          type="number"
          placeholder="Días antes del pago"
          value={daysBefore}
          onChange={(e) => setDaysBefore(e.target.value)}
        />
        <button onClick={handleConfigureGeneralAlert}>Configurar Alerta General</button>
      </div>
    </div>
  );
};

export default AdminAlertView;