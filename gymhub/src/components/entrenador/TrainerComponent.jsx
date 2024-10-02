import React, { useState } from 'react';
import EntrenadorNavBarComponent from './EntrenadorNavBarComponent'
import AdminSuplementsComp from '../administrador/AdminSuplements'

const TrainerComponent = () => {
  const [view, setView] = useState('userView');

  const handleShowSuplementosView = () => {
    setView('suplementosView');
  };

  return (
    <>
      <EntrenadorNavBarComponent
        onShowSuplements={handleShowSuplementosView}
      />
      {view === 'suplementosView' && ( 
        <AdminSuplementsComp 
          role = "entrenador"
        />
      )}
    </>
  )
}

export default TrainerComponent