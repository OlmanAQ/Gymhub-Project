import React from 'react'
import { useState } from 'react'
import ClientNavBarComponent from './ClientNavBarComponent'
import ProfileView from '../ProfileView';
import ClientPlanViewComponent from './ClientPlanViewComponent';




const ClienteComponent = () => {
  const [view, setView] = useState('userView');

  const handleShowProfileView = () => {
    setView('profileView');
  }

  const handleShowPlanView = () => {
    setView('planView');
  }
  

  return (
    <>
      <ClientNavBarComponent 
        onShowProfileView={handleShowProfileView}
        onShowPlanView={handleShowPlanView}
      />
      {view === 'profileView' && (
        <ProfileView onClose={handleShowPlanView} />
      )}
      {view === 'planView' && (
        <ClientPlanViewComponent />
      )}
    </>
  );
}

export default ClienteComponent