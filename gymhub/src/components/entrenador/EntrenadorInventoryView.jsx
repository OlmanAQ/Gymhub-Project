import React, { useEffect, useState } from 'react';
import { obtenerGimnasios, obtenerInventarioPorGimnasio, eliminarProducto } from '../../cruds/InventoryCrud';
import { Edit, Trash, Plus, Info, Search, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import '../../css/AdminInventoryView.css';

const EntrenadorInventoryView = ({ onShowRegisterInventory, onShowEditInventory }) => {
  const [gimnasios, setGimnasios] = useState([]);
  const [selectedGym, setSelectedGym] = useState(''); // Gimnasio seleccionado
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOption, setSortOption] = useState('Aleatorio');


  useEffect(() => {
    const fetchGimnasios = async () => {
      try {
        const gymData = await obtenerGimnasios();
        setGimnasios(gymData);
      } catch (error) {
        console.error("Error fetching gyms:", error);
      }
    };
    fetchGimnasios();
  }, []);

  useEffect(() => {
    const fetchInventory = async () => {
      if (!selectedGym) return;
      try {
        const inventoryData = await obtenerInventarioPorGimnasio(selectedGym);
        setInventory(inventoryData || []);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setInventory([]);
      }
    };
    fetchInventory();
  }, [selectedGym]);


  const editEquipment = (id) => {
    onShowEditInventory(selectedGym, id);
  };




  const moreInfo = (id) => {
    try {
      const equipment = inventory.find(item => item.id === id);
      Swal.fire({
        title: 'Información del equipo',
        html: `
          <p><strong>Nombre:</strong> ${equipment.nombre}</p>
          <p><strong>Cantidad:</strong> ${equipment.cantidad}</p>
          <p><strong>Estado:</strong> ${equipment.estado}</p>
          <p><strong>Categoría:</strong> ${equipment.categoria}</p>
          <p><strong>Ejercicios:</strong></p>
          <ul>
            ${equipment.ejercicios.map(ejercicio => `
              <li>
                <strong>Nombre:</strong> ${ejercicio.nombre}<br>
                <strong>Descripción:</strong> ${ejercicio.descripcion}<br>
                <strong>Zonas:</strong> ${ejercicio.zonas.join(', ')}
              </li>
            `).join('')}
          </ul>
        `,
        confirmButtonText: 'Entendido'
      });

    } catch (error) {
      console.error('Error fetching equipment info: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener la información del equipo',
        confirmButtonText: 'Entendido'
      });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredInventory = inventory.filter(item =>
    item.nombre && item.nombre.toLowerCase().includes(searchTerm)
  );

  if (sortOption === 'Nombre') {
    filteredInventory.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }
  if (sortOption === 'Cantidad') {
    filteredInventory.sort((a, b) => a.cantidad - b.cantidad);
  }
  if (sortOption === 'Estado') {
    filteredInventory.sort((a, b) => a.estado.localeCompare(b.estado));
  }


  const displayedItems = filteredInventory.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);


  const handlePagination = (direction) => {

    if (direction === 'next') {
      setCurrentPage(prev => prev + 1);
    }
    if (direction === 'prev') {
      setCurrentPage(prev => prev - 1);
    }
    if (direction === 'first') {
      setCurrentPage(0);
    }
    if (direction === 'last') {
      setCurrentPage(Math.floor(filteredInventory.length / itemsPerPage));
    };
  };


  return (
    <div className="admin-inventory-view">
      {/* Sección para seleccionar gimnasio (compacta) */}
      <div className="gym-selection-small">
        <label htmlFor="gym">Seleccionar Gimnasio:</label>
        <select
          id="gym"
          value={selectedGym}
          onChange={e => setSelectedGym(e.target.value)}
          className="gym-select-small"
        >
          <option value="">Selecciona un gimnasio</option>
          {gimnasios.map(gym => (
            <option key={gym.id} value={gym.id}>{gym.nombre}</option>
          ))}
        </select>
      </div>

      {selectedGym && (
        <>
          {/* Acciones de búsqueda, ordenación y agregar */}
          <div className="inventory-actions">
            <div className="search-and-sort">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <button className="search-button"><Search /></button>
              </div>
              <div className="sort-box">
                <label>Ordenar por:</label>
                <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
                  <option value="Aleatorio">Aleatorio</option>
                  <option value="Nombre">Nombre</option>
                  <option value="Cantidad">Cantidad</option>
                  <option value="Estado">Estado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabla de inventario */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Estado</th>
                  <th>Información</th>
                  <th>Editar</th>
                </tr>
              </thead>
              <tbody>
                {displayedItems.length === 0 ? (
                  <tr>
                    <td colSpan="4">No se encontraron equipos</td>
                  </tr>
                ) : (
                  displayedItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.nombre}</td>
                      <td>{item.cantidad}</td>
                      <td>{item.estado}</td>
                      <td>
                        <button className='button-actions' onClick={() => moreInfo(item.id)}>
                          <Info size={16} color="#007BFF" />
                        </button>
                      </td>
                      <td>
                        <button className='button-actions' onClick={() => editEquipment(item.id)}>
                          <Edit size={16} color="#F7E07F" />
                        </button>
                      </td>


                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Controles de paginación */}
          <div className="pagination-buttons">
            <button className='button-actions'
              onClick={() => handlePagination('first')}
              disabled={currentPage === 0}
            >
              <ChevronsLeft size={24} />
            </button>
            <button className='button-actions'
              onClick={() => handlePagination('prev')}
              disabled={currentPage === 0}
            >
              <ChevronLeft size={24} />
            </button>
            <span className="page-indicator">{currentPage + 1} de {Math.floor(filteredInventory.length / itemsPerPage) + 1}</span>
            <button className='button-actions'
              onClick={() => handlePagination('next')}
              disabled={currentPage === Math.floor(filteredInventory.length / itemsPerPage)}
            >
              <ChevronRight size={24} />
            </button>
            <button className='button-actions'
              onClick={() => handlePagination('last')}
              disabled={currentPage === Math.floor(filteredInventory.length / itemsPerPage)}
            >
              <ChevronsRight size={24} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EntrenadorInventoryView;
