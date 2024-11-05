import React, { useState, useEffect } from 'react';
import { sendAlert, getClientsWithUpcomingPayments, configureGeneralAlert, getGeneralAlertConfig } from '../../cruds/Alert';
import Swal from 'sweetalert2';
import '../../css/AdminAlertView.css';

const AdminAlertView = () => {
  const [clients, setClients] = useState([]);
  const [daysBefore, setDaysBefore] = useState(0);
  const [generalAlertMessage, setGeneralAlertMessage] = useState('');

  useEffect(() => {
  
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

    fetchClients();
    fetchGeneralAlertConfig();
  }, []);
  

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
      <div className="table-container">
        <table class="table">
          <thead class="table-dark">
            <tr>
              <th scope="col">Usuario</th>
              <th scope="col">Próximo Pago</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.usuario}</td>
                <td>{client.nextPaymentDate}</td>
                <td>
                  <button onClick={() => handleSendPaymentReminder(client)}>Enviar Alerta</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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