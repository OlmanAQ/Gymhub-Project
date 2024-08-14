import React, { useEffect, useState } from 'react';
import { obtenerTodosLosUsuarios, obtenerUsuariosConPaginacion } from '../../cruds/Read'; // Ajusta la ruta según tu estructura de carpetas
import { Edit, Trash, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'; // Importa los íconos necesarios
import '../../css/AdminUserView.css';

const AdminUserView = () => {
  const [users, setUsers] = useState([]);
  const [pageToken, setPageToken] = useState(null); // Para paginación
  const [lastVisible, setLastVisible] = useState(null); // Para paginación

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { usuarios, lastVisible } = await obtenerUsuariosConPaginacion(null, 5);
        setUsers(usuarios);
        setLastVisible(lastVisible);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId) => {
    console.log('Edit user:', userId);
  };

  const handleDelete = (userId) => {
    console.log('Delete user:', userId);
  };

  const handlePagination = async (direction) => {
    try {
      const { usuarios, lastVisible: newLastVisible } = await obtenerUsuariosConPaginacion(
        direction === 'next' ? lastVisible : null,
        5
      );
      setUsers(usuarios);
      setLastVisible(newLastVisible);
    } catch (error) {
      console.error('Error fetching paginated users: ', error);
    }
  };

  return (
    <div className='table-container'>
      <table>
        <thead>
          <tr>
            <th>Correo</th>
            <th>Edad</th>
            <th>Estatura (metros)</th>
            <th>Fecha Inscripción</th>
            <th>Género</th>
            <th>Nombre</th>
            <th>Padecimientos</th>
            <th>Peso (kg)</th>
            <th>Renovación</th>
            <th>Rol</th>
            <th>Teléfono</th>
            <th>Membresía</th>
            <th>Usuario</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.correo}</td>
              <td>{user.edad}</td>
              <td>{user.estatura}</td>
              <td>{user.fechaInscripcion}</td>
              <td>{user.genero}</td>
              <td>{user.nombre}</td>
              <td>{user.padecimientos}</td>
              <td>{user.peso} kg</td>
              <td>{user.renovacion}</td>
              <td>{user.rol}</td>
              <td>{user.telefono}</td>
              <td>{user.tipoMembresia}</td>
              <td>{user.usuario}</td>
              <td>
                <button onClick={() => handleEdit(user.id)}>
                  <Edit size={16} color="#4CAF50" />
                </button>
              </td>
              <td>
                <button onClick={() => handleDelete(user.id)}>
                  <Trash size={16} color="#F44336" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-controls">
        <button onClick={() => handlePagination('first')}>
          <ChevronsLeft size={24} />
        </button>
        <button onClick={() => handlePagination('prev')}>
          <ChevronLeft size={24} />
        </button>
        <button onClick={() => handlePagination('next')}>
          <ChevronRight size={24} />
        </button>
        <button onClick={() => handlePagination('last')}>
          <ChevronsRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default AdminUserView;
