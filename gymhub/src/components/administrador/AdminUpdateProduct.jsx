import React, { useState, useEffect } from 'react';
import { storage } from '../../firebaseConfig/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import Swal from 'sweetalert2';
import { X } from 'lucide-react';
import { actualizarProducto } from '../../cruds/Update';
import { obtenerProducto } from '../../cruds/Read';
import '../../css/AdminUpdateProduct.css';

const AdminUpdateProduct = ({ productId, onClose, recargarAdminSalesView }) => {
  const [producto, setProducto] = useState({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    state: '',
    imageID: '',
  });
  const [cargando, setCargando] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productoData = await obtenerProducto(productId);
        if (productoData) {
          setProducto(productoData);
        }
      } catch (error) {
        console.error('Error al obtener el producto:', error);
      } finally {
        setCargando(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewImageUrl(previewUrl);
    }
  };

  const uploadImageAndGetUrl = async () => {
    if (imageFile) {
      try {
        const imageRef = ref(storage, `products/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(imageRef);
        return imageUrl;
      } catch (error) {
        console.error('Error al cargar la imagen:', error);
        Swal.fire('Error', 'Hubo un problema al cargar la imagen', 'error');
      }
    }
    return null;
  };

  const deleteOldImage = async (oldImageUrl) => {
    if (oldImageUrl) {
      const oldImageRef = ref(storage, oldImageUrl);
      try {
        await deleteObject(oldImageRef);
        console.log('Imagen eliminada con éxito');
      } catch (error) {
        console.error('Error al eliminar la imagen:', error);
      }
    }
  };

  const validarFormulario = () => {
    if (!producto.name || !producto.description || producto.price <= 0 || !producto.state) {
      Swal.fire('Formulario incompleto', 'Por favor, completa todos los campos obligatorios.', 'error');
      return false;
    }
    return true;
  };

  const handleUpdateProduct = async () => {
    if (!validarFormulario()) {
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas realizar los cambios en este producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let updatedProduct = { ...producto };
          if (imageFile) {
            await deleteOldImage(producto.imageID);
            const imageUrl = await uploadImageAndGetUrl();
            if (imageUrl) {
              updatedProduct.imageID = imageUrl;
            }
          }
          await actualizarProducto(productId, updatedProduct);
          Swal.fire('Éxito', 'El producto ha sido actualizado correctamente', 'success');
          recargarAdminSalesView();
          onClose();
        } catch (error) {
          console.error('Error al actualizar el producto:', error);
          Swal.fire('Error', 'Hubo un problema al actualizar el producto: ' + error.message, 'error');
        }
      }
    });
  };

  const handleStateChange = (newState) => {
    setProducto((prevProducto) => ({
      ...prevProducto,
      state: newState,
      quantity: newState === 'Agotado' ? 0 : prevProducto.quantity,
    }));
  };

  if (cargando) return <p>Cargando producto...</p>;

  return (
    <div className="update-product-container">
      <div className="update-product-header">
        <h2 className="update-product-title">Actualizar Producto</h2>
        <X onClick={onClose} className="update-product-close-icon" />
      </div>
      <form className="update-product-form">
        <div className="product-image-container">
          {producto.imageID ? (
            <>
              <label className="update-product-label">Imagen actual</label>
              <img src={producto.imageID} alt="Producto" className="product-image" />
            </>
          ) : (
            <p>No hay imagen disponible</p>
          )}

          <div className="file-and-preview-container">
            <label className="update-product-label">
              <input
                type="file"
                id="fileInput"
                className="update-product-file-input"
                onChange={handleImageChange}
              />
              <span
                className="custom-file-button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  document.getElementById('fileInput').click();
                }}
              >
                Nueva imagen
              </span>
            </label>

            <div className="image-preview-container">
              {previewImageUrl && (
                <img src={previewImageUrl} alt="Vista previa" className="preview-image" />
              )}
            </div>
          </div>
          <label className="update-product-label">
            Descripción:
            <textarea
              className="update-product-textarea"
              value={producto.description}
              onChange={(e) => setProducto({ ...producto, description: e.target.value })}
            />
          </label>
        </div>
        <div className="product-info-container">
          <label className="update-product-label">
            Nombre:
            <input
              type="text"
              className="update-product-input"
              value={producto.name}
              onChange={(e) => setProducto({ ...producto, name: e.target.value })}
            />
          </label>
          
          <label className="update-product-label">
            Precio:
            <input
              type="number"
              className="update-product-input"
              value={producto.price}
              onChange={(e) => setProducto({ ...producto, price: parseFloat(e.target.value) })}
            />
          </label>
          
          <label className="update-product-label">
            Cantidad disponible:
            <input
              type="number"
              className="update-product-input"
              value={producto.quantity}
              onChange={(e) => setProducto({ ...producto, quantity: parseInt(e.target.value) })}
              disabled={producto.state === 'Agotado'}
            />
          </label>

          <label className="update-product-label">
            Estado:
            <select
              className="update-product-select"
              value={producto.state}
              onChange={(e) => handleStateChange(e.target.value)}
            >
              <option value="">Seleccione</option>
              <option value="Disponible">Disponible</option>
              <option value="Agotado">Agotado</option>
            </select>
          </label>
        </div>
      </form>
      <button
        type="button"
        className="update-product-button"
        onClick={handleUpdateProduct}
      >
        Actualizar
      </button>
    </div>
  );
};

export default AdminUpdateProduct;
