import React, { useState, useEffect } from 'react';
import '../../css/AdminUpdateUser.css';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';
import { actualizarUsuario } from '../../cruds/Update';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import UserTypes from '../../utils/UsersTipos';

const AdminUpdateUser = ({ user, onClose }) => {
  const [form, setForm] = useState({
    nombre: '',
    edad: '',
    genero: '',
    estatura: '',
    peso: '',
    padecimientos: '',
    telefono: '',
    rol: ''
  });

  useEffect(() => {
    // Prellenar el formulario con los datos del usuario a editar
    if (user) {
      setForm({
        nombre: user.nombre || '',
        edad: user.edad || '',
        genero: user.genero || '',
        estatura: user.estatura || '',
        peso: user.peso || '',
        padecimientos: user.padecimientos || '',
        telefono: user.telefono || '',
        rol: user.rol || '',
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
      'nombre', 'edad', 'genero', 'estatura', 'peso', 'padecimientos',
      'telefono', 'rol'
    ];
    for (let field of requiredFields) {
      if (form[field] === undefined || form[field].trim() === '') {
        return false;
      }
    }

    if (form.genero === '' || form.rol === '' || form.genero === 'Seleccione' || form.rol === 'Seleccione') {
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
      onClose(); // Cerrar el formulario de actualización
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
        onClose();
      }
    });
  };

  return (
    <div className="admin-update-user-container">
      <div className="admin-update-user-header">
        <h2>Actualizar Usuario</h2>
      </div>

      <form className="admin-update-user-form" onSubmit={handleSubmit}>
        <button type="button" className="admin-update-user-close-button" onClick={cerrarFormulario}>
          <X />
        </button>
        <div className='colum-one-update'>
          <div className="register-name-group-update">
            <label htmlFor="nombre" className="register-label-nombre-update">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={estadoElemento}
              className="register-input-nombre-update"
            />
          </div>

          <div className="register-genero-group-update">
            <label htmlFor="genero" className="register-label-genero-update">Género</label>
            <select
              id="genero"
              name="genero"
              value={form.genero}
              onChange={estadoElemento}
              className="register-input-genero-update"
            >
              <option value="">Seleccione</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="register-rol-group-update">
            <label htmlFor="rol" className="register-label-rol-update">Rol</label>
            <select
              id="rol"
              name="rol"
              value={form.rol}
              onChange={estadoElemento}
              className="register-input-rol-update"
            >
              <option value="">Seleccione</option>
              <option value={UserTypes.ADMINISTRADOR}>Administrador</option>
              <option value={UserTypes.ENTRENADOR}>Entrenador</option>
              <option value={UserTypes.CLIENTE}>Cliente</option>
            </select>
          </div>
        </div>

        <div className='colum-two-update'>
          <div className="register-edad-group-update">
            <label htmlFor="edad" className="register-label-edad-update">Edad</label>
            <input
              type="number"
              id="edad"
              name="edad"
              value={form.edad}
              onChange={estadoElemento}
              className="register-input-edad-update"
              min="0"
            />
          </div>

          <div className="register-peso-group-update">
            <label htmlFor="peso" className="register-label-peso-update">Peso (kg)</label>
            <input
              type="number"
              id="peso"
              name="peso"
              value={form.peso}
              onChange={estadoElemento}
              className="register-input-peso-update"
              step="0.1"
              min="0"
            />
          </div>

          <div className="register-estatura-group-update">
            <label htmlFor="estatura" className="register-label-estatura-update">Estatura (metros)</label>
            <input
              type="number"
              id="estatura"
              name="estatura"
              value={form.estatura}
              onChange={estadoElemento}
              className="register-input-estatura-update"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className='colum-three-update'>
          <div className="register-telefono-group-update">
            <label htmlFor="telefono" className="register-label-telefono-update">Teléfono</label>
            <PhoneInput
              country={'cr'}
              value={form.telefono}
              onChange={handlePhoneChange}
              inputProps={{
                name: 'telefono',
                required: true,
                className: "register-input-telefono-update"
              }}
            />
          </div>

          <div className="register-padecimientos-group-update">
            <label htmlFor="padecimientos" className="register-label-padecimientos-update">Padecimientos</label>
            <textarea
              id="padecimientos"
              name="padecimientos"
              value={form.padecimientos}
              onChange={estadoElemento}
              className="register-input-padecimientos-update"
            />
          </div>
        </div>

        <div className="register-button-register-container-update">
          <button type="submit" className="register-button-register-update">
            Actualizar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUpdateUser;
