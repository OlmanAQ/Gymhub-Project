import React, { useState, useEffect } from 'react';
import { getClientAlerts, deleteAlert } from '../../cruds/Alert';
import Swal from 'sweetalert2';
import '../../css/ClientAlertView.css';

const ClientAlertView = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      const fetchedAlerts = await getClientAlerts();
      setAlerts(fetchedAlerts);
    };

    fetchAlerts();
  }, []);

  const handleDeleteAlert = async (alertId) => {
    await deleteAlert(alertId);
    setAlerts(alerts.filter(alert => alert.id !== alertId));
    Swal.fire('Éxito', 'Alerta eliminada correctamente.', 'success');
  };

  return (
    <div className="client-alert-view">
      <h2>Mis Alertas</h2>
      <ul>
        {alerts.map((alert) => (
          <li key={alert.id}>
            {alert.message}
            <button onClick={() => handleDeleteAlert(alert.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientAlertView;