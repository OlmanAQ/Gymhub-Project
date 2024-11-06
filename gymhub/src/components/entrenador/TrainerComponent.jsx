import React, { useState } from 'react';
import EntrenadorNavBarComponent from './EntrenadorNavBarComponent';
import AdminSuplementsComp from '../administrador/AdminSuplements';
import TrainerCreatePlanComponent from './TrainerCreatePlanComponent';
import TrainerSearchPlanComponent from './TrainerSearchPlanComponent';
import TrainerEditPlanComponent from './TrainerEditPlanComponent';
import EntrenadorInventoryView from './EntrenadorInventoryView';
import EntrenadorEditInventory from './EntrenadorEditInventory';
import ClientSalesView from '../cliente/ClientSalesView';
import Profile from '../user-info/Profile'; 

const TrainerComponent = () => {
  const [view, setView] = useState('userView');
  const [gimnasioId, setGimnasioId] = useState('');
  const [equipoId, setEquipoId] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');

  const handleShowSuplementosView = () => {
    setView('suplementosView');
  };

  const handleShowProfileView = () => {
    setView('profileView'); 
  };

  const handleShowPlansView = () => {
    setView('plansView'); 
  };

  const handleShowCreatePlansView = () => {
    setView('createPlansView'); 
  };

  const handleShowEditPlanView = (plan) => {
    setSelectedPlan(plan);
    setView('editPlanView'); 
  };

  const handleShowSalesView = () => {
    setView('salesView'); 
  };

  const handleShowInventoryView = () => {
    setView('inventoryView'); 
  };

  const handleShowEditInventoryView = (gimnasioId, equipoId) => {
    setGimnasioId(gimnasioId);
    setEquipoId(equipoId);
    setView('editInventoryView'); 
  };

  return (
    <>
      <EntrenadorNavBarComponent
        onShowSuplements={handleShowSuplementosView}
        onShowProfile={handleShowProfileView} 
        onShowPlans={handleShowPlansView}
        onShowSales={handleShowSalesView}
        onShowInventory={handleShowInventoryView}
      />
      {view === 'suplementosView' && (
        <AdminSuplementsComp 
          role="entrenador"
        />
      )}
      {view === 'profileView' && <Profile />}
      {view === 'plansView' && 
        <TrainerSearchPlanComponent 
          onShowCreatePlan={handleShowCreatePlansView}
          onShowEditPlan={handleShowEditPlanView}
        />
      }
      {view === 'createPlansView' && 
        <TrainerCreatePlanComponent
          onClose={handleShowPlansView} 
        />
      }
      {view === 'editPlanView' && 
        <TrainerEditPlanComponent 
          plan={selectedPlan}
          onClose={handleShowPlansView}
        />
      }

      {view === 'salesView' && <ClientSalesView />}

      {view === 'inventoryView' && 
        <EntrenadorInventoryView 
          onShowEditInventory={handleShowEditInventoryView}
        />
      }

      {view === 'editInventoryView' && (
        <EntrenadorEditInventory
          gimnasioId={gimnasioId}
          equipoId={equipoId}
          onClose={handleShowInventoryView}
        />
      )}
      
    </>
  );
};

export default TrainerComponent;
