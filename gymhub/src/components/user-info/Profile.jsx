import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { obtenerInfoUsuarioPorUid } from '../../cruds/Read';
import '../../css/Profile.css';

const Profile = () => {
  const [usuarioData, setUsuarioData] = useState(null);
  const [cargando, setCargando] = useState(true); 
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

  if (cargando) {
    return <div className="profile-container">Cargando perfil...</div>;
  }

  if (!usuarioData) {
    return <div className="profile-container">No se encontró la información del usuario.</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">Perfil del Usuario</h1>
      <div className="profile-info">
        <p><strong>Nombre:</strong> {usuarioData.nombre}</p>
        <p><strong>Correo:</strong> {usuarioData.correo}</p>
        <p><strong>Edad:</strong> {usuarioData.edad}</p>
        <p><strong>Estatura:</strong> {usuarioData.estatura} m</p>
        <p><strong>Peso:</strong> {usuarioData.peso} kg</p>
        <p><strong>Género:</strong> {usuarioData.genero}</p>
        <p><strong>Padecimientos:</strong> {usuarioData.padecimientos}</p>
        <p><strong>Teléfono:</strong> {usuarioData.telefono}</p>
        <p><strong>Rol:</strong> {usuarioData.rol}</p>
      </div>
    </div>
  );
};

export default Profile;
