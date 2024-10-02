import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import Swal from 'sweetalert2';
import '../../css/AdminAddSuplement.css';

const AdminAddSuplement = ({ onClose }) => {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [disponible, setDisponible] = useState(true);
  const [precio, setPrecio] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !descripcion || !url) {
      Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
      return;
    }

    const newSuplement = {
      cantidad: parseInt(cantidad, 10), 
      descripcion,
      disponible,
      precio: parseFloat(precio), 
      url,
    };

    try {
      const docRef = doc(db, 'suplementslist', 'FkhKVhtSuwkyiSl7VvN9'); 
      await updateDoc(docRef, {
        [nombre]: newSuplement, 
      });

      setNombre('');
      setCantidad(0);
      setDescripcion('');
      setDisponible(true);
      setPrecio(0);
      setUrl('');

      Swal.fire('Excelente', 'Suplemento agregado correctamente.', 'success');
      
    } catch (error) {
      console.error('Error al agregar suplemento:', error);
      Swal.fire('Error', 'Hubo un error al agregar el suplemento.', 'error');
    }
  };

  return (
    <div className="admin-add-suplement-container">
      <h1 className="admin-add-suplement-title">Agregar nuevo suplemento</h1>
      <div className="admin-add-suplement-back-container">
        <button type="button" className="admin-add-suplement-back-button" onClick={onClose}>Volver</button>
      </div>
      <form onSubmit={handleSubmit} className="admin-add-suplement-form">
        <div className="admin-add-suplement-form-group">
          <label htmlFor="nombre" className="admin-add-suplement-label">Nombre</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="admin-add-suplement-input"
            required
          />
        </div>

        <div className="admin-add-suplement-form-group">
          <label htmlFor="cantidad" className="admin-add-suplement-label">Cantidad</label>
          <input
            type="number"
            id="cantidad"
            value={cantidad === 0 ? '' : cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="admin-add-suplement-input"
            required
          />
        </div>

        <div className="admin-add-suplement-form-group">
          <label htmlFor="descripcion" className="admin-add-suplement-label">Descripción</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="admin-add-suplement-textarea"
            required
          />
        </div>

        <div className="admin-add-suplement-form-group">
          <label htmlFor="disponible" className="admin-add-suplement-label">Disponible</label>
          <select
            id="disponible"
            value={disponible}
            onChange={(e) => setDisponible(e.target.value === 'true')}
            className="admin-add-suplement-select"
            required
          >
            <option value="true">Disponible</option>
            <option value="false">No disponible</option>
          </select>
        </div>

        <div className="admin-add-suplement-form-group">
          <label htmlFor="precio" className="admin-add-suplement-label">Precio</label>
          <input
            type="number"
            id="precio"
            value={precio === 0 ? '' : precio}
            onChange={(e) => setPrecio(Number(e.target.value))}
            className="admin-add-suplement-input"
            required
          />
        </div>

        <div className="admin-add-suplement-form-group">
          <label htmlFor="url" className="admin-add-suplement-label">URL de la imagen</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="admin-add-suplement-input"
            required
          />
        </div>

        <button type="submit" className="admin-add-suplement-submit-button">Agregar</button>
      </form>
    </div>
  );
};

export default AdminAddSuplement;
