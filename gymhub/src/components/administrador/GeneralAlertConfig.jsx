import React, { useState, useEffect, useCallback } from 'react';
import { configureGeneralAlert, getGeneralAlertConfig } from '../../cruds/Alert';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/GeneralAlertConfig.css';

const GeneralAlertConfig = ({onClose}) => {
  const [generalAlertMessage, setGeneralAlertMessage] = useState('');
  const [daysBefore, setDaysBefore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGeneralAlertConfig = async () => {
      try {
        const config = await getGeneralAlertConfig();
        if (config) {
          setGeneralAlertMessage(config.message);
          setDaysBefore(config.daysBefore);
        }
      } catch (error) {
        Swal.fire('Error', 'No se pudo cargar la configuración de la alerta general.', 'error');
      }
    };
    fetchGeneralAlertConfig();
  }, []);

  const handleConfigureGeneralAlert = useCallback(async () => {
    if (!generalAlertMessage || daysBefore <= 0) {
      Swal.fire('Error', 'El mensaje de alerta y los días antes del pago no pueden estar vacíos o ser negativos.', 'error');
      return;
    }
    try {
      setIsLoading(true);
      await configureGeneralAlert(generalAlertMessage, daysBefore);
      Swal.fire('Éxito', 'Alerta general configurada correctamente.', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo configurar la alerta general.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [generalAlertMessage, daysBefore]);

  return (
    <div className="card p-4 mt-4 general-alert-form">
      <h3 className="card-title mb-3">Configurar Alerta General</h3>
      <button className="btn-close" onClick={onClose}></button>
      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="Escribe el mensaje de alerta general..."
          value={generalAlertMessage}
          onChange={(e) => setGeneralAlertMessage(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="number"
          className="form-control"
          placeholder="Días antes del pago"
          value={daysBefore}
          onChange={(e) => setDaysBefore(Number(e.target.value))}
        />
      </div>
      <button className="btn btn-success" onClick={handleConfigureGeneralAlert} disabled={isLoading}>
        {isLoading ? 'Configurando...' : 'Configurar Alerta General'}
      </button>
    </div>
  );
};

export default GeneralAlertConfig;