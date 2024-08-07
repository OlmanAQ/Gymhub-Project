import React, { useState, useEffect } from 'react';
import '../css/RegisterComponent.css';
import { Eye, EyeOff, X } from 'lucide-react';
import LogoGymHub from '../assets/LogoGymHub.png';

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
    fechaInscripcion: new Date().toISOString().slice(0, 10), // Fecha actual
    tipoMembresia: '',
    renovacion: '',
    contrasena: ''
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
    setForm((prevForm) => ({ ...prevForm, renovacion: renovacionDate.toISOString().slice(0, 10) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado', form);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="register-container">
      <img src={LogoGymHub} className="register-logo" />
      <h2 className='titulo-form'>Registro de Membresía</h2>
      <form onSubmit={handleSubmit}>
        <div className="register-row">
        <button className="close-button" onClick={onShowLogin}>
          <X />
        </button>
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
        </div>
        <div className="register-row">
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
        </div>
        <div className="register-row">
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
        </div>
        <div className="register-row">
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
        </div>
        <div className="register-row">
          <div className="register-form-group">
            <label htmlFor="fechaInscripcion" className="register-label">Fecha de inscripción</label>
            <input 
              type="date" 
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
              <option value="Dia">Día</option>
              <option value="Semana">Semana</option>
              <option value="Mes">Mes</option>
              <option value="Año">Año</option>
            </select>
          </div>
        </div>
        <div className="register-row">
          <div className="register-form-group">
            <label htmlFor="renovacion" className="register-label">Renovación</label>
            <input 
              type="date" 
              id="renovacion" 
              name="renovacion" 
              value={form.renovacion} 
              onChange={handleChange} 
              className="register-input register-input-renovacion" 
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
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
        </div>
        <button type="submit" className="register-submit-button">Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterComponent;
