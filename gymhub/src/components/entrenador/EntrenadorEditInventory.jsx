import React, { useState, useEffect } from 'react';
import { actualizarProducto, obtenerProductoPorId } from '../../cruds/InventoryCrud';
import Swal from 'sweetalert2';
import '../../css/AdminEditInventory.css';

const EntrenadorEditInventory = ({ gimnasioId, equipoId, onClose }) => {
  const [form, setForm] = useState({
    nombre: '',
    cantidad: '',
    categoria: '',
    estado: 'Operativo',
    ejercicios: [],
  });

  useEffect(() => {
    const fetchEquipo = async () => {
      try {
        const equipo = await obtenerProductoPorId(gimnasioId, equipoId);
        setForm(equipo);
      } catch (error) {
        console.error('Error fetching equipment: ', error);
      }
    };
    fetchEquipo();
  }, [gimnasioId, equipoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await actualizarProducto(gimnasioId, equipoId, form);
      Swal.fire('Éxito', 'Equipo actualizado correctamente', 'success');
      onClose();
    } catch (error) {
      console.error('Error updating equipment: ', error);
      Swal.fire('Error', 'No se pudo actualizar el equipo', 'error');
    }
  };

  return (
    <div className="admin-edit-inventory-view">
      <h2>Editar Equipo</h2>
      <button className="btn-close" onClick={onClose}></button>
      <form className="inventory-form" onSubmit={handleUpdate}>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre del producto"
          className="form-control"
        />
        <input
          type="number"
          name="cantidad"
          value={form.cantidad}
          onChange={handleChange}
          placeholder="Cantidad"
          className="form-control"
        />
        <input
          type="text"
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          placeholder="Categoría"
          className="form-control"
        />
        <select name="estado" value={form.estado} onChange={handleChange} className="form-control">
          <option value="Operativo">Operativo</option>
          <option value="En mantenimiento">En mantenimiento</option>
          <option value="Fuera de servicio">Fuera de servicio</option>
        </select>
        <div className="form-buttons">
          <button type="submit" className="btn-submit">Actualizar Equipo</button>
          <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default EntrenadorEditInventory;