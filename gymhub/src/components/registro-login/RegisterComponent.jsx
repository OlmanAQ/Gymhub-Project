import React, { useState } from 'react';
import '../../css/RegisterComponent.css';
import { X } from 'lucide-react';
import LogoGymHub from '../../assets/LogoGymHub.png';
import Swal from 'sweetalert2';
import { auth } from '../../firebaseConfig/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { agregarClienteConRol } from '../../cruds/Create';
import { verificarCorreoExistente, verificarUsuario } from '../../cruds/Read';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import PasswordStrengthMeter from './PasswordStrengtMeter';


const RegisterComponent = ({ onShowLogin }) => {
  const [form, setForm] = useState({
    nombre: '',
    edad: '',
    genero: '',
    estatura: '',
    peso: '',
    padecimientos: '',
    correo: '',
    telefono: '',
    contrasena: '',
    usuario: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['nombre', 'edad', 'genero', 'estatura', 'peso', 'padecimientos', 'correo', 'telefono', 'contrasena', 'usuario'];
    for (let field of requiredFields) {
      if (form[field] === undefined || form[field].trim() === '') {
        return false;
      }
    }
    if (form.genero === '' || form.genero === 'Seleccione') {
      return false;
    }
    return true;
  };
  
  const handlePhoneChange = (value) => {
    setForm((prevForm) => ({ ...prevForm, telefono: value }));
  };
  
  const agregarCliente = async (e) => {
    e.preventDefault();
    
    // Validación del formulario
    if (!validateForm()) {
      Swal.fire({
        icon: 'warning',
        title: 'Registro incompleto',
        text: 'Por favor, complete todos los campos correctamente.',
        confirmButtonText: 'Entendido'
      });
      return;
    }
  
    // Verificar si el correo ya está registrado
    const correoExiste = await verificarCorreoExistente(form.correo);
    if (correoExiste) {
      Swal.fire({
        icon: 'error',
        title: 'Correo ya registrado',
        text: 'El correo ingresado ya está registrado. Por favor, utilice otro correo.',
        confirmButtonText: 'Entendido'
      });
      return;
    }
  
    // Verificar si el usuario ya está registrado
    const usuarioExistente = await verificarUsuario(form.usuario);
    if (usuarioExistente) {
      Swal.fire({
        icon: 'error',
        title: 'Usuario ya registrado',
        text: 'El usuario ya está en uso. Por favor, utilice otro usuario.',
        confirmButtonText: 'Entendido'
      });
      return;
    }
  
    // Confirmación de registro
    const result = await Swal.fire({
      title: 'Confirmar registro',
      text: "¿Estás seguro de que deseas registrarte?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    });
  
    if (result.isConfirmed) {
      try {
        // Crear el usuario en Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          form.correo,
          form.contrasena
        );
        const user = userCredential.user;
  
        // Enviar correo de verificación
        await sendEmailVerification(user);
  
        // Guardar el cliente con rol en Firestore
        await agregarClienteConRol(form);
        // Cerrar la sesión del usuario inmediatamente después del registro
        await auth.signOut();
  
        Swal.fire({
          icon: 'success',
          title: 'Registrado',
          text: 'Cliente registrado exitosamente. Revisa tu correo para la verificación.',
          confirmButtonText: 'Ok'
        }).then(() => {
          // Limpiar el formulario después del registro exitoso
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
            usuario: ''
          });
          onShowLogin(); // Volver a la vista de inicio de sesión
        });
      } catch (error) {
        console.error('Error al registrar el cliente:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al registrar el cliente. Por favor, inténtalo de nuevo.',
          confirmButtonText: 'Entendido'
        });
      }
    }
  };  

  return (
    <div className="register-container">
      <header className="register-header">
        <img src={LogoGymHub} alt="Logo GymHub" className="register-logo" />
        <h2 className="register-title">Registro de Membresía</h2>
      </header>
      <form className='register' onSubmit={agregarCliente}>
        <button className="close-button" onClick={onShowLogin}>
            <X />
        </button>
        <div className='colum-one'>
          <div className="register-group-usuario">
            <label htmlFor="usuario" className="register-label-usuario">Usuario</label>
            <input 
              type="text" 
              id="usuario" 
              name="usuario" 
              value={form.usuario} 
              onChange={handleChange} 
              className="register-input-usuario" 
            />
          </div>
          <div className="register-group-nombre">
            <label htmlFor="nombre" className="register-label-nombre">Nombre completo</label>
            <input 
              type="text" 
              id="nombre" 
              name="nombre" 
              value={form.nombre} 
              onChange={handleChange} 
              className="register-input-nombre" 
            />
          </div>
          <div className="register-group-correo">
            <label htmlFor="correo" className="register-label-correo">Correo</label>
            <input 
              type="email" 
              id="correo" 
              name="correo" 
              value={form.correo} 
              onChange={handleChange} 
              className="register-input-correo" 
            />
          </div>
          <PasswordStrengthMeter 
            password={form.contrasena} 
            setPassword={(value) => setForm({ ...form, contrasena: value })} 
          />
        </div>
        <div className='colum-two'>
          <div className="register-group-genero">
            <label htmlFor="genero" className="register-label-genero">Género</label>
            <select 
              id="genero" 
              name="genero" 
              value={form.genero} 
              onChange={handleChange} 
              className="register-input-genero"
            >
              <option value="">Seleccione</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className="register-group-edad">
            <label htmlFor="edad" className="register-label-edad">Edad</label>
            <input 
              type="number" 
              id="edad" 
              name="edad" 
              value={form.edad} 
              onChange={handleChange} 
              className="register-input-edad" 
              min="0" 
            />
          </div>
          <div className="register-group-peso">
            <label htmlFor="peso" className="register-label-peso">Peso (kilos)</label>
            <input 
              type="number" 
              id="peso" 
              name="peso" 
              value={form.peso} 
              onChange={handleChange} 
              className="register-input-peso" 
              step="0.1" 
              min="0" 
            />
          </div>
          <div className="register-group-estatura">
            <label htmlFor="estatura" className="register-label-estatura">Estatura (metros)</label>
            <input 
              type="number" 
              id="estatura" 
              name="estatura" 
              value={form.estatura} 
              onChange={handleChange} 
              className="register-input-estatura" 
              step="0.01" 
              min="0" 
            />
          </div>          
        </div>
        <div className='colum-three'>
          <div className="register-group-telefono">
            <label htmlFor="telefono" className="register-label-telefono">Teléfono</label>
            <PhoneInput
              country={'cr'}
              value={form.telefono}
              onChange={handlePhoneChange}
              inputProps={{
                name: 'telefono',
                required: true,
                className: 'register-input-telefono'
              }}
            />
          </div>
          <div className="register-group-padecimientos">
            <label htmlFor="padecimientos" className="register-label-padecimientos">Padecimientos y alergias</label>
            <textarea
              id="padecimientos"
              name="padecimientos"
              value={form.padecimientos}
              onChange={handleChange}
              className="register-textarea-padecimientos"
            />
          </div>
        <div className="register-button-container">
          <button type="submit" className="register-submit-button">Registrarse</button>
        </div>          
        </div>
      </form>
    </div>
  );
};
export default RegisterComponent;