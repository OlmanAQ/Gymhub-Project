import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { obtenerInfoUsuarioPorUid } from '../../cruds/Read';
import { EditIcon, Lock } from 'lucide-react';
import ChangePasswordForm from '../registro-login/ChangePasswordForm'; 
import EditProfile from './EditProfile'; // Importar el componente EditProfile
import '../../css/Profile.css';

const Profile = () => {
  const [usuarioData, setUsuarioData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editMode, setEditMode] = useState(false); // Estado para controlar la edición
  const usuario = useSelector((state) => state.user);

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

  const toggleChangePassword = () => {
    setShowChangePassword(!showChangePassword);
  };

  const toggleEditProfile = () => {
    setEditMode(true); // Habilitar el modo de edición
  };

  // Función para cancelar la edición y regresar al perfil
  const cancelEditProfile = () => {
    setEditMode(false); // Simplemente salir del modo de edición
  };

  if (cargando) {
    return <div className="profile-container">Cargando perfil...</div>;
  }

  if (!usuarioData) {
    return <div className="profile-container">No se encontró la información del usuario.</div>;
  }

  // Mostrar EditProfile cuando está en modo de edición
  if (editMode) {
    return <EditProfile user={usuarioData} onCancel={cancelEditProfile} />; // Pasar usuarioData a EditProfile
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">Perfil del Usuario</h1>

      {/* Sección de configuraciones */}
      <div className="settings-section">
        <h2 className="settings-title">Ajustes</h2>
        <div className="edit-profile" onClick={toggleEditProfile} style={{ cursor: 'pointer' }}>
          <EditIcon className="edit-icon" />
          <span className="edit-text">Editar perfil</span>
        </div>
        <div className="change-password" onClick={toggleChangePassword} style={{ cursor: 'pointer' }}>
          <Lock className="lock-icon" />
          <span className="change-text">Cambio de contraseña</span>
        </div>
      </div>

      {/* Renderizar el formulario de cambio de contraseña si está visible */}
      {showChangePassword && <ChangePasswordForm />}

      <div className="info-section">
        <h2 className="info-title">Información General</h2>
        <div className="profile-info">
          <div className='profile-column-one'>
            <p><strong>Usuario:</strong> {usuarioData.usuario}</p>
            <p><strong>Nombre:</strong> {usuarioData.nombre}</p>
            <p><strong>Correo:</strong> {usuarioData.correo}</p>
            <p><strong>Padecimientos:</strong> {usuarioData.padecimientos}</p>
            <p><strong>Teléfono:</strong> {usuarioData.telefono}</p>
          </div>
          <div className='profile-column-two'>
            <p><strong>Edad:</strong> {usuarioData.edad}</p>
            <p><strong>Estatura:</strong> {usuarioData.estatura} m</p>
            <p><strong>Peso:</strong> {usuarioData.peso} kg</p>
            <p><strong>Género:</strong> {usuarioData.genero}</p>
            <p><strong>Rol:</strong> {usuarioData.rol}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
