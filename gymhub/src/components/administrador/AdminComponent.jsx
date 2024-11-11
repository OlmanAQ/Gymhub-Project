import React, { useState } from 'react';
import AdminNavBarComponent from './AdminNavBarComponent';
import AdminUserView from './AdminUserView';
import AdminRegisterUser from './AdminRegisterUser';
import AdminUpdateUser from './AdminUpdateUser';
import AdminInventoryView from './AdminInventoryView';
import AdminRegisterInventory from './AdminRegisterInventory';
import AdminEditInventory from './AdminEditInventory';
import AdminExpenseView from './AdminExpenseView';
import AdminRegisterExpense from './AdminRegisterExpense';
import AdminEditExpense from './AdminEditExpense';
import AdminSuplements from './AdminSuplements';
import AdminAddSuplement from './AdminAddSuplement';
import AdminEditSuplement from './AdminEditSuplement';
import AdminRewardsComp from './AdminRewardsComp';
import AdminAddReward from './AdminAddReward';
import AdminEditReward from './AdminEditReward';
import AdminSalesView from './AdminSalesView';
import AdminGastosEstadistica from './AdminGastosEstadistica';
import AdminPagosEstadistica from './AdminPagosEstadistica';
import AdminAlertView from './AdminAlertView';
import AdminPaymentsView from './AdminPaymentsView';
import AdminPaymentsAdd from './AdminPaymentsAdd';
import AdminPaymentsHistory from './AdminPaymentsHistory';
import GeneralAlertConfig from './GeneralAlertConfig';
import Profile from '../user-info/Profile';

const AdminComponent = ({ setIsAuthenticating }) => {
  const [view, setView] = useState('userView');
  const [selectedUser, setSelectedUser] = useState(null);
  const [gimnasioId, setGimnasioId] = useState(null);
  const [equipoId, setEquipoId] = useState(null);
  const [gastoId, setGastoId] = useState(null);
  const [selectedSuplement, setSelectedSuplement] = useState(null);
  const [selectedReward, setSelectedReward] = useState(null);

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

  const handleShowRewardsView = () => {
    setView('rewardsView');
  };

  const handleShowAddRewardsView = () => {
    setView('addRewardsView');
  };

  const handleShowEditRewardsView = (reward) => {
    setSelectedReward(reward);
    setView('editRewardsView');
  };
  
  const handleShowPaymentsView = () => {
    setView('paymentsView'); 
  };

  const handleShowAddPayment = (user) => {
    setSelectedUser(user);
    setView('addPayment');
  };

  const handleShowPaymentsMain = () => {
    setView('paymentsView');
  };

  const handleShowPaymentHistory = (user) => {
    setSelectedUser(user);
    setView('paymentHistory');
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


  const handleShowGastoStad = () => {
    setView('gastoStad');
  };

  const handleShowPagoStad = () => {
    setView('pagoStad');
  };

  const handleShowExpenseView = () => {
    setView('expenseView');
  };
  

  const handleShowRegisterExpense = () => {
    setView('registerExpense');
  };

  const handleShowEditExpense = (gastoId) => {
    setGastoId(gastoId);
    setView('editExpense');
  };

  const handleShowSalesView = () => {
    setView('salesView');
  };

  const handleShowProfile = () => {
    setView('profileView');
  };

  const handleShowAlertView = () => {
    setView('alertView');
  };

  const handleShowGeneralAlert = () => {
    setView('generalAlert');
  };

  return (
    <>
      <AdminNavBarComponent
        onShowInventory={handleShowInventoryView}
        onShowUserView={handleShowUserView}
        onShowExpenseView={handleShowExpenseView}
        onShowSuplementos={handleShowSuplementosView}
        onShowRewards={handleShowRewardsView}
        onShowPayments={handleShowPaymentsView}
        onShowSales={handleShowSalesView}
        onShowProfile={handleShowProfile}
        onShowGastosStd={handleShowGastoStad}
        onShowPagosStd={handleShowPagoStad}
        onShowAlertView={handleShowAlertView}
      />
      {view === 'paymentsView' && (
        <AdminPaymentsView
          onShowAddPayment={handleShowAddPayment}
          onShowPaymentHistory={handleShowPaymentHistory} // Pasa el manejador de historial
        />
      )}
      {view === 'addPayment' && (
        <AdminPaymentsAdd
          selectedUser={selectedUser}
          onCancel={handleShowPaymentsMain}
        />
      )}
      {view === 'paymentHistory' && (
        <AdminPaymentsHistory
          selectedUser={selectedUser}
          onCancel={handleShowPaymentsMain}
        />
      )}
      {view === 'userView' && (
        <AdminUserView
          onShowRegisterUser={handleShowRegisterUser}
          onShowUpdateUser={handleShowUpdateUser}
        />
      )}
      {view === 'registerUser' && <AdminRegisterUser onClose={handleShowUserView} setIsAuthenticating={setIsAuthenticating} />}
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
      {view === 'suplementosView' && (
        <AdminSuplements
          onShowAddSuplements={handleShowAddSuplementsView}
          onShowEditSuplements={handleShowEditSuplement}
        />
      )}
      {view === 'addSuplementsView' && <AdminAddSuplement onClose={handleShowSuplementosView} />}
      {view === 'editSuplementsView' && (
        <AdminEditSuplement
          suplemento={selectedSuplement}
          onClose={handleShowSuplementosView}
        />
      )}
      {view === 'rewardsView' && (
        <AdminRewardsComp
          onShowAddRewards={handleShowAddRewardsView} 
          onShowEditRewards={handleShowEditRewardsView} 
        />
      )}
      {view === 'addRewardsView' && <AdminAddReward onClose={handleShowRewardsView} />}
      {view === 'editRewardsView' && (
        <AdminEditReward 
          reward={selectedReward}
          onClose={handleShowRewardsView} 
        />
      )}

      {view === 'salesView' && <AdminSalesView />}
      {view === 'alertView' && (
        <AdminAlertView
          onShowGeneralAlertConfig={handleShowGeneralAlert}
        />
      )}
      {view === 'generalAlert' && (
        <GeneralAlertConfig onClose={handleShowAlertView} />
      )}
      {view === 'profileView' && <Profile />}
      {view === 'gastoStad' && <AdminGastosEstadistica />}
      {view === 'pagoStad' && <AdminPagosEstadistica />}
    </>
  );
};

export default AdminComponent;
