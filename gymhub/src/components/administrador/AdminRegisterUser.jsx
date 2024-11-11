import React, { useState } from 'react';
import '../../css/AdminRegisterUser.css';
import { X } from 'lucide-react';
import Swal from 'sweetalert2';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from 'firebase/auth';
import { agregarUsuario } from '../../cruds/Create';
import { verificarCorreoExistente, verificarUsuario } from '../../cruds/Read';
import { showConfirmAlert } from '../../utils/Alert';
import PasswordStrengthMeter from '../registro-login/PasswordStrengtMeter';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import UserTypes from '../../utils/UsersTipos';
import appFirebase from '../../firebaseConfig/firebase';

const auth = getAuth(appFirebase);

const AdminRegisterUser = ({ onClose, setIsAuthenticating }) => {
  const [isLoading, setIsLoading] = useState(false);
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

  const estadoElemento = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      'nombre', 'edad', 'genero', 'estatura', 'peso', 'padecimientos',
      'correo', 'telefono', 'contrasena', 'usuario', 'rol'
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

  const agregarUser = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setIsLoading(true);
  
    if (!validateForm()) {
      Swal.fire({
        icon: 'warning',
        title: 'Registro incompleto',
        text: 'Por favor, complete todos los campos correctamente.',
        confirmButtonText: 'Entendido'
      });
      setIsAuthenticating(false);
      setIsLoading(false);
      return;
    }
  
    try {
      const correoExiste = await verificarCorreoExistente(form.correo);
      if (correoExiste) {
        Swal.fire({
          icon: 'error',
          title: 'Correo ya registrado',
          text: 'El correo ingresado ya está registrado. Por favor, utilice otro correo.',
          confirmButtonText: 'Entendido'
        });
        setIsAuthenticating(false);
        setIsLoading(false);
        return;
      }
  
      const usuarioExistente = await verificarUsuario(form.usuario);
      if (usuarioExistente) {
        Swal.fire({
          icon: 'error',
          title: 'Usuario ya registrado',
          text: 'El usuario ya está en uso. Por favor, utilice otro usuario.',
          confirmButtonText: 'Entendido'
        });
        setIsAuthenticating(false);
        setIsLoading(false);
        return;
      }
  
      const result = await Swal.fire({
        title: 'Confirmar registro',
        text: "¿Estás seguro de que deseas registrar este usuario?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, registrar',
        cancelButtonText: 'Cancelar'
      });
  
      if (result.isConfirmed) {
        // Guarda la sesión del administrador
        const currentUser = auth.currentUser;
        const adminEmail = currentUser.email;
  
        // Solicita la contraseña del administrador para re-autenticarse después
        const { value: adminPassword } = await Swal.fire({
          title: 'Autenticación requerida',
          text: 'Por favor, ingresa tu contraseña para continuar con el registro:',
          input: 'password',
          inputPlaceholder: 'Ingrese su contraseña',
          showCancelButton: true
        });
  
        if (!adminPassword) {
          setIsAuthenticating(false);
          setIsLoading(false);
          return;
        }
  
        // Llama a `agregarUsuario` con los datos del usuario, el email y la contraseña del administrador
        await agregarUsuario(form, adminEmail, adminPassword);
  
        Swal.fire({
          icon: 'success',
          title: 'Usuario registrado',
          text: 'El usuario ha sido registrado exitosamente.',
          confirmButtonText: 'Ok'
        });
  
        setForm({
          nombre: '',
          edad: '',
          genero: '',
          estatura: '',
          peso: '',
          padecimientos: '',
          correo: '',
          telefono: '',
          contrasena: '',
          usuario: '',
          rol: ''
        });
  
        onClose();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al registrar el usuario.',
        confirmButtonText: 'Entendido'
      });
    } finally {
      setIsAuthenticating(false);
      setIsLoading(false);
    }
  };  

  const handlePhoneChange = (value) => {
    setForm((prevForm) => ({ ...prevForm, telefono: value }));
  };

  const cerrarFormulario = () => {
    showConfirmAlert('¿Estás seguro?', 'Estás a punto de cerrar el formulario. Los datos no guardados se perderán.', 'Sí, cerrar', 'Cancelar')
      .then((result) => {
        if (result.isConfirmed) {
          onClose();
        }
      });
  };

  return (
    <div className="admin-register-user-container">
      {isLoading ? (
        <div className="loading-indicator">Cargando...</div>
      ) : (
        <>
          <div className="admin-register-user-header">
            <h2>Agregar Usuario</h2>
          </div>

          <form className="admin-register-user-form" onSubmit={agregarUser}>
            <button type="button" className="admin-register-user-close-button" onClick={cerrarFormulario}>
              <X />
            </button>
            <div className='colum-one-admin'>
              <div className="register-user-group-admin">
                <label htmlFor="usuario" className="register-label-usuario-admin">Usuario</label>
                <input
                  type="text"
                  id="usuario"
                  name="usuario"
                  value={form.usuario}
                  onChange={estadoElemento}
                  className="register-input-usuario-admin" 
                />
              </div>

              <div className="register-name-group-admin">
                <label htmlFor="nombre" className="register-label-nombre-admin">Nombre completo</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={estadoElemento}
                  className="register-input-nombre-admin"
                />
              </div>
              <div className="register-correo-group-admin">
                <label htmlFor="correo" className="register-label-correo-admin">Correo</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={form.correo}
                  onChange={estadoElemento}
                  className="register-input-correo-admin"
                />
              </div>
              <div className="password-strength-container">
                <PasswordStrengthMeter 
                  password={form.contrasena} 
                  setPassword={(value) => setForm({ ...form, contrasena: value })} 
                />
              </div>
            </div>

            <div className='colum-two-admin'>
              <div className="register-genero-group-admin">
                <label htmlFor="genero" className="register-label-genero-admin">Género</label>
                <select
                  id="genero"
                  name="genero"
                  value={form.genero}
                  onChange={estadoElemento}
                  className="register-input-genero-admin"
                >
                  <option value="">Seleccione</option>
                  <option value="Hombre">Hombre</option>
                  <option value="Mujer">Mujer</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="register-edad-group-admin">
                <label htmlFor="edad" className="register-label-edad-admin">Edad</label>
                <input
                  type="number"
                  id="edad"
                  name="edad"
                  value={form.edad}
                  onChange={estadoElemento}
                  className="register-input-edad-admin"
                  min="0"
                />
              </div>
              <div className="register-peso-group-admin">
                <label htmlFor="peso" className="register-label-peso-admin">Peso (kg)</label>
                <input
                  type="number"
                  id="peso"
                  name="peso"
                  value={form.peso}
                  onChange={estadoElemento}
                  className="register-input-peso-admin"
                  step="0.1"
                  min="0"
                />
              </div>  
              <div className="register-estatura-group-admin">
                <label htmlFor="estatura" className="register-label-estatura-admin">Estatura (metros)</label>
                <input
                  type="number"
                  id="estatura"
                  name="estatura"
                  value={form.estatura}
                  onChange={estadoElemento}
                  className="register-input-estatura-admin"
                  step="0.01"
                  min="0"
                />
              </div>                  
            </div>

            <div className='colum-three-admin'>
              <div className="register-telefono-group-admin">
                <label htmlFor="telefono" className="register-label-telefono-admin">Teléfono</label>
                <PhoneInput
                  country={'cr'}
                  value={form.telefono}
                  onChange={handlePhoneChange}
                  inputProps={{
                    name: 'telefono',
                    required: true,
                    className: "register-input-telefono-admin"
                  }}
                />
              </div>

              <div className="register-rol-group-admin">
                <label htmlFor="rol" className="register-label-rol-admin">Rol</label>
                <select
                  id="rol"
                  name="rol"
                  value={form.rol}
                  onChange={estadoElemento}
                  className="register-input-rol-admin"
                >
                  <option value="">Seleccione</option>
                  <option value={UserTypes.ADMINISTRADOR}>Administrador</option>
                  <option value={UserTypes.ENTRENADOR}>Entrenador</option>
                  <option value={UserTypes.CLIENTE}>Cliente</option>
                </select>
              </div>
              <div className="register-padecimientos-group-admin">
                <label htmlFor="padecimientos" className="register-label-padecimientos-admin">Padecimientos</label>
                <textarea
                  id="padecimientos"
                  name="padecimientos"
                  value={form.padecimientos}
                  onChange={estadoElemento}
                  className="register-input-padecimientos-admin"
                />
              </div>          
            </div>

            <div className="register-button-register-container-admin">
              <button type="submit" className="register-button-register-admin">
                Registrar
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default AdminRegisterUser;
