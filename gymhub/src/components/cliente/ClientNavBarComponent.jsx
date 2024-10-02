import React, { useState } from 'react';
import logo from '../../assets/LogoGymHub.png';
import { User } from 'lucide-react';
import '../../css/AdminNavBarComponent.css';
import appFirebase from '../../firebaseConfig/firebase';
import { getAuth } from 'firebase/auth';

const auth = getAuth(appFirebase);

const ClientNavBarComponent = ({ onShowSuplements }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  
  const handleLogout = () => {
    auth.signOut().then(() => {
        console.log('Sesión cerrada');
        
    }).catch((error) => {
        console.log('Error al cerrar sesión', error);
    });
};

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>
        <ul className="navbar-menu">
          <li><a href="#rutinas">Rutinas</a></li>
          <li><a href="#alertas">Alertas</a></li>
          <li><a href="#suplementos" onClick={onShowSuplements}>Suplementos</a></li>
          <li><a href="#ventas">Ventas</a></li>
          <li><a href="#premiacion">Premiación</a></li>
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
}

export default ClientNavBarComponent;
