import React, { useState, useEffect, useCallback } from 'react';
import { getClientAlerts, deleteAlert } from '../../cruds/Alert';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/ClientAlertView.css';

const ClientAlertView = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setIsLoading(true);
        const clientId = 'current-client-uid'; // Replace this with the actual client UID logic
        const fetchedAlerts = await getClientAlerts(clientId);
        setAlerts(fetchedAlerts);
      } catch (error) {
        Swal.fire('Error', 'No se pudo cargar las alertas.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const handleDeleteAlert = useCallback(async (alertId) => {
    try {
      await deleteAlert(alertId);
      setAlerts((prevAlerts) => prevAlerts.filter(alert => alert.id !== alertId));
      Swal.fire('Éxito', 'Alerta eliminada correctamente.', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo eliminar la alerta.', 'error');
    }
  }, []);

  return (
    <div className="container mt-4 client-alert-view">
      <h2 className="mb-4">Alertas de Pagos</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col">Mensaje</th>
              <th scope="col">Fecha Programada</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.message}</td>
                  <td>{alert.scheduleDate.split(',')[0]}</td>
                  <td>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">No hay alertas disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientAlertView;

