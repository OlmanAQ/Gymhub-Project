import React, { useState } from 'react';
import logo from '../../assets/LogoGymHub.png';
import { User } from 'lucide-react';
import '../../css/AdminNavBarComponent.css';
import appFirebase from '../../firebaseConfig/firebase';
import TrainerCreatePlanComponent from './TrainerCreatePlanComponent';
import TrainerSearchPlanComponent from './TrainerSearchPlanComponent';
import EntrenadorInventoryView from './EntrenadorInventoryView';
import EntrenadorEditInventory from './EntrenadorEditInventory';
import ClientSalesView from '../cliente/ClientSalesView';
import { getAuth } from 'firebase/auth';

const auth = getAuth(appFirebase);

const EntrenadorNavBarComponent = ({onShowProfile,ProfileView, onShowSuplements }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [showProfileVIew, setShowProfileView] = useState(false);
  const [showTrainingPlans, setShowTrainingPlans] = useState(false);
  const [showSearchPlanComp, setShowSearchPlanComp] = useState(false);
  const [showInventario, setShowInventario] = useState(false);
  const [showEditInventory, setShowEditInventory] = useState(false);
  const [showSales, setShowSales] = useState(false);
  const [gimnasioId, setGimnasioId] = useState('');
  const [equipoId, setEquipoId] = useState('');

  const handleShowProfileView = () => {
    onShowProfile();
    setDropdownVisible(false);
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
        console.log('Sesión cerrada');
    }).catch((error) => {
        console.log('Error al cerrar sesión', error);
    });
  };

  const handleSearchPlansClick = () => {
    setShowSearchPlanComp(true);
    setShowTrainingPlans(false);
    setShowSales(false);
  };

  const handleInventarioClick = () => {
    setShowInventario(true);
    setShowTrainingPlans(false);
    setShowSearchPlanComp(false);
    setShowEditInventory(false);
    setShowSales(false);
  };

  const handleEditInventory = (gimnasioId, equipoId) => {
    setGimnasioId(gimnasioId);
    setEquipoId(equipoId);
    setShowEditInventory(true);
    setShowInventario(false);
    setShowSales(false);
  };

  const handleSalesClick = () => {
    setShowSales(true);
    setShowTrainingPlans(false);
    setShowSearchPlanComp(false);
    setShowInventario(false);
    setShowEditInventory(false);
  };
  

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="navbar-menu">
          <li><a href="#planes" onClick={handleSearchPlansClick}>Planes de entrenamiento</a></li>
          <li><a href="#suplementos" onClick={onShowSuplements}>Suplementos</a></li>
          <li><a href="#inventario de maquinas">Máquinas</a></li>
          <li><a href="#inventario" onClick={handleInventarioClick}>Inventario</a></li>
          <li><a href="#ventas" onClick={handleSalesClick}>Ventas</a></li>
        </ul>
        <div
          className="navbar-profile"
          onMouseEnter={() => setDropdownVisible(true)}
          onMouseLeave={() => setDropdownVisible(false)}
        >
          <User className="navbar-icon" />
          <span className="navbar-username">Mi Perfil</span>
          {isDropdownVisible && (
            <ul className="navbar-dropdown">
              <li><a href="#ver-perfil" onClick={handleShowProfileView}>Ver perfil</a></li>
              <li><a href="#cerrar-sesion" onClick={handleLogout}>Cerrar sesión</a></li>
            </ul>
          )}
        </div>
      </nav>

      <div className="content">
        {showProfileVIew && <ProfileView onClose={handleSearchPlansClick}/>}
        {showTrainingPlans && <TrainerCreatePlanComponent />}
        {showSearchPlanComp && <TrainerSearchPlanComponent />}
        {showInventario && <EntrenadorInventoryView onShowEditInventory={handleEditInventory} />}
        {showEditInventory && <EntrenadorEditInventory gimnasioId={gimnasioId} equipoId={equipoId} onClose={handleInventarioClick}/>}
        {showSales && <ClientSalesView />}
      </div>
    </div>
  );
};

export default EntrenadorNavBarComponent;
