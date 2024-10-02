import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { obtenerTodosLosUsuarios, obtenerInfoUsuario } from '../../cruds/Read';
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

  const deleteUser = (userId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarUsuario(userId);
          Swal.fire(
            'Eliminado',
            'El usuario ha sido eliminado.',
            'success'
          );
          // Actualiza la lista de usuarios después de la eliminación
          const updatedUsers = allUsers.filter(user => user.id !== userId);
          setAllUsers(updatedUsers);
          setDisplayedUsers(updatedUsers.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage));
        } catch (error) {
          console.error('Error al eliminar el usuario:', error);
          Swal.fire(
            'Error',
            'No se pudo eliminar el usuario.',
            'error'
          );
        }
      }
    });
  };

  const moreInfo = async (user) => {
    try {
      const userInfo = await obtenerInfoUsuario(user.correo, user.usuario);
      Swal.fire({
        title: 'Información del Usuario',
        icon: 'info',
        html: `
          <div style="display: flex; flex-wrap: wrap; gap: 30px; justify-content: space-between;">
            <div style="flex: 1; min-width: 300px;">
              <table>
                <tr><td><strong>Nombre:</strong></td><td>${userInfo.nombre || 'N/A'}</td></tr>
                <tr><td><strong>Usuario:</strong></td><td>${userInfo.usuario || 'N/A'}</td></tr>
                <tr><td><strong>Correo:</strong></td><td>${userInfo.correo || 'N/A'}</td></tr>
                <tr><td><strong>Contraseña:</strong></td><td>${userInfo.contrasena || 'N/A'}</td></tr>
                <tr><td><strong>Edad:</strong></td><td>${userInfo.edad || 'N/A'}</td></tr>
                <tr><td><strong>Estatura:</strong></td><td>${userInfo.estatura + ' m' || 'N/A'}</td></tr>
                <tr><td><strong>Peso:</strong></td><td>${userInfo.peso + ' kg' || 'N/A'}</td></tr>
              </table>
            </div>
            <div style="flex: 1; min-width: 300px;">
              <table>
                <tr><td><strong>Fecha de Inscripción:</strong></td><td>${userInfo.fechaInscripcion || 'N/A'}</td></tr>
                <tr><td><strong>Género:</strong></td><td>${userInfo.genero || 'N/A'}</td></tr>
                <tr><td><strong>Padecimientos:</strong></td><td>${userInfo.padecimientos || 'N/A'}</td></tr>
                <tr><td><strong>Teléfono:</strong></td><td>${userInfo.telefono || 'N/A'}</td></tr>
                <tr><td><strong>Tipo de Membresía:</strong></td><td>${userInfo.tipoMembresia || 'N/A'}</td></tr>
                <tr><td><strong>Renovación:</strong></td><td>${userInfo.renovacion || 'N/A'}</td></tr>
                <tr><td><strong>Rol:</strong></td><td>${userInfo.rol || 'N/A'}</td></tr>
              </table>
            </div>
          </div>
        `,
        width: '800px', // Ajusta el ancho de la alerta
        confirmButtonText: 'Cerrar',
        customClass: {
          container: 'custom-swal-container',
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
          htmlContainer: 'custom-swal-html-container',
          confirmButton: 'custom-swal-confirm-button'
        }
      });
    } catch (error) {
      console.error('Error fetching user info: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener la información del usuario.',
        confirmButtonText: 'Entendido'
      });
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
      setCurrentPage(0); // Opcional: Reinicia la página a la primera
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
            <UserPlus size={24} color="#28a745" />
            Agregar usuario
          </button>
        </div>

        <div className='buscador-container'>
          <div className="buscador-wrapper">
            <button className='refresh-button' onClick={refreshUsers}>
              <Paintbrush size={24} color="#007BFF" />
            </button>
            <input
              type="text"
              placeholder="Buscar"
              className="buscador-input"
              onKeyPress={keyPress}
            />
            <button className="buscador-button" onClick={search}>
              <Search size={24} color="#007BFF" />
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
            <option value="Tipo de membresía">Tipo de membresía</option>
          </select>
        </div>
      </div>

      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Renovación</th>
              <th>Membresía</th>
              <th>Rol</th>
              <th>Info</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.length > 0 ? (
              displayedUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.nombre || 'N/A'}</td>
                  <td>{user.usuario || 'N/A'}</td>
                  <td>{user.correo || 'N/A'}</td>
                  <td>{user.renovacion || 'N/A'}</td>
                  <td>{user.tipoMembresia || 'N/A'}</td>
                  <td>{user.rol || 'N/A'}</td>
                  <td>
                    <button className='button-actions' onClick={() => moreInfo(user)}>
                      <Info size={16} color="#007BFF" />
                    </button>
                  </td>
                  <td>
                    <button className='button-actions' onClick={() => editUser(user)}>
                      <Edit size={16} color="#F7E07F" />
                    </button>
                  </td>
                  <td>
                    <button className='button-actions' onClick={() => deleteUser(user.id)}>
                      <Trash size={16} color="#FF5C5C" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No hay usuarios disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
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
          <span className="page-indicator">{currentPage + 1} de {Math.ceil(allUsers.length / usersPerPage)}</span>
          <button className='button-actions'
            onClick={() => handlePagination('next')}
            disabled={(currentPage + 1) * usersPerPage >= allUsers.length}
          >
            <ChevronRight size={24} />
          </button>
          <button className='button-actions'
            onClick={() => handlePagination('last')}
            disabled={(currentPage + 1) * usersPerPage >= allUsers.length}
          >
            <ChevronsRight size={24} />
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminUserView;
