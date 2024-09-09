import React, { useEffect, useState } from 'react';
import { obtenerGimnasios, obtenerInventarioPorGimnasio, eliminarProducto } from '../../cruds/InventoryCrud';
import { Edit, Trash, Eye, Plus } from 'lucide-react';
import '../../css/AdminInventoryView.css';

const AdminInventoryView = () => {
  const [gimnasios, setGimnasios] = useState([]);
  const [selectedGym, setSelectedGym] = useState('');
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

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

  const handleDelete = async (id) => {
    try {
      await eliminarProducto(selectedGym, id);
      setInventory(inventory.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
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
      <div className="inventory-header">
        <h1>Manage Equipments</h1>
        <button className="add-equipment-button"><Plus /> Add Equipment</button>
      </div>

      {/* Selector de gimnasio */}
      <div className="gym-selector">
        <label>Seleccionar Gimnasio:</label>
        <select value={selectedGym} onChange={e => setSelectedGym(e.target.value)}>
          <option value="">Selecciona un gimnasio</option>
          {gimnasios.map(gym => (
            <option key={gym.id} value={gym.id}>{gym.nombre}</option>
          ))}
        </select>
      </div>

      {selectedGym && (
        <>
          <div className="inventory-controls">
            <label>Show Entries</label>
            <select value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
              />
              <button className="search-button"><Eye /></button>
            </div>
          </div>

          <table className="inventory-table">
            <thead>
              <tr>
                <th>Equipment Name</th>
                <th>Total no.</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedItems.length === 0 ? (
                <tr>
                  <td colSpan="4">No equipments found</td>
                </tr>
              ) : (
                displayedItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.nombre}</td>
                    <td>{item.cantidad}</td>
                    <td>{item.estado}</td>
                    <td className="actions">
                      <button><Eye /></button>
                      <button><Edit /></button>
                      <button onClick={() => handleDelete(item.id)}><Trash /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="pagination">
            <button onClick={() => setCurrentPage(0)} disabled={currentPage === 0}>First</button>
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} disabled={currentPage === 0}>Previous</button>
            <span>Page {currentPage + 1}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredInventory.length / itemsPerPage) - 1))} disabled={(currentPage + 1) * itemsPerPage >= filteredInventory.length}>Next</button>
            <button onClick={() => setCurrentPage(Math.ceil(filteredInventory.length / itemsPerPage) - 1)} disabled={(currentPage + 1) * itemsPerPage >= filteredInventory.length}>Last</button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminInventoryView;
