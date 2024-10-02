import React, { useEffect, useState } from 'react';
import { obtenerCarritoCompras } from '../../cruds/Read';
import { eliminarProductoCarrito } from '../../cruds/Delete';
import { useSelector } from 'react-redux';
import { Trash, X } from 'lucide-react';
import '../../css/ShopingCarView.css';

const ShopingCarView = ({ onClose }) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const usuario = useSelector((state) => state.user);

  const loadCarrito = async () => {
    try {
      const carritoProductos = await obtenerCarritoCompras(usuario.userId);
      setProductos(carritoProductos);
    } catch (error) {
      console.error('Error al obtener los productos del carrito:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleDelete = async (productoId, idProduct, quantity) => {
    try {
      await eliminarProductoCarrito(productoId, idProduct, quantity);
      loadCarrito();
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
    }
  };

  useEffect(() => {
    if (usuario && usuario.userId) {
      loadCarrito();
    }
  }, [usuario]);

  if (cargando) return <p>Cargando carrito de compras...</p>;

  return (
    <div className="carrito-contenedor">
      <button className="boton-cerrar" onClick={onClose}>
        <X size={24} />
      </button>
      <h1 className="titulo-carrito">Carrito de Compras</h1>
      <div className="carrito-grid">
        {productos.map((producto) => (
          <div className="carrito-producto" key={producto.id}>
            <img src={producto.imageID} alt={producto.name} />
            <h2>{producto.name}</h2>
            <p>{producto.description}</p>
            <p>Precio: ₡{producto.price}</p>
            <p>Cantidad: {producto.quantity}</p>
            <p>Total: ₡{producto.totalAmount}</p>
            <Trash
              className="icono-basura"
              size={24}
              onClick={() => handleDelete(producto.id, producto.idProduct, producto.quantity)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopingCarView;
