import React, { useState } from 'react';
import '../../css/LoginComponent.css';
import LogoGymHub from '../../assets/LogoGymHub.png';
import Swal from 'sweetalert2';
import { collection, query, where, getDocs} from 'firebase/firestore';
import {db, auth} from '../../firebaseConfig/firebase';
import {signInWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth';

const LoginComponent = ({ onShowRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  

  const handleLogin = async(e) => {
    e.preventDefault();

    // Verificar que los campos no estén vacíos
    if (username === '' || password === '') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, llena todos los campos',
      });
      return;
    }

    // Si el username es correo iniciar sesión con correo y contraseña, buscar el correo en la base de datos si no existe mostrar mensaje de error

    if (username.includes('@')) {
      try {
        const user = await signInWithEmailAndPassword(auth, username, password);
        console.log(user);
        // Redirigir a la página de inicio
      }
      catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Usuario o contraseña incorrectos',
        });
      }
    }

    // Si el username no es correo buscar el username en el firebase y obtener el correo para iniciar sesión
    else {
      try {
        const q = query(collection(db, 'User'), where('usuario', '==', username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const user = doc.data();
            signInWithEmailAndPassword(auth, user.correo, password);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Usuario o contraseña incorrectos',
          });
        }
      } catch (error) {
        console.error('Error al buscar el usuario: ', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al iniciar sesión',
        });
      }
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Ingresa tu correo',
      input: 'email',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      showLoaderOnConfirm: true,
      preConfirm: (email) => {
        return sendPasswordResetEmail(auth, email)
          .then(() => {
            Swal.fire('Correo enviado', 'Revisa tu bandeja de entrada', 'success');
          })
          .catch((error) => {
            Swal.fire('Error', 'Ocurrió un error al enviar el correo', 'error');
          });
      },
      allowOutsideClick: () => !Swal.isLoading()
    });

  };

  return (
    <div className="login-container">
      <img src={LogoGymHub} alt="Logo" className="login-logo" />
      <form>
        <div className="login-form-group">
          <label htmlFor="username" className="login-label">Usuario</label>
          <input 
            type="text" 
            id="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="login-input"
          />
        </div>
        <div className="login-form-group">
          <label htmlFor="password" className="login-label">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="login-input"
          />
        </div>
        <div className="login-form-group">
          <button onClick={handleForgotPassword} className="forgot-password-button">¿Olvidaste tu contraseña?</button>
        </div>
        <div className="login-button-group">
          <button onClick={handleLogin} className="login-button login-button-login">Inicio sesión</button>
          <button onClick={onShowRegister} className="login-button login-button-register">Crear cuenta</button>
        </div>
      </form>
    </div>
  );
};

export default LoginComponent;