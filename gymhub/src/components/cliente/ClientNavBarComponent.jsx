import React, { useState } from 'react';
import { User } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import appFirebase from '../../firebaseConfig/firebase';
import '../../css/ClientNavBarComponent.css';
import logo from '../../assets/LogoGymHub.png';

const auth = getAuth(appFirebase);

const ClientNavBarComponent = ({ onShowSuplements, onShowRewards, onShowSales }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  
  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log('Sesión cerrada');
    }).catch((error) => {
      console.log('Error al cerrar sesión', error);
    });
  };

  

  return (
    <nav className="client-navbar">
      <div className="client-navbar-logo">
        <img src={logo} alt="Logo" />
      </div>
        <ul className="navbar-menu">
          <li><a href="#rutinas">Rutinas</a></li>
          <li><a href="#alertas">Alertas</a></li>
          <li><a href="#suplementos" onClick={onShowSuplements}>Suplementos</a></li>
          <li><a href="#ventas" onClick={onShowSales}>Ventas</a></li>
          <li><a href="#premiacion"onClick={onShowRewards}>Premiación</a></li>
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
              <li><a href="#ver-perfil">Ver Perfil</a></li>
              <li><a href="home" onClick={handleLogout}>Cerrar Sesión</a></li>
            </ul>
          )}
        </div>
    </nav>
  );
};

export default ClientNavBarComponent;
