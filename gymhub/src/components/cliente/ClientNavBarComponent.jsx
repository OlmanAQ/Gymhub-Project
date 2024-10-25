import React, { useState } from 'react';
import { User } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import appFirebase from '../../firebaseConfig/firebase';
import '../../css/ClientNavBarComponent.css';
import logo from '../../assets/LogoGymHub.png';

const auth = getAuth(appFirebase);

const ClientNavBarComponent = ({ onShowSuplements, onShowRewards, onShowSales, onShowPlan, onShowProfile, onShowAlerts }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log('Sesión cerrada');
    }).catch((error) => {
      console.log('Error al cerrar sesión', error);
    });
  };

  return (
    <nav class="navbar bg-body-tertiary navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
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
                <a class="nav-link" href="#suplementos" onClick={onShowSuplements}>Suplementos</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#recompensas" onClick={onShowRewards}>Recompensas</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#ventas" onClick={onShowSales}>Ventas</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#planes" onClick={onShowPlan}>Planes</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#alertas" onClick={onShowAlerts}>Alertas</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="dropdown">
          <button class="btn btn-dark dropdown-toggle" type="button" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <User size={24} />
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#perfil" onClick={onShowProfile}>Perfil</a></li>
            <li><a class="dropdown-item" href="#cerrar-sesión" onClick={handleLogout}>Cerrar sesión</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavBarComponent;
