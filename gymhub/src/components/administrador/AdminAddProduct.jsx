import React, { useState } from 'react';
import { agregarProducto } from '../../cruds/Create';
import Swal from 'sweetalert2';
import { X } from 'lucide-react';
import '../../css/AdminAddProduct.css';

const AdminAddProduct = ({ onVolver }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    state: 'Disponible',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateFields = () => {
    const { name, description, price, quantity } = product;

    if (!name || !description || !price || !quantity || !image) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios, y debes seleccionar una imagen.',
      });
      return false;
    }

    if (price <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El precio debe ser mayor que 0.',
      });
      return false;
    }

    if (quantity <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La cantidad debe ser mayor que 0.',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    try {
      await agregarProducto(product, image);
      Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        text: 'El producto ha sido agregado correctamente.',
      });
      setProduct({
        name: '',
        description: '',
        price: '',
        quantity: '',
        state: 'Disponible',
      });
      setImage(null);
      setImagePreview(null);
      onVolver()
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al agregar el producto.',
      });
    }
  };

  return (
    <div className="admin-add-product">
      <div className="header">
        <X className="close-icon" size={24} onClick={onVolver} />
        <h2 className="add-product-title">Agregar Producto</h2>
      </div>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="left-column">
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleInputChange}
              required
              className="description-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="image" className="custom-file-label">
              Abrir imagen
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="custom-file-input"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Vista previa" />
              </div>
            )}
          </div>
        </div>
        <div className="right-column">
          <div className="form-group">
            <label htmlFor="name">Nombre del producto</label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group-small">
            <label htmlFor="price">Precio</label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              required
              className="price-input"
            />
          </div>
          <div className="form-group-small">
            <label htmlFor="quantity">Cantidad disponible</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={product.quantity}
              onChange={handleInputChange}
              required
              className="quantity-input"
            />
          </div>
          <button className="button-add" type="submit">
            Agregar producto
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProduct;
