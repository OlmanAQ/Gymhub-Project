import React, { useState } from 'react';
import ClientNavBarComponent from './ClientNavBarComponent';
import ClientSalesView from './ClientSalesView';

const ClienteComponent = () => {
  const [view, setView] = useState('defaultView');

  const handleShowSalesView = () => {
    setView('salesView');
  };

  return (
    <>
      <ClientNavBarComponent onShowSales={handleShowSalesView} />
      {view === 'defaultView' && <div>Contenido predeterminado</div>}
      {view === 'salesView' && <ClientSalesView />}
    </>
  );
};

export default ClienteComponent;
