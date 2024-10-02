import React, { useState } from 'react';
import ClientNavBarComponent from './ClientNavBarComponent'
import AdminSuplementsComp from '../administrador/AdminSuplements'; 

const ClienteComponent = () => {
  const [view, setView] = useState('userView');

  const handleShowSuplementosView = () => {
    setView('suplementosView');
  };

  return (
    <>
      <ClientNavBarComponent 
        onShowSuplements={handleShowSuplementosView}
      />
      {view === 'suplementosView' && ( 
        <AdminSuplementsComp 
          role = "cliente"
        />
      )}
    </>
)
}

export default ClienteComponent