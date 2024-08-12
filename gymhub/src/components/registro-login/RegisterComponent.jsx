import React, { useState, useEffect } from 'react';
import '../../css/RegisterComponent.css';
import { Eye, EyeOff, X } from 'lucide-react';
import LogoGymHub from '../../assets/LogoGymHub.png';
import Swal from 'sweetalert2';
import { agregarClienteConRol } from '../../cruds/Create';
import { verificarCorreoExistente,verificarUsuario } from '../../cruds/Read';

const RegisterComponent = ({ onShowLogin }) => {
  const formatDate = (date) => {
    return date.toISOString().slice(0, 10).replace(/-/g, '/'); // Formato YYYY/MM/DD
  };
  const [form, setForm] = useState({
    nombre: '',
    edad: '',
    genero: '',
    estatura: '',
    peso: '',
    padecimientos: '',
    correo: '',
    telefono: '',
    fechaInscripcion: formatDate(new Date()), // Fecha actual 
    tipoMembresia: '',
    renovacion: '',
    contrasena: '',
    usuario: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (form.tipoMembresia) {
      calculateRenovationDate(form.tipoMembresia);
    }
  }, [form.tipoMembresia]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const calculateRenovationDate = (tipo) => {
    const fechaInscripcion = new Date(form.fechaInscripcion);
    let renovacionDate;
  
    switch (tipo) {
      case 'Dia':
        renovacionDate = new Date(fechaInscripcion);
        renovacionDate.setDate(fechaInscripcion.getDate() + 1);
        break;
      case 'Semana':
        renovacionDate = new Date(fechaInscripcion);
        renovacionDate.setDate(fechaInscripcion.getDate() + 7);
        break;
      case 'Mes':
        renovacionDate = new Date(fechaInscripcion);
        renovacionDate.setMonth(fechaInscripcion.getMonth() + 1);
        break;
      case 'Año':
        renovacionDate = new Date(fechaInscripcion);
        renovacionDate.setFullYear(fechaInscripcion.getFullYear() + 1);
        break;
      default:
        renovacionDate = '';
    }
  
    if (renovacionDate) {
      const formattedDate = renovacionDate.toISOString().slice(0, 10).replace(/-/g, '/'); // Formato YYYY/MM/DD
      setForm((prevForm) => ({ ...prevForm, renovacion: formattedDate }));
    } else {
      setForm((prevForm) => ({ ...prevForm, renovacion: '' }));
    }
  };
  
  

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const validateForm = () => {
    // Verifica que todos los campos estén llenos y que no tengan datos por defecto
    const requiredFields = ['nombre', 'edad', 'genero', 'estatura', 'peso', 'padecimientos', 'correo', 'telefono', 'tipoMembresia', 'contrasena', 'usuario'];
    for (let field of requiredFields) {
      if (form[field] === undefined || form[field].trim() === '') {
        return false;
      }
    }
  
    // Verifica que los valores seleccionados en los campos de selección no sean los predeterminados
    if (form.genero === '' || form.tipoMembresia === '' || form.genero === 'Seleccione' || form.tipoMembresia === 'Seleccione') {
      return false;
    }
  
    return true;
  };

  const agregarCliente = async (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
  
    if (!validateForm()) {
      Swal.fire({
        icon: 'warning',
        title: 'Registro incompleto',
        text: 'Por favor, complete todos los campos correctamente.',
        confirmButtonText: 'Entendido'
      });
      return;
    }
  
    // Verificar si el correo ya existe en la base de datos
    const correoExiste = await verificarCorreoExistente(form.correo);
  
    if (correoExiste) {
      Swal.fire({
        icon: 'error',
        title: 'Correo ya registrado',
        text: 'El correo ingresado ya está registrado. Por favor, utilice otro correo.',
        confirmButtonText: 'Entendido'
      });
      return; // Detener el proceso de registro si el correo ya existe
    }
    const usuarioExistente = await verificarUsuario(form.usuario);
  
    if (usuarioExistente) {
      Swal.fire({
        icon: 'error',
        title: 'Usuario ya registrado',
        text: 'El usuario ya esta en uso. Por favor, utilice otro usuario.',
        confirmButtonText: 'Entendido'
      });
      return; // Detener el proceso de registro si el usuario ya existe
    }
    const result = await Swal.fire({
      title: 'Confirmar registro',
      text: "¿Estás seguro de que desea registrarse?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Cancelar'
    });
  
    if (result.isConfirmed) {
      try {
        await agregarClienteConRol(form); // Llama al método para agregar el cliente con rol
        Swal.fire({
          icon: 'success',
          title: 'Registrado',
          text: 'Cliente registrado exitosamente.',
          confirmButtonText: 'Ok'
        }).then(() => {
          // Limpiar el formulario después de un registro exitoso
          setForm({
            nombre: '',
            edad: '',
            genero: '',
            estatura: '',
            peso: '',
            padecimientos: '',
            correo: '',
            telefono: '',
            fechaInscripcion: formatDate(new Date()), // Fecha actual
            tipoMembresia: '',
            renovacion: '',
            contrasena: '',
            usuario: ''
          });
  
          // Redirigir al componente de login
          onShowLogin();
        });
      } catch (error) {
        console.error('Error al registrar el cliente:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al registrar el cliente.',
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
        <button className="close-button" onClick={onShowLogin}>
          <X />
        </button>
      </header>
      <form className='register' onSubmit={agregarCliente}>
          <div className="register-form-group">
              <label htmlFor="usuario" className="register-label">Usuario</label>
              <input 
                type="text" 
                id="usuario" 
                name="usuario" 
                value={form.usuario} 
                onChange={handleChange} 
                className="register-input register-input-usuario" 
              />
          </div>
          <div className="register-form-group">
            <label htmlFor="nombre" className="register-label">Nombre completo</label>
            <input 
              type="text" 
              id="nombre" 
              name="nombre" 
              value={form.nombre} 
              onChange={handleChange} 
              className="register-input register-input-nombre" 
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="edad" className="register-label">Edad</label>
            <input 
              type="number" 
              id="edad" 
              name="edad" 
              value={form.edad} 
              onChange={handleChange} 
              className="register-input register-input-edad" 
              min="0" 
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="genero" className="register-label">Género</label>
            <select 
              id="genero" 
              name="genero" 
              value={form.genero} 
              onChange={handleChange} 
              className="register-input register-input-genero"
            >
              <option value="">Seleccione</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
            </select>
          </div>
          <div className="register-form-group">
            <label htmlFor="estatura" className="register-label">Estatura (metros)</label>
            <input 
              type="number" 
              id="estatura" 
              name="estatura" 
              value={form.estatura} 
              onChange={handleChange} 
              className="register-input register-input-estatura" 
              step="0.01" 
              min="0" 
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="peso" className="register-label">Peso (kilos)</label>
            <input 
              type="number" 
              id="peso" 
              name="peso" 
              value={form.peso} 
              onChange={handleChange} 
              className="register-input register-input-peso" 
              step="0.1" 
              min="0" 
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="padecimientos" className="register-label">Padecimientos y alergias</label>
            <input 
              type="text" 
              id="padecimientos" 
              name="padecimientos" 
              value={form.padecimientos} 
              onChange={handleChange} 
              className="register-input register-input-padecimientos" 
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="correo" className="register-label">Correo</label>
            <input 
              type="email" 
              id="correo" 
              name="correo" 
              value={form.correo} 
              onChange={handleChange} 
              className="register-input register-input-correo" 
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="telefono" className="register-label">Teléfono</label>
            <input 
              type="tel" 
              id="telefono" 
              name="telefono" 
              value={form.telefono} 
              onChange={handleChange} 
              className="register-input register-input-telefono" 
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="fechaInscripcion" className="register-label">Fecha de inscripción</label>
            <input 
              type="text" 
              id="fechaInscripcion" 
              name="fechaInscripcion" 
              value={form.fechaInscripcion} 
              onChange={handleChange} 
              className="register-input register-input-fecha-inscripcion" 
              disabled
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="tipoMembresia" className="register-label">Tipo de membresía</label>
            <select 
              id="tipoMembresia" 
              name="tipoMembresia" 
              value={form.tipoMembresia} 
              onChange={handleChange} 
              className="register-input register-input-tipo-membresia"
            >
              <option value="">Seleccione</option>
              <option value="Dia">Dia</option>
              <option value="Semana">Semana</option>
              <option value="Mes">Mes</option>
              <option value="Año">Año</option>
            </select>
          </div>
          <div className="register-form-group">
            <label htmlFor="renovacion" className="register-label">Renovación</label>
            <input 
              type="text" 
              id="renovacion" 
              name="renovacion" 
              value={form.renovacion} 
              onChange={handleChange} 
              className="register-input register-input-renovacion" 
              placeholder="yyy/mm/dd"
              disabled
            />
          </div>
          <div className="register-form-group">
            <label htmlFor="contrasena" className="register-label">Contraseña</label>
            <div className="password-container">
              <input 
                type={showPassword ? "text" : "password"} 
                id="contrasena" 
                name="contrasena" 
                value={form.contrasena} 
                onChange={handleChange} 
                className="register-input register-input-contrasena" 
              />
              <button 
                type="button" 
                className="password-toggle-button" 
                onClick={toggleShowPassword}
              >
                {showPassword ? <Eye /> : <EyeOff/>}
              </button>
            </div>
          </div>
        <button type="submit" className="register-submit-button">Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterComponent;
