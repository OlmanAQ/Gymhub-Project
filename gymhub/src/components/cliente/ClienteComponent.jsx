import React, { useState } from 'react';
import ClientNavBarComponent from './ClientNavBarComponent';
import AdminSuplementsComp from '../administrador/AdminSuplements';
import AdminRewardsComp from '../administrador/AdminRewardsComp';
import ClientSalesView from './ClientSalesView';
import ClientPlanViewComponent from './ClientPlanViewComponent';
import Profile from '../user-info/Profile';

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

  // Nueva función para mostrar la vista del perfil
  const handleShowProfile = () => {
    setView('profileView');
  };

  return (
    <>
      <ClientNavBarComponent
        onShowSuplements={handleShowSuplementosView}
        onShowRewards={handleShowRewardsView}
        onShowSales={handleShowSalesView}
        onShowPlan={handleShowPlanView}
        onShowProfile={handleShowProfile} 
      />
      {view === 'suplementosView' && (
        <AdminSuplementsComp role="cliente" />
      )}
      {view === 'rewardsView' && (
        <AdminRewardsComp role="client" />
      )}
      {view === 'salesView' && <ClientSalesView />}
      {view === 'planView' && <ClientPlanViewComponent />}
      {view === 'profileView' && <Profile />}
    </>
  );
};

export default ClienteComponent;
