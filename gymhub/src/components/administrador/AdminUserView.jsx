import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { obtenerTodosLosUsuarios, obtenerInfoUsuario, esAdministrador} from '../../cruds/Read';
import { showAlert, showConfirmAlert, AlertType, showUserInfoAlert } from '../../utils/Alert';
import { eliminarUsuario } from '../../cruds/Delete';
import { Edit, Trash, Info, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, UserPlus, Search, Paintbrush } from 'lucide-react';
import '../../css/AdminUserView.css';

const AdminUserView = ({ onShowRegisterUser, onShowUpdateUser }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [usersPerPage] = useState(5);
  const [sortOption, setSortOption] = useState('Aleatorio');
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await obtenerTodosLosUsuarios(sortOption);
        setAllUsers(usersData);
        setDisplayedUsers(usersData.slice(0, usersPerPage));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users: ', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [sortOption]);

  useEffect(() => {
    const startIndex = currentPage * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    setDisplayedUsers(allUsers.slice(startIndex, endIndex));
  }, [currentPage, allUsers]);

  const editUser = (user) => {
    setSelectedUser(user);
    onShowUpdateUser(user);
  };

  const deleteUser = (user) => {
    showConfirmAlert('¿Estás seguro?', 'Esta acción no se puede deshacer.', 'Sí, eliminar', 'Cancelar')
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            // Pasamos el usuarioId y el uid al eliminar
            await eliminarUsuario(user.id, user.uid); // Asegúrate de pasar ambos valores
            showAlert('Eliminado', 'El usuario ha sido eliminado.', AlertType.SUCCESS);
            
            const updatedUsers = allUsers.filter(u => u.id !== user.id);
            setAllUsers(updatedUsers);
            setDisplayedUsers(updatedUsers.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage));
          } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            showAlert('Error', 'No se pudo eliminar el usuario.', AlertType.ERROR);
          }
        }
      });
  };
  
  const moreInfo = async (user) => {
    try {
      const userInfo = await obtenerInfoUsuario(user.correo, user.usuario);
      showUserInfoAlert(userInfo); // Llama a la alerta personalizada
    } catch (error) {
      console.error('Error fetching user info: ', error);
      showAlert('Error', 'No se pudo obtener la información del usuario.', AlertType.ERROR);
    }
  };

  const handlePagination = (direction) => {
    if (direction === 'next') {
      if ((currentPage + 1) * usersPerPage < allUsers.length) {
        setCurrentPage(currentPage + 1);
      }
    } else if (direction === 'prev') {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    } else if (direction === 'first') {
      setCurrentPage(0);
    } else if (direction === 'last') {
      const lastPage = Math.floor(allUsers.length / usersPerPage);
      setCurrentPage(lastPage);
    }
  };

  const refreshUsers = async () => {
    try {
      setLoading(true);
      const usersData = await obtenerTodosLosUsuarios(sortOption);
      setAllUsers(usersData);
      setDisplayedUsers(usersData.slice(0, usersPerPage));
      setCurrentPage(0); 
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users: ', error);
      setLoading(false);
    }
  };

  const search = () => {
    const searchTerm = document.querySelector('.buscador-input').value.toLowerCase();
    const searchBy = document.querySelector('.buscador-select').value;

    const filteredUsers = allUsers.filter(user => {
      let valueToSearch;
      switch (searchBy) {
        case 'nombre':
          valueToSearch = user.nombre || '';
          break;
        case 'usuario':
          valueToSearch = user.usuario || '';
          break;
        case 'correo':
          valueToSearch = user.correo || '';
          break;
        default:
          valueToSearch = '';
      }
      return valueToSearch.toLowerCase().includes(searchTerm);
    });

    setDisplayedUsers(filteredUsers.slice(0, usersPerPage));
    setCurrentPage(0); // Reset to the first page of filtered results
  };

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  const keyPress = (event) => {
    if (event.key === 'Enter') {
      search();
    }
  };

  return (
    <>
      <div className='controls-container'>
        <div className='add-user-container'>
          <button className='add-user-button' onClick={onShowRegisterUser}>
            <UserPlus className="icon-svg" size={24} color="#28a745" />
            Agregar usuario
          </button>
        </div>
  
        <div className='buscador-container'>
          <div className="buscador-wrapper">
            <button className='refresh-button' onClick={refreshUsers}>
              <Paintbrush className="icon-svg" size={24} color="#007BFF" />
            </button>
            <input
              type="text"
              placeholder="Buscar"
              className="buscador-input"
              onKeyPress={keyPress}
            />
            <button className="buscador-button" onClick={search}>
              <Search className="icon-svg" size={24} color="#007BFF" />
            </button>
          </div>
          <select className="buscador-select">
            <option value="nombre">Nombre</option>
            <option value="usuario">Usuario</option>
            <option value="correo">Correo</option>
          </select>
        </div>
  
        <div className='filter-container'>
          <label htmlFor="sort">Ordenar por:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="sort-select"
          >
            <option value="Aleatorio">Aleatorio</option>
            <option value="Nombre completo (A-Z)">Nombre completo (A-Z)</option>
            <option value="Usuario (A-Z)">Usuario (A-Z)</option>
            <option value="Recientes">Recientes</option>
            <option value="Rol">Rol</option>
          </select>
        </div>
      </div>
  
      {/* Nuevo div envolvente para centrar la tabla */}
      <div className='table-wrapper'>
        <div className='table-container'>
          <table className='user-table'>
            <thead className='user-table-header'>
              <tr>
                <th className='user-table-header-cell'>Nombre</th>
                <th className='user-table-header-cell'>Usuario</th>
                <th className='user-table-header-cell'>Correo</th>
                <th className='user-table-header-cell'>Rol</th>
                <th className='user-table-header-cell'>Info</th>
                <th className='user-table-header-cell'>Editar</th>
                <th className='user-table-header-cell'>Eliminar</th>
              </tr>
            </thead>
            <tbody className='user-table-body'>
              {displayedUsers.length > 0 ? (
                displayedUsers.map(user => (
                  <tr key={user.id} className='user-table-row'>
                    <td className='user-table-cell'>{user.nombre || 'N/A'}</td>
                    <td className='user-table-cell'>{user.usuario || 'N/A'}</td>
                    <td className='user-table-cell'>{user.correo || 'N/A'}</td>
                    <td className='user-table-cell'>{user.rol || 'N/A'}</td>
                    <td className='user-table-cell'>
                      <button className='button-actions' onClick={() => moreInfo(user)}>
                        <Info className="icon-svg" size={16} color="#007BFF" />
                      </button>
                    </td>
                    <td className='user-table-cell'>
                      <button className='button-actions' onClick={() => editUser(user)}>
                        <Edit className="icon-svg" size={16} color="#F7E07F" />
                      </button>
                    </td>
                    <td className='user-table-cell'>
                      <button className='button-actions' onClick={() => deleteUser(user)}>
                        <Trash className="icon-svg" size={16} color="#FF5C5C" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className='user-table-row'>
                  <td className='user-table-cell' colSpan="7">No hay usuarios disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination-buttons">
            <button className='button-actions'
              onClick={() => handlePagination('first')}
              disabled={currentPage === 0}
            >
              <ChevronsLeft className="icon-svg" size={24} />
            </button>
            <button className='button-actions'
              onClick={() => handlePagination('prev')}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="icon-svg" size={24} />
            </button>
            <span className="page-indicator">{currentPage + 1} de {Math.ceil(allUsers.length / usersPerPage)}</span>
            <button className='button-actions'
              onClick={() => handlePagination('next')}
              disabled={(currentPage + 1) * usersPerPage >= allUsers.length}
            >
              <ChevronRight className="icon-svg" size={24} />
            </button>
            <button className='button-actions'
              onClick={() => handlePagination('last')}
              disabled={(currentPage + 1) * usersPerPage >= allUsers.length}
            >
              <ChevronsRight className="icon-svg" size={24} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
  
};

export default AdminUserView;
