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
      <nav class="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="#home">
            <img src={logo} alt="Logo" class="d-inline-block align-text-top" />
            Gymhub
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div className='center' >
            <div class="collapse navbar-collapse" id="navbarSupportedContent" >
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link" aria-current="page" href="#home">Inicio</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#planes" onClick={handleSearchPlansClick}>Planes</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#inventario" onClick={handleInventarioClick}>Inventario</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#ventas" onClick={handleSalesClick}>Ventas</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="dropdown">
            <button class="btn btn-dark dropdown-toggle" type="button" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
              <User size={24} />
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#perfil" onClick={handleShowProfileView}>Perfil</a></li>
              <li><a class="dropdown-item" href="#cerrar-sesión" onClick={handleLogout}>Cerrar sesión</a></li>
            </ul>
          </div>
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
