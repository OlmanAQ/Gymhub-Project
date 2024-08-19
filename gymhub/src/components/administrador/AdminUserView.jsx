import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { obtenerTodosLosUsuarios, obtenerInfoUsuario } from '../../cruds/Read';
import { Edit, Trash, Info, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, UserPlus } from 'lucide-react';
import '../../css/AdminUserView.css'; // Importa el archivo CSS

const AdminUserView = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [usersPerPage] = useState(5);
  const [sortOption, setSortOption] = useState('Aleatorio');
  const [loading, setLoading] = useState(true);

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

  const handleEdit = (userId) => {
    console.log('Edit user:', userId);
  };

  const handleDelete = (userId) => {
    console.log('Delete user:', userId);
  };

  const moreInfo = async (user) => {
    try {
      const userInfo = await obtenerInfoUsuario(user.correo, user.usuario);
      Swal.fire({
        title: 'Información del Usuario',
        icon: 'info',
        html: `
          <table>
            <tr><td><strong>Nombre:</strong></td><td>${userInfo.nombre || 'N/A'}</td></tr>
            <tr><td><strong>Usuario:</strong></td><td>${userInfo.usuario || 'N/A'}</td></tr>
            <tr><td><strong>Correo:</strong></td><td>${userInfo.correo || 'N/A'}</td></tr>
            <tr><td><strong>Edad:</strong></td><td>${userInfo.edad || 'N/A'}</td></tr>
            <tr><td><strong>Estatura:</strong></td><td>${userInfo.estatura || 'N/A'}</td></tr>
            <tr><td><strong>Peso:</strong></td><td>${userInfo.peso || 'N/A'}</td></tr>
            <tr><td><strong>Fecha de Inscripción:</strong></td><td>${userInfo.fechaInscripcion || 'N/A'}</td></tr>
            <tr><td><strong>Género:</strong></td><td>${userInfo.genero || 'N/A'}</td></tr>
            <tr><td><strong>Padecimientos:</strong></td><td>${userInfo.padecimientos || 'N/A'}</td></tr>
            <tr><td><strong>Teléfono:</strong></td><td>${userInfo.telefono || 'N/A'}</td></tr>
            <tr><td><strong>Tipo de Membresía:</strong></td><td>${userInfo.tipoMembresia || 'N/A'}</td></tr>
            <tr><td><strong>Renovación:</strong></td><td>${userInfo.renovacion || 'N/A'}</td></tr>
            <tr><td><strong>Rol:</strong></td><td>${userInfo.rol || 'N/A'}</td></tr>
          </table>
        `,
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

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  return (
    <>
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
      <div className='add-user-container'>
        <button className='add-user-button'>
          <UserPlus size={24} color="#28a745" />
          Agregar usuario
        </button>
      </div>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Fecha Inscripción</th>
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
                  <td>{user.fechaInscripcion || 'N/A'}</td>
                  <td>{user.renovacion || 'N/A'}</td>
                  <td>{user.tipoMembresia || 'N/A'}</td>
                  <td>{user.rol || 'N/A'}</td>
                  <td>
                    <button onClick={() => moreInfo(user)}>
                      <Info size={16} color="#007BFF" />
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(user.id)}>
                      <Edit size={16} color="#F7E07F" />
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(user.id)}>
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
          <button
            onClick={() => handlePagination('first')}
            disabled={currentPage === 0}
          >
            <ChevronsLeft size={24} />
          </button>
          <button
            onClick={() => handlePagination('prev')}
            disabled={currentPage === 0}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => handlePagination('next')}
            disabled={(currentPage + 1) * usersPerPage >= allUsers.length}
          >
            <ChevronRight size={24} />
          </button>
          <button
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
