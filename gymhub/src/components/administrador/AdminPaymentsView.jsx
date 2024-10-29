import React, { useState, useEffect } from 'react';
import '../../css/AdminPaymentsView.css';
import UserTypes from '../../utils/UsersTipos';
import { obtenerUsuariosPorRol } from '../../cruds/Read';
import { showAlert, showConfirmAlert, AlertType } from '../../utils/Alert';
import { Search } from 'lucide-react';

const AdminPaymentsView = ({ onShowAddPayment, onShowPaymentHistory}) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [rolSeleccionado, setRolSeleccionado] = useState(UserTypes.CLIENTE);
  const [sortOption, setSortOption] = useState('Nombre completo (A-Z)');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const usuariosData = await obtenerUsuariosPorRol(rolSeleccionado, sortOption);
        setUsuarios(usuariosData);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
      setLoading(false);
    };
    fetchUsuarios();
  }, [rolSeleccionado, sortOption]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRolSeleccionado(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleUserSelection = (user) => {
    setSelectedUser(user.id === selectedUser?.id ? null : user);
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProcessClick = () => {
    if (!selectedUser) {
      showAlert('Error', 'Seleccione un usuario antes de procesar.', AlertType.WARNING);
      return;
    }
    
    showConfirmAlert(
      '¿Está seguro?',
      `¿Desea ver los pagos para el usuario ${selectedUser.nombre}?`,
      'Procesar',
      'Cancelar'
    ).then((result) => {
      if (result.isConfirmed) {
        onShowAddPayment(selectedUser);
      }
    });
  };

  const handleViewHistoryClick = () => {
    if (!selectedUser) {
      showAlert('Error', 'Seleccione un usuario antes de ver el historial.', AlertType.WARNING);
      return;
    }
    
    onShowPaymentHistory(selectedUser);
  };

  return (
      <div className="seleccionar-usuario-container">
        <h1>Lista de usuarios</h1>

        <div className="filter-controls">
          <div className="role-select">
            <label htmlFor="role">Buscar:</label>
            <select id="role" value={rolSeleccionado} onChange={handleRoleChange}>
              <option value={UserTypes.CLIENTE}>Clientes</option>
              <option value={UserTypes.ENTRENADOR}>Entrenadores</option>
              <option value={UserTypes.ADMINISTRADOR}>Administradores</option>
            </select>
          </div>

          <div className="sort-select">
            <label htmlFor="sort">Ordenar por:</label>
            <select id="sort" value={sortOption} onChange={handleSortChange}>
              <option value="Nombre completo (A-Z)">Nombre (A-Z)</option>
              <option value="Correo (A-Z)">Correo (A-Z)</option>
              <option value="Recientes">Recientes</option>
            </select>
          </div>

          <div className="search-input">
            <div className="search-icon-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
        <div className="instructions-user-list-text">
          <p>Selecciona un usuario para facturar o ver más información de pagos:</p>
        </div>
        {loading ? (
          <div className="loading">Cargando usuarios...</div>
        ) : (
          <div className="clientes-list">
            <ul>
              {usuariosFiltrados.map((usuario) => (
                <li
                  key={usuario.id}
                  className={`cliente-item ${selectedUser?.id === usuario.id ? 'selected' : ''}`}
                  onClick={() => handleUserSelection(usuario)}
                >
                  <p><strong>Nombre:</strong> {usuario.nombre}</p>
                  <p><strong>Correo:</strong> {usuario.correo}</p>
                  <p><strong>Rol:</strong> {usuario.rol}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="buttons-container">
          <button className="history-button" onClick={handleViewHistoryClick}>
            Ver historial
          </button>
          <button className="process-button" onClick={handleProcessClick}>
            Crear factura
          </button>
        </div>
      </div>
  );
};

export default AdminPaymentsView;
