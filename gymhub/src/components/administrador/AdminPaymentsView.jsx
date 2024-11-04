import React, { useState, useEffect } from 'react';
import '../../css/AdminPaymentsView.css';
import UserTypes from '../../utils/UsersTipos';
import { obtenerUsuariosPorRol, contarFacturasPorUsuario } from '../../cruds/Read';
import { showConfirmAlert, showErrorAlert } from '../../utils/Alert';
import { Search, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

const AdminPaymentsView = ({ onShowAddPayment, onShowPaymentHistory }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [rolSeleccionado, setRolSeleccionado] = useState(UserTypes.CLIENTE);
  const [sortOption, setSortOption] = useState('Nombre completo (A-Z)');
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const usuariosData = await obtenerUsuariosPorRol(rolSeleccionado, sortOption);
        const usuariosConFacturas = await contarFacturasPorUsuario(usuariosData);
        setUsuarios(usuariosConFacturas);
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

  const handlePagination = (type) => {
    const totalPages = Math.ceil(usuariosFiltrados.length / usersPerPage);
    if (type === 'first') setCurrentPage(0);
    else if (type === 'prev' && currentPage > 0) setCurrentPage(currentPage - 1);
    else if (type === 'next' && currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    else if (type === 'last') setCurrentPage(totalPages - 1);
  };

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const usuariosPaginados = usuariosFiltrados.slice(
    currentPage * usersPerPage,
    (currentPage + 1) * usersPerPage
  );

  const handleProcessClick = () => {
    if (!selectedUser) {
      showErrorAlert('Error', 'Seleccione un usuario antes de procesar.');
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
      showErrorAlert('Error', 'Seleccione un usuario antes de ver el historial.');
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
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Facturas</th>
            </tr>
          </thead>
          <tbody>
            {usuariosPaginados.map((usuario) => (
              <tr
                key={usuario.id}
                className={`usuario-row ${selectedUser?.id === usuario.id ? 'selected' : ''}`}
                onClick={() => handleUserSelection(usuario)}
              >
                <td>{usuario.nombre}</td>
                <td>{usuario.correo}</td>
                <td>{usuario.rol}</td>
                <td>{usuario.cantidadFacturas || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination-buttons">
        <button className="button-actions" onClick={() => handlePagination('first')} disabled={currentPage === 0}>
          <ChevronsLeft className="icon-svg" size={24} />
        </button>
        <button className="button-actions" onClick={() => handlePagination('prev')} disabled={currentPage === 0}>
          <ChevronLeft className="icon-svg" size={24} />
        </button>
        <span className="page-indicator">{currentPage + 1} de {Math.ceil(usuariosFiltrados.length / usersPerPage)}</span>
        <button className="button-actions" onClick={() => handlePagination('next')} disabled={(currentPage + 1) * usersPerPage >= usuariosFiltrados.length}>
          <ChevronRight className="icon-svg" size={24} />
        </button>
        <button className="button-actions" onClick={() => handlePagination('last')} disabled={(currentPage + 1) * usersPerPage >= usuariosFiltrados.length}>
          <ChevronsRight className="icon-svg" size={24} />
        </button>
      </div>

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
