import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoginComponent from './LoginComponent';
import RegisterComponent from './RegisterComponent';
import { auth } from '../../firebaseConfig/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AdminComponent from '../administrador/AdminComponent';
import ClienteComponent from '../cliente/ClienteComponent';
import TrainerComponent from '../entrenador/TrainerComponent';
import { login, logout } from '../../actions/userActions';
import { obtenerInfoUsuarioCorreo } from '../../cruds/Read';
import UserTypes from '../../utils/UsersTipos';

const InicioSesionComponent = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const dispatch = useDispatch();
  const usuario = useSelector((state) => state.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userF) => {
      if (userF) {
        obtenerInfoUsuarioCorreo(userF.email).then((usuario) => {
          if (usuario) {
            dispatch(login(usuario));
          }
        }).finally(() => setIsAuthenticating(false));
      } else {
        dispatch(logout());
        setIsAuthenticating(false); 
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const showRegister = () => {
    setIsLoginVisible(false);
  };

  const showLogin = () => {
    setIsLoginVisible(true);
  };

  return (
    <>
      {usuario.isAuthenticated || isAuthenticating ? (
        usuario.role === UserTypes.ADMINISTRADOR ? (
          <AdminComponent setIsAuthenticating={setIsAuthenticating} /> 
        ) : usuario.role === UserTypes.CLIENTE ? (
          <ClienteComponent />
        ) : usuario.role === UserTypes.ENTRENADOR ? (
          <TrainerComponent />
        ) : (
          <div>Cargando...</div>
        )
      ) : (
        isLoginVisible && !isAuthenticating ? (
          <LoginComponent onShowRegister={showRegister} />
        ) : (
          <RegisterComponent onShowLogin={showLogin} />
        )
      )}
    </>
  );
};

export default InicioSesionComponent;
