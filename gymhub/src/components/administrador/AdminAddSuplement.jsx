import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import Swal from 'sweetalert2';
import '../../css/AdminAddSuplement.css';

const AdminAddSuplement = ({onClose}) => {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [descripcion, setDescripcion] = useState('');
  const [disponible, setDisponible] = useState(true);
  const [precio, setPrecio] = useState(0);
  const [url, setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !descripcion || !url) {
      Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
      return;
    }

    const newSuplement = {
      cantidad,
      descripcion,
      disponible,
      precio,
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
    <div className="add-suplement-container">
      <h1 className='ttl'>Agregar nuevo suplemento</h1>
      <div className='cont-butb'>
        <button type="button" className="button-rback" onClick={onClose}>Volver</button>
      </div>
      <form onSubmit={handleSubmit} className="add-suplement-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
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

        <button type="submit" className="button-add">Agregar</button>
      </form>
    </div>
  );
};

export default AdminAddSuplement;
