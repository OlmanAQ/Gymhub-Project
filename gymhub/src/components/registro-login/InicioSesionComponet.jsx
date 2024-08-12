import React, { useState } from 'react';
import LoginComponent from './LoginComponent';
import RegisterComponent from './RegisterComponent';

// import firebase auth
import appFirebase from '../../firebaseConfig/firebase';  
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AdminComponent from '../administrador/AdminComponent';
const auth = getAuth(appFirebase);


const ShowComponent = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(true);

  const [usuario, setUsuario] = useState(null);



  const showRegister = () => {
    setIsLoginVisible(false);
  };

  const showLogin = () => {
    setIsLoginVisible(true);
  };

  return (
    <div>
      {usuario ? (
        <AdminComponent  />
      )
      : (
        isLoginVisible ? (
          <LoginComponent onShowRegister={showRegister} />
        ) : (
          <RegisterComponent onShowLogin={showLogin} />
      ))
      }
    </div>
  );
};

export default ShowComponent;
