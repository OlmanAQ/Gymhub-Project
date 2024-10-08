import React, { useState, useEffect } from 'react';
import '../../css/AdminRegisterUser.css';
import { Eye, EyeOff, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { appFirebase, auth } from '../../firebaseConfig/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { agregarUsuario } from '../../cruds/Create';
import { verificarCorreoExistente, verificarUsuario } from '../../cruds/Read';

const AdminRegisterUser = ({onClose}) => {
  
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
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
    fechaInscripcion: formatDate(new Date()),
    tipoMembresia: '',
    renovacion: '',
    contrasena: '',
    usuario: '',
    rol: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (form.tipoMembresia) {
      calculateRenovationDate(form.tipoMembresia);
    }
  }, [form.tipoMembresia]);

  const estadoElemento = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const calculateRenovationDate = (tipo) => {
    const [day, month, year] = form.fechaInscripcion.split('/').map(Number);
    const fechaInscripcion = new Date(year, month - 1, day);

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
        renovacionDate = null;
    }

    if (renovacionDate) {
      const formattedDate = formatDate(renovacionDate);
      setForm((prevForm) => ({ ...prevForm, renovacion: formattedDate }));
    } else {
      setForm((prevForm) => ({ ...prevForm, renovacion: '' }));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const requiredFields = [
      'nombre', 'edad', 'genero', 'estatura', 'peso', 'padecimientos',
      'correo', 'telefono', 'tipoMembresia', 'contrasena', 'usuario', 'rol'
    ];
    for (let field of requiredFields) {
      if (form[field] === undefined || form[field].trim() === '') {
        return false;
      }
    }

    if (form.genero === '' || form.tipoMembresia === '' || form.genero === 'Seleccione' || form.tipoMembresia === 'Seleccione') {
      return false;
    }

    if (form.rol === '') {
      return false;
    }

    return true;
  };

  const agregarUser = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: 'warning',
        title: 'Registro incompleto',
        text: 'Por favor, complete todos los campos correctamente.',
        confirmButtonText: 'Entendido'
      });
      return;
    }

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
        await createUserWithEmailAndPassword(auth, form.correo, form.contrasena);
        await agregarUsuario(form);
        Swal.fire({
          icon: 'success',
          title: 'Registrado',
          text: 'Cliente registrado exitosamente.',
          confirmButtonText: 'Ok'
        }).then(() => {
          setForm({
            nombre: '',
            edad: '',
            genero: '',
            estatura: '',
            peso: '',
            padecimientos: '',
            correo: '',
            telefono: '',
            fechaInscripcion: formatDate(new Date()),
            tipoMembresia: '',
            renovacion: '',
            contrasena: '',
            usuario: '',
            rol: ''
          });
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

  const cerrarFormulario = () => {
    // Lógica para cerrar el formulario
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Estás a punto de cerrar el formulario. Los datos no guardados se perderán.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Lógica adicional para cerrar el formulario, como redirigir o limpiar estados
        console.log('Formulario cerrado');
        onClose(); // Invocar la función onClose
      }
    });
  };
  
  return (
    <div className="register-user-container">
      <div className="register-user-header">
        <h2>Agregar Usuario</h2>
      </div>
      <form className='register-user' onSubmit={agregarUser}>
        
      <button type="button" className="close-button-admin-user" onClick={cerrarFormulario}>
          <X />
        </button>
        <div className="register-form-group">
          <label htmlFor="usuario" className="register-label">Usuario</label>
          <input
            type="text"
            id="usuario"
            name="usuario"
            value={form.usuario}
            onChange={estadoElemento}
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
            onChange={estadoElemento}
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
            onChange={estadoElemento}
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
            onChange={estadoElemento}
            className="register-input register-input-genero"
          >
            <option value="">Seleccione</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="register-form-group">
          <label htmlFor="estatura" className="register-label">Estatura (metros)</label>
          <input
            type="number"
            id="estatura"
            name="estatura"
            value={form.estatura}
            onChange={estadoElemento}
            className="register-input register-input-estatura"
            step="0.01"
            min="0"
          />
        </div>
        <div className="register-form-group">
          <label htmlFor="peso" className="register-label">Peso (kg)</label>
          <input
            type="number"
            id="peso"
            name="peso"
            value={form.peso}
            onChange={estadoElemento}
            className="register-input register-input-peso"
            step="0.1"
            min="0"
          />
        </div>
        <div className="register-form-group">
          <label htmlFor="padecimientos" className="register-label">Padecimientos y alergias</label>
          <textarea
            id="padecimientos"
            name="padecimientos"
            value={form.padecimientos}
            onChange={estadoElemento}
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
            onChange={estadoElemento}
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
            onChange={estadoElemento}
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
            onChange={estadoElemento}
            className="register-input register-input-fechaInscripcion"
            readOnly
          />
        </div>
        <div className="register-form-group">
          <label htmlFor="tipoMembresia" className="register-label">Tipo de membresía</label>
          <select
            id="tipoMembresia"
            name="tipoMembresia"
            value={form.tipoMembresia}
            onChange={estadoElemento}
            className="register-input register-input-tipoMembresia"
          >
            <option value="">Seleccione</option>
            <option value="Dia">Día</option>
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
            onChange={estadoElemento}
            className="register-input register-input-renovacion"
            readOnly
            placeholder='dd/mm/yyy'
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
              onChange={estadoElemento}
              className="register-input register-input-contrasena"
            />
            <button type="button" className="password-toggle-button" onClick={toggleShowPassword}>
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </div>
        <div className="register-form-group">
          <label htmlFor="rol" className="register-label">Rol</label>
          <select
            id="rol"
            name="rol"
            value={form.rol}
            onChange={estadoElemento}
            className="register-input register-input-rol"
          >
            <option value="">Seleccione</option>
            <option value="Administrador">Administrador</option>
            <option value="Entrenador">Entrenador</option>
            <option value="Cliente">Cliente</option>
          </select>
        </div>
        <div className="register-form-group submit-container">
          <button type="submit" className="register-user-submit-button">
            Registrar
          </button>
        </div>
      </form>
    </div>
  );
  
};

export default AdminRegisterUser;
