import React, { useState, useEffect } from 'react';
import { agregarProducto } from '../../cruds/InventoryCrud';
import '../../css/AdminRegisterInventory.css';
import Swal from 'sweetalert2';

const AdminRegisterInventory = ({ gimnasioId, onClose }) => {
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [form, setForm] = useState({
    nombre: '',
    cantidad: '',
    categoria: '',
    estado: 'Operativo',
    zonas: [],
    ejercicios: [],
  });

  const [ejercicioNombre, setEjercicioNombre] = useState('');
  const [ejercicioDescripcion, setEjercicioDescripcion] = useState('');
  const [zona, setZona] = useState('');

  const estadoElemento = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleAgregarZona = () => {
    if (zona && !form.zonas.includes(zona)) {
      setForm((prevForm) => ({ ...prevForm, zonas: [...prevForm.zonas, zona] }));
      setZona('');
    }
  };

  const handleAgregarEjercicio = () => {
    if (ejercicioNombre && ejercicioDescripcion && form.zonas.length > 0) {
      const nuevoEjercicio = {
        nombre: ejercicioNombre,
        descripcion: ejercicioDescripcion,
        zonas: [...form.zonas],
      };
      setForm((prevForm) => ({
        ...prevForm,
        ejercicios: [...prevForm.ejercicios, nuevoEjercicio],
        zonas: [],
      }));
      setEjercicioNombre('');
      setEjercicioDescripcion('');
    } else {
      Swal.fire('Error', 'Debes agregar zonas al ejercicio antes de agregarlo.', 'error');
    }
  };

  const handleagregarProducto = async (e) => {
    e.preventDefault();
    try {
      //elminar listas vacias dentro lista de ejercicios
      form.ejercicios = form.ejercicios.filter(ejercicio => ejercicio.zonas.length > 0);
      
      const producto = { 
        nombre: form.nombre,
        cantidad: form.cantidad,
        categoria: form.categoria,
        estado: form.estado,
        ejercicios: form.ejercicios,
      };

      await agregarProducto({producto, gimnasioId });
      Swal.fire('Éxito', 'Producto agregado correctamente', 'success');
      onClose();
    } catch (error) {
      console.error('Error adding product: ', error);
      Swal.fire('Error', 'No se pudo agregar el producto', 'error');
    }

  };

  return (
    <div className="admin-inventory-register-view">
      <h2>Agregar Equipo</h2>
      <button className="btn-close" onClick={onClose}></button>
      <form className="inventory-form" onSubmit={handleagregarProducto}>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={estadoElemento}
          placeholder="Nombre del producto"
          className="form-control"
        />
        <input
          type="number"
          name="cantidad"
          value={form.cantidad}
          onChange={estadoElemento}
          placeholder="Cantidad"
          className="form-control"
        />
        <input
          type="text"
          name="categoria"
          value={form.categoria}
          onChange={estadoElemento}
          placeholder="Categoría"
          className="form-control"
        />
        <select name="estado" value={form.estado} onChange={estadoElemento} className="form-control">
          <option value="Operativo">Operativo</option>
          <option value="En mantenimiento">En mantenimiento</option>
          <option value="Fuera de servicio">Fuera de servicio</option>
        </select>

        
        <div className="form-inline">
          <input
            type="text"
            value={ejercicioNombre}
            onChange={(e) => setEjercicioNombre(e.target.value)}
            placeholder="Nombre del ejercicio"
            className="form-control"
          />
          <input
            type="text"
            value={ejercicioDescripcion}
            onChange={(e) => setEjercicioDescripcion(e.target.value)}
            placeholder="Descripción del ejercicio"
            className="form-control"
          />
          {/* Zonas y ejercicios */}
        <div className="form-inline">
          <input
            type="text"
            value={zona}
            onChange={(e) => setZona(e.target.value)}
            placeholder="Zona del cuerpo"
            className="form-control"
          />
          <button type="button" className="btn-zone" onClick={handleAgregarZona}>
            Enlistar Zona
          </button>
        </div>

        {form.zonas.length > 0 && (
          <ul className="zone-list">
            {form.zonas.map((z, index) => (
              <li key={index}>{z}</li>
            ))}
          </ul>
        )}

          <button type="button" className="btn-add" onClick={handleAgregarEjercicio}>
            + Agregar Ejercicio
          </button>
        </div>

        {form.ejercicios.length > 0 && (
          <div className="inventory-list">
            <h3>Ejercicios agregados:</h3>
            <ul>
              {form.ejercicios.map((ejercicio, index) => (
                <li key={index}>
                  <strong>{ejercicio.nombre}</strong>: {ejercicio.descripcion}
                  <ul>
                    {ejercicio.zonas.map((zona, zonaIndex) => (
                      <li key={zonaIndex}>{zona}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" className="btn-submit">Finalizar Equipo</button>
      </form>
    </div>
  );
};

export default AdminRegisterInventory;
