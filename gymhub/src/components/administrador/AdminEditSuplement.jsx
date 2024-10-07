import React, { useState } from 'react';
import { doc, updateDoc, deleteField } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; 
import { db } from '../../firebaseConfig/firebase';
import Swal from 'sweetalert2';
import '../../css/AdminEditSuplement.css';

const AdminEditSuplement = ({ suplemento, onClose }) => {
  const [nombre] = useState(suplemento.id); 
  const [nuevoNombre, setNuevoNombre] = useState(suplemento.id); 
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

    // Si se ha seleccionado una nueva imagen, súbela a Firebase Storage
    if (image) {
      const storageRef = ref(storage, `suplements/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      // Manejo del progreso de la subida
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
          // Obtener URL de la imagen subida
          downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL);
          updateSuplementData(downloadURL); // Llama a la función de actualización
        }
      );
    } else {
      // Si no se ha seleccionado una nueva imagen, solo actualizar los demás campos
      updateSuplementData(downloadURL);
    }
  };

  const updateSuplementData = async (url) => {
    const updatedSuplement = {
      cantidad: parseInt(cantidad, 10),
      descripcion,
      disponible,
      precio: parseFloat(precio),
      url, // Utiliza la URL de la imagen (nueva o anterior)
    };

    try {
      const docRef = doc(db, 'suplementslist', 'FkhKVhtSuwkyiSl7VvN9');

      await updateDoc(docRef, {
        [nuevoNombre]: updatedSuplement,
      });

      if (nombre !== nuevoNombre) {
        await updateDoc(docRef, {
          [nombre]: deleteField(),
        });
      }

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
    <div className="admin-add-suplement-container">
      <h1 className="admin-add-suplement-title">Editar suplemento</h1>
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
              {!image && imageUrl && (
                <div className="uploaded-image-container">
                  <img src={imageUrl} alt="Suplemento" className="uploaded-image" />
                  <button type="button" onClick={handleRemoveImage} className="remove-image-button">
                    Eliminar imagen
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="right">
            <div className="admin-add-suplement-form-group">
              <label htmlFor="nuevoNombre" className="admin-add-suplement-label">Nombre</label>
              <input
                type="text"
                id="nuevoNombre"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
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
          <button type="submit" className="as-submit-button">Actualizar</button>
          <button type="button" className="remove-image-button" onClick={onClose}>Cancelar</button>
        </div>

      </form>
    </div>
  );
};

export default AdminEditSuplement;
