import React from 'react'
import { useState } from 'react'
import ClientNavBarComponent from './ClientNavBarComponent'
import ProfileView from '../ProfileView';



const ClienteComponent = () => {
  const [view, setView] = useState('userView');

  const handleShowProfileView = () => {
    setView('profileView');
  }

  const handleShowUserView = () => {
    setView('userView');
  }
  

  return (
    <>
      <ClientNavBarComponent 
        onShowProfileView={handleShowProfileView}
      />
      {view === 'userView' && (
        <ProfileView onClose={handleShowUserView} />
      )}
      
    </>
  );
}

export default ClienteComponent