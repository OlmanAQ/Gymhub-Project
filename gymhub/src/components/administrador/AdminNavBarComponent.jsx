import React, { useState } from 'react';
import logo from '../../assets/LogoGymHub.png';
import { User } from 'lucide-react';
import '../../css/AdminNavBarComponent.css';
import appFirebase from '../../firebaseConfig/firebase';
import { getAuth } from 'firebase/auth'; 

const auth = getAuth(appFirebase);


const AdminNavBarComponent = ({  
  onShowInventory, onShowUserView, onShowSales, 
  onShowProfile, onShowSuplementos, onShowRewards,
  onShowGastosStd,onShowPagosStd, onShowExpenseView, 
  onShowPayments, onShowAlertView }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log('Sesión cerrada');
    }).catch((error) => {
      console.log('Error al cerrar sesión', error);
    });
  };

  const handleShowProfile = () => {
    onShowProfile();
    setDropdownVisible(false);
  };

  return (
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
                <a class="nav-link" href="#usuarios" onClick={onShowUserView}>Usuarios</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#alertas" onClick={onShowAlertView}>Alertas</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#inventario" onClick={onShowInventory}>Inventario</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#gastos" onClick={onShowExpenseView}>Gastos</a>
              </li>
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#estadisticas"
                  id="statsDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Estadísticas
                </a>
                <ul class="dropdown-menu" aria-labelledby="statsDropdown">
                  <li>
                    <a class="dropdown-item" href="#estadisticas-gastos" onClick={onShowGastosStd}>
                      De gastos
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#estadisticas-ingresos" onClick={onShowPagosStd}>
                      De ingresos
                    </a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#suplementos" onClick={onShowSuplementos}>Suplementos</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#premiación" onClick={onShowRewards}>Premiación</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#ventas" onClick={onShowSales}>Ventas</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#pagos" onClick={onShowPayments}>Pagos</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="dropdown">
          <button class="btn btn-dark dropdown-toggle" type="button" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            <User size={24} />
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#perfil" onClick={handleShowProfile}>Perfil</a></li>
            <li><a class="dropdown-item" href="#cerrar-sesión" onClick={handleLogout}>Cerrar sesión</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavBarComponent;
