import React, { useState } from 'react';
import logo from '../../assets/LogoGymHub.png';
import { User } from 'lucide-react';
import '../../css/AdminNavBarComponent.css';
import appFirebase from '../../firebaseConfig/firebase';
import TrainerCreatePlanComponent from './TrainerCreatePlanComponent';
import TrainerSearchPlanComponent from './TrainerSearchPlanComponent';
import { getAuth } from 'firebase/auth';

const auth = getAuth(appFirebase);

const EntrenadorNavBarComponent = ({ onShowSuplements }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [showTrainingPlans, setShowTrainingPlans] = useState(false);
  const [showSearchPlanComp, setShowSearchPlanComp] = useState (false);


  
  const handleLogout = () => {
    auth.signOut().then(() => {
        console.log('Sesión cerrada');
        
    }).catch((error) => {
        console.log('Error al cerrar sesión', error);
    });
  };


  const handleSearchPlansClick = () => {
    setShowSearchPlanComp(true);
    setShowTrainingPlans (false);
  };

  return (
    <div>
      {/* Barra de navegación */}
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="Logo" />
        </div>
        <ul className="navbar-menu">
          <li><a href="#planes" onClick={handleSearchPlansClick}>Planes de entrenamiento</a></li>
          <li><a href="#suplementos" onClick={onShowSuplements}>Suplementos</a></li>
          <li><a href="#inventario de maquinas">Máquinas</a></li>
          <li><a href="#inventario">Inventario</a></li>
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
              <li><a href="#cerrar-sesion" onClick={handleLogout}>Cerrar sesión</a></li>
            </ul>
          )}
        </div>
      </nav>

      {/* Aquí fuera del nav renderizamos el componente */}
      <div className="content">
        {showTrainingPlans && <TrainerCreatePlanComponent />}
        {showSearchPlanComp && <TrainerSearchPlanComponent />}
      </div>
    </div>
  );
}

export default EntrenadorNavBarComponent;
