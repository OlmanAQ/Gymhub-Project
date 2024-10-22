import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../../css/PasswordStrengtMeter.css';

const PasswordStrengthMeter = ({ password, setPassword }) => {
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value); // Actualiza la contraseña en el estado del componente padre
    setPasswordStrength(getPasswordStrength(value)); // Actualiza la fuerza de la contraseña
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthLabel = (strength) => {
    switch (strength) {
      case 0:
      case 1:
      case 2:
        return 'Débil';
      case 3:
        return 'Medio';
      case 4:
        return 'Fuerte';
      case 5:
        return 'Muy fuerte';
      default:
        return '';
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-group-contrasena">
      <label htmlFor="contrasena" className="register-label-contrasena">Contraseña</label>
      <div className="password-container">
        <input
          type={showPassword ? "text" : "password"}
          id="contrasena"
          name="contrasena"
          value={password}
          onChange={handlePasswordChange}
          className="register-input-contrasena"
        />
        <button
          type="button"
          className="password-toggle-button"
          onClick={toggleShowPassword}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>

      {/* Barra de fuerza de la contraseña */}
      <div className={`password-strength-bar level-${passwordStrength}`}>
        <div
          className="password-strength-level"
          style={{ width: `${(passwordStrength / 5) * 100}%` }}
        ></div>
      </div>

      {/* Texto de fuerza de la contraseña */}
      <div className={`password-strength-text level-${passwordStrength}`}>
        {getStrengthLabel(passwordStrength)}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
