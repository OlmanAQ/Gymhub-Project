import React, { useState } from 'react';
import ClientNavBarComponent from './ClientNavBarComponent'
import AdminSuplementsComp from '../administrador/AdminSuplements';
import AdminRewardsComp from '../administrador/AdminRewardsComp';
import ClientSalesView from './ClientSalesView';

const ClienteComponent = () => {
  const [view, setView] = useState('userView');

  const handleShowSuplementosView = () => {
    setView('suplementosView');
  };

  const handleShowRewardsView = () => {
    setView('rewardsView');
  };

  const handleShowSalesView = () => {
    setView('salesView');
  };

  return (
    <>
      <ClientNavBarComponent
        onShowSuplements={handleShowSuplementosView}
        onShowRewards={handleShowRewardsView}
        onShowSales={handleShowSalesView}
      />
      {view === 'suplementosView' && (
        <AdminSuplementsComp
          role="cliente"
        />
      )}
      {view === 'rewardsView' && (
        <AdminRewardsComp
          role="client"
        />
      )}
      {view === 'salesView' && <ClientSalesView />}
    </>
  )
}

export default ClienteComponent;


