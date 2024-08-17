import React, { useState } from 'react';
import logo from '../../assets/LogoGymHub.png';
import { User } from 'lucide-react';
import '../../css/AdminNavBarComponent.css';
import appFirebase from '../../firebaseConfig/firebase';
import { getAuth } from 'firebase/auth';

const auth = getAuth(appFirebase);

const AdminNavBarComponent = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // bottom lpg out
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
          <li><a href="#Inicio">Inicio</a></li>
          <li><a href="#usuarios">Usuarios</a></li>
          <li><a href="#alertas">Alertas</a></li>
          <li><a href="#inventario">Inventario</a></li>
          <li><a href="#estadisticas">Estadísticas</a></li>
          <li><a href="#suplementos">Suplementos</a></li>
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

export default AdminNavBarComponent;
