import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; 
import { db } from '../../firebaseConfig/firebase';
import Swal from 'sweetalert2';
import '../../css/AdminAddSuplement.css';

const AdminAddSuplement = ({ onClose }) => {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [disponible, setDisponible] = useState(true);
  const [precio, setPrecio] = useState('');
  const [image, setImage] = useState(null); 
  const [imageUrl, setImageUrl] = useState(''); 
  const storage = getStorage(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !descripcion || !image) {
      Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
      return;
    }

    const storageRef = ref(storage, `suplements/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.error('Error uploading image:', error);
        Swal.fire('Error', 'Error al subir la imagen.', 'error');
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(downloadURL); 

        const newSuplement = {
          nombre,
          cantidad: parseInt(cantidad, 10),
          descripcion,
          disponible,
          precio: parseFloat(precio),
          url: downloadURL, 
        };

        try {
          await addDoc(collection(db, 'suplements'), newSuplement);

          setNombre('');
          setCantidad('');
          setDescripcion('');
          setDisponible(true);
          setPrecio('');
          setImage(null);
          setImageUrl('');

          Swal.fire('Excelente', 'Suplemento agregado correctamente.', 'success');
        } catch (error) {
          console.error('Error al agregar suplemento:', error);
          Swal.fire('Error', 'Hubo un error al agregar el suplemento.', 'error');
        }
      }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageUrl('');
  };

  return (
    <div className="admin-add-suplement-container">
      <h1 className="admin-add-suplement-title">Agregar nuevo suplemento</h1>
      <div className="admin-add-suplement-back-container">
        <button type="button" className="admin-add-suplement-back-button" onClick={onClose}>Volver</button>
      </div>

      <form onSubmit={handleSubmit} className="admin-add-suplement-form">
        <div className="division-form-entry">

          <div className="left">
            <div className="admin-add-suplement-form-group">
              <label className="admin-add-suplement-label">Subir imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="admin-add-suplement-input"
              />
              {image && (
                <div className="uploaded-image-container">
                  <img src={URL.createObjectURL(image)} alt="Suplemento" className="uploaded-image" />
                  <button type="button" onClick={handleRemoveImage} className="remove-image-button">
                    Eliminar imagen
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="right">
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
                onChange={(e) => setCantidad(e.target.value)}
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
                onChange={(e) => setPrecio(e.target.value)}
                className="admin-add-suplement-input"
                required
              />
            </div>
          </div>

        </div>

        <div className="division-form-button">
          <button type="submit" className="admin-add-suplement-submit-button">Agregar</button>
        </div>

      </form>
    </div>
  );
};

export default AdminAddSuplement;
