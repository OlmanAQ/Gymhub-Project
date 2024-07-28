import React, { useState } from 'react';
import '../css/LoginComponent.css';
import LogoGymHub from '../assets/LogoGymHub.png';

const LoginComponent = ({ onShowRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Lógica de inicio de sesión aquí
    console.log('Login', { username, password });
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Lógica para manejar la recuperación de contraseña
    console.log('Forgot Password');
  };

  return (
    <div className="login-container">
      <img src={LogoGymHub} className="login-logo" />
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
