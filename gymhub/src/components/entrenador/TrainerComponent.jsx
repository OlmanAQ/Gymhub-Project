import React, { useState } from 'react';
import EntrenadorNavBarComponent from './EntrenadorNavBarComponent';
import AdminSuplementsComp from '../administrador/AdminSuplements';
import Profile from '../user-info/Profile'; 

const TrainerComponent = () => {
  const [view, setView] = useState('userView');

  const handleShowSuplementosView = () => {
    setView('suplementosView');
  };

  const handleShowProfileView = () => {
    setView('profileView'); // Cambia la vista para mostrar el perfil
  };

  return (
    <>
      <EntrenadorNavBarComponent
        onShowSuplements={handleShowSuplementosView}
        onShowProfile={handleShowProfileView} // Pasa la función de perfil
      />
      {view === 'suplementosView' && (
        <AdminSuplementsComp 
          role="entrenador"
        />
      )}
      {view === 'profileView' && <Profile />}
    </>
  );
};

export default TrainerComponent;
