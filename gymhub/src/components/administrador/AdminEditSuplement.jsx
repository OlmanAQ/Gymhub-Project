import React, { useState } from 'react';
import { doc, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import Swal from 'sweetalert2';
import '../../css/AdminEditSuplement.css';

const AdminEditSuplement = ({ suplemento, onClose }) => {
  // Mantén el ID antiguo (no cambiante) y agrega un estado para el nuevo nombre (ID)
  const [nombre, setNombre] = useState(suplemento.id); // ID actual del suplemento
  const [nuevoNombre, setNuevoNombre] = useState(suplemento.id); // El nuevo ID del suplemento
  const [cantidad, setCantidad] = useState(suplemento.cantidad);
  const [descripcion, setDescripcion] = useState(suplemento.descripcion);
  const [disponible, setDisponible] = useState(suplemento.disponible);
  const [precio, setPrecio] = useState(suplemento.precio);
  const [url, setUrl] = useState(suplemento.url);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nuevoNombre || !descripcion || !url) {
      Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
      return;
    }

    const updatedSuplement = {
      cantidad,
      descripcion,
      disponible,
      precio,
      url,
    };

    try {
      const docRef = doc(db, 'suplementslist', 'FkhKVhtSuwkyiSl7VvN9');

      // 1. Agregar el nuevo suplemento con el nuevo ID
      await updateDoc(docRef, {
        [nuevoNombre]: updatedSuplement,
      });

      // 2. Eliminar el suplemento con el antiguo ID si el nombre ha cambiado
      if (nombre !== nuevoNombre) {
        await updateDoc(docRef, {
          [nombre]: deleteField(),
        });
      }

      Swal.fire('Éxito', 'Suplemento actualizado correctamente.', 'success');
      onClose(); // Cerrar el formulario de edición

    } catch (error) {
      console.error('Error al actualizar suplemento:', error);
      Swal.fire('Error', 'Hubo un error al actualizar el suplemento.', 'error');
    }
  };

  return (
    <div className="add-suplement-container">
      <h1 className="ttl">Editar suplemento</h1>
      <form onSubmit={handleSubmit} className="add-suplement-form">
        <div className="form-group">
          <label htmlFor="nuevoNombre">Nombre (ID)</label>
          <input
            type="text"
            id="nuevoNombre"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cantidad">Cantidad</label>
          <input
            type="number"
            id="cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="disponible">Disponible</label>
          <select
            id="disponible"
            value={disponible}
            onChange={(e) => setDisponible(e.target.value === 'true')}
            required
          >
            <option value="true">Disponible</option>
            <option value="false">No disponible</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="precio">Precio</label>
          <input
            type="number"
            id="precio"
            value={precio}
            onChange={(e) => setPrecio(Number(e.target.value))}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="url">URL de la imagen</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="button-add">Actualizar</button>
        <button type="button" className="button-cancel" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default AdminEditSuplement;
