import React, { useState } from 'react';
import ClientNavBarComponent from './ClientNavBarComponent'
import AdminSuplementsComp from '../administrador/AdminSuplements'; 
import AdminRewardsComp from '../administrador/AdminRewardsComp';

const ClienteComponent = () => {
  const [view, setView] = useState('userView');

  const handleShowSuplementosView = () => {
    setView('suplementosView');
  };

  const handleShowRewardsView = () => {
    setView('rewardsView');
  };

  return (
    <>
      <ClientNavBarComponent 
        onShowSuplements={handleShowSuplementosView}
        onShowRewards={handleShowRewardsView}
      />
      {view === 'suplementosView' && ( 
        <AdminSuplementsComp 
          role = "cliente"
        />
      )}
      {view === 'rewardsView' && (
        <AdminRewardsComp 
          role = "client" 
        />
      )}
    </>
)
}

export default ClienteComponent