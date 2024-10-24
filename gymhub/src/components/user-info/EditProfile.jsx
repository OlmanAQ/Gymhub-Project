import React, { useState, useEffect } from 'react';
import '../../css/EditProfile.css';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';
import { actualizarUsuario } from '../../cruds/Update';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import UserTypes from '../../utils/UsersTipos';

const EditProfile = ({ user, onCancel }) => { // Recibir el usuario como prop
  const [form, setForm] = useState({
    usuario: '',
    nombre: '',
    edad: '',
    genero: '',
    estatura: '',
    peso: '',
    padecimientos: '',
    telefono: ''
  });

  useEffect(() => {
    // Prellenar el formulario con los datos del usuario a editar
    if (user) {
      setForm({
        usuario: user.usuario || '',
        nombre: user.nombre || '',
        edad: user.edad || '',
        genero: user.genero || '',
        estatura: user.estatura || '',
        peso: user.peso || '',
        padecimientos: user.padecimientos || '',
        telefono: user.telefono || ''
      });
    }
  }, [user]);

  const estadoElemento = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handlePhoneChange = (value) => {
    setForm((prevForm) => ({ ...prevForm, telefono: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      'usuario', 'nombre', 'edad', 'genero', 'estatura', 'peso', 'padecimientos',
      'telefono'
    ];
    for (let field of requiredFields) {
      if (form[field] === undefined || form[field].trim() === '') {
        return false;
      }
    }

    if (form.genero === '' || form.genero === 'Seleccione' || form.telefono === '') {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, complete todos los campos correctamente.',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    try {
      // Actualizar usuario en Firestore
      await actualizarUsuario(user.id, form);
      Swal.fire({
        icon: 'success',
        title: 'Usuario actualizado',
        text: 'Los datos del usuario han sido actualizados exitosamente.',
        confirmButtonText: 'Ok'
      });
      onCancel(); // Volver a la vista de perfil
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al actualizar el usuario.',
        confirmButtonText: 'Entendido'
      });
    }
  };

  const cerrarFormulario = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Los cambios no guardados se perderán.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        onCancel(); // Volver a la vista de perfil sin guardar
      }
    });
  };

  return (
    <div className="editprofile-user-container">
      <div className="editprofile-user-header">
        <h2>Editar perfil</h2>
      </div>

      <form className="editprofile-user-form" onSubmit={handleSubmit}>
        <button type="button" className="editprofile-user-close-button" onClick={cerrarFormulario}>
          <X />
        </button>
        <div className='colum-one-editprofile'>
          <div className="register-user-group-editprofile">
            <label htmlFor="usuario" className="register-label-usuario-editprofile">Usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={form.usuario}
              onChange={estadoElemento}
              className="register-input-usuario-editprofile"
            />
          </div>
          
          <div className="register-name-group-editprofile">
            <label htmlFor="nombre" className="register-label-nombre-editprofile">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={estadoElemento}
              className="register-input-nombre-editprofile"
            />
          </div>

          <div className="register-genero-group-editprofile">
            <label htmlFor="genero" className="register-label-genero-editprofile">Género</label>
            <select
              id="genero"
              name="genero"
              value={form.genero}
              onChange={estadoElemento}
              className="register-input-genero-editprofile"
            >
              <option value="">Seleccione</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>

        <div className='colum-two-editprofile'>
          <div className="register-edad-group-editprofile">
            <label htmlFor="edad" className="register-label-edad-editprofile">Edad</label>
            <input
              type="number"
              id="edad"
              name="edad"
              value={form.edad}
              onChange={estadoElemento}
              className="register-input-edad-editprofile"
              min="0"
            />
          </div>

          <div className="register-peso-group-editprofile">
            <label htmlFor="peso" className="register-label-peso-editprofile">Peso (kg)</label>
            <input
              type="number"
              id="peso"
              name="peso"
              value={form.peso}
              onChange={estadoElemento}
              className="register-input-peso-editprofile"
              step="0.1"
              min="0"
            />
          </div>

          <div className="register-estatura-group-editprofile">
            <label htmlFor="estatura" className="register-label-estatura-editprofile">Estatura (metros)</label>
            <input
              type="number"
              id="estatura"
              name="estatura"
              value={form.estatura}
              onChange={estadoElemento}
              className="register-input-estatura-editprofile"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className='colum-three-editprofile'>
          <div className="register-telefono-group-editprofile">
            <label htmlFor="telefono" className="register-label-telefono-editprofile">Teléfono</label>
            <PhoneInput
              country={'cr'}
              value={form.telefono}
              onChange={handlePhoneChange}
              inputProps={{
                name: 'telefono',
                required: true,
                className: "register-input-telefono-editprofile"
              }}
            />
          </div>

          <div className="register-padecimientos-group-editprofile">
            <label htmlFor="padecimientos" className="register-label-padecimientos-editprofile">Padecimientos</label>
            <textarea
              id="padecimientos"
              name="padecimientos"
              value={form.padecimientos}
              onChange={estadoElemento}
              className="register-input-padecimientos-editprofile"
            />
          </div>
        </div>

        <div className="register-button-register-container-editprofile">
          <button type="submit" className="register-button-register-editprofile">
            Actualizar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
