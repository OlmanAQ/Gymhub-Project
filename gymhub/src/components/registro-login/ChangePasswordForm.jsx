import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import '../../css/ChangePasswordForm.css';
import { actualizarContrasena } from '../../cruds/Update';
import { obtenerInfoUsuarioPorUid } from '../../cruds/Read';

const ChangePasswordForm = () => {
  const [usuarioData, setUsuarioData] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPasswordStrength, setCurrentPasswordStrength] = useState(0);
  const [newPasswordStrength, setNewPasswordStrength] = useState(0);
  const [confirmPasswordStrength, setConfirmPasswordStrength] = useState(0);
  const usuario = useSelector((state) => state.user);
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    const cargarInfoUsuario = async () => {
      try {
        if (usuario && usuario.userId) {
          const infoUsuario = await obtenerInfoUsuarioPorUid(usuario.userId);
          setUsuarioData(infoUsuario);
        }
      } catch (error) {
        console.error('Error al cargar la información del usuario:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarInfoUsuario();
  }, [usuario]);

  // Función para alternar la visibilidad de la contraseña
  const toggleShowPassword = (passwordType) => {
    switch (passwordType) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  // Maneja cambios en la contraseña y calcula la fuerza
  const handlePasswordChange = (e, setPassword, setPasswordStrength) => {
    const { value } = e.target;
    setPassword(value);
    setPasswordStrength(getPasswordStrength(value));
  };

  // Calcula la fuerza de la contraseña
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  // Devuelve la etiqueta correspondiente a la fuerza de la contraseña
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

  // Verifica si las contraseñas coinciden
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  // Validar y mostrar alerta antes de enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita el envío por defecto del formulario

    if (newPassword === currentPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña inválida',
        text: 'La nueva contraseña no puede ser la misma que la actual.',
      });
      return;
    }

    if (!passwordsMatch) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña no coincide',
        text: 'La nueva contraseña y la confirmación no coinciden.',
      });
      return;
    }

    try {
      // Llamar al método para actualizar la contraseña en Firebase Authentication
      console.log('Correo del usuario por redux: ',usuarioData.correo);
      console.log('clave actual: ', currentPassword);
      console.log('clave nueva: ', newPassword);
      await actualizarContrasena(usuarioData.correo, currentPassword, newPassword);
      Swal.fire({
        icon: 'success',
        title: 'Cambio exitoso',
        text: 'La contraseña ha sido cambiada correctamente.',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `No se pudo cambiar la contraseña: ${error.message}`,
      });
    }
  };

  if (cargando) {
    return <div className="profile-password">Cargando...</div>;
  }
  return (
    <form className="change-password-form" onSubmit={handleSubmit}>
      {/* Contraseña Actual */}
      <div className="password-group">
        <label htmlFor="currentPassword" className="password-label">
          Contraseña actual
        </label>
        <div className="password-input-container">
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            id="currentPassword"
            name="currentPassword"
            value={currentPassword}
            onChange={(e) => handlePasswordChange(e, setCurrentPassword, setCurrentPasswordStrength)}
            className="password-input"
          />
          <button
            type="button"
            className="password-toggle-button"
            onClick={() => toggleShowPassword('current')}
          >
            {showCurrentPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {/* Barra de fuerza de la contraseña */}
        <div className={`password-strength-bar level-${currentPasswordStrength}`}>
          <div
            className="password-strength-level"
            style={{ width: `${(currentPasswordStrength / 5) * 100}%` }}
          ></div>
        </div>
        <div className={`password-strength-text level-${currentPasswordStrength}`}>
          {getStrengthLabel(currentPasswordStrength)}
        </div>
      </div>

      {/* Nueva Contraseña */}
      <div className="password-group">
        <label htmlFor="newPassword" className="password-label">
          Nueva contraseña
        </label>
        <div className="password-input-container">
          <input
            type={showNewPassword ? 'text' : 'password'}
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(e) => handlePasswordChange(e, setNewPassword, setNewPasswordStrength)}
            className="password-input"
          />
          <button
            type="button"
            className="password-toggle-button"
            onClick={() => toggleShowPassword('new')}
          >
            {showNewPassword ? <EyeOff /> : <Eye />}
          </button>
          {/* Icono de verificación */}
          {newPassword && confirmPassword && (
            passwordsMatch ? (
              <CheckCircle color="green" className="password-match-icon" />
            ) : (
              <XCircle color="red" className="password-match-icon" />
            )
          )}
        </div>

        {/* Barra de fuerza de la contraseña */}
        <div className={`password-strength-bar level-${newPasswordStrength}`}>
          <div
            className="password-strength-level"
            style={{ width: `${(newPasswordStrength / 5) * 100}%` }}
          ></div>
        </div>
        <div className={`password-strength-text level-${newPasswordStrength}`}>
          {getStrengthLabel(newPasswordStrength)}
        </div>
      </div>

      {/* Confirmar Nueva Contraseña */}
      <div className="password-group">
        <label htmlFor="confirmPassword" className="password-label">
          Confirmar nueva contraseña
        </label>
        <div className="password-input-container">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => handlePasswordChange(e, setConfirmPassword, setConfirmPasswordStrength)}
            className="password-input"
          />
          <button
            type="button"
            className="password-toggle-button"
            onClick={() => toggleShowPassword('confirm')}
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>
          {/* Icono de verificación */}
          {newPassword && confirmPassword && (
            passwordsMatch ? (
              <CheckCircle color="green" className="password-match-icon" />
            ) : (
              <XCircle color="red" className="password-match-icon" />
            )
          )}
        </div>

        {/* Barra de fuerza de la contraseña */}
        <div className={`password-strength-bar level-${confirmPasswordStrength}`}>
          <div
            className="password-strength-level"
            style={{ width: `${(confirmPasswordStrength / 5) * 100}%` }}
          ></div>
        </div>
        <div className={`password-strength-text level-${confirmPasswordStrength}`}>
          {getStrengthLabel(confirmPasswordStrength)}
        </div>
      </div>

      {/* Submit button */}
      <button type="submit" className="submit-button">
        Guardar
      </button>
    </form>
  );
};

export default ChangePasswordForm;
