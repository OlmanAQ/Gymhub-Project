import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoginComponent from './LoginComponent';
import RegisterComponent from './RegisterComponent';
import appFirebase from '../../firebaseConfig/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AdminComponent from '../administrador/AdminComponent';
import ClienteComponent from '../cliente/ClienteComponent';
import TrainerComponent from '../entrenador/TrainerComponent';
import { setUser } from '../../actions/userActions';
import { obtenerInfoUsuarioCorreo } from '../../cruds/Read';
const auth = getAuth(appFirebase);

const InicioSesionComponent = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [rol, setRol] = useState('');
  const dispatch = useDispatch();
  const usuario = useSelector((state) => state.user.user);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userF) => {
      if (userF) {
        dispatch(setUser(userF.uid));
        obtenerInfoUsuarioCorreo(userF.email).then((usuario) => {
          setRol(usuario.rol);
        }
        );
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
        rol === 'administrador' ? (
          <AdminComponent />
        ) : rol === 'cliente' ? (
          <ClienteComponent />
        ) : (
          <TrainerComponent />
        )
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