import React, { useState } from 'react';
import ClientNavBarComponent from './ClientNavBarComponent'
import AdminSuplementsComp from '../administrador/AdminSuplements';
import AdminRewardsComp from '../administrador/AdminRewardsComp';
import ClientSalesView from './ClientSalesView';
import ClientPlanViewComponent from './ClientPlanViewComponent';

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

  const handleShowPlanView = () => {
    setView('planView');
  };

  return (
    <>
      <ClientNavBarComponent
        onShowSuplements={handleShowSuplementosView}
        onShowRewards={handleShowRewardsView}
        onShowSales={handleShowSalesView}
        onShowPlan={handleShowPlanView}
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
      {view === 'planView' && <ClientPlanViewComponent />}
    </>
  )
}

export default ClienteComponent;


