import React, { useState } from 'react';

const GeneralAlertConfig = () => {
  const [alertConfig, setAlertConfig] = useState({
    message: '',
    frequency: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlertConfig({
      ...alertConfig,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para guardar la configuración de la alerta
    console.log('Configuración de alerta guardada:', alertConfig);
  };

  return (
    <div>
      <h2>Configurar Alerta General</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Mensaje de Alerta:</label>
          <input
            type="text"
            name="message"
            value={alertConfig.message}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Frecuencia:</label>
          <input
            type="text"
            name="frequency"
            value={alertConfig.frequency}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Guardar Configuración</button>
      </form>
    </div>
  );
};

export default GeneralAlertConfig;