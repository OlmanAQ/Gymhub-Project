import React, { useState } from 'react';
import AdminNavBarComponent from './AdminNavBarComponent';
import AdminUserView from './AdminUserView';
import AdminRegisterUser from './AdminRegisterUser';
import AdminUpdateUser from './AdminUpdateUser';

const AdminComponent = () => {
  const [view, setView] = useState('userView'); 
  const [selectedUser, setSelectedUser] = useState(null); // Nuevo estado para el usuario seleccionado

  const handleShowRegisterUser = () => {
    setView('registerUser');
  };

  const handleShowUserView = () => {
    setView('userView');
  };

  const handleShowUpdateUser = (user) => {
    setSelectedUser(user); // Establecer el usuario seleccionado
    setView('updateUser');
  };

  return (
    <>
      <AdminNavBarComponent />
      {view === 'userView' && (
        <AdminUserView 
          onShowRegisterUser={handleShowRegisterUser} 
          onShowUpdateUser={handleShowUpdateUser} 
        />
      )}
      {view === 'registerUser' && <AdminRegisterUser onClose={handleShowUserView} />}
      {view === 'updateUser' && (
        <AdminUpdateUser 
          user={selectedUser} // Pasar el usuario seleccionado como prop
          onClose={handleShowUserView} 
        />
      )}
    </>
  );
};

export default AdminComponent;
