import React, { useEffect, useState } from 'react';
import { obtenerTodosLosProductos } from '../../cruds/Read';
import { comprarProducto, contarProductosEnCarrito } from '../../cruds/Update';
import { Search, Paintbrush, ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';
import FloatingCart from '../sales/FloatingCart';
import Swal from 'sweetalert2';
import '../../css/ClientSalesView.css';
import ShopingCarView from '../sales/ShopingCarView';

const ClientSalesView = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [contadorCarrito, setContadorCarrito] = useState(0);
  const [showShoppingCart, setShowShoppingCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const usuario = useSelector((state) => state.user);

  const toggleCartView = () => {
    setShowShoppingCart(!showShoppingCart);
    if (showShoppingCart) {
      actualizarContadorCarrito();
    }
  };

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
    actualizarContadorCarrito();
  }, [usuario]);

  const actualizarContadorCarrito = async () => {
    const cantidad = await contarProductosEnCarrito(usuario.userId);
    setContadorCarrito(cantidad);
  };

  const handleAddToCart = async (producto) => {
    if (!usuario || !usuario.userId) {
      Swal.fire({
        title: 'Error',
        text: 'No se ha autenticado el usuario.',
        icon: 'error',
      });
      return;
    }

    if (producto.quantity === "0") {
      Swal.fire({
        title: 'Producto agotado',
        text: 'Este producto no está disponible.',
        icon: 'warning',
      });
    } else {
      await comprarProducto(producto.id, usuario.userId);
      await actualizarContadorCarrito();
      recargarClientSalesView();
    }
  };

  useEffect(() => {
    loadProducts('');
  }, []);

  useEffect(() => {
    loadProducts(filter);
  }, [filter]);

  const recargarClientSalesView = () => {
    setSearchTerm('');
    setFilter('');
    loadProducts('');
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
    <div className="sales-catalog-container">
      {showShoppingCart ? (
        <ShopingCarView onClose={toggleCartView} />
      ) : (
        <>
          <h1 className="sales-title-products">Catálogo de Productos</h1>
          <div className="sales-search-filter-wrapper">
            <div className="sales-search-filter-container">
              <div className="sales-search-container">
                <Paintbrush className="sales-reload-icon" onClick={recargarClientSalesView} />
                <input
                  type="text"
                  className="sales-search-input"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="sales-search-icon" />
              </div>
              <div className="sales-filter-container">
                <label htmlFor="filter-select" className="sales-filter-label">Ordenar por:</label>
                <select
                  id="filter-select"
                  className="sales-filter-select"
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
          <div className="sales-grid-container">
            {filteredAndSortedProducts.map((producto) => (
              <div className="sales-product-card" key={producto.id}>
                <img src={producto.imageID} alt={producto.name} />
                <h2>{producto.name}</h2>
                <p>{producto.description}</p>
                <p>Precio: ₡{producto.price}</p>
                <p>Cantidad disponible: {producto.quantity}</p>
                <p>Estado: {producto.state}</p>
                <div className="sales-product-actions">
                  <ShoppingCart
                    className="sales-icono-comprar"
                    color="green"
                    size={24}
                    onClick={async () => {
                      if (producto.quantity === "0") {
                        Swal.fire({
                          title: 'Producto agotado',
                          text: 'Este producto no está disponible.',
                          icon: 'warning',
                        });
                      } else {
                        await comprarProducto(producto.id, usuario.userId);
                        recargarClientSalesView();
                        await actualizarContadorCarrito();
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {!showShoppingCart && <FloatingCart contador={contadorCarrito} onClick={toggleCartView} />}
    </div>
  );
};

export default ClientSalesView;
