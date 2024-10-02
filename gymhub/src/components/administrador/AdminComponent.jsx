import React, { useState } from 'react';
import AdminNavBarComponent from './AdminNavBarComponent';
import AdminUserView from './AdminUserView';
import AdminRegisterUser from './AdminRegisterUser';
import AdminUpdateUser from './AdminUpdateUser';
import AdminInventoryView from './AdminInventoryView';
import AdminRegisterInventory from './AdminRegisterInventory';
import AdminEditInventory from './AdminEditInventory';
import ProfileView from '../ProfileView';
import AdminExpenseView   from './AdminExpenseView';
import AdminRegisterExpense from './AdminRegisterExpense';
import AdminEditExpense from './AdminEditExpense';

const AdminComponent = () => {
  const [view, setView] = useState('userView');
  const [selectedUser, setSelectedUser] = useState(null);
  const [gimnasioId, setGimnasioId] = useState(null);
  const [equipoId, setEquipoId] = useState(null);
  const [gastoId, setGastoId] = useState(null);

  const handleShowRegisterUser = () => {
    setView('registerUser');
  };
  const handleShowUserView = () => {
    setView('userView');
  };

  const handleShowInventoryView = () => {
    setView('inventoryView');
  };

  const handleShowUpdateUser = (user) => {
    setSelectedUser(user);
    setView('updateUser');
  };

  const handleShowRegisterInventory = (gimnasioId) => {
    setGimnasioId(gimnasioId);
    setView('registerInventory');
  };

  const handleShowEditInventory = (gimnasioId, equipoId) => {
    setGimnasioId(gimnasioId);
    setEquipoId(equipoId);
    setView('editInventory');
  };


  const handleShowExpenseView = () => {
    setView('expenseView');
  }

  const handleShowRegisterExpense = () => {
    setView('registerExpense');
  }

  const handleShowEditExpense = (gastoId) => {
    setGastoId(gastoId);
    setView('editExpense');
  }

  const handleShowProfileView = () => {
    setView('profileView');
  }

  return (
    <>
      <AdminNavBarComponent
        onShowInventory={handleShowInventoryView}
        onShowUserView={handleShowUserView}
        onShowProfileView={handleShowProfileView}
        onShowExpenseView={handleShowExpenseView}
      />
      {view === 'userView' && (
        <AdminUserView
          onShowRegisterUser={handleShowRegisterUser}
          onShowUpdateUser={handleShowUpdateUser}
        />
      )}
      {view === 'registerUser' && <AdminRegisterUser onClose={handleShowUserView} />}
      {view === 'updateUser' && (
        <AdminUpdateUser
          user={selectedUser}
          onClose={handleShowUserView}
        />
      )}
      {view === 'inventoryView' && (
        <AdminInventoryView
          onShowRegisterInventory={handleShowRegisterInventory}
          onShowEditInventory={handleShowEditInventory}
        />
      )}
      {view === 'registerInventory' && (
        <AdminRegisterInventory
          gimnasioId={gimnasioId}
          onClose={handleShowInventoryView}
        />
      )}
      {view === 'editInventory' && (
        <AdminEditInventory
          gimnasioId={gimnasioId}
          equipoId={equipoId}
          onClose={handleShowInventoryView}
        />
      )}
      {view === 'profileView' && <ProfileView onClose={handleShowUserView} />}
      {view === 'expenseView' && (
        <AdminExpenseView
          onShowRegisterExpense={handleShowRegisterExpense}
          onShowEditExpense={handleShowEditExpense}
        />
      )}
      {view === 'registerExpense' && <AdminRegisterExpense onClose={handleShowExpenseView} />}
      {view === 'editExpense' && (
        <AdminEditExpense
          gastoId={gastoId}
          onClose={handleShowExpenseView}
        />
      )}
    </>
  );
};

export default AdminComponent;
