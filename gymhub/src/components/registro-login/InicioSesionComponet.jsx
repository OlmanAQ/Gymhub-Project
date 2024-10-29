import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoginComponent from './LoginComponent';
import RegisterComponent from './RegisterComponent';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AdminComponent from '../administrador/AdminComponent';
import ClienteComponent from '../cliente/ClienteComponent';
import TrainerComponent from '../entrenador/TrainerComponent';
import { login, logout } from '../../actions/userActions';
import { obtenerInfoUsuarioCorreo } from '../../cruds/Read';
import UserTypes from '../../utils/UsersTipos';

const auth = getAuth();

const InicioSesionComponent = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [authComplete, setAuthComplete] = useState(false); // Nuevo estado para bloquear visualización prematura
  const dispatch = useDispatch();
  const usuario = useSelector((state) => state.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userF) => {
      setIsAuthenticating(true);
      setAuthComplete(false); // Resetea `authComplete` al iniciar una nueva autenticación

      if (userF) {
        obtenerInfoUsuarioCorreo(userF.email).then((usuario) => {
          if (usuario) {
            dispatch(login(usuario));
          }
        }).finally(() => {
          setIsAuthenticating(false);
          setAuthComplete(true); // Establece `authComplete` cuando el usuario está completamente cargado
        });
      } else {
        dispatch(logout());
        setIsAuthenticating(false);
        setAuthComplete(true); // Completa la autenticación sin usuario logueado
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

  if (isAuthenticating || !authComplete) {
    // Bloquea todos los componentes y muestra el loader hasta que `isAuthenticating` sea false y `authComplete` true
    return <div>Cargando...</div>;
  }

  return (
    <>
      {usuario.isAuthenticated ? (
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
        isLoginVisible ? (
          <LoginComponent onShowRegister={showRegister} />
        ) : (
          <RegisterComponent onShowLogin={showLogin} />
        )
      )}
    </>
  );
};

export default InicioSesionComponent;
