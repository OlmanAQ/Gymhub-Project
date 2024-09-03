import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoginComponent from './LoginComponent';
import RegisterComponent from './RegisterComponent';
import appFirebase from '../../firebaseConfig/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AdminComponent from '../administrador/AdminComponent';
import { setUser } from '../../actions/userActions';

const auth = getAuth(appFirebase);

const InicioSesionComponent = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const dispatch = useDispatch();
  const usuario = useSelector((state) => state.user.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userF) => {
      if (userF) {
        dispatch(setUser(userF));
      } else {
        dispatch(setUser(null));
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
    <div>
      {usuario ? (
        <div>
          <AdminComponent />
        </div>
      ) : (
        isLoginVisible ? (
          <LoginComponent onShowRegister={showRegister} />
        ) : (
          <RegisterComponent onShowLogin={showLogin} />
        )
      )}
    </div>
  );
};

export default InicioSesionComponent;