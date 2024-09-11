import React, { useEffect, useState } from 'react';
import { obtenerGimnasios, obtenerInventarioPorGimnasio, eliminarProducto } from '../../cruds/InventoryCrud';
import { Edit, Trash, Plus, Info, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import '../../css/AdminInventoryView.css';

const AdminInventoryView = () => {
  const [gimnasios, setGimnasios] = useState([]);
  const [selectedGym, setSelectedGym] = useState(''); // Gimnasio seleccionado
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
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

  const deleteEquipment = async (id) => {
    // Confirmar eliminación
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    // Si se confirma la eliminación
    if (result.isConfirmed) {
      try {
        await eliminarProducto(selectedGym, id);
        Swal.fire({
          icon: 'success',
          title: 'Equipo eliminado',
          showConfirmButton: false,
          timer: 1500
        });
        setInventory(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting equipment: ', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el equipo',
          confirmButtonText: 'Entendido'
        });
      }
    }
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
          <p><strong>Descripción:</strong> ${equipment.descripcion}</p>
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

  const displayedItems = filteredInventory.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

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
            <button className="add-equipment-button">Agregar Equipo <Plus /></button>
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
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Información</th>
                <th>Editar</th>
                <th>Eliminar</th>
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
                      <button onClick={() => moreInfo(item.id)}><Info /></button>
                    </td>
                    <td>
                      <button><Edit /></button>
                    </td>
                    <td>
                      <button onClick={() => deleteEquipment(item.id)}><Trash /></button>
                    </td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Controles de paginación */}
          <div className="pagination">
            <button onClick={() => setCurrentPage(0)} disabled={currentPage === 0}>Primero</button>
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} disabled={currentPage === 0}>Anterior</button>
            <span>Página {currentPage + 1}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredInventory.length / itemsPerPage) - 1))} disabled={(currentPage + 1) * itemsPerPage >= filteredInventory.length}>Siguiente</button>
            <button onClick={() => setCurrentPage(Math.ceil(filteredInventory.length / itemsPerPage) - 1)} disabled={(currentPage + 1) * itemsPerPage >= filteredInventory.length}>Último</button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminInventoryView;
