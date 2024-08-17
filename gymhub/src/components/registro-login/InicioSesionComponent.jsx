import React, { useState, useEffect } from 'react';
import LoginComponent from './LoginComponent';
import RegisterComponent from './RegisterComponent';
import appFirebase from '../../firebaseConfig/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AdminComponent from '../administrador/AdminComponent';

const auth = getAuth(appFirebase);

const InicioSesionComponent = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userF) => {
      if (userF) {
        setUsuario(userF);
      } else {
        setUsuario(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);



  const showRegister = () => {
    setIsLoginVisible(false);
  };

  const showLogin = () => {
    setIsLoginVisible(true);
  };



  return (
    <div>
      {usuario ? (
        <AdminComponent/>

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

export default InicioSesionComponent;
