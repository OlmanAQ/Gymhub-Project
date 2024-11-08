import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; 
import { db } from '../../firebaseConfig/firebase';
import Swal from 'sweetalert2';
import '../../css/AdminEditSuplement.css';

const AdminEditSuplement = ({ suplemento, onClose }) => {
  const [nombre] = useState(suplemento.nombre); 
  const [nuevoNombre, setNuevoNombre] = useState(suplemento.nombre); 
  const [cantidad, setCantidad] = useState(suplemento.cantidad);
  const [descripcion, setDescripcion] = useState(suplemento.descripcion);
  const [disponible, setDisponible] = useState(suplemento.disponible);
  const [precio, setPrecio] = useState(suplemento.precio);
  const [image, setImage] = useState(null); 
  const [imageUrl, setImageUrl] = useState(suplemento.url); 
  const storage = getStorage();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nuevoNombre || !descripcion || (!image && !imageUrl)) {
      Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
      return;
    }

    let downloadURL = imageUrl;

    if (image) {
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
          downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL);
          updateSuplementData(downloadURL); 
        }
      );
    } else {
      updateSuplementData(downloadURL);
    }
  };

  const updateSuplementData = async (url) => {
    const updatedSuplement = {
      nombre: nuevoNombre,
      cantidad: parseInt(cantidad, 10),
      descripcion,
      disponible,
      precio: parseFloat(precio),
      url, 
    };

    try {
      const docRef = doc(db, 'suplements', suplemento.id);  
      await updateDoc(docRef, updatedSuplement); 
      Swal.fire('Éxito', 'Suplemento actualizado correctamente.', 'success');
      onClose(); 

    } catch (error) {
      console.error('Error al actualizar suplemento:', error);
      Swal.fire('Error', 'Hubo un error al actualizar el suplemento.', 'error');
    }
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
    <div className="edit-suplement-container">
      <h1 className="edit-suplement-title">Editar suplemento</h1>
      <form onSubmit={handleSubmit} className="edit-suplement-form">
        <div className="division-form-entry">

          <div className="edit-left">
            <div className="edit-suplement-form-group">
              <label className="edit-suplement-label">Subir imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="edit-suplement-input"
              />
              {image && (
                <div className="edit-uploaded-image-container">
                  <img src={URL.createObjectURL(image)} alt="Suplemento" className="edit-uploaded-image" />
                  <button type="button" onClick={handleRemoveImage} className="edit-remove-image-button">
                    Eliminar imagen
                  </button>
                </div>
              )}
              {!image && imageUrl && (
                <div className="edit-uploaded-image-container">
                  <img src={imageUrl} alt="Suplemento" className="edit-uploaded-image" />
                  <button type="button" onClick={handleRemoveImage} className="edit-remove-image-button">
                    Eliminar imagen
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="edit-right">
            <div className="edit-suplement-form-group">
              <label htmlFor="nuevoNombre" className="edit-suplement-label">Nombre</label>
              <input
                type="text"
                id="nuevoNombre"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                className="edit-suplement-input"
                required
              />
            </div>

            <div className="edit-suplement-form-group">
              <label htmlFor="cantidad" className="edit-suplement-label">Cantidad</label>
              <input
                type="number"
                id="cantidad"
                value={cantidad === 0 ? '' : cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="edit-suplement-input"
                required
              />
            </div>

            <div className="edit-suplement-form-group">
              <label htmlFor="descripcion" className="edit-suplement-label">Descripción</label>
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="edit-suplement-textarea"
                required
              />
            </div>

            <div className="edit-suplement-form-group">
              <label htmlFor="disponible" className="edit-suplement-label">Disponible</label>
              <select
                id="disponible"
                value={disponible}
                onChange={(e) => setDisponible(e.target.value === 'true')}
                className="edit-suplement-select"
                required
              >
                <option value="true">Disponible</option>
                <option value="false">No disponible</option>
              </select>
            </div>

            <div className="edit-suplement-form-group">
              <label htmlFor="precio" className="edit-suplement-label">Precio</label>
              <input
                type="number"
                id="precio"
                value={precio === 0 ? '' : precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="edit-suplement-input"
                required
              />
            </div>
          </div>
        </div>

        <div className="edit-division-form-button">
          <button type="submit" className="edit-as-submit-button">Actualizar</button>
          <button type="button" className="edit-cancel-button" onClick={onClose}>Cancelar</button>
        </div>

      </form>
    </div>
  );
};

export default AdminEditSuplement;
