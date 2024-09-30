import React, { useState } from 'react';
import AdminNavBarComponent from './AdminNavBarComponent';
import AdminUserView from './AdminUserView';
import AdminRegisterUser from './AdminRegisterUser';
import AdminUpdateUser from './AdminUpdateUser';
import AdminInventoryView from './AdminInventoryView';
import AdminRegisterInventory from './AdminRegisterInventory';
import AdminEditInventory from './AdminEditInventory';
import AdminSuplements from './AdminSuplements'
import AdminAddSuplement from './AdminAddSuplement';
import AdminEditSuplement from './AdminEditSuplement';

const AdminComponent = () => {
  const [view, setView] = useState('userView');
  const [selectedUser, setSelectedUser] = useState(null);
  const [gimnasioId, setGimnasioId] = useState(null);
  const [equipoId, setEquipoId] = useState(null);
  const [selectedSuplement, setSelectedSuplement] = useState(null);


  const handleShowRegisterUser = () => {
    setView('registerUser');
  };

  const handleShowUserView = () => {
    setView('userView');
  };

  const handleShowInventoryView = () => {
    setView('inventoryView');
  };

  const handleShowSuplementosView = () => {
    setView('suplementosView');
  };

  const handleShowAddSuplementsView = () => {
    setView('addSuplementsView');
  };

  const handleShowEditSuplement = (suplement) => {
    setSelectedSuplement(suplement);
    setView('editSuplementsView');
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

  return (
    <>
      <AdminNavBarComponent 
        onShowInventory={handleShowInventoryView} 
        onShowUserView={handleShowUserView}
        onShowSuplementos={handleShowSuplementosView} 
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
      {view === 'suplementosView' && ( 
        <AdminSuplements 
          onShowAddSuplements={handleShowAddSuplementsView}
          onShowEditSuplements={handleShowEditSuplement}
        />
      )}
      {view === 'addSuplementsView' && <AdminAddSuplement onClose={handleShowSuplementosView} />}
      {view === 'editSuplementsView' && (
        <AdminEditSuplement
          suplemento={selectedSuplement} // Pasar el suplemento seleccionado
          onClose={handleShowSuplementosView} // Función para cerrar la vista de edición
        />
      )}

    </>
  );
};

export default AdminComponent;