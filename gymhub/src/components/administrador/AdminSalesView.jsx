import React, { useEffect, useState } from 'react';
import { obtenerTodosLosProductos } from '../../cruds/Read';
import { eliminarProducto } from '../../cruds/Delete';
import { Edit, Trash, Search, Paintbrush, Plus } from 'lucide-react';
import AdminUpdateProduct from './AdminUpdateProduct';
import AdminAddProduct from './AdminAddProduct';
import Swal from 'sweetalert2';
import '../../css/AdminSalesView.css';

const AdminSalesView = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [mostrarAgregarProducto, setMostrarAgregarProducto] = useState(false);

  const loadProducts = async (filter) => {
    try {
      const productosObtenidos = await obtenerTodosLosProductos(filter);
      setProductos(productosObtenidos);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    loadProducts('');
  }, []);

  useEffect(() => {
    loadProducts(filter);
  }, [filter]);

  const handleEditProduct = (productoId) => {
    const productoSeleccionado = productos.find((producto) => producto.id === productoId);
    setProductoAEditar(productoSeleccionado);
  };

  const handleCloseEdit = () => {
    setProductoAEditar(null);
  };

  const recargarAdminSalesView = () => {
    setSearchTerm('');
    setFilter('');
    loadProducts('');
  };

  const handleAddProductClick = () => {
    setMostrarAgregarProducto(true);
  };

  const handleVolverACatalogo = () => {
    setMostrarAgregarProducto(false);
  };

  const handleDeleteProduct = async (productoId, imageID) => {
    try {
      const confirm = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esto',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
      });

      if (confirm.isConfirmed) {
        await eliminarProducto(productoId, imageID);
        Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
        recargarAdminSalesView(); // Recargar productos después de la eliminación
      }
    } catch (error) {
      Swal.fire('Error', 'Ocurrió un error al eliminar el producto.', 'error');
    }
  };

  const filteredAndSortedProducts = productos
  .filter((producto) => {
    return producto.name.toLowerCase().includes(searchTerm.toLowerCase());
  })
  .sort((a, b) => {
    if (filter === "Precio mayor") {
      return b.price - a.price;
    } else if (filter === "Precio menor") {
      return a.price - b.price;
    } else {
      return 0;
    }
  });


  if (cargando) return <p>Cargando productos...</p>;

  return (
    <div className="catalogo-container">
      {mostrarAgregarProducto ? (
        <AdminAddProduct onVolver={handleVolverACatalogo} />
      ) : productoAEditar ? (
        <AdminUpdateProduct
          productId={productoAEditar.id}
          onClose={handleCloseEdit}
          recargarAdminSalesView={recargarAdminSalesView}
        />
      ) : (
        <>
          <h1 className="titule-products">Catálogo de Productos</h1>
          <div className="search-filter-wrapper">
            <div className="search-filter-container">
              <div className="add-product-container" onClick={handleAddProductClick}>
                <Plus className="add-product-icon" />
                <span className="add-product-text">Agregar producto</span>
              </div>
              <div className="search-container">
                <Paintbrush className="reload-icon" onClick={recargarAdminSalesView} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="search-icon" />
              </div>
              <div className="filter-container">
                <label htmlFor="filter-select" className="filter-label">Ordenar por:</label>
                <select
                  id="filter-select"
                  className="filter-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="">Aleatorio</option>
                  <option value="Precio mayor">Precio Mayor</option>
                  <option value="Precio menor">Precio Menor</option>
                </select>
              </div>
            </div>
          </div>
          <div className="grid-container">
            {filteredAndSortedProducts.map((producto) => (
              <div className="producto-card" key={producto.id}>
                <img src={producto.imageID} alt={producto.name} />
                <h2>{producto.name}</h2>
                <p>{producto.description}</p>
                <p>Precio: ₡{producto.price}</p>
                <p>Cantidad disponible: {producto.quantity}</p>
                <p>Estado: {producto.state}</p>
                <div className="producto-actions">
                  <Edit
                    className="icono-editar"
                    color="yellow"
                    size={24}
                    onClick={() => handleEditProduct(producto.id)}
                  />
                  <Trash
                    className="icono-eliminar"
                    color="red"
                    size={24}
                    onClick={() => handleDeleteProduct(producto.id, producto.imageID)}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminSalesView;
